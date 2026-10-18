export type CatalogSortOption =
  | "recent"
  | "price-asc"
  | "price-desc"
  | "name-asc";

interface CatalogToolbarProps {
  searchTerm: string;
  sort: CatalogSortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: CatalogSortOption) => void;
}

const tabs = ["Todos os NFTs", "Novos lançamentos", "Em alta"];

export function CatalogToolbar({
  searchTerm,
  sort,
  onSearchChange,
  onSortChange,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-[11px]">
      <nav aria-label="Abas do catálogo">
        <ul className="flex items-center gap-4">
          {tabs.map((tab, index) => (
            <li key={tab}>
              <button
                type="button"
                aria-pressed={index === 0}
                className={
                  index === 0
                    ? "border-b border-[#d4893f] pb-0.5 text-[#d4893f]"
                    : "text-zinc-300 hover:text-zinc-100"
                }
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="catalog-search">
          Buscar NFTs
        </label>

        <input
          id="catalog-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar NFTs..."
          className="w-40 border border-[#4a3226] bg-[#1a110d] px-3 py-1.5 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#d4893f]"
        />

        <label className="sr-only" htmlFor="catalog-sort">
          Ordenar NFTs
        </label>

        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as CatalogSortOption)
          }
          className="border border-[#4a3226] bg-[#1a110d] px-2 py-1.5 text-zinc-300 outline-none focus:border-[#d4893f]"
        >
          <option value="recent">Listados recentemente</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="name-asc">Nome A-Z</option>
        </select>
      </div>
    </div>
  );
}
