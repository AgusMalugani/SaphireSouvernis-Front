import React from 'react';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

function ProductStep3({ product, previewUrl, volverStep, handleSubmit }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Summary card — recibo de producto antes de confirmar */}
      <div className="bg-stone-50/80 border border-stone-100 rounded-2xl overflow-hidden">

        {/* Imagen de previsualización */}
        {previewUrl && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={previewUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Información del producto */}
        <div className="p-5 flex flex-col gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-400 font-medium">Producto</p>
            <h2 className="font-display text-2xl text-stone-800 font-bold mt-0.5">
              {product.name}
            </h2>
          </div>

          <p className="text-stone-500 text-sm leading-relaxed">
            {product.details}
          </p>

          <div className="flex items-center justify-between py-3 border-t border-stone-100">
            <span className="text-stone-500 text-sm">Precio unitario</span>
            <span className="font-bold text-rose-500 text-lg">${product.price}</span>
          </div>

          {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 bg-rose-50 text-rose-500 text-xs font-medium rounded-full border border-rose-100"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex gap-3">
        <button
          onClick={volverStep}
          className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 rounded-full border border-stone-200 text-stone-500 text-sm font-medium hover:border-stone-300 hover:bg-stone-50 transition-all duration-200"
        >
          <FiArrowLeft size={15} />
          Volver
        </button>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-semibold shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <FiCheck size={15} />
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default ProductStep3;
