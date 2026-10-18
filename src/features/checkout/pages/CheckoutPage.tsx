import { Link } from "@tanstack/react-router";

import { useCart } from "@/features/cart/cart-context";

export function CheckoutPage() {
  const { items, total } = useCart();

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

  return (
    <main>
      <h1>Pagamento</h1>

      <p>
        {items.length} produto(s)
      </p>

      <p>
        Total: {total.toFixed(2)} ETH
      </p>

      <button type="button">
        Confirmar pedido
      </button>
    </main>
  );
}