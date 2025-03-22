import React from 'react'
import imgModalidadTrabajo from "../../public/modalidad-trabajo.png"

function InfoMetodoTrabajo() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between", // Añadí espacio entre las imágenes
        gap: "20px", // Espacio entre las imágenes
      }}
    >
      <img 
        src={imgModalidadTrabajo}  
        alt="Modalidad de trabajo" 
        style={{
          border: "1px solid #ddd", // Color de borde suave
          borderRadius: "8px", // Bordes redondeados
          width: "48%",  // Ligera reducción del 50% para dar espacio entre imágenes
          height: "300px",
          objectFit: "contain",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
        }} 
      />
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0-hHH-tYkE1_CqnxjiBpfZkU1vs32Hlsjg&s" 
        alt="Imagen de trabajo" 
        style={{
          border: "1px solid #ddd", // Color de borde suave
          borderRadius: "8px", // Bordes redondeados
          width: "48%",  // Ligera reducción del 50% para dar espacio entre imágenes
          height: "300px",
          objectFit: "cover", // Mantiene la imagen cubierta
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
        }} 
      />
    </div>
  )
}

export default InfoMetodoTrabajo

