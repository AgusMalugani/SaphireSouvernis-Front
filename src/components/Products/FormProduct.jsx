import React, { useState } from 'react'
import ProductStep1 from './formProductStep/ProductStep1';
import ProductStep2 from './formProductStep/ProductStep2';
import ProductStep3 from './formProductStep/ProductStep3';

function FormProduct({ handleOnChangeImage, handleSubmit, product, handleOnChange, categorias, categoriasSeleccionadas }) {
  const [step, setStep] = useState(1);

  const avanzarStep = () => setStep((prevStep) => prevStep + 1);
  const volverStep = () => setStep((prevStep) => prevStep - 1);

  return (
<div className="max-w-full p-5 font-sans box-border">
  <div className="mb-5 flex justify-around flex-wrap">
    <span className={`font-bold ${step === 1 ? 'text-blue-500' : 'text-gray-500'}`}>
      {step > 1 ? "✅" : "⚪"} Paso 1
    </span>
    <span className={`font-bold ${step === 2 ? 'text-blue-500' : 'text-gray-500'}`}>
      {step > 2 ? "✅" : "⚪"} Paso 2
    </span>
    <span className={`font-bold ${step === 3 ? 'text-blue-500' : 'text-gray-500'}`}>
      {step > 3 ? "✅" : "⚪"} Paso 3
    </span>
  </div>

      {step === 1 && (
        <ProductStep1
          avanzarStep={avanzarStep}
          product={product}
          handleOnChange={handleOnChange}
          categorias={categorias}
          categoriasSeleccionadas={categoriasSeleccionadas}
        />
      )}
      {step === 2 && (
        <ProductStep2
          handleOnChangeImage={handleOnChangeImage}
          volverStep={volverStep}
          avanzarStep={avanzarStep}
          imgProduct={product?.img_url}
        />
      )}
      {step === 3 && (
        <ProductStep3
          product={product}
          volverStep={volverStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default FormProduct;
