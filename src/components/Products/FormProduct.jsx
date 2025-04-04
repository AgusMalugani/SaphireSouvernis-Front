import React, { useState } from 'react'
import ProductStep1 from './formProductStep/ProductStep1';
import ProductStep2 from './formProductStep/ProductStep2';
import ProductStep3 from './formProductStep/ProductStep3';


function FormProduct({handleOnChangeImage,handleSubmit,product,handleOnChange, categorias, categoriasSeleccionadas }) {
//product va en step1 
//onchange en 1
//categorias 1
//categorias seleccionadas 1
//changeimg en 2
//submit en 3

  const [step, setStep] = useState(1);

const avanzarStep=()=>setStep((prevStep)=>prevStep +1)
const volverStep = ()=>setStep((prevStep)=>prevStep -1)
  return (
    <div>
<div>
        <span style={{ color: step === 1 ? "blue" : "gray" }}>⚪ Paso 1</span>
        <span style={{ color: step === 2 ? "blue" : "gray" }}>⚪ Paso 2</span>
        <span style={{ color: step === 3 ? "blue" : "gray" }}>⚪ Paso 3</span>
  </div>
   {step === 1 && <ProductStep1 avanzarStep={avanzarStep} product={product} handleOnChange={handleOnChange} categorias={categorias} categoriasSeleccionadas={categoriasSeleccionadas} /> }
   {step === 2 && <ProductStep2 handleOnChangeImage={handleOnChangeImage} volverStep={volverStep} avanzarStep={avanzarStep} /> }
   {step===3 && <ProductStep3 product={product} volverStep={volverStep} handleSubmit={handleSubmit} /> } 

   </div>
  )
}

export default FormProduct
