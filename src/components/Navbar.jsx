import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
const{deleteToken,isAuthenticated} = useContext(AuthContext)
return (
<nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #a67c7c",
    height: "80px",
    padding: "0 20px",
    backgroundColor: "#c08585", // Azul oscuro
    color: "#ffffff",
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

    { !isAuthenticated && <li>
  <Link
        to={"/login"}
        style={{textDecoration: "none",color: "#2C3E50",fontWeight: "bold",backgroundColor: "white",padding: "10px 15px",borderRadius: "5px",transition: "background 0.3s, color 0.3s",}}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1A252F";
          e.currentTarget.style.color = "white";}}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "#2C3E50"; }}>
        Iniciar sesion
      </Link>
    </li>
        }
    


    { isAuthenticated && <li>
  <Link
        to={"/dashboard"}
        style={{textDecoration: "none",color: "#2C3E50",fontWeight: "bold",backgroundColor: "white",padding: "10px 15px",borderRadius: "5px",transition: "background 0.3s, color 0.3s",}}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1A252F";
          e.currentTarget.style.color = "white";}}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "#2C3E50"; }}>
        Dashboard
      </Link>
    </li>
        }


  { isAuthenticated && <li>
      <Link
        onClick={deleteToken}
        to={"/"}
        style={{ textDecoration: "none", color: "white", fontWeight: "bold", padding: "10px 15px", borderRadius: "5px", transition: "background 0.3s", }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#1A252F")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
        Salir
      </Link>
    </li>
  }
  </ul>
</nav>

  )
}

export default Navbar
