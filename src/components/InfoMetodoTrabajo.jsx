
import React from 'react'
import imgModalidadTrabajo from "../../public/modalidad-trabajo.png"

function InfoMetodoTrabajo() {
  return (
    <div style={{ display: "flex", width: "100%" }}>
  <img 
    src={imgModalidadTrabajo}  
    alt="" 
    style={{
      border: "1px solid",
      width: "50%",  // Ocupa la mitad del contenedor
      height: "300px",
      objectFit: "contain"
    }} 
  />
  <img 
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0-hHH-tYkE1_CqnxjiBpfZkU1vs32Hlsjg&s" 
    alt="" 
    style={{
      border: "1px solid",
      width: "50%",  // Ocupa la otra mitad del contenedor
      height: "300px",
      objectFit: "cover"
    }} 
  />
</div>
  )
}

export default InfoMetodoTrabajo
