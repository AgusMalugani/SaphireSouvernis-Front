import React, { useContext, useEffect, useState } from 'react'
import FormProduct from '../components/Products/FormProduct'
import { CreateNewProduct } from '../services/CreateNewProduct'
import { FindAllCategories } from '../services/FindAllCategories'
import { ImageProduct } from '../services/ImageProduct'
import { ProductsContext } from '../contexts/ProductsContext'

function CreateProduct() {
    const[product,setProduct]=useState({
        name:"",
        details:"",
        price:0,
        stock:true,
        img_url:"",
        categories:[]
    })
    const[file,setFile]=useState(null)
    const[categories,setCategories]=useState(null);
    const{setProducts}=useContext(ProductsContext)

    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

    useEffect(()=>{
      const response = async()=>{
        const resp = await FindAllCategories();
        setCategories(resp);
      }
      response();
    },[])

   const handleOnChange=(e)=>{
    const{name,value} = e.target;
    if(name === "categories"){
        setCategoriasSeleccionadas((prev) =>{
          const nuevasCategorias = prev.includes(value)
            ? prev.filter((cat) => cat !== value) // Si ya está, la quitamos
            : [...prev, value] // Si no está, la agregamos
        
            setProduct((prevProduct) => ({
              ...prevProduct,
              categories: nuevasCategorias,
            }));
      
            return nuevasCategorias;
          }
          );  
      return;
        };
    
    setProduct({...product,[name]:value})
   }

   const handleOnChangeImage=(e)=>{
       const file = e.target.files[0]
       setFile(file)
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
      console.log(product);
      console.log(file);
      
      const formdata = new FormData()
      for (let key in product) {
        if(key === "categories"){
          product.categories.forEach((cat)=>{formdata.append(key,cat)})
        } else{
          formdata.append(key,product[key])
        }
} //guardo el producto 
      formdata.append("file",file) //guardo la foto     
       const resp = await CreateNewProduct(formdata) 
       console.log(resp);
       setProducts((prevProducts)=>[...prevProducts,resp])
       alert("Producto creado y cargado")
    }

  return (
    <div>
      <FormProduct  categoriasSeleccionadas={categoriasSeleccionadas} categorias={categories} product={product} handleOnChange={handleOnChange} handleSubmit={handleSubmit} handleOnChangeImage={handleOnChangeImage}/>
    </div>
  )
}

export default CreateProduct
