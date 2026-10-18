export interface CreateOrderItem {
  nftId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItem[];
  total: number;
  idempotencyKey: string;
}

export interface Order {
  id: string;
  transactionId: string;
  status: "confirmed";
  total: number;
  createdAt: string;
}