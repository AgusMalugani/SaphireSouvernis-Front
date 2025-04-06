import React, { useState } from 'react'
import ModalActionOrder from './ModalActionOrder';

function Order({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("");

  const handleInteractuar = (action) => {
    setIsOpen(true)
    setAction(action);
  }

  return (
    <div style={{ padding: "10px", margin: "10px", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff"
        }}
      >
        <h2 style={{ color: "#343a40", fontSize: "1.5rem" }}>{order.nameClient}</h2>
        <h3 style={{ color: "#6c757d", fontSize: "1rem" }}>{order.endOrder}</h3>
        <h3 style={{ color: "#6c757d", fontSize: "1rem" }}>{order.numCel}</h3>
        <h3 style={{ color: "#6c757d", fontSize: "1rem" }}>{order.transactionType}</h3>
        <h3 style={{ color: "#6c757d", fontSize: "1rem" }}>{order.state}</h3>

        <details style={{ width: "100%", marginTop: "10px" }}>
          <summary style={{ cursor: "pointer", fontWeight: "bold", marginBottom: "8px" }}>Interactuar</summary>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}>
            <button
              onClick={() => { handleInteractuar("ver") }}
              style={{ padding: "8px 12px", width: "100%", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Ver
            </button>
            <button
              onClick={() => { handleInteractuar("estadoPago") }}
              style={{ padding: "8px 12px", width: "100%", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Cambiar estado de pago
            </button>
            <button
              onClick={() => { handleInteractuar("envio/Retiro") }}
              style={{ padding: "8px 12px", width: "100%", backgroundColor: "#ffc107", color: "black", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >
              Cambiar método Envío/Retiro
            </button>
          </div>
        </details>
      </div>

      {isOpen &&
        <ModalActionOrder
          isOpen={isOpen}
          onClose={() => { setIsOpen(false) }}
          id={order.id}
          action={action}
        />
      }
    </div>
  )
}

export default Order
