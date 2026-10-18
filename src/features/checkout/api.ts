import { api } from "@/api/client";

import type {
  CreateOrderInput,
  Order,
} from "@/contracts/order";

export async function createOrder(
  input: CreateOrderInput,
): Promise<Order> {
  const response = await api.post<Order>(
    "/orders",
    input,
  );

  return response.data;
}