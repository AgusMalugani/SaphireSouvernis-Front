import { FaHome, FaUser  } from "react-icons/fa";
import { BiNotepad } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";


import SidebarItem from './SidebarItem';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate()
  
  return (
    <div style={{ width: "200px", height: "100vh", backgroundColor: "#333", color: "white", display: "flex", flexDirection: "column", alignItems: "flex-start", paddingTop: "20px",boxShadow: "2px 0px 5px rgba(0,0,0,0.2)",}}>
      
      <div
        style={{display: "flex",alignItems: "center",gap: "10px",padding: "10px",width: "100%",cursor: "pointer",transition: "background 0.2s",}}
        onMouseOver={(e) => (e.currentTarget.style.background = "#444")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
        <FaHome/>
        <button style={{color:"#fff"}} onClick={()=>navigate("/")}>Inicio</button>
      </div>
      

      <div
        style={{display: "flex",alignItems: "center",gap: "10px",padding: "10px",width: "100%",cursor: "pointer",transition: "background 0.2s",}}
        onMouseOver={(e) => (e.currentTarget.style.background = "#444")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
        <AiFillProduct/>
        <button style={{color:"#fff"}} onClick={()=>navigate("/")}>Cargar Productos</button>
      </div>

      <div
        style={{display: "flex",alignItems: "center",gap: "10px",padding: "10px",width: "100%",cursor: "pointer",transition: "background 0.2s",}}
        onMouseOver={(e) => (e.currentTarget.style.background = "#444")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
        <AiFillProduct/>
        <button style={{color:"#fff"}} onClick={()=>navigate("/")}>Editar Productos</button>
      </div>

      <div
        style={{ display: "flex",alignItems: "center",gap: "10px",padding: "10px",width: "100%",cursor: "pointer",transition: "background 0.2s",}}
        onMouseOver={(e) => (e.currentTarget.style.background = "#444")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
        <BiNotepad/>
        <button style={{color:"#fff"}} onClick={()=>navigate("/")}>Pedidos</button>
        </div>

    </div>
  );
}

