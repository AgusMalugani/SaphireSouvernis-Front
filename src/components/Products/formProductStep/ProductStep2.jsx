import { useRef, useState } from 'react';
import { FiUploadCloud, FiArrowLeft, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ProductImagePreview from '../ProductImagePreview';
import {
  canAdvanceFromImageStep,
  getImageStepBlockMessage,
  MAX_PRODUCT_IMAGES_MESSAGE,
} from '../../../utils/products/canAdvanceFromImageStep';
import { MAX_PRODUCT_IMAGES } from '../../../utils/products/productImageUrls';

function ProductStep2({
  handleOnChangeImages,
  volverStep,
  avanzarStep,
  files = [],
  previewUrls = [],
  mode = 'create',
  existingImageUrls = [],
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const isEditMode = mode === 'edit';
  const newFilesCount = files.length;
  const hasNewFiles = newFilesCount > 0;
  const hasPersistedImages = existingImageUrls.length > 0;
  const showImageGrid = hasNewFiles || (isEditMode && hasPersistedImages);

  const handleFilesSelect = (selectedFileList) => {
    if (!selectedFileList || selectedFileList.length === 0) {
      return;
    }

    const incomingFiles = Array.from(selectedFileList);
    const invalidFile = incomingFiles.find(
      (fileItem) => !fileItem.type.startsWith('image/'),
    );

    if (invalidFile) {
      toast.error('Solo se aceptan archivos de imagen.');
      return;
    }

    if (incomingFiles.length > MAX_PRODUCT_IMAGES) {
      toast.error(MAX_PRODUCT_IMAGES_MESSAGE);
      return;
    }

    handleOnChangeImages(incomingFiles);
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
    handleFilesSelect(event.dataTransfer.files);
  };

  const handleAvanzar = () => {
    const canAdvance = canAdvanceFromImageStep({
      mode,
      newFilesCount,
      existingImageUrls,
    });

    if (!canAdvance) {
      toast.error(getImageStepBlockMessage({ mode, existingImageUrls }));
      return;
    }

    avanzarStep();
  };

  const handleChangeImagesClick = () => {
    fileInputRef.current?.click();
  };

  const renderPreviewTile = (previewUrl, index, altLabel) => {
    if (previewUrl?.startsWith('blob:')) {
      return (
        <img
          key={`blob-${index}`}
          src={previewUrl}
          alt={altLabel}
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <ProductImagePreview
        key={`persisted-${previewUrl}-${index}`}
        originalUrl={previewUrl}
        alt={altLabel}
        className="h-full w-full object-cover"
      />
    );
  };

  const gridPreviewUrls = hasNewFiles ? previewUrls : existingImageUrls;

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleFilesSelect(event.target.files)}
        className="sr-only"
      />

      {showImageGrid ? (
        <div className="flex flex-col items-center gap-4">
          <div
            className={`grid w-full max-w-md gap-3 ${
              gridPreviewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {gridPreviewUrls.map((previewUrl, index) => (
              <div
                key={`${previewUrl}-${index}`}
                className="relative aspect-square overflow-hidden rounded-2xl border border-white/60 shadow-md"
              >
                {renderPreviewTile(previewUrl, index, `Vista previa ${index + 1}`)}
              </div>
            ))}
          </div>

          {isEditMode && hasPersistedImages && !hasNewFiles ? (
            <p className="max-w-md text-center text-xs text-stone-500">
              Imágenes actuales — no es necesario cambiarlas
            </p>
          ) : (
            <p className="max-w-md text-center text-xs text-stone-400">
              {hasNewFiles
                ? `${newFilesCount} imagen${newFilesCount === 1 ? '' : 'es'} seleccionada${newFilesCount === 1 ? '' : 's'} (máx. ${MAX_PRODUCT_IMAGES})`
                : `Hasta ${MAX_PRODUCT_IMAGES} imágenes`}
            </p>
          )}

          <button
            type="button"
            onClick={handleChangeImagesClick}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-500 transition-all duration-200 hover:border-rose-300 hover:text-rose-400"
          >
            <FiRefreshCw size={13} />
            {hasNewFiles ? 'Reemplazar imágenes' : 'Cambiar imágenes'}
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
            multiple
            onChange={(event) => handleFilesSelect(event.target.files)}
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
              {isDragging ? 'Soltá las imágenes aquí' : 'Arrastrá imágenes o hacé clic'}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              PNG, JPG, WEBP · hasta {MAX_PRODUCT_IMAGES} imágenes
            </p>
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
