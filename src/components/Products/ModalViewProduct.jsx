import Modal from 'react-modal';
import { HiX } from 'react-icons/hi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useProductDetail } from '../../hooks/useProductDetail';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';
import ProductDetailSkeleton from './ProductDetailSkeleton';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    inset: 'unset',
    padding: 0,
    border: 'none',
    background: 'none',
    overflow: 'visible',
  },
};

function ModalViewProduct({ isOpen, onClose, idProduct }) {
  const { product, isLoading, isError, isSuccess, errorMessage } = useProductDetail({
    productId: idProduct,
    enabled: isOpen,
  });

  useBodyScrollLock(isOpen);

  const displayImageUrl = product?.img_url
    ? toCloudinaryDisplayUrl(product.img_url)
    : undefined;

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onClose}
      style={modalStyles}
    >
      <div className="relative bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl shadow-2xl w-[90vw] max-w-sm overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-200"
        >
          <HiX size={16} />
        </button>

        {isLoading && <ProductDetailSkeleton />}

        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <p className="text-stone-600 text-sm">{errorMessage}</p>
          </div>
        )}

        {isSuccess && product && (
          <>
            <div className="aspect-square w-full overflow-hidden bg-stone-100">
              {displayImageUrl ? (
                <img
                  src={displayImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-400 text-sm">
                  Sin imagen
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col gap-2">
              <h2 className="font-display text-xl text-stone-800 font-semibold leading-snug">
                {product.name}
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                {product.details}
              </p>
              <p className="text-rose-500 font-bold text-lg mt-1">${product.price}</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ModalViewProduct;
