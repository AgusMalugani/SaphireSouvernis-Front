import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

function OrderDetail({ prod, deleteToCart }) {
  const { name, img_url, price, cuantity } = prod;
  const subtotal = price * cuantity;

  return (
    <div className="flex items-center gap-3 bg-white/70 border border-white/60 p-2.5 rounded-2xl">
      <img
        src={img_url}
        alt={name}
        className="w-10 h-10 object-cover rounded-xl shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-stone-700 text-xs font-medium truncate">{name}</p>
        <p className="text-rose-500 text-xs font-bold">${subtotal}</p>
      </div>

      <span className="text-stone-400 text-xs shrink-0">×{cuantity}</span>

      <button
        onClick={deleteToCart}
        aria-label={`Eliminar ${name} del carrito`}
        className="shrink-0 text-stone-300 hover:text-rose-400 transition-colors duration-200"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
}

export default OrderDetail;
