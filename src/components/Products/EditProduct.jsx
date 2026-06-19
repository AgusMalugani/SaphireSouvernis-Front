import { useContext, useEffect, useState } from 'react';
import FormProduct from './FormProduct';
import ProductDetailSkeleton from './ProductDetailSkeleton';
import { toast } from 'react-toastify';
import { ImageProduct } from '../../services/Products/ImageProduct';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '../../hooks/useProductDetail';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';
import { normalizeProductForEdit, resolveProductFromCatalog } from '../../utils/products/resolveProductFromCatalog';

const emptyProduct = {
  name: '',
  details: '',
  price: 0,
  stock: true,
  img_url: '',
  categories: [],
};

function buildEditStateFromProduct(sourceProduct) {
  const normalizedProduct = normalizeProductForEdit(sourceProduct);
  return {
    product: normalizedProduct,
    previewUrl: normalizedProduct.img_url
      ? toCloudinaryDisplayUrl(normalizedProduct.img_url)
      : null,
  };
}

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editProduct, categories, products } = useContext(ProductsContext);

  const cachedProduct = resolveProductFromCatalog(products, id);
  const initialEditState = cachedProduct
    ? buildEditStateFromProduct(cachedProduct)
    : { product: emptyProduct, previewUrl: null };

  const [product, setProduct] = useState(initialEditState.product);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialEditState.previewUrl);

  const { product: loadedProduct, isLoading, isError, errorMessage } =
    useProductDetail({ productId: id, enabled: Boolean(id) });

  useEffect(() => {
    setFile(null);
    const nextCachedProduct = resolveProductFromCatalog(products, id);
    if (nextCachedProduct) {
      const nextEditState = buildEditStateFromProduct(nextCachedProduct);
      setProduct(nextEditState.product);
      setPreviewUrl(nextEditState.previewUrl);
      return;
    }
    setProduct(emptyProduct);
    setPreviewUrl(null);
  }, [id]);

  useEffect(() => {
    if (!loadedProduct) {
      return;
    }

    const nextEditState = buildEditStateFromProduct(loadedProduct);
    setProduct(nextEditState.product);
    setPreviewUrl(nextEditState.previewUrl);
  }, [loadedProduct]);

  const handleOnChangeImage = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      if (product.img_url?.trim()) {
        setPreviewUrl(toCloudinaryDisplayUrl(product.img_url));
      } else {
        setPreviewUrl(null);
      }
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    toast.success('Imagen cargada');
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (file) {
        const imageResponse = await ImageProduct(id, file);
        const updatedProduct = { ...product, img_url: imageResponse.img };
        setProduct(updatedProduct);
        await editProduct(id, updatedProduct);
      } else {
        await editProduct(id, product);
      }

      toast.success('Producto modificado correctamente.', {
        hideProgressBar: true,
        autoClose: 2000,
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Ocurrió un error al modificar el producto.');
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
      handleOnChangeImage={handleOnChangeImage}
      handleSubmit={handleSubmit}
      product={product}
      file={file}
      previewUrl={previewUrl}
      handleOnChange={handleOnChange}
    />
  );
}

export default EditProduct;
