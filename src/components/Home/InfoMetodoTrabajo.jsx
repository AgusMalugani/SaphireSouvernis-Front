import React from 'react'

function InfoMetodoTrabajo() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around", // Añadí espacio entre las imágenes
      margin:"10px"
      }}
      >
     <div
  style={{
    padding: "5px", // Espaciado interno
    maxWidth: "800px", // Máximo ancho para que no se extienda demasiado
    boxShadow: "0 4px 5px rgba(0, 0, 0, 0.1)", // Sombra sutil para dar profundidad
  }}
>
  <h2 style={{
    fontSize: "24px",
    fontWeight: "bold",
    color: "#5a7d7c", // Color complementario al fondo (verde suave)
    textAlign: "center", // Título centrado
    marginBottom: "15px",
  }}>
    MODALIDAD DE TRABAJO
  </h2>
  
  <p style={{
    fontSize: "16px",
    color: "#333333", // Texto oscuro para buen contraste
    lineHeight: "1.6", // Espaciado entre líneas para mejor lectura
    marginBottom: "10px", // Separación entre párrafos
    textAlign: "justify", // Justificado para una lectura más fluida
  }}>
    ▪ Hacer el pedido por la web así completan todos los datos que les pide y de ahí crean la orden. Se redirige al Whatsapp.
  </p>
  
  <p style={{
    fontSize: "16px",
    color: "#333333",
    lineHeight: "1.6",
    marginBottom: "10px",
    textAlign: "justify",
  }}>
    ▪ El pedido se agenda una vez realizado la seña del 50% o 30% o bien el pago total de la compra.
  </p>
  
  <p style={{
    fontSize: "16px",
    color: "#333333",
    lineHeight: "1.6",
    marginBottom: "10px",
    textAlign: "justify",
  }}>
    ▪ De no ser abonado dentro de las 48hs se da de baja automáticamente, teniendo que volver a consultar costos y disponibilidad.
  </p>
  
  <p style={{
    fontSize: "16px",
    color: "#333333",
    lineHeight: "1.6",
    marginBottom: "10px",
    textAlign: "justify",
  }}>
    ▪ Una vez confirmado el pedido se realizan las muestras y se envían para que den el OK.
  </p>
</div>

      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0-hHH-tYkE1_CqnxjiBpfZkU1vs32Hlsjg&s" 
        alt="Imagen de trabajo" 
        style={{
          borderRadius: "8px", // Bordes redondeados
          width: "30%", 
          height: "250px",
          objectFit: "cover", // Mantiene la imagen cubierta
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
        }} 
      />
    </div>
  )
}

export default InfoMetodoTrabajo

