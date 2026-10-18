import { Link } from "@tanstack/react-router";
import type { Order } from "@/contracts/order";

export function OrderConfirmationPage() {
  const storedOrder = sessionStorage.getItem("lastOrder");

  const order: Order | null = storedOrder
    ? JSON.parse(storedOrder)
    : null;

  if (!order) {
    return (
      <main>
        <h1>Nenhum pedido encontrado.</h1>

        <Link to="/">
          Voltar ao marketplace
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Pedido confirmado</h1>

      <p>ID do pedido: {order.id}</p>

      <p>
        Transação: {order.transactionId}
      </p>

      <p>Status: {order.status}</p>

      <p>Total: {order.total} ETH</p>

      <p>
        Criado em:{" "}
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <Link to="/">
        Voltar ao marketplace
      </Link>
    </main>
  );
}