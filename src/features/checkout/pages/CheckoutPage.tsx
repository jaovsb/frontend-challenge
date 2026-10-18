import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/features/cart/cart-context";
import { useCreateOrder } from "@/features/checkout/mutations";

const NETWORK_FEE = 0.016;

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  if (items.length === 0) {
    return (
      <main>
        <p>Seu carrinho está vazio.</p>

        <Link to="/">
          Voltar ao marketplace
        </Link>
      </main>
    );
  }

  const finalTotal = Number(
    (total + NETWORK_FEE).toFixed(3),
  );

  function handleConfirmOrder() {
    createOrderMutation.mutate(
      {
        items: items.map((item) => ({
          nftId: item.nft.id,
          quantity: item.quantity,
        })),
        total: finalTotal,
        idempotencyKey,
      },
      {
        onSuccess: (order) => {
          sessionStorage.setItem(
            "lastOrder",
            JSON.stringify(order),
          );

          clearCart();

          navigate({
            to: "/order-confirmation",
          });
        },
      },
    );
  }

  return (
    <main>
      <h1>Pagamento</h1>

      <p>
        {items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        )}{" "}
        produto(s)
      </p>

      <p>Subtotal: {total.toFixed(2)} ETH</p>
      <p>Taxa de rede: {NETWORK_FEE} ETH</p>
      <p>Total: {finalTotal} ETH</p>

      <button
        type="button"
        onClick={handleConfirmOrder}
        disabled={createOrderMutation.isPending}
      >
        {createOrderMutation.isPending
          ? "Processando..."
          : "Confirmar pedido"}
      </button>

      {createOrderMutation.isError && (
        <p>Não foi possível confirmar o pedido.</p>
      )}
    </main>
  );
}