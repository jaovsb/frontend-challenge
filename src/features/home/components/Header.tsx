import { Search, ShoppingCart } from "lucide-react";

const navItems = ["Início", "Mercado", "Criadores", "Aprenda"];

export function Header() {
  return (
    <header className="border-b border-[#2e1d16] bg-[#140d0a]">
      <div className="mx-auto grid h-14 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-4 xl:px-0">
        <a href="#" className="text-sm font-bold tracking-widest text-zinc-100">
          KURIO
        </a>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-6 text-xs sm:gap-8">
            {navItems.map((item, index) => (
              <li key={item}>
                <a
                  href="#"
                  aria-current={index === 0 ? "page" : undefined}
                  className={
                    index === 0
                      ? "border-b border-[#d4893f] pb-1 text-[#d4893f]"
                      : "text-zinc-300 hover:text-zinc-100"
                  }
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end gap-4">
          <button type="button" aria-label="Buscar" className="text-zinc-300 hover:text-zinc-100">
            <Search className="size-4" aria-hidden="true" />
          </button>
          <button type="button" aria-label="Carrinho" className="text-zinc-300 hover:text-zinc-100">
            <ShoppingCart className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="rounded-sm border border-[#d4893f] bg-[#d4893f] px-3 py-1 text-xs font-medium text-[#1a110d] hover:bg-[#e09a52]"
          >
            Entrar
          </button>
        </div>
      </div>
    </header>
  );
}
