import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 text-center px-4">
      <p className="font-display text-8xl font-bold text-rose-200 select-none">404</p>
      <h1 className="font-display text-2xl text-stone-700 font-semibold mt-2 mb-2">
        Página no encontrada
      </h1>
      <p className="text-stone-400 text-sm font-light mb-8 max-w-xs">
        La dirección que buscás no existe o fue movida.
      </p>
      <Link to="/">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300">
          <FiHome size={15} />
          Volver al inicio
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
