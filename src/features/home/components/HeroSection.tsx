export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-[1200px] px-4 pt-8 xl:px-0">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_450px]">
        <div className="relative lg:pl-10">
          <p className="text-xs text-zinc-300">Bem-vindo à Kurio</p>

          <h1
            id="hero-title"
            className="mt-4 text-3xl font-bold leading-tight tracking-wide text-zinc-100 sm:text-[44px]"
          >
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>

          <p className="mt-6 max-w-[460px] text-xs leading-relaxed text-zinc-400">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e torne-se parte da
            cultura da internet.
          </p>

          <button
            type="button"
            className="mt-8 rounded-sm bg-[#d4893f] px-6 py-2 text-xs font-medium text-[#1a110d] hover:bg-[#e09a52]"
          >
            EXPLORAR
          </button>

          <div className="mt-10 flex justify-end gap-1.5 lg:mt-12" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#d4893f]" />
            <span className="size-1.5 rounded-full bg-[#d4893f]" />
            <span className="size-1.5 rounded-full bg-[#d4893f]" />
          </div>
        </div>

        <img
          src="/assets/nfts/ape-green.png"
          alt="Macaco com óculos verdes e jaqueta college verde"
          className="aspect-[45/44] w-full max-w-[450px] justify-self-center rounded-2xl object-cover lg:justify-self-end"
        />
      </div>
    </section>
  );
}
