import React, { useEffect, useState } from 'react'
import { OneOrder } from '../../services/Orders/OneOrder'; 
import { EditOrderService } from '../../services/Orders/EditOrderService'; 

function EditOrder({ id, action }) {
  const [order, setOrder] = useState({})

  useEffect(() => {
    const response = async () => {
      const resp = await OneOrder(id);
      setOrder(resp);
    }
    response()
  }, [id])

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setOrder({ ...order, [name]: value });
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await EditOrderService(id, order)
    console.log(response);
    alert("Orden modificada")
  }

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginTop: "4px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  }

  const buttonStyle = {
    padding: "10px 15px",
    marginTop: "15px",
    cursor: "pointer",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    width: "100%",
    fontWeight: "bold"
  }

  const formContainerStyle = {
    maxWidth: "500px",
    margin: "auto",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 0px 8px rgba(0,0,0,0.1)"
  }

  return (
    <div style={formContainerStyle}>

      {/* Forma de entrega */}
      {action === "envio/Retiro" && (
        <form onSubmit={handleOnSubmit}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>
            Forma de entrega
            <select
              name='transactionType'
              value={order.transactionType}
              onChange={handleOnChange}
              style={inputStyle}
            >
              <option value={""}>Seleccione Envío - Retiro</option>
              <option value={"withdraw"}>Retiro en local</option>
              <option value={"send"}>Envío</option>
            </select>
          </label>

          <label style={{ fontWeight: "bold", display: "block", marginTop: "15px" }}>
            Dirección de envío
            <input
              type="text"
              name='address'
              value={order.address || ""}
              onChange={handleOnChange}
              style={inputStyle}
            />
          </label>

          <button style={buttonStyle}>ENVIAR</button>
        </form>
      )}

      {/* Estado del pago */}
      {action === "estadoPago" && (
        <form onSubmit={handleOnSubmit}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>
            Estado del pago
            <select
              name='state'
              value={order.state}
              onChange={handleOnChange}
              style={inputStyle}
            >
              <option value={""}>Seleccione el Estado del pago</option>
              <option value={"inProcces"}>Aún sin pagar</option>
              <option value={"paid"}>Pagado completo</option>
              <option value={"partialPayment"}>Señado</option>
            </select>
          </label>

          <button style={buttonStyle}>ENVIAR</button>
        </form>
      )}
    </div>
  )
}

export default EditOrder
