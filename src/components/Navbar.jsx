import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
<nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ccc",
    height: "80px",
    padding: "0 20px",
    backgroundColor: "#2C3E50", // Azul oscuro
    color: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  }}
>
  <Link to={"/"} >
  <img
    src="https://res.cloudinary.com/dxt4qdckz/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1742683464/logo-saphire_hj5yra.png"
    alt="imagen empresa"
    style={{ height: "75px", cursor: "pointer" }}
    />
    </Link>

  {/* Menú */}
  <ul
    style={{ display: "flex", justifyContent: "space-between", gap: "20px", listStyle: "none", padding: "0", margin: "0",}}>
    <li>
      <Link
        href="#"
        style={{textDecoration: "none",color: "white", fontWeight: "bold",padding: "10px 15px",borderRadius: "5px",transition: "background 0.3s",}}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1A252F")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} to={"/shopProducts"} >
        Comprar
      </Link>
    </li>
    <li>
      <a
        href="#"
        style={{ textDecoration: "none", color: "white", fontWeight: "bold", padding: "10px 15px", borderRadius: "5px", transition: "background 0.3s",}}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1A252F")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        Preguntas frecuentes
      </a>
    </li>
    <li>
      <a
        href="#"
        style={{ textDecoration: "none", color: "white", fontWeight: "bold", padding: "10px 15px", borderRadius: "5px", transition: "background 0.3s", }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1A252F")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        Registrarse
      </a>
    </li>
    <li>
      <a
        href="#"
        style={{textDecoration: "none",color: "#2C3E50",fontWeight: "bold",backgroundColor: "white",padding: "10px 15px",borderRadius: "5px",transition: "background 0.3s, color 0.3s",}}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1A252F";
          e.currentTarget.style.color = "white";}}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "#2C3E50"; }}>
        Iniciar sesión
      </a>
    </li>
  </ul>
</nav>

  )
}

export default Navbar
