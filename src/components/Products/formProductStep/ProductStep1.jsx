import React, { useState } from 'react';
import { onValidateProduct } from '../../../formValidations/OnValidateProduct';
import { FiArrowRight } from 'react-icons/fi';

function ProductStep1({ avanzarStep, product, handleOnChange, categorias }) {
  const [errors, setErrors] = useState(null);

  const handleOnSubmit = () => {
    const errores = onValidateProduct(product);
    if (!errores) {
      avanzarStep();
    } else {
      setErrors(errores);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Nombre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Nombre del producto
        </label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleOnChange}
          placeholder="Ej: Souvenir de bautismo"
          className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-stone-300"
        />
        {errors?.name && <ErrorMessage message={errors.name} />}
      </div>

      {/* Detalles */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Detalles
        </label>
        <textarea
          name="details"
          value={product.details}
          onChange={handleOnChange}
          placeholder="Describí el producto, materiales, uso..."
          className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all resize-none h-24 placeholder:text-stone-300"
        />
        {errors?.details && <ErrorMessage message={errors.details} />}
      </div>

      {/* Precio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-stone-700">
          Precio unitario
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium pointer-events-none">
            $
          </span>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleOnChange}
            placeholder="0"
            className="w-full pl-8 pr-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-stone-300"
          />
        </div>
        {errors?.price && <ErrorMessage message={errors.price} />}
      </div>

      {/* Categorías — pill checkboxes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-stone-700">Categorías</label>
        <div className="flex flex-wrap gap-2">
          {categorias?.map((categoria) => {
            const isSelected = product.categories.includes(categoria.name);
            return (
              <label
                key={categoria.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all duration-200
                  ${isSelected
                    ? 'bg-rose-400 border-rose-400 text-white shadow-sm'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-rose-300 hover:text-rose-400'
                  }
                `}
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={categoria.name}
                  checked={isSelected}
                  onChange={handleOnChange}
                  className="sr-only"
                />
                {categoria.name}
              </label>
            );
          })}
        </div>
        {errors?.categories && <ErrorMessage message={errors.categories} />}
      </div>

      <button
        onClick={handleOnSubmit}
        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300 mt-2"
      >
        Siguiente
        <FiArrowRight size={16} />
      </button>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-xs font-medium">
      {message}
    </p>
  );
}

export default ProductStep1;
