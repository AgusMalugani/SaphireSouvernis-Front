import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function TermsOfService() {
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
          <header className="space-y-2 border-b border-stone-100 pb-6">
            <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
              Legal
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-stone-800 font-bold">
              Términos de uso
            </h1>
            <p className="text-stone-500 text-sm font-light">
              Última actualización: {new Date().getFullYear()}
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Servicio</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Saphire Souvenirs ofrece souvenirs personalizados para eventos. Los precios y disponibilidad pueden
              variar según el producto y la temporada; cualquier cotización final se confirma al procesar tu pedido.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Pedidos y pagos</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Este sitio no procesa cobros online integrados en la página. La coordinación de precios, medios de pago
              y entrega puede realizarse por los canales que indiquemos oficialmente (por ejemplo correo o WhatsApp).
              Desconfiá de solicitudes de datos bancarios fuera de esos canales verificados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Plazos</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Los tiempos de producción y entrega dependen del volumen del pedido y la fecha del evento; te
              informaremos estimaciones al confirmar los detalles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Limitación</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Las imágenes del catálogo son orientativas; los diseños finales pueden variar levemente según materiales
              y personalización. Si tenés dudas, consultanos antes de confirmar.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

export default TermsOfService;
