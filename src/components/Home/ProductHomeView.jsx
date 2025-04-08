
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProductHomeView() {
    const navigate = useNavigate()
  return (
    <div
    style={{
      height: "250px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "20px",
      gap: "15px",
    }}
  >
    <h3 style={{ 
      fontSize: "20px", 
      fontWeight: "bold", 
      letterSpacing: "1px", 
      color: "#3e5f5e" 
    }}>
      CONOCE LA LISTA DE PRODUCTOS
    </h3>
  
    <button
      style={{
        height: "50px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: "#5a7d7c",
        color: "#ffffff",
        border: "2px solid #3e5f5e",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3e5f5e")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5a7d7c")}
      onClick={() => navigate("/shopProducts")}
    >
      Ver Productos
    </button>
  </div>
  
  )
}

export default ProductHomeView
