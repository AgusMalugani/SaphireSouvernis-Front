import { useRef, useState } from 'react';
import { FiUploadCloud, FiArrowLeft, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProductImagePreview from '../ProductImagePreview';
import {
  canAdvanceFromImageStep,
  getImageStepBlockMessage,
  hasExistingProductImage,
} from '../../../utils/products/canAdvanceFromImageStep';

function ProductStep2({
  handleOnChangeImage,
  volverStep,
  avanzarStep,
  file,
  previewUrl,
  mode = 'create',
  existingImageUrl = '',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const isEditMode = mode === 'edit';
  const hasPersistedImage = hasExistingProductImage(existingImageUrl);
  const showExistingImagePreview =
    Boolean(previewUrl) || (isEditMode && hasPersistedImage);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) {
      return;
    }
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Solo se aceptan archivos de imagen.');
      return;
    }
    handleOnChangeImage(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files[0]);
  };

  const handleAvanzar = () => {
    const canAdvance = canAdvanceFromImageStep({
      mode,
      hasNewFile: Boolean(file),
      existingImageUrl,
    });

    if (!canAdvance) {
      toast.error(getImageStepBlockMessage({ mode, existingImageUrl }));
      return;
    }

    avanzarStep();
  };

  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };

  const renderPreviewImage = () => {
    if (file && previewUrl?.startsWith('blob:')) {
      return (
        <img
          src={previewUrl}
          alt="Vista previa"
          className="h-full w-full object-cover"
        />
      );
    }

    if (hasPersistedImage) {
      return (
        <ProductImagePreview
          originalUrl={existingImageUrl}
          alt="Vista previa"
          className="h-full w-full object-cover"
        />
      );
    }

    if (previewUrl) {
      return (
        <img
          src={previewUrl}
          alt="Vista previa"
          className="h-full w-full object-cover"
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => handleFileSelect(event.target.files[0])}
        className="sr-only"
      />

      {showExistingImagePreview ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl border border-white/60 shadow-md">
            {renderPreviewImage()}
          </div>

          {isEditMode && hasPersistedImage && !file ? (
            <p className="max-w-[280px] text-center text-xs text-stone-500">
              Imagen actual — no es necesario cambiarla
            </p>
          ) : (
            <p className="max-w-[240px] truncate text-center text-xs text-stone-400">
              {file?.name}
            </p>
          )}

          <button
            type="button"
            onClick={handleChangeImageClick}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-500 transition-all duration-200 hover:border-rose-300 hover:text-rose-400"
          >
            <FiRefreshCw size={13} />
            Cambiar imagen
          </button>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-14 transition-all duration-300
            ${
              isDragging
                ? 'scale-[1.01] border-rose-400 bg-rose-50/60'
                : 'border-stone-200 bg-stone-50/50 hover:border-rose-300 hover:bg-rose-50/30'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleFileSelect(event.target.files[0])}
            className="sr-only"
          />

          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300
              ${isDragging ? 'bg-rose-100' : 'bg-stone-100'}
            `}
          >
            <FiUploadCloud
              size={28}
              className={`transition-colors duration-300 ${isDragging ? 'text-rose-400' : 'text-stone-400'}`}
            />
          </div>

          <div className="text-center">
            <p
              className={`text-sm font-semibold transition-colors duration-300 ${isDragging ? 'text-rose-500' : 'text-stone-600'}`}
            >
              {isDragging ? 'Soltá la imagen aquí' : 'Arrastrá una imagen o hacé clic'}
            </p>
            <p className="mt-1 text-xs text-stone-400">PNG, JPG, WEBP · hasta 10MB</p>
          </div>
        </label>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={volverStep}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 py-2.5 text-sm font-medium text-stone-500 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
        >
          <FiArrowLeft size={15} />
          Volver
        </button>
        <button
          type="button"
          onClick={handleAvanzar}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-rose-400/60 active:scale-95"
        >
          Siguiente
          <FiArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default ProductStep2;
