import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { MIN_QUANTITY_PER_PRODUCT } from '../../constants/orderRules';

function OrderDetail({ prod, deleteToCart, onQuantityChange }) {
  const { name, img_url, price, cuantity } = prod;
  const subtotal = price * cuantity;
  const isBelowMinimum = cuantity < MIN_QUANTITY_PER_PRODUCT;
  const missingUnits = MIN_QUANTITY_PER_PRODUCT - cuantity;

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-2.5 ${
        isBelowMinimum
          ? 'border-rose-200 bg-rose-50/70'
          : 'border-white/60 bg-white/70'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <img
          src={img_url}
          alt={name}
          className="h-10 w-10 shrink-0 rounded-xl object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-stone-700">{name}</p>
          <p className="text-xs font-bold text-rose-500">${subtotal}</p>
        </div>

        <button
          type="button"
          onClick={deleteToCart}
          aria-label={`Eliminar ${name} del carrito`}
          className="shrink-0 text-stone-300 transition-colors duration-200 hover:text-rose-400"
        >
          <FiTrash2 size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex h-8 items-center rounded-lg border border-stone-200 bg-white/80">
          <button
            type="button"
            onClick={() => onQuantityChange(cuantity - 1)}
            aria-label={`Disminuir cantidad de ${name}`}
            disabled={cuantity <= 1}
            className="flex h-8 w-7 items-center justify-center text-stone-500 transition-colors hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiMinus size={12} aria-hidden="true" />
          </button>

          <span
            className={`min-w-[1.75rem] text-center text-xs font-semibold tabular-nums ${
              isBelowMinimum ? 'text-rose-500' : 'text-stone-700'
            }`}
            aria-live="polite"
          >
            {cuantity}
          </span>

          <button
            type="button"
            onClick={() => onQuantityChange(cuantity + 1)}
            aria-label={`Aumentar cantidad de ${name}`}
            className="flex h-8 w-7 items-center justify-center text-stone-500 transition-colors hover:text-rose-500"
          >
            <HiPlus size={12} aria-hidden="true" />
          </button>
        </div>

        {isBelowMinimum ? (
          <p className="text-right text-[10px] font-medium leading-tight text-rose-500">
            Faltan {missingUnits} u. (mín. {MIN_QUANTITY_PER_PRODUCT})
          </p>
        ) : (
          <p className="text-[10px] text-stone-400">×{cuantity}</p>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;
