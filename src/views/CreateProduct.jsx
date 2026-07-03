import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormProduct from '../components/Products/FormProduct';
import { ProductsContext } from '../contexts/Products/ProductsContext';
import { CreateNewProduct } from '../services/Products/CreateNewProduct';
import { AdminGlassCard, AdminPageShell } from '../components/layout/AdminPageShell.jsx';
import { buildProductMultipartFormData } from '../utils/products/buildProductMultipartFormData';
import { MAX_PRODUCT_IMAGES } from '../utils/products/productImageUrls';
import { MAX_PRODUCT_IMAGES_MESSAGE } from '../utils/products/canAdvanceFromImageStep';

function CreateProduct() {
  const [product, setProduct] = useState({
    name: '',
    details: '',
    price: 0,
    stock: true,
    categories: [],
  });
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const { setProducts, categories } = useContext(ProductsContext);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      previewUrls.forEach((previewUrl) => {
        if (previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, [previewUrls]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === 'categories') {
      setProduct((previousProduct) => {
        const updatedCategories = previousProduct.categories.includes(value)
          ? previousProduct.categories.filter((category) => category !== value)
          : [...previousProduct.categories, value];
        return { ...previousProduct, categories: updatedCategories };
      });
      return;
    }
    setProduct((previousProduct) => ({ ...previousProduct, [name]: value }));
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      toast.error('Debés seleccionar al menos una imagen.');
      return;
    }

    try {
      const formData = buildProductMultipartFormData({ product, files });
      const createdProduct = await toast.promise(CreateNewProduct(formData), {
        pending: 'Cargando...',
        success: 'Producto creado ✅',
        error: 'Falló 😓',
      });

      setProducts((previousProducts) => [...previousProducts, createdProduct]);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error al crear el producto.');
      console.error(error);
    }
  };

  return (
    <AdminPageShell
      title="Nuevo Producto"
      titleId="create-product-heading"
      centered
      showBackToDashboard
    >
      <AdminGlassCard>
        <FormProduct
          mode="create"
          categorias={categories}
          product={product}
          files={files}
          previewUrls={previewUrls}
          existingImageUrls={[]}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
          handleOnChangeImages={handleOnChangeImages}
        />
      </AdminGlassCard>
    </AdminPageShell>
  );
}

export default CreateProduct;
