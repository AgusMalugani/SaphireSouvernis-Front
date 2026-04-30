import React, { useContext, useEffect, useState } from 'react';
import FormProduct from './FormProduct';
import { toast } from 'react-toastify';
import { ImageProduct } from '../../services/Products/ImageProduct';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { OneProductById } from '../../services/Products/OneProductById';

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    details: '',
    price: 0,
    stock: true,
    img_url: '',
    categories: [],
  });

  const navigate = useNavigate();
  const { editProduct, categories } = useContext(ProductsContext);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // categoriasSeleccionadas eliminado — product.categories es la única fuente de verdad,
  // alineado con el patrón de CreateProduct.jsx

  // Acepta un File directamente (input y drag-and-drop) o null para limpiar
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resp = await OneProductById(id);
        setProduct({
          ...resp,
          // Normalizar categories a array de strings para que los checkboxes
          // funcionen igual que en CreateProduct
          categories: resp.categories?.map((cat) => cat.name) ?? [],
        });
        setPreviewUrl(resp.img_url || null);
      } catch (error) {
        console.log('Error al traer el producto');
        throw error;
      }
    };

    fetchProduct();
  }, [id]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === 'categories') {
      setProduct((prev) => {
        const alreadySelected = prev.categories.includes(value);
        return {
          ...prev,
          categories: alreadySelected
            ? prev.categories.filter((cat) => cat !== value)
            : [...prev.categories, value],
        };
      });
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (file) {
        const resp = await ImageProduct(id, file);
        const updatedProduct = { ...product, img_url: resp.img };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-stone-50 to-pink-50/30 px-4 py-10">
      <div className="max-w-lg mx-auto bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="mb-6">
          <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
            Panel de administración
          </span>
          <h1 className="font-display text-2xl text-stone-800 font-bold mt-1">
            Modificar producto
          </h1>
        </div>

        <FormProduct
          categorias={categories}
          handleOnChangeImage={handleOnChangeImage}
          handleSubmit={handleSubmit}
          product={product}
          file={file}
          previewUrl={previewUrl}
          handleOnChange={handleOnChange}
        />
      </div>
    </div>
  );
}

export default EditProduct;
