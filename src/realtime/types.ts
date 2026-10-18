import type { Nft } from "@/contracts/nft";

export interface NftUpdatedPayload {
  id: string;
  changes: Partial<Pick<Nft, "price" | "name" | "imageUrl">>;
}

export interface ServerToClientEvents {
  "nft.updated": (payload: NftUpdatedPayload) => void;
}
