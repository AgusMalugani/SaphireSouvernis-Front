import React, { useState } from 'react';
import { HiMinus, HiPlus } from 'react-icons/hi';
import ModalViewProduct from './ModalViewProduct';
import { MIN_QUANTITY_PER_PRODUCT } from '../../constants/orderRules';

function Product({ id, img_url, name, price, addToCart }) {
  const [cantidad, setCantidad] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleIncrement = () => setCantidad((prev) => prev + 1);
  const handleDecrement = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = (event) => {
    event.preventDefault();
    addToCart({ id, img_url, name, price, cuantity: cantidad });
    setCantidad(1);
  };

  return (
    <div className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-rose-200/50">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Ver detalle de ${name}`}
        className="relative aspect-square w-full cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-inset"
      >
        <img
          src={img_url}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <div className="flex min-w-0 flex-col gap-2 p-2.5 sm:gap-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-stone-800 sm:text-sm">
            {name}
          </h3>
          <p className="mt-1 text-sm font-bold text-rose-500 sm:text-base">${price}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-auto flex min-w-0 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="flex h-8 shrink-0 items-center rounded-lg border border-stone-200 bg-white/70 sm:h-9 sm:rounded-xl">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Disminuir cantidad"
                disabled={cantidad === 1}
                className="flex h-8 w-7 items-center justify-center text-stone-500 transition-colors hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-8"
              >
                <HiMinus size={12} aria-hidden="true" />
              </button>

              <span
                className="min-w-[1.5rem] text-center text-xs font-semibold tabular-nums text-stone-700 sm:min-w-[1.75rem] sm:text-sm"
                aria-live="polite"
              >
                {cantidad}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Aumentar cantidad"
                className="flex h-8 w-7 items-center justify-center text-stone-500 transition-colors hover:text-rose-500 sm:h-9 sm:w-8"
              >
                <HiPlus size={12} aria-hidden="true" />
              </button>
            </div>

            <button
              type="submit"
              className="h-8 min-w-0 flex-1 truncate rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-2 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 hover:brightness-105 active:scale-[0.98] sm:h-9 sm:px-3 sm:text-xs"
            >
              Agregar
            </button>
          </div>

          <p className="text-[10px] leading-tight text-stone-400 sm:text-xs">
            Pedido mínimo: {MIN_QUANTITY_PER_PRODUCT} u. por producto
          </p>
        </form>
      </div>

      {isOpen && (
        <ModalViewProduct
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          idProduct={id}
        />
      )}
    </div>
  );
}

export default Product;
