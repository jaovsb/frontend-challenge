import { http, HttpResponse } from "msw";
import { nfts } from '@/mocks/fixtures/nfts';  

export const handlers = [
  http.get("/api/nfts", () => {
    return HttpResponse.json(nfts);
  }),
];