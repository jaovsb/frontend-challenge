import { useMemo, useState } from "react";
import type { Nft } from "@/contracts/nft";
import { CartContext } from "./cart-context";
import type { CartItem } from "./types";

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(nft: Nft, quantity = 1) {
    setItems((currentItems) => {
        const existingItem = currentItems.find(
            (item) => item.nft.id === nft.id,
            );

                if (existingItem) {
                return currentItems.map((item) =>
                    item.nft.id === nft.id
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        }
                    : item,
                );
            }

            return [
                ...currentItems,
                {
                    nft,
                    quantity,
                },
            ];
        });
    }

  function removeItem(nftId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.nft.id !== nftId),
    );
  }

  function updateQuantity(nftId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(nftId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.nft.id === nftId
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(item.nft.price) * item.quantity,
        0,
      ),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}