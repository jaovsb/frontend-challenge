import { Link } from "@tanstack/react-router";
import type { Order } from "@/contracts/order";
import { OrderConfirmationCard } from "@/features/checkout/components/OrderConfirmationCard";

export function OrderConfirmationPage() {
  const storedOrder = sessionStorage.getItem("lastOrder");

  const order: Order | null = storedOrder ? JSON.parse(storedOrder) : null;

  if (!order) {
    return (
      <main className="min-h-screen bg-[#140d0a] font-mono text-zinc-100 flex items-center justify-center p-4">
        <div className="rounded-sm border border-[#3a2416] bg-[#241612] p-8 text-center text-xs text-zinc-400 max-w-sm w-full">
          <h1 className="text-sm font-bold text-zinc-200">
            Nenhum pedido encontrado.
          </h1>
          <p className="mt-2 text-zinc-400">
            Não há registro recente de compra finalizada nesta sessão.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-sm bg-[#d4893f] px-6 py-2 text-xs font-medium text-[#1a110d] hover:bg-[#e09a52]"
          >
            Voltar ao marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#140d0a] font-mono text-zinc-100 flex items-center justify-center p-4 sm:p-8">
      <OrderConfirmationCard order={order} />
    </main>
  );
}