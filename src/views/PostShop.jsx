import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from '../components/Products/Product'

function PostShop() {
    const{id}=useParams()
    const[order,setOrder] = useState({})

    useEffect(()=>{
        fetch(`http://localhost:3000/orders/${id}`)
        .then(resp=>resp.json())
        .then(data=> setOrder(data))
    },[id])

console.log(order);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        width: "80%",
        margin: "auto",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ color: "#28a745", textAlign: "center" }}>
        GRACIAS POR TU COMPRA {order.nameClient}
      </h1>
      <h2 style={{ color: "#343a40" }}>Los productos que eligió son:</h2>
      <h3 style={{ color: "#6c757d" }}>Dirección: {order.address}</h3>
      <h3 style={{ color: "#6c757d" }}>Fecha de creación: {order.createAt}</h3>
      <h3 style={{ color: "#6c757d" }}>Fecha de entrega: {order.endOrder}</h3>
      <h3 style={{ color: "#6c757d" }}>Cliente: {order.nameClient}</h3>
      <h3 style={{ color: "#6c757d" }}>Email: {order.email}</h3>
      <h3 style={{ color: "#6c757d" }}>Nombre en tarjeta: {order.nameForCard}</h3>
      <h3 style={{ color: "#6c757d" }}>Teléfono: {order.numCel}</h3>
      <h3 style={{ color: "#6c757d" }}>Teléfono secundario: {order.num2Cel}</h3>
      <h3 style={{ color: "#6c757d" }}>Estado del pedido: {order.state}</h3>
      <h3 style={{ color: "#6c757d" }}>Tema: {order.theme}</h3>
      <h3 style={{ color: "#dc3545", fontWeight: "bold" }}>
        Total a pagar: ${order.totalPrice}
      </h3>
      <h3 style={{ color: "#6c757d" }}>Tipo de transacción: {order.transactionType}</h3>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
        }}
      >
        {order.orderDetails?.map((orderDet, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #dee2e6",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <img
              src={orderDet.product.img_url}
              alt={orderDet.product.name}
              style={{
                width: "100px",
                height: "auto",
                borderRadius: "5px",
              }}
            />
            <h3 style={{ color: "#007bff" }}>{orderDet.product.name}</h3>
            <h3 style={{ color: "#6c757d" }}>
              Detalles: {orderDet.product.details}
            </h3>
            <h3 style={{ color: "#28a745" }}>
              Precio: ${orderDet.product.price}
            </h3>
            <h3 style={{ color: "#6c757d" }}>
              Cantidad: {orderDet.cuantity}
            </h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostShop