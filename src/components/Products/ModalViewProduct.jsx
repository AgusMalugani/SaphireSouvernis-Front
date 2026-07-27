import { BaseModal } from '../ui';
import { useProductDetail } from '../../hooks/useProductDetail';
import { getProductImageUrls } from '../../utils/products/productImageUrls';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import ProductImageGallery from './ProductImageGallery';

function ModalViewProduct({ isOpen, onClose, idProduct }) {
  const { product, isLoading, isError, isSuccess, errorMessage } = useProductDetail({
    productId: idProduct,
    enabled: isOpen,
  });

  const galleryImageUrls = product ? getProductImageUrls(product) : [];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      maxHeight=""
      className="overflow-hidden"
      closeButtonPosition="top-3 right-3"
      ariaLabel="Detalle del producto"
    >
      {isLoading && <ProductDetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
          <p className="text-sm text-stone-600">{errorMessage}</p>
        </div>
      )}

      {isSuccess && product && (
        <>
          <ProductImageGallery imageUrls={galleryImageUrls} alt={product.name} />

          <div className="flex flex-col gap-2 p-5">
            <h2 className="font-display text-xl font-semibold leading-snug text-stone-800">
              {product.name}
            </h2>
            <p className="text-sm leading-relaxed text-stone-500">{product.details}</p>
            <p className="mt-1 text-lg font-bold text-rose-500">${product.price}</p>
          </div>
        </>
      )}
    </BaseModal>
  );
}

export default ModalViewProduct;
