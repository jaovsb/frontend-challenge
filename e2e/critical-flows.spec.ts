import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import type { Order } from "../src/contracts/order";
import type { OrderUpdatedPayload } from "../src/realtime/types";

const nftName = "Bored Ape #731";

// Playwright creates a fresh browser context per test. Storage is deliberately
// not cleared on navigation/reload, so persistence and the real MSW runtime work.
async function addNftToCart(page: Page, quantity = 1) {
  await page.goto("/");
  const catalog = page.getByRole("region", { name: "Catálogo de NFTs", exact: true });
  await expect(catalog.getByRole("link", { name: /Bored Ape #731/ })).toBeVisible();
  await catalog.getByRole("link", { name: /Bored Ape #731/ }).click();

  await expect(page).toHaveURL("/nfts/nft-2");
  await expect(page.getByRole("heading", { name: nftName, exact: true })).toBeVisible();
  for (let current = 1; current < quantity; current++) {
    await page.getByRole("button", { name: "Aumentar quantidade", exact: true }).click();
  }
  await page.getByRole("button", { name: "COMPRAR", exact: true }).click();
  await expect(page).toHaveURL("/cart");
}

async function login(page: Page) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "E-mail", exact: true }).fill("collector@kurio.test");
  await page.getByLabel("Senha", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("banner").getByText("Mock Collector", { exact: true })).toBeVisible();
}

test("marketplace → detalhe → carrinho com a quantidade selecionada", async ({ page }) => {
  await addNftToCart(page, 2);

  const item = page.getByRole("article", { name: nftName, exact: true });
  await expect(item.getByRole("heading", { name: nftName, exact: true })).toBeVisible();
  await expect(item.getByText("2", { exact: true })).toBeVisible();
  await expect(item.getByText("4.90 ETH", { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Carrinho com 2 item(ns)", exact: true })).toBeVisible();
});

test("carrinho preserva item, quantidade alterada e subtotal após F5", async ({ page }) => {
  await addNftToCart(page);
  const item = page.getByRole("article", { name: nftName, exact: true });
  await item.getByRole("button", { name: `Aumentar quantidade de ${nftName}`, exact: true }).click();
  await item.getByRole("button", { name: `Aumentar quantidade de ${nftName}`, exact: true }).click();
  await expect(item.getByText("3", { exact: true })).toBeVisible();

  await page.reload();

  await expect(item.getByText("3", { exact: true })).toBeVisible();
  await expect(item.getByText("7.35 ETH", { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Carrinho com 3 item(ns)", exact: true })).toBeVisible();
});

test("checkout acompanha pending → order.updated → confirmed e só então esvazia o carrinho", async ({ page }) => {
  await addNftToCart(page);
  await page.getByRole("link", { name: "Conectar e finalizar", exact: true }).click();
  await expect(page).toHaveURL("/checkout");

  await page.getByLabel("Nome de exibição", { exact: false }).fill("E2E Collector");
  await page.getByLabel("Nome de usuário", { exact: false }).fill("e2e-collector");
  await page.getByLabel("Rede", { exact: false }).selectOption("ethereum");
  await page.getByLabel("Nome do perfil", { exact: false }).fill("E2E Collector");
  await page.getByLabel("Endereço da carteira", { exact: false }).fill("0x0000000000000000000000000000000000000001");
  await page.getByLabel("Tipo de carteira", { exact: false }).selectOption("coinbase");
  await page.getByLabel("Código de indicação", { exact: false }).fill("E2E");
  await page.getByRole("textbox", { name: "E-mail*", exact: true }).fill("e2e@kurio.test");

  // Observe the real POST and the existing socket listener; never inject events.
  const createdResponse = page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/api/orders" && response.request().method() === "POST",
  );
  const updatedMessage = page.waitForEvent("console", {
    predicate: (message) => message.text().startsWith("[realtime] order.updated"),
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Confirmar compra", exact: true }).click();

  const response = await createdResponse;
  expect(response.status()).toBe(201);
  const pending: Order = await response.json();
  expect(pending.status).toBe("pending");
  expect(pending.transactionId).toBeUndefined();
  await expect(page).toHaveURL("/order-confirmation");
  await expect(page.getByRole("status")).toHaveText("Seu pedido está sendo processado");
  await expect(page.getByText("Aguardando confirmação", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("kurio-cart") ?? "[]"))).toHaveLength(1);

  const event = await (await updatedMessage).args()[1].jsonValue() as OrderUpdatedPayload;
  expect(event).toMatchObject({ id: pending.id, status: "confirmed" });
  if (event.status !== "confirmed") throw new Error("Expected a confirmed order.updated event");

  await expect(page.getByRole("status")).toHaveText("Seus NFTs agora estão na sua carteira");
  await expect(page.getByTitle(event.transactionId, { exact: true })).toBeVisible();

  // Browser fetch passes through the application's MSW handlers (APIRequestContext would not).
  const reconciled = await page.evaluate(async (id) => {
    const result = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    return { status: result.status, order: await result.json() };
  }, pending.id);
  expect(reconciled.status).toBe(200);
  expect(reconciled.order).toMatchObject({ id: pending.id, status: "confirmed", transactionId: event.transactionId });

  await page.getByRole("link", { name: "Fechar e voltar ao marketplace", exact: true }).click();
  await page.getByRole("link", { name: "Carrinho com 0 item(ns)", exact: true }).click();
  await expect(page).toHaveURL("/cart");
  await expect(page.getByRole("region", { name: "Itens do carrinho", exact: true }).getByRole("article")).toHaveCount(0);
  await expect(page.getByText("Carrinho vazio.", { exact: true })).toBeVisible();
});

test("login autentica e mantém a sessão visível após F5", async ({ page }) => {
  await login(page);
  await page.reload();

  const header = page.getByRole("banner");
  await expect(header.getByText("Mock Collector", { exact: true })).toBeVisible();
  await expect(header.getByRole("button", { name: "Sair", exact: true })).toBeVisible();
  await expect(header.getByRole("link", { name: "Entrar", exact: true })).toHaveCount(0);
});

test("cadastro valida confirmação da senha e autentica uma conta nova", async ({ page }) => {
  const name = "E2E Collector";
  const email = `collector-${randomUUID()}@kurio.test`;
  await page.goto("/register");
  await page.getByRole("textbox", { name: "Nome de usuário", exact: true }).fill(name);
  await page.getByRole("textbox", { name: "Digite seu e-mail", exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("123456");
  await page.getByLabel("Confirmar senha", { exact: true }).fill("654321");
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("As senhas não coincidem.");
  await expect(page).toHaveURL("/register");

  await page.getByLabel("Confirmar senha", { exact: true }).fill("123456");
  const registeredResponse = page.waitForResponse((response) =>
    new URL(response.url()).pathname === "/api/auth/register" && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Criar conta", exact: true }).click();
  expect((await registeredResponse).status()).toBe(201);
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("banner").getByText(name, { exact: true })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("button", { name: "Sair", exact: true })).toBeVisible();
});

test("logout volta a exibir Entrar e preserva o carrinho", async ({ page }) => {
  await addNftToCart(page);
  await login(page);
  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: "Carrinho com 1 item(ns)", exact: true })).toBeVisible();
  await header.getByRole("button", { name: "Sair", exact: true }).click();

  await expect(header.getByRole("link", { name: "Entrar", exact: true })).toBeVisible();
  await expect(header.getByText("Mock Collector", { exact: true })).toHaveCount(0);
  await expect(header.getByRole("button", { name: "Sair", exact: true })).toHaveCount(0);
  await header.getByRole("link", { name: "Carrinho com 1 item(ns)", exact: true }).click();
  await expect(page.getByRole("article", { name: nftName, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("link", { name: "Entrar", exact: true })).toBeVisible();
  await expect(page.getByRole("article", { name: nftName, exact: true }).getByText("1", { exact: true })).toBeVisible();
});
