import React, { useContext, useState } from 'react';
import FormProduct from '../components/Products/FormProduct';
import { FindAllCategories } from '../services/Categories/FindAllCategories';
import { ProductsContext } from '../contexts/Products/ProductsContext';
import { CreateNewProduct } from '../services/Products/CreateNewProduct';
import { toast } from 'react-toastify';
import { AuthContext } from './../contexts/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState({
    name: "",
    details: "",
    price: 0,
    stock: true,
    img_url: "",
    categories: []
  });
  const [file, setFile] = useState(null);
  const { setProducts, categories } = useContext(ProductsContext);

  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "categories") {
      setCategoriasSeleccionadas((prev) => {
        const nuevasCategorias = prev.includes(value)
          ? prev.filter((cat) => cat !== value) // Si ya está, la sacamos
          : [...prev, value]; // Si no está, la agregamos

        setProduct((prevProduct) => ({
          ...prevProduct,
          categories: nuevasCategorias,
        }));

        return nuevasCategorias;
      });
      return;
    }

    setProduct({ ...product, [name]: value });
  };

  const handleOnChangeImage = (e) => {
    const file = e.target.files[0];
    setFile(file);
    toast.success("Imagen Cargada");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    
    for (let key in product) {
      if (key === "categories") {
        product.categories.forEach((cat) => {
          formdata.append(key, cat);
        });
      } else {
        formdata.append(key, product[key]);
      }
    } // guardo el producto 
    formdata.append("file", file); // guardo la foto

    
    const resp = await toast.promise(
      CreateNewProduct(formdata, token),
      {
        pending: 'Cargando...',
        success: 'Producto creado y cargado ✅',
        error: 'Falló 😓'
      }
    );

    setProducts((prevProducts) => [...prevProducts, resp]);
    navigate("/dashboard"); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl mb-5 text-center">
        Creación de producto
      </h1>
      <FormProduct 
        categoriasSeleccionadas={categoriasSeleccionadas} 
        categorias={categories} 
        product={product} 
        handleOnChange={handleOnChange} 
        handleSubmit={handleSubmit} 
        handleOnChangeImage={handleOnChangeImage}
      />
    </div>
  );
}

export default CreateProduct;
