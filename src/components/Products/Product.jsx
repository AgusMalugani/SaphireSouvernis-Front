import React from 'react'

function Product({img,name,price,addToCart}) {
const prod = {img,name,price}

  return (
    <div 
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "70%",
    maxWidth: "500px",
    gap: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }}
>
  <img 
    src={img} 
    alt={name} 
    style={{ height: "100px", width: "100px", objectFit: "cover", borderRadius: "8px" }} 
  />
  <h3 style={{ flex: 1, margin: 0, color: "#333" }}>{name}</h3> 
  <span style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>${price}</span>
  <button 
    onClick={() => addToCart(prod)} 
    style={{
      padding: "8px 12px", 
      cursor: "pointer", 
      border: "none", 
      backgroundColor: "#007bff", 
      color: "white", 
      borderRadius: "5px"
    }}
  >
    Add
  </button>
</div>

    /*
    <div 
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Distribuye los elementos equitativamente
    margin: "10px",
    padding: "10px",
    border: "1px solid #ccc", // Borde opcional para visualizar mejor
    borderRadius: "8px", // Bordes redondeados opcionales
    width: "70%", // O un ancho máximo como "400px"
    maxWidth: "500px", // Evita que se expanda demasiado
    gap: "15px" // Espacio entre elementos
  }}
>
  <img src={img} alt="" style={{ height: "100px", width: "100px", objectFit: "cover", borderRadius: "8px" }} />
  <h3 style={{ flex: 1, margin: 0 }}>{name}</h3> 
  <span style={{ fontWeight: "bold" }}>${price}</span>
  <span> cuantity </span>
  <button onClick={()=>addToCart(prod)} style={{ padding: "8px 12px", cursor: "pointer", border: "none", background: "#007bff", color: "white", borderRadius: "5px" }}>
    Add
  </button>
  
</div>
*/
  )
}

export default Product
