import { ChevronRight } from "lucide-react";
import { useNfts } from "@/features/nfts/queries";
import { NftCard } from "@/features/nfts/components/NftCard";
import { Header } from "@/features/home/components/Header";
import { HeroSection } from "@/features/home/components/HeroSection";
import { CatalogSidebar } from "@/features/home/components/CatalogSidebar";
import { CatalogToolbar } from "@/features/home/components/CatalogToolbar";
import { FeaturedNftSection } from "@/features/home/components/FeaturedNftSection";
import { PromoSection } from "@/features/home/components/PromoSection";
import { MintingDiary } from "@/features/home/components/MintingDiary";
import { TrustSection } from "@/features/home/components/TrustSection";
import { Footer } from "@/features/home/components/Footer";

const pages = [1, 2, 3, 4];

function App() {
  const { data, isLoading, isError } = useNfts();

  const nfts = data ?? [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#1a110d] font-mono text-zinc-100">
      <Header />

      <main>
        <HeroSection />

        <section
          aria-label="Catálogo de NFTs"
          className="mx-auto mt-20 max-w-[1200px] px-4 xl:px-0"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
            <div className="flex flex-col gap-6">
              <CatalogSidebar />
              <FeaturedNftSection />
            </div>

            <div className="min-w-0">
              <CatalogToolbar />

              {isLoading && (
                <p role="status" className="mt-8 text-xs text-zinc-400">
                  Loading...
                </p>
              )}

              {isError && (
                <p role="alert" className="mt-8 text-xs text-red-400">
                  Error fetching NFTs
                </p>
              )}

              {!isLoading && !isError && nfts.length === 0 && (
                <p className="mt-8 text-xs text-zinc-400">Nenhum NFT encontrado.</p>
              )}

              {!isLoading && !isError && nfts.length > 0 && (
                <div className="mt-6 grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:justify-items-start">
                  {nfts.map((nft) => (
                    <NftCard key={nft.id} nft={nft} />
                  ))}
                </div>
              )}

              <nav aria-label="Paginação" className="mt-10 flex justify-end">
                <ul className="flex items-center gap-2 text-[11px]">
                  {pages.map((page) => (
                    <li key={page}>
                      <button
                        type="button"
                        aria-current={page === 1 ? "page" : undefined}
                        className={`flex size-6 items-center justify-center rounded-sm border ${
                          page === 1
                            ? "border-[#d4893f] bg-[#d4893f] text-[#1a110d]"
                            : "border-[#4a3226] text-zinc-300 hover:text-zinc-100"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      aria-label="Próxima página"
                      className="flex size-6 items-center justify-center rounded-sm border border-[#4a3226] text-zinc-300 hover:text-zinc-100"
                    >
                      <ChevronRight className="size-3" aria-hidden="true" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>

        <div className="mt-24">
          <PromoSection />
        </div>

        <div className="mt-28">
          <MintingDiary />
        </div>

        <div className="mx-auto mt-24 max-w-[1200px] px-4 xl:px-0">
          <TrustSection />
        </div>
      </main>

      <div className="mx-auto max-w-[1200px] px-4 pb-6 xl:px-0">
        <Footer />
      </div>
    </div>
  );
}

export default App;