import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMousePointer,
} from 'react-icons/fi';

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

const STEP_CARD_CLASS =
  'rounded-2xl border border-white/60 bg-white/60 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-all duration-200 ease-in-out hover:bg-white/75 hover:shadow-md';

function SectionHeading({ eyebrow, title, headingId }) {
  return (
    <div className="mb-12 text-center">
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

function WorkStepCard({ step, stepNumber }) {
  const StepIcon = step.icon;

  return (
    <article className={STEP_CARD_CLASS}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
          <StepIcon size={20} className="text-rose-400" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium uppercase tracking-widest text-rose-400">
          Paso {stepNumber}
        </span>
      </div>

      <h3 className="mb-1 text-sm font-semibold text-stone-800">{step.title}</h3>
      <p className="text-sm leading-relaxed text-stone-500">{step.description}</p>
    </article>
  );
}

function InfoMetodoTrabajo() {
  return (
    <section
      aria-labelledby="work-method-heading"
      className="relative w-full overflow-hidden px-6 py-20 sm:px-8"
    >
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-100 via-rose-50 to-stone-100"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="¿Cómo funciona?"
          title="Modalidad de Trabajo"
          headingId="work-method-heading"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          {WORK_STEPS.map((step, index) => (
            <WorkStepCard
              key={step.title}
              step={step}
              stepNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default InfoMetodoTrabajo;
