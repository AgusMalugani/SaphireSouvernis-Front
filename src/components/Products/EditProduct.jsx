import React, { useContext, useEffect, useState } from 'react'
import FormProduct from './FormProduct';
import { toast } from 'react-toastify';
import { ImageProduct } from '../../services/Products/ImageProduct';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { FindAllCategories } from '../../services/Categories/FindAllCategories';
import { OneProductById } from '../../services/Products/OneProductById';

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
     const{editProduct,categories} = useContext(ProductsContext)
     const[file,setFile]=useState(null);
     const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
 
 
         const handleOnChangeImage=(e)=>{
             const file = e.target.files[0]
             setFile(file)
             toast.success("Imagen Cargada")
         }
 
 useEffect(()=>{
     const response = async ()=> {
         const resp= await OneProductById(id)
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
       const resp = await ImageProduct(id,file) //mod img
         const updatedProduct = {
           ...product,
           img_url: resp.img,
         };
          setProduct(updatedProduct) //mod estado para context
          await editProduct(id,updatedProduct) //mod context con img
     } 
     else {
       await editProduct(id,product)  //mod context
     }
     
     toast.success("Producto modificado. Seras redirigido al Dashboard", {
        hideProgressBar: true,
        autoClose: 2000,
      })
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
