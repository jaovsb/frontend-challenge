import { useQuery } from "@tanstack/react-query";
import { getNfts } from "./api";

export function useNfts() {
  return useQuery({
    queryKey: ["nfts"],
    queryFn: getNfts,
  });
}