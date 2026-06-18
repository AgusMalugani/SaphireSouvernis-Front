import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle, FiHome } from 'react-icons/fi';
import ViewBuyOrder from '../components/Orders/ViewBuyOrder';
import { GHOST_CTA_CLASS } from '../components/layout/ConsumerPageLayout.jsx';

function PostShop() {
  const { id } = useParams();

  return (
    <section
      aria-labelledby="postshop-heading"
      className="flex min-h-[calc(100vh-5rem)] items-start justify-center bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 px-6 py-12"
    >
      <div className="w-full max-w-2xl">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <FiCheckCircle size={38} className="text-emerald-500" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
            Pedido confirmado
          </span>
          <h1
            id="postshop-heading"
            className="mt-2 font-display text-4xl font-bold leading-tight text-stone-800 sm:text-5xl"
          >
            ¡Gracias por tu compra!
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-stone-500">
            Ya recibimos tu pedido. El siguiente paso es contactarnos por WhatsApp para
            coordinar los detalles.
          </p>
        </header>

        <div className="mb-6 overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
          <ViewBuyOrder id={id} />
        </div>

        <Link to="/" className={GHOST_CTA_CLASS}>
          <FiHome size={15} aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

export default PostShop;
