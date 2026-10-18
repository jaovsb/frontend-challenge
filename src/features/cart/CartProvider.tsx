import { useEffect, useMemo, useState } from "react";
import type { Nft } from "@/contracts/nft";
import { CartContext } from "./cart-context";
import type { CartItem } from "./types";

interface CartProviderProps {
  children: React.ReactNode;
}

const CART_STORAGE_KEY = "kurio-cart";

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  if (!("quantity" in value) || typeof value.quantity !== "number") return false;
  if (!Number.isFinite(value.quantity)) return false;
  if (!("nft" in value) || typeof value.nft !== "object" || value.nft === null) {
    return false;
  }

  const nft = value.nft;
  return (
    "id" in nft && typeof nft.id === "string" &&
    "name" in nft && typeof nft.name === "string" &&
    "price" in nft && typeof nft.price === "string" &&
    Number.isFinite(Number(nft.price)) &&
    "imageUrl" in nft && typeof nft.imageUrl === "string"
  );
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart === null) return [];

      const parsed: unknown = JSON.parse(savedCart);
      if (Array.isArray(parsed) && parsed.every(isCartItem)) return parsed;
    } catch {
      // Corrupted JSON or unavailable storage must not prevent cart usage.
    }

    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Storage may be blocked by the browser.
    }

    return [];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Keep the in-memory cart usable if persistence is unavailable.
    }
  }, [items]);

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
