import React from 'react';
import { Link, useParams } from 'react-router-dom';
import ViewBuyOrder from '../components/Orders/ViewBuyOrder';
import { FiCheckCircle, FiHome } from 'react-icons/fi';

function PostShop() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl">

        {/* Hero de confirmación */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-100 mb-5">
            <FiCheckCircle size={38} className="text-emerald-500" />
          </div>
          <span className="uppercase tracking-[0.3em] text-rose-400 text-xs font-medium">
            Pedido confirmado
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-stone-800 font-bold mt-2 leading-tight">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-stone-400 mt-3 text-sm font-light max-w-sm mx-auto">
            Ya recibimos tu pedido. El siguiente paso es contactarnos por WhatsApp para coordinar los detalles.
          </p>
        </div>

        {/* Detalle del pedido */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl shadow-sm overflow-hidden mb-6">
          <ViewBuyOrder id={id} />
        </div>

        {/* Volver al inicio */}
        <Link to="/" className="block">
          <button className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full border border-stone-200 text-stone-500 font-semibold text-sm bg-white hover:bg-stone-50 hover:border-stone-300 transition-all duration-200">
            <FiHome size={15} />
            Volver al inicio
          </button>
        </Link>

      </div>
    </div>
  );
}

export default PostShop;
