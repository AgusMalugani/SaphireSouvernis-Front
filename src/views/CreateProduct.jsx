import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormProduct from '../components/Products/FormProduct';
import { ProductsContext } from '../contexts/Products/ProductsContext';
import { CreateNewProduct } from '../services/Products/CreateNewProduct';
import { AdminGlassCard, AdminPageShell } from '../components/layout/AdminPageShell.jsx';

function CreateProduct() {
  const [product, setProduct] = useState({
    name: '',
    details: '',
    price: 0,
    stock: true,
    img_url: '',
    categories: [],
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { setProducts, categories } = useContext(ProductsContext);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  const handleOnChangeImage = (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    toast.success('Imagen cargada');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Debés seleccionar una imagen.');
      return;
    }

    const formData = new FormData();
    for (const key in product) {
      if (key === 'categories') {
        product.categories.forEach((category) => formData.append(key, category));
      } else {
        formData.append(key, product[key]);
      }
    }
    formData.append('file', file);

    const createdProduct = await toast.promise(CreateNewProduct(formData), {
      pending: 'Cargando...',
      success: 'Producto creado ✅',
      error: 'Falló 😓',
    });

    setProducts((previousProducts) => [...previousProducts, createdProduct]);
    navigate('/dashboard');
  };

  return (
    <AdminPageShell
      title="Nuevo Producto"
      titleId="create-product-heading"
      centered
    >
      <AdminGlassCard>
        <FormProduct
          mode="create"
          categorias={categories}
          product={product}
          file={file}
          previewUrl={previewUrl}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
          handleOnChangeImage={handleOnChangeImage}
        />
      </AdminGlassCard>
    </AdminPageShell>
  );
}

export default CreateProduct;
