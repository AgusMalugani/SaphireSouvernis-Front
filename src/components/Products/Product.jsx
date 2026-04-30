import React, { useState } from 'react';
import ModalViewProduct from './ModalViewProduct';
import { FiHeart, FiEye } from 'react-icons/fi';

function Product({ id, img_url, name, price, addToCart }) {
  const [cantidad, setCantidad] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [idProduct, setIdProduct] = useState('');

  const viewProduct = (productId) => {
    setIdProduct(productId);
    setIsOpen(true);
  };

  const handleChange = (event) => {
    setCantidad(Number(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addToCart({ id, img_url, name, price, cuantity: cantidad });
  };

  return (
    <div className="group relative flex flex-col bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-300">

      {/* Imagen con efecto scale al hover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={img_url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Velo oscuro sutil al hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Íconos de acción — aparecen al hover con deslizamiento vertical */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            aria-label="Guardar en favoritos"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-rose-400 hover:bg-rose-50 hover:text-rose-500 shadow-sm transition-colors duration-200"
          >
            <FiHeart size={16} />
          </button>

          <button
            type="button"
            onClick={() => viewProduct(id)}
            aria-label="Ver detalle del producto"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-stone-500 hover:bg-stone-50 hover:text-stone-800 shadow-sm transition-colors duration-200"
          >
            <FiEye size={16} />
          </button>
        </div>
      </div>

      {/* Info y controles */}
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
          idProduct={idProduct}
        />
      )}
    </div>
  );
}

export default Product;
