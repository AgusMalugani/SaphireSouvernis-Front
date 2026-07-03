import { useContext, useEffect, useState } from 'react';
import FormProduct from './FormProduct';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import { toast } from 'react-toastify';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';
import { normalizeProductForEdit, resolveProductFromCatalog } from '../../utils/products/resolveProductFromCatalog';
import { getProductImageUrls } from '../../utils/products/productImageUrls';
import { buildProductMetadataPayload } from '../../utils/products/buildProductMetadataPayload';
import { buildProductMultipartFormData } from '../../utils/products/buildProductMultipartFormData';
import { UpdateProduct } from '../../services/Products/UpdateProduct';
import { updateProductWithFiles } from '../../services/Products/updateProductWithFiles';
import { MAX_PRODUCT_IMAGES } from '../../utils/products/productImageUrls';
import { MAX_PRODUCT_IMAGES_MESSAGE } from '../../utils/products/canAdvanceFromImageStep';

const emptyProduct = {
  name: '',
  details: '',
  price: 0,
  stock: true,
  categories: [],
  img_urls: [],
};

function buildEditStateFromProduct(sourceProduct) {
  const normalizedProduct = normalizeProductForEdit(sourceProduct);
  return {
    product: normalizedProduct,
    existingImageUrls: getProductImageUrls(normalizedProduct),
  };
}

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setProducts, categories, products } = useContext(ProductsContext);

  const cachedProduct = resolveProductFromCatalog(products, id);
  const initialEditState = cachedProduct
    ? buildEditStateFromProduct(cachedProduct)
    : { product: emptyProduct, existingImageUrls: [] };

  const [product, setProduct] = useState(initialEditState.product);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState(
    initialEditState.existingImageUrls,
  );

  const { product: loadedProduct, isLoading, isError, errorMessage } =
    useProductDetail({ productId: id, enabled: Boolean(id) });

  useEffect(() => {
    setFiles([]);
    setPreviewUrls([]);
    const nextCachedProduct = resolveProductFromCatalog(products, id);
    if (nextCachedProduct) {
      const nextEditState = buildEditStateFromProduct(nextCachedProduct);
      setProduct(nextEditState.product);
      setExistingImageUrls(nextEditState.existingImageUrls);
      return;
    }
    setProduct(emptyProduct);
    setExistingImageUrls([]);
  }, [id, products]);

  useEffect(() => {
    if (!loadedProduct) {
      return;
    }

    const nextEditState = buildEditStateFromProduct(loadedProduct);
    setProduct(nextEditState.product);
    setExistingImageUrls(nextEditState.existingImageUrls);
  }, [loadedProduct]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((previewUrl) => {
        if (previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, [previewUrls]);

  const handleOnChangeImages = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setFiles([]);
      previewUrls.forEach((previewUrl) => {
        if (previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
      });
      setPreviewUrls([]);
      return;
    }

    if (selectedFiles.length > MAX_PRODUCT_IMAGES) {
      toast.error(MAX_PRODUCT_IMAGES_MESSAGE);
      return;
    }

    previewUrls.forEach((previewUrl) => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    });

    setFiles(selectedFiles);
    setPreviewUrls(selectedFiles.map((fileItem) => URL.createObjectURL(fileItem)));
    toast.success(
      `${selectedFiles.length} imagen${selectedFiles.length === 1 ? '' : 'es'} cargada${selectedFiles.length === 1 ? '' : 's'}`,
    );
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    if (name === 'categories') {
      setProduct((previousProduct) => {
        const alreadySelected = previousProduct.categories.includes(value);
        return {
          ...previousProduct,
          categories: alreadySelected
            ? previousProduct.categories.filter((category) => category !== value)
            : [...previousProduct.categories, value],
        };
      });
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  const syncUpdatedProduct = (updatedProduct) => {
    setProducts((previousProducts) => {
      const nextProducts = previousProducts.map((productItem) =>
        productItem.id === id ? updatedProduct : productItem,
      );
      localStorage.setItem('products', JSON.stringify(nextProducts));
      return nextProducts;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let updatedProduct;

      if (files.length > 0) {
        const formData = buildProductMultipartFormData({ product, files });
        updatedProduct = await updateProductWithFiles(id, formData);
      } else {
        const metadataPayload = buildProductMetadataPayload(product);
        updatedProduct = await UpdateProduct(id, metadataPayload);
      }

      syncUpdatedProduct(updatedProduct);

      toast.success('Producto modificado correctamente.', {
        hideProgressBar: true,
        autoClose: 2000,
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error al modificar el producto.');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div
        className="overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md"
        aria-busy="true"
        aria-label="Cargando producto para editar"
      >
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/60 bg-white/60 backdrop-blur-md p-10 text-center">
        <p className="text-stone-600 text-sm">{errorMessage}</p>
      </div>
    );
  }

  return (
    <FormProduct
      mode="edit"
      categorias={categories}
      handleOnChangeImages={handleOnChangeImages}
      handleSubmit={handleSubmit}
      product={product}
      files={files}
      previewUrls={previewUrls}
      existingImageUrls={existingImageUrls}
      handleOnChange={handleOnChange}
    />
  );
}

export default EditProduct;
