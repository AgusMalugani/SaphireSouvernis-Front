import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OneProductById } from '../services/OneProductById';
import { UpdateProduct } from '../services/UpdateProduct';
import { ProductsContext } from '../contexts/ProductsContext';
import { ImageProduct } from '../services/ImageProduct';
import FormProduct from '../components/Products/FormProduct';
import { FindAllCategories } from '../services/FindAllCategories';

function EditProduct() {
    const{id} = useParams()
   const[product,setProduct]=useState({
          name:"",
          details:"",
          price:0,
          stock:true,
          img_url:"",
          categories:[]
      });
    
    const navigate = useNavigate();
    const{editProduct} = useContext(ProductsContext)
 const[categories,setCategories]=useState(null);
    const[file,setFile]=useState(null);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    
    
useEffect(()=>{
      const response = async()=>{
        const resp = await FindAllCategories();
        setCategories(resp);
      }
      response();
    },[])



        const handleOnChangeImage=(e)=>{
            const file = e.target.files[0]
            setFile(file)
            alert("Imagen cargada")
        }

useEffect(()=>{
    const response = async ()=> {
        const resp= await OneProductById(id)
        console.log(resp);
        
        setProduct(resp);
      setCategoriasSeleccionadas(resp.categories?.map(cat=>cat.name))
      }
    response()
},[id])

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


const handleSubmit= async (e)=>{
    e.preventDefault();
    
    if(file){
      console.log("entro al if de file");
      const resp = await ImageProduct(id,file) //mod img
        const updatedProduct = {
          ...product,
          img_url: resp.img,
        };
         setProduct(updatedProduct) //mod estado para context
         await editProduct(id,updatedProduct) //mod context con img
    } else {
      await editProduct(id,product)  //mod context
    }
    alert("Producto modificado")
    alert("Sera redirigido al Dashboard")
   navigate("/dashboard")
}



return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>
        Modificación de producto
      </h1>
      <FormProduct categoriasSeleccionadas={categoriasSeleccionadas} categorias={categories} handleOnChangeImage ={handleOnChangeImage} handleSubmit={handleSubmit} product={product} handleOnChange={handleOnChange} />
    </div>
  );
  
}

export default EditProduct
