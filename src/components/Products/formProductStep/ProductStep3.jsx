import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import ProductImagePreview from '../ProductImagePreview';

function ProductStep3({
  product,
  previewUrls = [],
  existingImageUrls = [],
  files = [],
  volverStep,
  handleSubmit,
}) {
  const hasNewFiles = files.length > 0;
  const summaryImageUrls = hasNewFiles ? previewUrls : existingImageUrls;

  const renderSummaryTile = (imageUrl, index) => {
    if (hasNewFiles && imageUrl?.startsWith('blob:')) {
      return (
        <img
          key={`summary-blob-${index}`}
          src={imageUrl}
          alt={`${product.name} ${index + 1}`}
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <ProductImagePreview
        key={`summary-persisted-${imageUrl}-${index}`}
        originalUrl={imageUrl}
        alt={`${product.name} ${index + 1}`}
        className="h-full w-full object-cover"
      />
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-stone-100 bg-stone-50/80">
        {summaryImageUrls.length > 0 && (
          <div
            className={`grid gap-1 ${
              summaryImageUrls.length === 1
                ? 'grid-cols-1'
                : summaryImageUrls.length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
            }`}
          >
            {summaryImageUrls.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className="aspect-square overflow-hidden"
              >
                {renderSummaryTile(imageUrl, index)}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Producto
            </p>
            <h2 className="mt-0.5 font-display text-2xl font-bold text-stone-800">
              {product.name}
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-stone-500">{product.details}</p>

          <div className="flex items-center justify-between border-t border-stone-100 py-3">
            <span className="text-sm text-stone-500">Precio unitario</span>
            <span className="text-lg font-bold text-rose-500">${product.price}</span>
          </div>

          {product.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-500"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

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
          onClick={handleSubmit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-rose-400/60 active:scale-95"
        >
          <FiCheck size={15} />
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default ProductStep3;
