import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-stone-50 to-pink-50/30 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-rose-500 transition-colors mb-8"
        >
          <FiArrowLeft size={16} />
          Volver al inicio
        </Link>

        <article className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm p-8 sm:p-10 space-y-6">
          <header className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-stone-100 pb-6">
            <img
              src={import.meta.env.VITE_LOGO_URL}
              alt="Saphire Souvenirs"
              className="w-16 h-16 rounded-full object-cover border border-white/60 shrink-0"
            />
            <div className="space-y-1">
              <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
                Quiénes somos
              </span>
              <h1 className="font-display text-3xl sm:text-4xl text-stone-800 font-bold">
                Saphire Souvenirs
              </h1>
              <p className="text-stone-500 text-sm font-light">
                Souvenirs personalizados con dedicación y estilo.
              </p>
            </div>
          </header>

          <section className="space-y-3">
            <p className="text-stone-500 text-sm leading-relaxed">
              Somos un emprendimiento enfocado en souvenirs y detalles para celebraciones especiales. Trabajamos
              diseños personalizados para que cada evento refleje la identidad de quienes lo celebran.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Cómo trabajamos</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Podés explorar nuestro catálogo en línea, armar tu pedido y completar los datos para el diseño. Luego
              coordinamos contigo por los canales oficiales del negocio para confirmar detalles, tiempos y entrega.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Contacto</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Encontrás nuestros enlaces a Instagram y WhatsApp en el pie de página de este sitio. Solo utilizamos
              esos perfiles y números publicados aquí para atención al cliente.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

export default AboutUs;
