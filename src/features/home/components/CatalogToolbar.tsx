const tabs = ["Todos os NFTs", "Novos lançamentos", "Em alta"];

export function CatalogToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
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

      <button type="button" className="text-zinc-300 hover:text-zinc-100">
        Ordenar por: Listados recentemente
      </button>
    </div>
  );
}
