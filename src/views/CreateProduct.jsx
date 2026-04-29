import React, { useContext, useEffect, useState } from 'react';
import FormProduct from '../components/Products/FormProduct';
import { ProductsContext } from '../contexts/Products/ProductsContext';
import { CreateNewProduct } from '../services/Products/CreateNewProduct';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

  // Libera la blob URL cuando previewUrl cambia o el componente se desmonta
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categories') {
      setProduct((prev) => {
        const updatedCategories = prev.categories.includes(value)
          ? prev.categories.filter((cat) => cat !== value)
          : [...prev.categories, value];
        return { ...prev, categories: updatedCategories };
      });
      return;
    }
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Acepta un File directamente (input change y drag-and-drop).
  // Pasar null para limpiar la imagen seleccionada.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Debés seleccionar una imagen.');
      return;
    }

    const formdata = new FormData();
    for (let key in product) {
      if (key === 'categories') {
        product.categories.forEach((cat) => formdata.append(key, cat));
      } else {
        formdata.append(key, product[key]);
      }
    }
    formdata.append('file', file);

    const resp = await toast.promise(CreateNewProduct(formdata), {
      pending: 'Cargando...',
      success: 'Producto creado ✅',
      error: 'Falló 😓',
    });

    setProducts((prev) => [...prev, resp]);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-stone-50 to-pink-50/30 py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-8">
          <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
            Panel de Administración
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-stone-800 font-bold mt-2">
            Nuevo Producto
          </h1>
        </div>

        {/* Glassmorphism card wrapper */}
        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl shadow-md p-6 sm:p-8">
          <FormProduct
            categorias={categories}
            product={product}
            file={file}
            previewUrl={previewUrl}
            handleOnChange={handleOnChange}
            handleSubmit={handleSubmit}
            handleOnChangeImage={handleOnChangeImage}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
