import React, { useEffect, useState } from 'react'
import  Modal  from 'react-modal';
import { OneProductById } from '../../services/Products/OneProductById';

function ModalViewProduct({isOpen,onClose,idProduct}) {
   
    const[product,setProduct]=useState({
        img_url:"",
        name:"",
        details:"",
        price:0,
        stock:true
    });
useEffect(()=>{
    const response = async ()=> {
    try {
       const resp= await OneProductById(idProduct)
      setProduct(resp)
    } catch (error) {
        console.log(error);   
    }
    };
    response()
},[idProduct])

  return (
<Modal
    isOpen={isOpen}
    appElement={document.getElementById('root') || undefined}
    onRequestClose={onClose}
    style={{overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)",}, // Fondo oscuro para desactivar la página position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, // Asegura que el modal esté por encima de todo
  content: { padding: "20px",  width: "50%",  maxWidth: "500px",  margin: "auto",  borderRadius: "10px",  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",  backgroundColor: "#fff",  position: "relative",  maxHeight: "80vh", // Limita la altura máxima del moda 
   overflow: "auto", // Agrega barra de desplazamiento si el contenido es larg 
    }, }}>

        <button
      onClick={onClose}
      style={{ position: "absolute", top: "10px", right: "10px", background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", fontWeight: "bold", color: "#555",}}>
      ✖
    </button>

    <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    maxWidth: "400px",
    textAlign: "center",
  }}
>
  <img
    src={product.img_url}
    alt={product.name}
    style={{
      width: "100%",
      maxHeight: "300px",
      borderRadius: "8px",
      marginBottom: "15px",
    }}
  />
  <span style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
    {product.name}
  </span>
  <span style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
    {product.details}
  </span>
  <span style={{ fontSize: "16px", fontWeight: "600", color: "#28a745", marginBottom: "10px" }}>
    ${product.price}
  </span>

</div>

    </Modal>
)
}

export default ModalViewProduct
