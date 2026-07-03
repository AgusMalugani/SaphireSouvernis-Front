import React, { useState } from 'react';
import ModalViewProduct from './ModalViewProduct';

function Product({ id, img_url, name, price, addToCart }) {
  const [cantidad, setCantidad] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    setCantidad(Number(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addToCart({ id, img_url, name, price, cuantity: cantidad });
  };

  return (
    <div className="group relative flex flex-col bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Ver detalle de ${name}`}
        className="relative aspect-square w-full overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-inset"
      >
        <img
          src={img_url}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <div className="flex flex-col gap-2 p-3 sm:p-4 sm:gap-3">
        <div>
          <h3 className="font-semibold text-stone-800 text-xs sm:text-sm leading-snug line-clamp-2">
            {name}
          </h3>
          <p className="text-rose-500 font-bold text-sm sm:text-base mt-1">${price}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-end gap-1.5 sm:gap-2 mt-auto">
          <label className="flex flex-col text-xs text-stone-400 shrink-0">
            Cant.
            <input
              type="number"
              value={cantidad}
              onChange={handleChange}
              min={1}
              className="w-12 sm:w-14 h-8 text-center text-xs sm:text-sm border border-stone-200 rounded-xl mt-0.5 focus:outline-none focus:border-rose-300 transition-colors"
            />
          </label>

          <button
            type="submit"
            className="flex-1 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-400 to-pink-500 rounded-full shadow-sm hover:shadow-rose-300/50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Agregar
          </button>
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
