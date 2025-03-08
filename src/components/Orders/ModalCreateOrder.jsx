import React, { useState } from 'react'
import Modal from 'react-modal'

function ModalCreateOrder({isOpen,onClose}) {
  const [formaEntrega, setFormaEntrega] = useState("Retiro en local");

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    shouldCloseOnOverlayClick={false} // Evita cerrar el modal al hacer clic fuera
    style={{
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fondo oscuro para desactivar la página
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000, // Asegura que el modal esté por encima de todo
      },
      content: {
        padding: "20px",
        width: "50%",
        maxWidth: "500px",
        margin: "auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        position: "relative",
        maxHeight: "80vh", // Limita la altura máxima del modal
      overflow: "auto", // Agrega barra de desplazamiento si el contenido es largo
      },
    }}
  >
    {/* Botón "X" para cerrar */}
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "transparent",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#555",
      }}
    >
      ✖
    </button>
  
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <label style={{ fontWeight: "bold" }}>
        Nombre completo
        <input
          type="text"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </label>
  
      <label style={{ fontWeight: "bold" }}>
        Nombre para tarjeta
        <input
          type="text"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </label>
  
      <label style={{ fontWeight: "bold", display: "block" }}>
      Forma de entrega
      <select
        style={{
          width: "100%",
          padding: "8px",
          marginTop: "4px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        value={formaEntrega}
        onChange={(e) => setFormaEntrega(e.target.value)}
      >
        <option>Retiro en local</option>
        <option>Envío</option>
      </select>

      {formaEntrega === "Envío" && (
        <div style={{ marginTop: "10px" }}>
          <label style={{ fontWeight: "bold" }}>
            Dirección de envío
            <input
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              placeholder="Ingrese su dirección"
            />
          </label>
        </div>
      )}
    </label>
  
      <label style={{ fontWeight: "bold" }}>
        Tema
<textarea  style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }} />
      </label>
  
      <label style={{ fontWeight: "bold" }}>
        Teléfono principal
        <input
          type="number"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </label>
  
      <label style={{ fontWeight: "bold" }}>
        Teléfono secundario
        <input
          type="number"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </label>
    </form>
  
    <button
      onClick={onClose}
      style={{
        marginTop: "15px",
        padding: "10px",
        width: "100%",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Cerrar
    </button>
  </Modal>
  
  )
}

export default ModalCreateOrder
