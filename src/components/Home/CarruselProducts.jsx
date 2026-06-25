import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { isProductAvailableForSale } from '../../utils/products/isProductAvailableForSale';

const FEATURED_COUNT = 6;

const PRODUCT_CARD_CLASS =
  'group relative block overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-200 ease-in-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

function SectionHeading({ eyebrow, title, headingId }) {
  return (
    <div className="mb-10 text-center">
      <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
        {eyebrow}
      </span>
      <h2
        id={headingId}
        className="mt-2 font-display text-3xl font-semibold text-stone-800 sm:text-4xl"
      >
        {title}
      </h2>
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Cargando productos destacados"
      className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8"
    >
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="h-3 w-32 animate-pulse rounded-lg bg-stone-200/60" />
        <div className="h-8 w-56 animate-pulse rounded-xl bg-stone-200/60" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {Array.from({ length: FEATURED_COUNT }, (_, index) => (
          <div
            key={index}
            className={`aspect-square animate-pulse rounded-2xl bg-stone-200/60 ${
              index === 0 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function FeaturedProductCard({ product, isWideOnMobile }) {
  return (
    <Link
      to="/shopProducts"
      aria-label={`Ver ${product.name} en el catálogo`}
      className={`${PRODUCT_CARD_CLASS} ${isWideOnMobile ? 'col-span-2 sm:col-span-1' : ''}`}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.img_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 flex translate-y-full items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 transition-transform duration-200 ease-in-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
        <span className="text-sm font-semibold leading-snug text-white sm:text-base">
          {product.name}
        </span>
      </div>

      <span
        className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      />
    </Link>
  );
}

function CarruselProducts() {
  const { products } = useContext(ProductsContext);

  const featuredProducts = useMemo(
    () => (products ?? []).filter(isProductAvailableForSale).slice(0, FEATURED_COUNT),
    [products],
  );

  if (!products || products.length === 0 || featuredProducts.length === 0) {
    return <FeaturedProductsSkeleton />;
  }

  return (
    <section
      aria-labelledby="featured-products-heading"
      className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8"
    >
      <SectionHeading
        eyebrow="Nuestra Colección"
        title="Productos destacados"
        headingId="featured-products-heading"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {featuredProducts.map((product, index) => (
          <FeaturedProductCard
            key={product.id}
            product={product}
            isWideOnMobile={index === 0}
          />
        ))}
      </div>
    </section>
  );
}

export default CarruselProducts;
