import { http, HttpResponse } from "msw";
import { nfts } from "@/mocks/fixtures/nfts";
import type {
  CreateOrderInput,
  Order,
} from "@/contracts/order";

const ordersByIdempotencyKey = new Map<string, Order>();

export const handlers = [
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