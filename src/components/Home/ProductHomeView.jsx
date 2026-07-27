import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { Button } from '../ui';

function ProductHomeView() {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="catalog-cta-heading"
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center sm:px-8"
    >
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-stone-50 to-pink-100"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-200/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6">
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
          Catálogo Completo
        </span>

        <h2
          id="catalog-cta-heading"
          className="font-display text-4xl font-bold leading-tight text-stone-800 sm:text-5xl"
        >
          Explorá todos
          <br />
          <em className="not-italic text-rose-400">nuestros productos</em>
        </h2>

        <p className="max-w-md text-base font-light leading-relaxed text-stone-500">
          Descubrí nuestra colección completa de souvenirs y encontrá el detalle
          perfecto para tu celebración.
        </p>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => navigate('/shopProducts')}
          className="group"
        >
          Ver Productos
          <HiArrowRight
            size={18}
            aria-hidden="true"
            className="transition-transform duration-200 ease-in-out group-hover:translate-x-1"
          />
        </Button>
      </div>
    </section>
  );
}

export default ProductHomeView;
