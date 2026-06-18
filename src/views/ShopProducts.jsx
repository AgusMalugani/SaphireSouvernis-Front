import Products from '../components/Products/Products';

function ShopPageHeader() {
  return (
    <header className="px-6 pb-2 pt-24 text-center sm:px-8">
      <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
        Saphire Souvenirs
      </span>
      <h1
        id="shop-heading"
        className="mt-2 font-display text-4xl font-bold text-stone-800 sm:text-5xl"
      >
        Nuestro Catálogo
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-stone-500">
        Encontrá el souvenir perfecto para tu celebración especial
      </p>
    </header>
  );
}

function ShopProducts() {
  return (
    <div className="min-h-screen scroll-smooth bg-gradient-to-br from-rose-50/50 via-stone-50 to-pink-50/30">
      <section
        id="shop-content"
        aria-labelledby="shop-heading"
        className="flex flex-col"
      >
        <ShopPageHeader />
        <Products />
      </section>
    </div>
  );
}

export default ShopProducts;
