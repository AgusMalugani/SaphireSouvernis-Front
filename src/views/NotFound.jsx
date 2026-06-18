import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { PRIMARY_CTA_CLASS } from '../components/layout/ConsumerPageLayout.jsx';

function NotFound() {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 px-6 text-center"
    >
      <p className="select-none font-display text-8xl font-bold text-rose-200">404</p>
      <h1
        id="not-found-heading"
        className="mt-2 font-display text-2xl font-semibold text-stone-800"
      >
        Página no encontrada
      </h1>
      <p className="mb-8 mt-2 max-w-xs text-sm font-light leading-relaxed text-stone-500">
        La dirección que buscás no existe o fue movida.
      </p>
      <Link to="/" className={PRIMARY_CTA_CLASS}>
        <FiHome size={15} aria-hidden="true" />
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFound;
