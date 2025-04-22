import React, { useState } from 'react';

function ProductStep2({ handleOnChangeImage, volverStep, avanzarStep, imgProduct }) {
  const[image, setImage]=useState(imgProduct ? true : false)
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      {image && (
        <div>
          <img
            src={imgProduct}
            alt="Preview"
            className="w-full max-w-[300px] h-auto rounded-lg"
          />
          <button
            onClick={() => setImage(false)}
            className="p-2 bg-green-600 text-white border-none rounded w-full mt-2"
          >
            Cambiar imagen
          </button>
        </div>
      )}
  
      {!image && (
        <input
        type="file"
        name="file"
        onChange={handleOnChangeImage}
        className="w-full py-2 px-4 bg-blue-900 text-white border-none rounded-md shadow-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        accept="image/*"
      />
      
      )}
  
      <div className="flex flex-col gap-2 w-full">
        <button
          onClick={volverStep}
          className="p-2 bg-gray-600 text-white border-none rounded w-full"
        >
          Volver
        </button>
        <button
          onClick={avanzarStep}
          className="p-2 bg-blue-600 text-white border-none rounded w-full"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
  }

export default ProductStep2;
