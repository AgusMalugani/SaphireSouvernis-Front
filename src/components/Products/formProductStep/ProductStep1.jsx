import React, { useState } from 'react';
import { onValidateProduct } from '../../../formValidations/OnValidateProduct';

function ProductStep1({ avanzarStep, product, handleOnChange, categorias, categoriasSeleccionadas }) {
  const [errors,setErrors]=useState(null)

const handleOnSubmit = ()=>{
 const errores = onValidateProduct(product)
 if(!errores){
  avanzarStep()
} else {
  setErrors(errores)
  console.log(errores);
}

}

return (
  <div className="flex flex-col gap-4 w-full">
    <label className="font-bold w-full">
      Nombre
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleOnChange}
        className="w-full p-2 mt-1 border border-gray-300 rounded"
      />
    </label>
    {errors && errors.name && (
      <p className="text-red-700 bg-red-100 border border-red-200 p-2 rounded-md text-sm mt-1 mb-1 font-medium">
        {errors.name}
      </p>
    )}

    <label className="font-bold w-full">
      Detalles
      <textarea
        name="details"
        value={product.details}
        onChange={handleOnChange}
        className="w-full p-2 mt-1 border border-gray-300 rounded resize-none h-20"
      />
    </label>
    {errors && errors.details && (
      <p className="text-red-700 bg-red-100 border border-red-200 p-2 rounded-md text-sm mt-1 mb-1 font-medium">
        {errors.details}
      </p>
    )}

    <label className="font-bold w-full">
      Precio unitario
      <input
        type="number"
        name="price"
        value={product.price}
        onChange={handleOnChange}
        className="w-full p-2 mt-1 border border-gray-300 rounded"
      />
    </label>
    {errors && errors.price && (
      <p className="text-red-700 bg-red-100 border border-red-200 p-2 rounded-md text-sm mt-1 mb-1 font-medium">
        {errors.price}
      </p>
    )}

    <div className="flex flex-col gap-2">
      {categorias?.map((categoria) => (
        <label key={categoria.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            name="categories"
            value={categoria.name}
            checked={categoriasSeleccionadas?.includes(categoria.name)}
            onChange={handleOnChange}
            className="form-checkbox"
          />
          {categoria.name}
        </label>
      ))}
    </div>
    {errors && errors.categories && (
      <p className="text-red-700 bg-red-100 border border-red-200 p-2 rounded-md text-sm mt-1 mb-1 font-medium">
        {errors.categories}
      </p>
    )}

    <button
      onClick={handleOnSubmit}
      className="p-2 bg-blue-600 text-white border-none rounded cursor-pointer w-full"
    >
      Siguiente
    </button>
  </div>
);
}

export default ProductStep1;
