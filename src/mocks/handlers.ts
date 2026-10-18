import { http, HttpResponse } from "msw";
import { nfts } from "@/mocks/fixtures/nfts";
import { users } from "@/mocks/fixtures/users";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/contracts/auth";
import type {
  CreateOrderInput,
  Order,
} from "@/contracts/order";

const ordersByIdempotencyKey = new Map<string, Order>();

const sessions = new Map<string, string>();

function toPublicUser(user: User): User {
  return { id: user.id, name: user.name, email: user.email };
}

function createAuthResponse(user: User): AuthResponse {
  const token = `mock-token-${crypto.randomUUID()}`;
  sessions.set(token, user.id);
  return { user: toPublicUser(user), token };
}

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const input = (await request.json().catch(() => null)) as Partial<LoginInput> | null;

    if (
      typeof input?.email !== "string" ||
      !input.email.trim() ||
      typeof input.password !== "string" ||
      !input.password.trim()
    ) {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const email = input.email.trim().toLowerCase();
    const user = users.find(
      (user) => user.email === email && user.password === input.password,
    );

    if (!user) {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return HttpResponse.json(createAuthResponse(user));
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const input = (await request.json().catch(() => null)) as Partial<RegisterInput> | null;

    if (
      typeof input?.name !== "string" ||
      !input.name.trim() ||
      typeof input.email !== "string" ||
      !input.email.trim() ||
      typeof input.password !== "string" ||
      !input.password.trim()
    ) {
      return HttpResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    const email = input.email.trim().toLowerCase();

    if (users.some((user) => user.email === email)) {
      return HttpResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = {
      id: `user-${crypto.randomUUID()}`,
      name: input.name.trim(),
      email,
      password: input.password,
    };

    users.push(user);
    return HttpResponse.json(createAuthResponse(user), { status: 201 });
  }),

  http.get("/api/auth/me", ({ request }) => {
    const authorization = request.headers.get("Authorization");
    const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
    const userId = token ? sessions.get(token) : undefined;
    const user = userId ? users.find((user) => user.id === userId) : undefined;

    if (!user) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json(toPublicUser(user));
  }),

  http.get("/api/nfts", () => {
    return HttpResponse.json(nfts);
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const { id } = params;

    const nft = nfts.find((nft) => nft.id === id);

    if (!nft) {
      return HttpResponse.json(
        { error: "NFT not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),
  http.post("/api/orders", async ({ request }) => {
  const input = (await request.json()) as CreateOrderInput;

  if (!input.items.length) {
    return HttpResponse.json(
      { error: "Order must contain at least one item" },
      { status: 400 },
    );
  }

  const existingOrder = ordersByIdempotencyKey.get(
    input.idempotencyKey,
  );

  if (existingOrder) {
    return HttpResponse.json(existingOrder);
  }

  const order: Order = {
    id: `order-${Date.now()}`,
    transactionId: `tx-${Date.now()}`,
    status: "confirmed",
    total: input.total,
    createdAt: new Date().toISOString(),
  };

  ordersByIdempotencyKey.set(
    input.idempotencyKey,
    order,
  );

  return HttpResponse.json(order, {
    status: 201,
  });
}),
];
