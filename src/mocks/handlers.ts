import { http, HttpResponse } from "msw";
import { nfts } from "@/mocks/fixtures/nfts";

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
];