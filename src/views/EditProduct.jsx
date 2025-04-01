import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { OneProductById } from '../services/OneProductById';
import { UpdateProduct } from '../services/UpdateProduct';
import { ProductsContext } from '../contexts/ProductsContext';

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
 //img   
const formData = new FormData();
  formData.append("file", file); // Solo enviamos la imagen
        const resp =  await fetch(`http://localhost:3000/files/uploadImage/${id}`,{
            method:"POST",
              body:formData
        })
        const data = await resp.json()
        console.log(data);
//%%%%%%%%%%%%%%

    await editProduct(id,product) 
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
  
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <label style={{ fontWeight: "bold", textAlign: "left" }}>
          Nombre
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleOnChange}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
  
        <label style={{ fontWeight: "bold", textAlign: "left" }}>
          Detalles
          <textarea
            name="details"
            value={product.details}
            onChange={handleOnChange}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              resize: "none",
              height: "80px",
            }}
          />
        </label>
  
        <label style={{ fontWeight: "bold", textAlign: "left" }}>
          Precio unitario
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleOnChange}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        
      <input type="file" name="file" onChange={handleOnChangeImage} />
  
        <button
          style={{
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Modificar producto
        </button>
      </form>
    </div>
  );
  
}

export default EditProduct
