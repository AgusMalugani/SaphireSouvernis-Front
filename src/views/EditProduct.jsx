import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OneProductById } from '../services/OneProductById';
import { UpdateProduct } from '../services/UpdateProduct';
import { ProductsContext } from '../contexts/ProductsContext';
import { ImageProduct } from '../services/ImageProduct';
import FormProduct from '../components/Products/FormProduct';

function EditProduct() {
    const{id} = useParams()
    const[product,setProduct]=useState({
        img_url:"",
        name:"",
        details:"",
        stock:true,
        price:0
    });
    const navigate = useNavigate();
    const{editProduct} = useContext(ProductsContext)

    const[file,setFile]=useState(null);
    
        const handleOnChangeImage=(e)=>{
            const file = e.target.files[0]
            setFile(file)
        }

useEffect(()=>{
    const response = async ()=> {
        const resp= await OneProductById(id)
        setProduct(resp);
    }
    response()
},[id])

const handleOnChange=(e)=>{
const{name,value} = e.target
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
      <FormProduct handleOnChangeImage ={handleOnChangeImage} handleSubmit={handleSubmit} product={product} handleOnChange={handleOnChange} />
    </div>
  );
  
}

export default EditProduct
