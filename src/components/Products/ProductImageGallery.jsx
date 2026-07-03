import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductImagePreview from './ProductImagePreview';

function ProductImageGallery({ imageUrls = [], alt = 'Producto' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = imageUrls.length;
  const hasMultipleImages = totalImages > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [imageUrls]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? totalImages - 1 : currentIndex - 1,
    );
  }, [totalImages]);

  const goToNext = useCallback(() => {
    setActiveIndex((currentIndex) =>
      currentIndex === totalImages - 1 ? 0 : currentIndex + 1,
    );
  }, [totalImages]);

  const handleKeyDown = (event) => {
    if (!hasMultipleImages) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    }
  };

  if (totalImages === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-stone-100 text-sm text-stone-400">
        Sin imagen
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, totalImages - 1);
  const currentUrl = imageUrls[safeIndex];

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-stone-100"
      onKeyDown={handleKeyDown}
      tabIndex={hasMultipleImages ? 0 : undefined}
      role={hasMultipleImages ? 'region' : undefined}
      aria-label={hasMultipleImages ? `Galería de ${alt}` : undefined}
    >
      <ProductImagePreview
        originalUrl={currentUrl}
        alt={alt}
        className="h-full w-full object-cover"
      />

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/80 text-stone-600 shadow-sm backdrop-blur-sm transition-colors hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/80 text-stone-600 shadow-sm backdrop-blur-sm transition-colors hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
          >
            <FiChevronRight size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {imageUrls.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                aria-label={`Ver imagen ${index + 1} de ${totalImages}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 ${
                  index === safeIndex
                    ? 'scale-110 bg-rose-400'
                    : 'bg-white/70 hover:bg-rose-200'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductImageGallery;
