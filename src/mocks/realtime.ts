import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { nfts } from "./fixtures/nfts";
import type { NftUpdatedPayload } from "@/realtime/types";

const STORAGE_KEY = "kurio-realtime-nft-1-price";
const UPDATED_PRICE = "2.48";
const nft = nfts.find((item) => item.id === "nft-1");

// Restore only the spike's known price before any REST handler serves the fixture.
try {
  if (nft && localStorage.getItem(STORAGE_KEY) === UPDATED_PRICE) {
    nft.price = UPDATED_PRICE;
  }
} catch {
  // The in-memory mock still works when browser storage is unavailable.
}

const realtime = ws.link(window.location.origin.replace(/^http/, "ws"));

export const realtimeHandlers = [
  realtime.addEventListener("connection", (connection) => {
    const io = toSocketIo(connection);

    const timer = setTimeout(() => {
      if (!nft) return;

      const payload: NftUpdatedPayload = {
        id: nft.id,
        changes: { price: UPDATED_PRICE },
      };

      Object.assign(nft, payload.changes);
      try {
        localStorage.setItem(STORAGE_KEY, UPDATED_PRICE);
      } catch {
        // REST and realtime still share the same fixture during this runtime.
      }

      io.client.emit("nft.updated", payload);
    }, 5000);

    connection.client.addEventListener("close", () => clearTimeout(timer));
  }),
];
