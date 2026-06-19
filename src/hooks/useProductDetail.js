import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ProductsContext } from '../contexts/Products/ProductsContext';
import { OneProductById } from '../services/Products/OneProductById';
import { resolveProductFromCatalog } from '../utils/products/resolveProductFromCatalog';

const LOAD_ERROR_MESSAGE = 'No se pudo cargar el producto.';

/**
 * Resuelve detalle de producto cache-first desde ProductsContext.
 * @param {{ productId: string | number | null | undefined, enabled?: boolean }} options
 */
export function useProductDetail({ productId, enabled = true }) {
  const { products } = useContext(ProductsContext);
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!enabled || productId == null || productId === '') {
      setProduct(null);
      setStatus('idle');
      setErrorMessage(null);
      return undefined;
    }

    const cachedProduct = resolveProductFromCatalog(products, productId);
    if (cachedProduct) {
      setProduct(cachedProduct);
      setStatus('success');
      setErrorMessage(null);
      return undefined;
    }

    let cancelled = false;
    setProduct(null);
    setStatus('loading');
    setErrorMessage(null);

    const fetchRemoteProduct = async () => {
      try {
        const remoteProduct = await OneProductById(productId);
        if (!cancelled) {
          setProduct(remoteProduct);
          setStatus('success');
        }
      } catch {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(LOAD_ERROR_MESSAGE);
          toast.error(LOAD_ERROR_MESSAGE);
        }
      }
    };

    fetchRemoteProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, enabled, products]);

  return {
    product,
    status,
    errorMessage,
    isLoading: status === 'loading',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
}
