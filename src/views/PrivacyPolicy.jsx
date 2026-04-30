import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function PrivacyPolicy() {
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
              Política de privacidad
            </h1>
            <p className="text-stone-500 text-sm font-light">
              Última actualización: {new Date().getFullYear()}
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Datos que recopilamos</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Cuando realizás un pedido a través de nuestro sitio, podemos recopilar datos necesarios para
              elaborar y coordinar tu compra: nombre, correo electrónico, teléfonos de contacto, dirección de
              envío cuando corresponda, detalle del evento y preferencias de diseño indicadas en el formulario.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Finalidad</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Utilizamos estos datos únicamente para gestionar tu pedido, comunicarnos sobre el mismo y enviarte
              confirmaciones por correo cuando aplique. No vendemos ni alquilamos tus datos personales a terceros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Contacto por WhatsApp</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Si elegís contactarnos por WhatsApp, aplican las políticas de uso de dicho servicio. Solo utilizamos
              la conversación para coordinar tu pedido de souvenirs personalizados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-stone-800 font-semibold">Tus derechos</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Podés solicitar acceso, rectificación o eliminación de tus datos escribiéndonos al correo de contacto
              indicado en nuestra página o por los canales públicos del negocio.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
