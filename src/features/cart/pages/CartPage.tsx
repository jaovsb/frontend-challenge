import { Link } from "@tanstack/react-router";
import { useCart } from "@/features/cart/cart-context";
import { Header } from "@/features/home/components/Header";
import { TrustSection } from "@/features/home/components/TrustSection";
import { Footer } from "@/features/home/components/Footer";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { RecommendedNfts } from "@/features/cart/components/RecommendedNfts";

export function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#1a110d] font-mono text-zinc-100">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 pt-6 xl:px-0">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[11px] text-zinc-100">
          <ol className="flex items-center gap-1">
            <li>
              <Link to="/" className="hover:text-[#d4893f]">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/" className="hover:text-[#d4893f]">
                Mercado
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Carrinho</li>
          </ol>
        </nav>

        {items.length === 0 ? (
          <div className="my-16 rounded-sm bg-[#241612] p-8 text-center text-xs text-zinc-400">
            <p className="text-sm font-bold text-zinc-200">Carrinho vazio.</p>
            <p className="mt-2 text-zinc-400">
              Você não adicionou nenhum item ao seu carrinho ainda.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block rounded-sm bg-[#d4893f] px-6 py-2 text-xs font-medium text-[#1a110d] hover:bg-[#e09a52]"
            >
              Continuar explorando
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_360px]">
            {/* Left Column: Cart items */}
            <section aria-label="Itens do carrinho" className="min-w-0">
              <div className="hidden grid-cols-[1fr_90px_100px_90px_36px] items-center gap-3 px-4 pb-2 text-[11px] font-bold text-zinc-100 sm:grid">
                <span>NFTs</span>
                <span>Preço</span>
                <span className="text-center">Edições</span>
                <span>Total</span>
                <span className="sr-only">Ações</span>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <CartItemRow
                    key={item.nft.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </section>

            {/* Right Column: Wallet summary */}
            <CartSummary total={total} />
          </div>
        )}

        {/* Recommended NFTs Section */}
        <div className="mt-20">
          <RecommendedNfts />
        </div>

        {/* Trust & Benefits Section */}
        <div className="mt-24">
          <TrustSection />
        </div>
      </main>

      {/* Footer */}
      <div className="mx-auto max-w-[1200px] px-4 pb-6 xl:px-0">
        <Footer />
      </div>
    </div>
  );
}