import React from 'react';
import { FiMousePointer, FiCreditCard, FiClock, FiCheckCircle } from 'react-icons/fi';

const WORK_STEPS = [
  {
    icon: FiMousePointer,
    title: 'Pedido online',
    description:
      'Completá los datos requeridos en la web. Al finalizar, serás redirigido automáticamente a WhatsApp.',
  },
  {
    icon: FiCreditCard,
    title: 'Confirmá con seña',
    description:
      'El pedido se agenda al abonar el 50%, 30% o el pago total de la compra.',
  },
  {
    icon: FiClock,
    title: 'Plazo de 48hs',
    description:
      'Si no se abona dentro de las 48hs, el pedido se da de baja. Consultá nuevamente costos y disponibilidad.',
  },
  {
    icon: FiCheckCircle,
    title: 'Aprobá las muestras',
    description:
      'Confirmado el pedido, realizamos las muestras y las enviamos para tu aprobación.',
  },
];

function InfoMetodoTrabajo() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-8 overflow-hidden">

      {/* Fondo degradado suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-stone-100 -z-10" />

      <div className="max-w-6xl mx-auto">

        {/* Encabezado de sección */}
        <div className="text-center mb-12">
          <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
            ¿Cómo funciona?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-stone-800 mt-2 font-semibold">
            Modalidad de Trabajo
          </h2>
        </div>

        {/* Layout: grid de cards + imagen lateral */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Grid de 4 tarjetas glassmorphism */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WORK_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-white/55 transition-all duration-300"
                >
                  {/* Ícono con fondo rose suave */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 mb-4">
                    <StepIcon size={20} className="text-rose-500" />
                  </div>

                  <h3 className="font-semibold text-stone-800 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Imagen lateral con ring decorativo */}
          <div className="lg:w-72 w-full shrink-0">
            <img
              className="rounded-3xl w-full h-72 lg:h-full object-cover shadow-xl ring-4 ring-white/60"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0-hHH-tYkE1_CqnxjiBpfZkU1vs32Hlsjg&s"
              alt="Ejemplo del proceso de trabajo en Saphire Souvenirs"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoMetodoTrabajo;
