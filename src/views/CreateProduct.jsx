import React, { useContext, useEffect, useState } from 'react'
import FormProduct from '../components/Products/FormProduct'
import { FindAllCategories } from '../services/Categories/FindAllCategories' 
import { ProductsContext } from '../contexts/ProductsContext'
import { CreateNewProduct } from '../services/Products/CreateNewProduct'

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
       alert("Imagen cargada")
    }

    const handleSubmit= async (e)=>{
        e.preventDefault();
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
    <div >
      <h1 style={{ fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>
        Creacion de producto
      </h1>
      <FormProduct  categoriasSeleccionadas={categoriasSeleccionadas} categorias={categories} product={product} handleOnChange={handleOnChange} handleSubmit={handleSubmit} handleOnChangeImage={handleOnChangeImage}/>
    </div>
  )
}

export default CreateProduct
