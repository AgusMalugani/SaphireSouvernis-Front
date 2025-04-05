import React, { useState } from 'react'
import ProductStep1 from './formProductStep/ProductStep1';
import ProductStep2 from './formProductStep/ProductStep2';
import ProductStep3 from './formProductStep/ProductStep3';

function FormProduct({ handleOnChangeImage, handleSubmit, product, handleOnChange, categorias, categoriasSeleccionadas }) {
  const [step, setStep] = useState(1);

  const avanzarStep = () => setStep((prevStep) => prevStep + 1);
  const volverStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div style={{ maxWidth: "100%", padding: "20px", fontFamily: "Arial, sans-serif", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        <span style={{ color: step === 1 ? "blue" : "gray", fontWeight: "bold" }}> {step > 1 ? "✅" : "⚪"}  Paso 1</span>
        <span style={{ color: step === 2 ? "blue" : "gray", fontWeight: "bold" }}>{step > 2 ? "✅" : "⚪"} Paso 2</span>
        <span style={{ color: step === 3 ? "blue" : "gray", fontWeight: "bold" }}> {step > 3 ? "✅" : "⚪"} Paso 3</span>
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
