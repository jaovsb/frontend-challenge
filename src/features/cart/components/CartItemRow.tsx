import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/features/cart/types";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (nftId: string, quantity: number) => void;
  onRemove: (nftId: string) => void;
}

function formatTokenId(id: string) {
  const digits = id.replace(/\D/g, "");
  return `#${digits.padStart(4, "0")}`;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const lineSubtotal = (Number(item.nft.price) * item.quantity).toFixed(2);

  return (
    <article
      aria-label={item.nft.name}
      className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-sm bg-[#241612] px-4 py-3 text-xs sm:grid-cols-[1fr_90px_100px_90px_36px]"
    >
      {/* NFT Info */}
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={item.nft.imageUrl}
          alt={item.nft.name}
          className="size-12 shrink-0 rounded-md object-cover"
        />
        <div className="min-w-0">
          <h2 className="truncate text-xs font-bold text-zinc-100">{item.nft.name}</h2>
          <p className="mt-0.5 text-[10px] text-zinc-400">
            ID do token: {formatTokenId(item.nft.id)}
          </p>
          <div className="mt-1 text-[10px] text-zinc-300 sm:hidden">
            {Number(item.nft.price).toFixed(2)} ETH • Total:{" "}
            <span className="font-bold text-[#d4893f]">{lineSubtotal} ETH</span>
          </div>
        </div>
      </div>

      {/* Unit Price */}
      <div className="hidden text-xs text-zinc-200 sm:block">
        {Number(item.nft.price).toFixed(2)} ETH
      </div>

      {/* Editions / Quantity Control */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label={`Diminuir quantidade de ${item.nft.name}`}
          onClick={() => onUpdateQuantity(item.nft.id, item.quantity - 1)}
          className="flex size-5 items-center justify-center rounded-full bg-[#d4893f] text-[#1a110d] hover:bg-[#e09a52]"
        >
          <Minus className="size-3" strokeWidth={3} aria-hidden="true" />
        </button>
        <span className="min-w-4 text-center font-medium text-zinc-100" aria-live="polite">
          {item.quantity}
        </span>
        <button
          type="button"
          aria-label={`Aumentar quantidade de ${item.nft.name}`}
          onClick={() => onUpdateQuantity(item.nft.id, item.quantity + 1)}
          className="flex size-5 items-center justify-center rounded-full bg-[#d4893f] text-[#1a110d] hover:bg-[#e09a52]"
        >
          <Plus className="size-3" strokeWidth={3} aria-hidden="true" />
        </button>
      </div>

      {/* Line Total */}
      <div className="hidden text-xs font-bold text-[#d4893f] sm:block">
        {lineSubtotal} ETH
      </div>

      {/* Remove Button */}
      <div className="flex justify-end">
        <button
          type="button"
          aria-label={`Remover ${item.nft.name} do carrinho`}
          onClick={() => onRemove(item.nft.id)}
          className="text-zinc-400 transition-colors hover:text-zinc-200"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
