import React, { useState } from 'react';
import { FiUploadCloud, FiArrowLeft, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

function ProductStep2({ handleOnChangeImage, volverStep, avanzarStep, file, previewUrl }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Solo se aceptan archivos de imagen.');
      return;
    }
    handleOnChangeImage(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  // Valida que el usuario haya seleccionado una imagen antes de avanzar
  const handleAvanzar = () => {
    if (!file) {
      toast.error('Debés seleccionar una imagen para continuar.');
      return;
    }
    avanzarStep();
  };

  return (
    <div className="flex flex-col gap-6">

      {previewUrl ? (
        /* Vista previa de la imagen seleccionada */
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-3xl shadow-md border border-white/60">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-stone-400 text-xs text-center truncate max-w-[240px]">
            {file?.name}
          </p>
          <button
            onClick={() => handleOnChangeImage(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border border-stone-200 text-stone-500 hover:border-rose-300 hover:text-rose-400 transition-all duration-200"
          >
            <FiRefreshCw size={13} />
            Cambiar imagen
          </button>
        </div>
      ) : (
        /* Drag & Drop zone — se convierte en input clickeable */
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-4 w-full py-14 px-6 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300
            ${isDragging
              ? 'border-rose-400 bg-rose-50/60 scale-[1.01]'
              : 'border-stone-200 bg-stone-50/50 hover:border-rose-300 hover:bg-rose-50/30'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            className="sr-only"
          />

          {/* Ícono de nube */}
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors duration-300
              ${isDragging ? 'bg-rose-100' : 'bg-stone-100'}
            `}
          >
            <FiUploadCloud
              size={28}
              className={`transition-colors duration-300 ${isDragging ? 'text-rose-400' : 'text-stone-400'}`}
            />
          </div>

          {/* Texto de la zona */}
          <div className="text-center">
            <p className={`text-sm font-semibold transition-colors duration-300 ${isDragging ? 'text-rose-500' : 'text-stone-600'}`}>
              {isDragging ? 'Soltá la imagen aquí' : 'Arrastrá una imagen o hacé clic'}
            </p>
            <p className="text-stone-400 text-xs mt-1">PNG, JPG, WEBP · hasta 10MB</p>
          </div>
        </label>
      )}

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
          onClick={handleAvanzar}
          className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-semibold shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Siguiente
          <FiArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default ProductStep2;
