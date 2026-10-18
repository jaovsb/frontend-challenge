import { useEffect, useMemo, useState } from "react";
import type { Nft } from "@/contracts/nft";
import { useAuth } from "@/features/auth/auth-context";
import { CartContext } from "./cart-context";
import type { CartItem } from "./types";

interface CartProviderProps {
  children: React.ReactNode;
}

interface IdentityCartProviderProps extends CartProviderProps {
  storageKey: string;
}

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
  const { user } = useAuth();
  const storageKey = `kurio-cart:${user?.id ?? "guest"}`;

  // A new identity gets fresh state before its children render. The old cart
  // can only persist to its own key; items never cross session boundaries.
  // The ambiguous legacy "kurio-cart" key is intentionally ignored.
  return (
    <IdentityCartProvider key={storageKey} storageKey={storageKey}>
      {children}
    </IdentityCartProvider>
  );
}

function IdentityCartProvider({ children, storageKey }: IdentityCartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedCart = window.localStorage.getItem(storageKey);
      if (savedCart === null) return [];

      const parsed: unknown = JSON.parse(savedCart);
      if (Array.isArray(parsed) && parsed.every(isCartItem)) return parsed;
    } catch {
      // Corrupted JSON or unavailable storage must not prevent cart usage.
    }

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Storage may be blocked by the browser.
    }

    return [];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Keep the in-memory cart usable if persistence is unavailable.
    }
  }, [items, storageKey]);

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
