import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

function ProductHomeView() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* Fondo degradado cálido rose-gold */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-stone-50 to-pink-100 -z-10" />

      {/* Blob central difuso — refuerza la atmósfera premium */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-200/30 blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Eyebrow */}
      <span className="uppercase tracking-[0.3em] text-rose-400 text-xs font-medium mb-4">
        Catálogo Completo
      </span>

      {/* Titular con Playfair Display */}
      <h2 className="font-display text-4xl sm:text-5xl text-stone-800 font-bold mb-4 leading-tight">
        Explorá todos
        <br />
        <em className="not-italic text-rose-400">nuestros productos</em>
      </h2>

      {/* Subtítulo */}
      <p className="text-stone-500 text-base max-w-md mb-10 font-light leading-relaxed">
        Descubrí nuestra colección completa de souvenirs y encontrá el detalle
        perfecto para tu celebración.
      </p>

      {/* CTA Button con efecto glow rose-gold — sin inline styles */}
      <button
        onClick={() => navigate('/shopProducts')}
        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-base rounded-full shadow-lg shadow-rose-300/40 hover:shadow-xl hover:shadow-rose-400/60 hover:scale-105 transition-all duration-300 ease-out active:scale-95"
      >
        Ver Productos
        <HiArrowRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>
    </section>
  );
}

export default ProductHomeView;
