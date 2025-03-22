
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProductHomeView() {
    const navigate = useNavigate()
  return (
    <div
  style={{
    border: "1px solid #ccc",
    height: "300px",
    width: "100%",
    backgroundImage: `url(https://res.cloudinary.com/dxt4qdckz/image/upload/v1742683464/logo-saphire_hj5yra.png)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
  }}
>
  <button
    style={{
      height: "50px",
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
  onClick={()=>navigate("/shopProducts")}
  >
    Ver Productos
  </button>
</div>
  )
}

export default ProductHomeView
