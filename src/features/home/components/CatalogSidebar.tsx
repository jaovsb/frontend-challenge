const collections = [
  { label: "Arte digital", count: 33 },
  { label: "Fotografia", count: 12 },
  { label: "Música", count: 65 },
  { label: "Arte 3D", count: 39 },
  { label: "Colecionáveis", count: 23 },
  { label: "Generativa", count: 17 },
  { label: "Jogos", count: 19 },
  { label: "Assinaturas", count: 13 },
  { label: "Utilidade", count: 18 },
];

const networks = [
  { label: "Ethereum", count: 119 },
  { label: "Polygon", count: 78 },
  { label: "Solana", count: 86 },
];

interface FilterListProps {
  items: { label: string; count: number }[];
  activeIndex?: number;
}

function FilterList({ items, activeIndex }: FilterListProps) {
  return (
    <ul className="mt-3 space-y-0.5 text-[11px]">
      {items.map((item, index) => (
        <li key={item.label}>
          <button
            type="button"
            className={`flex w-full items-center justify-between py-1.5 pl-3 text-left ${
              index === activeIndex ? "text-[#d4893f]" : "text-zinc-300 hover:text-zinc-100"
            }`}
          >
            <span>{item.label}</span>
            <span>({item.count})</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function CatalogSidebar() {
  return (
    <aside aria-label="Filtros do catálogo" className="bg-[#241612] px-5 py-5">
      <section aria-labelledby="filter-collections">
        <h2 id="filter-collections" className="text-xs font-bold text-zinc-100">
          Coleções
        </h2>
        <FilterList items={collections} activeIndex={0} />
      </section>

      <section aria-labelledby="filter-price" className="mt-5">
        <h2 id="filter-price" className="text-xs font-bold text-zinc-100">
          Faixa de preço
        </h2>

        <div className="relative mt-4 h-3" role="img" aria-label="Faixa de preço de 0,02 a 12,30 ETH">
          <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-[#4a3226]" />
          <div className="absolute top-1/2 left-[4%] h-0.5 w-[84%] -translate-y-1/2 bg-[#d4893f]" />
          <span className="absolute top-1/2 left-[4%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4893f]" />
          <span className="absolute top-1/2 left-[88%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4893f]" />
        </div>

        <p className="mt-3 text-[11px] text-zinc-300">Preço: 0,02 - 12,30 ETH</p>

        <button
          type="button"
          className="mt-3 rounded-sm bg-[#d4893f] px-3 py-1 text-[11px] font-medium text-[#1a110d] hover:bg-[#e09a52]"
        >
          Aplicar
        </button>
      </section>

      <section aria-labelledby="filter-network" className="mt-5">
        <h2 id="filter-network" className="text-xs font-bold text-zinc-100">
          Rede
        </h2>
        <FilterList items={networks} />
      </section>
    </aside>
  );
}
