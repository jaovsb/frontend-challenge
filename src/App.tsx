import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChevronRight } from "lucide-react";
import { useNfts } from "@/features/nfts/queries";
import { NftCard } from "@/features/nfts/components/NftCard";
import { Header } from "@/features/home/components/Header";
import { HeroSection } from "@/features/home/components/HeroSection";
import { CatalogSidebar } from "@/features/home/components/CatalogSidebar";
import {
  CatalogToolbar,
  type CatalogSortOption,
} from "@/features/home/components/CatalogToolbar";
import { FeaturedNftSection } from "@/features/home/components/FeaturedNftSection";
import { PromoSection } from "@/features/home/components/PromoSection";
import { MintingDiary } from "@/features/home/components/MintingDiary";
import { TrustSection } from "@/features/home/components/TrustSection";
import { Footer } from "@/features/home/components/Footer";
import { MobileHomeHeader } from "@/features/home/components/MobileHomeHeader";
import { MobileBottomNav } from "@/features/home/components/MobileBottomNav";

const PAGE_SIZE = 6;

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function getInitialSort(): CatalogSortOption {
  const sort = getSearchParams().get("sort");

  if (
    sort === "price-asc" ||
    sort === "price-desc" ||
    sort === "name-asc"
  ) {
    return sort;
  }

  return "recent";
}

function App() {
  const { data, isLoading, isError } = useNfts();

  const [searchTerm, setSearchTerm] = useState(
    () => getSearchParams().get("q") ?? "",
  );

  const [sort, setSort] = useState<CatalogSortOption>(
    getInitialSort,
  );

  const [minPrice, setMinPrice] = useState(
    () => getSearchParams().get("min") ?? "",
  );

  const [maxPrice, setMaxPrice] = useState(
    () => getSearchParams().get("max") ?? "",
  );

  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(
      getSearchParams().get("page") ?? "1",
    );

    return Number.isInteger(page) && page > 0
      ? page
      : 1;
  });

  const [mobileTab, setMobileTab] = useState<"all" | "new" | "trending">("all");

  const filteredNfts = useMemo(() => {
    const nfts = data ?? [];

    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    const minimum =
      minPrice === ""
        ? null
        : Number(minPrice);

    const maximum =
      maxPrice === ""
        ? null
        : Number(maxPrice);

    const result = nfts.filter((nft) => {
      const price = Number(nft.price);

      const matchesSearch =
        normalizedSearch === "" ||
        nft.name
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesMinimum =
        minimum === null ||
        !Number.isFinite(minimum) ||
        price >= minimum;

      const matchesMaximum =
        maximum === null ||
        !Number.isFinite(maximum) ||
        price <= maximum;

      return (
        matchesSearch &&
        matchesMinimum &&
        matchesMaximum
      );
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return (
            Number(a.price) -
            Number(b.price)
          );

        case "price-desc":
          return (
            Number(b.price) -
            Number(a.price)
          );

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "recent":
        default:
          return 0;
      }
    });
  }, [
    data,
    searchTerm,
    minPrice,
    maxPrice,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredNfts.length / PAGE_SIZE,
    ),
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  const visibleNfts = useMemo(() => {
    const start =
      (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredNfts.slice(
      start,
      start + PAGE_SIZE,
    );
  }, [
    filteredNfts,
    safeCurrentPage,
  ]);

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  useEffect(() => {
    // App também é renderizado como background visual
    // nas rotas /login e /register.
    // Só a Home real deve sincronizar filtros com a URL.
    if (window.location.pathname !== "/") {
      return;
    }

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set(
        "q",
        searchTerm.trim(),
      );
    }

    if (sort !== "recent") {
      params.set("sort", sort);
    }

    if (minPrice) {
      params.set("min", minPrice);
    }

    if (maxPrice) {
      params.set("max", maxPrice);
    }

    if (safeCurrentPage > 1) {
      params.set(
        "page",
        String(safeCurrentPage),
      );
    }

    const query = params.toString();

    window.history.replaceState(
      null,
      "",
      query ? `/?${query}` : "/",
    );
  }, [
    searchTerm,
    sort,
    minPrice,
    maxPrice,
    safeCurrentPage,
  ]);

  function handleSearchChange(
    value: string,
  ) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function handleSortChange(
    value: CatalogSortOption,
  ) {
    setSort(value);
    setCurrentPage(1);
  }

  function handleApplyPrice(
    min: string,
    max: string,
  ) {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#1a110d] font-mono text-zinc-100 pb-20 lg:pb-0">
      {/* Desktop Header (>= lg) */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header (< lg) */}
      <MobileHomeHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onApplyPrice={handleApplyPrice}
        sort={sort}
        onSortChange={handleSortChange}
      />

      <main>
        <HeroSection />

        {/* Mobile Tabs Row (< lg) */}
        <div className="block lg:hidden mx-auto max-w-[1200px] px-4 mt-4">
          <div className="flex items-center gap-5 text-xs font-mono border-b border-[#2e1d16] pb-1">
            <button
              type="button"
              onClick={() => {
                setMobileTab("all");
                setSort("recent");
              }}
              className={`pb-1 transition-colors ${
                mobileTab === "all"
                  ? "border-b-2 border-[#d4893f] font-bold text-[#d4893f]"
                  : "text-zinc-300 hover:text-zinc-100"
              }`}
            >
              Todos os NFTs
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileTab("new");
                setSort("recent");
              }}
              className={`pb-1 transition-colors ${
                mobileTab === "new"
                  ? "border-b-2 border-[#d4893f] font-bold text-[#d4893f]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Novos lançamentos
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileTab("trending");
                setSort("price-desc");
              }}
              className={`pb-1 transition-colors ${
                mobileTab === "trending"
                  ? "border-b-2 border-[#d4893f] font-bold text-[#d4893f]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Em alta
            </button>
          </div>
        </div>

        <section
          id="catalog-section"
          aria-label="Catálogo de NFTs"
          className="mx-auto mt-4 lg:mt-20 max-w-[1200px] px-4 xl:px-0"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
            {/* Desktop Sidebar (>= lg) */}
            <div className="hidden lg:flex flex-col gap-6">
              <CatalogSidebar
                initialMinPrice={minPrice}
                initialMaxPrice={maxPrice}
                onApplyPrice={
                  handleApplyPrice
                }
              />

              <FeaturedNftSection />
            </div>

            <div className="min-w-0">
              {/* Desktop Toolbar (>= lg) */}
              <div className="hidden lg:block">
                <CatalogToolbar
                  searchTerm={searchTerm}
                  sort={sort}
                  onSearchChange={
                    handleSearchChange
                  }
                  onSortChange={
                    handleSortChange
                  }
                />
              </div>

              {isLoading && (
                <p
                  role="status"
                  className="mt-8 text-xs text-zinc-400"
                >
                  Loading...
                </p>
              )}

              {isError && (
                <p
                  role="alert"
                  className="mt-8 text-xs text-red-400"
                >
                  Error fetching NFTs
                </p>
              )}

              {!isLoading &&
                !isError &&
                filteredNfts.length ===
                  0 && (
                  <p className="mt-8 text-xs text-zinc-400">
                    Nenhum NFT
                    encontrado.
                  </p>
                )}

              {!isLoading &&
                !isError &&
                visibleNfts.length >
                  0 && (
                  <div className="mt-4 lg:mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-10">
                    {visibleNfts.map(
                      (nft) => (
                        <NftCard
                          key={nft.id}
                          nft={nft}
                        />
                      ),
                    )}
                  </div>
                )}

              {!isLoading &&
                !isError &&
                filteredNfts.length >
                  PAGE_SIZE && (
                  <nav
                    aria-label="Paginação"
                    className="mt-6 lg:mt-10 flex justify-center lg:justify-end"
                  >
                    <ul className="flex items-center gap-2 text-[11px]">
                      {pages.map(
                        (page) => (
                          <li key={page}>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentPage(
                                  page,
                                )
                              }
                              aria-current={
                                page ===
                                safeCurrentPage
                                  ? "page"
                                  : undefined
                              }
                              className={`flex size-6 items-center justify-center rounded-sm border ${
                                page ===
                                safeCurrentPage
                                  ? "border-[#d4893f] bg-[#d4893f] text-[#1a110d]"
                                  : "border-[#4a3226] text-zinc-300 hover:text-zinc-100"
                              }`}
                            >
                              {page}
                            </button>
                          </li>
                        ),
                      )}

                      <li>
                        <button
                          type="button"
                          aria-label="Próxima página"
                          disabled={
                            safeCurrentPage >=
                            totalPages
                          }
                          onClick={() =>
                            setCurrentPage(
                              Math.min(
                                safeCurrentPage +
                                  1,
                                totalPages,
                              ),
                            )
                          }
                          className="flex size-6 items-center justify-center rounded-sm border border-[#4a3226] text-zinc-300 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronRight
                            className="size-3"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
            </div>
          </div>
        </section>

        {/* Desktop-only supplementary sections (>= lg) */}
        <div className="hidden lg:block mt-24">
          <PromoSection />
        </div>

        <div className="hidden lg:block mt-28">
          <MintingDiary />
        </div>

        <div className="hidden lg:block mx-auto mt-24 max-w-[1200px] px-4 xl:px-0">
          <TrustSection />
        </div>
      </main>

      {/* Desktop Footer (>= lg) */}
      <div className="hidden lg:block mx-auto max-w-[1200px] px-4 pb-6 xl:px-0">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation (< lg) */}
      <MobileBottomNav activeTab="home" />
    </div>
  );
}

export default App;