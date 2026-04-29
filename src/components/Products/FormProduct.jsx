import React, { useState } from 'react';
import ProductStep1 from './formProductStep/ProductStep1';
import ProductStep2 from './formProductStep/ProductStep2';
import ProductStep3 from './formProductStep/ProductStep3';
import { FiCheck } from 'react-icons/fi';

const STEPS = [
  { number: 1, label: 'Datos' },
  { number: 2, label: 'Imagen' },
  { number: 3, label: 'Resumen' },
];

function FormProduct({ handleOnChangeImage, handleSubmit, product, handleOnChange, categorias, file, previewUrl }) {
  const [step, setStep] = useState(1);

  const avanzarStep = () => setStep((prev) => prev + 1);
  const volverStep = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col gap-8">

      {/* Stepper premium — burbujas numeradas con líneas conectoras */}
      <div className="flex items-center justify-center">
        {STEPS.map((stepItem, index) => {
          const isCompleted = step > stepItem.number;
          const isActive = step === stepItem.number;

          return (
            <React.Fragment key={stepItem.number}>
              <div className="flex flex-col items-center gap-1.5">

                {/* Burbuja del paso */}
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all duration-300
                    ${isCompleted
                      ? 'bg-rose-400 text-white shadow-md shadow-rose-300/40'
                      : isActive
                        ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-300/50 ring-4 ring-rose-100'
                        : 'bg-stone-100 text-stone-400'
                    }
                  `}
                >
                  {isCompleted ? <FiCheck size={16} /> : stepItem.number}
                </div>

                {/* Label del paso */}
                <span
                  className={`text-xs font-medium transition-colors duration-300
                    ${isActive ? 'text-rose-500' : isCompleted ? 'text-stone-500' : 'text-stone-300'}
                  `}
                >
                  {stepItem.label}
                </span>
              </div>

              {/* Línea conectora entre pasos */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-16 sm:w-24 mb-5 mx-1 transition-all duration-500
                    ${step > stepItem.number ? 'bg-rose-300' : 'bg-stone-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Contenido del paso activo */}
      {step === 1 && (
        <ProductStep1
          avanzarStep={avanzarStep}
          product={product}
          handleOnChange={handleOnChange}
          categorias={categorias}
        />
      )}
      {step === 2 && (
        <ProductStep2
          handleOnChangeImage={handleOnChangeImage}
          volverStep={volverStep}
          avanzarStep={avanzarStep}
          file={file}
          previewUrl={previewUrl}
        />
      )}
      {step === 3 && (
        <ProductStep3
          product={product}
          previewUrl={previewUrl}
          volverStep={volverStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default FormProduct;
