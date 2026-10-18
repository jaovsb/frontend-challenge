import type { Nft } from "@/contracts/nft";
import { Link } from "@tanstack/react-router";

interface NftCardProps {
  nft: Nft;
}

export function NftCard({ nft }: NftCardProps) {
  return (
    <article className="w-64.5 flex flex-col gap-3">
      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        className="flex flex-col gap-3"
      >
        <div className="w-64.5 bg-[#241612] p-1 flex items-center justify-center">
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-62.5 h-62.5 rounded-[15px] object-cover"
          />
        </div>

        <h2 className="text-base font-normal leading-4 tracking-normal text-zinc-100">
          {nft.name}
        </h2>

        <p className="text-lg font-bold leading-4 tracking-normal text-amber-500">
          {nft.price} ETH
        </p>
      </Link>
    </article>
  );
}