import React, { useEffect, useState } from 'react'
import { OneOrder } from '../../services/OneOrder';

function ViewBuyOrder({ id }) {
  const [order, setOrder] = useState({})

  useEffect(() => {
    const response = async () => {
      const resp = await OneOrder(id);
      setOrder(resp);
    }
    response()
  }, [id])

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '800px',
      margin: 'auto',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ color: "#343a40", marginBottom: "1rem" }}>Los productos que eligió son:</h2>
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
      <h3 style={{
        color: "#dc3545",
        fontWeight: "bold",
        marginTop: "1rem"
      }}>
        Total a pagar: ${order.totalPrice}
      </h3>
      <h3 style={{ color: "#6c757d" }}>Tipo de transacción: {order.transactionType}</h3>

      <div style={{
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.1)"
      }}>
        {order.orderDetails?.map((orderDet, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #dee2e6",
              paddingBottom: "10px",
              marginBottom: "10px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start"
            }}
          >
            <img
              src={orderDet.product.img_url}
              alt={orderDet.product.name}
              style={{
                width: "100px",
                height: "auto",
                borderRadius: "5px",
                objectFit: "cover"
              }}
            />
            <div>
              <h3 style={{ color: "#007bff", margin: "0" }}>{orderDet.product.name}</h3>
              <h3 style={{ color: "#6c757d", margin: "0.25rem 0" }}>
                Detalles: {orderDet.product.details}
              </h3>
              <h3 style={{ color: "#28a745", margin: "0.25rem 0" }}>
                Precio: ${orderDet.product.price}
              </h3>
              <h3 style={{ color: "#6c757d", margin: "0.25rem 0" }}>
                Cantidad: {orderDet.cuantity}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewBuyOrder
