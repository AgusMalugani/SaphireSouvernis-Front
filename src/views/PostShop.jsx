import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Product from '../components/Products/Product'
import RedirectToWhatsapp from '../components/RedirectToWhatsapp'
import ViewBuyOrder from '../components/Orders/ViewBuyOrder'

function PostShop() {
    const{id}=useParams()
    const location = useLocation()

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        width: "80%",
        margin: "auto",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ color: "#28a745", textAlign: "center" }}>
        GRACIAS POR TU COMPRA 
      </h1>
      
      <ViewBuyOrder id={id}/>
      
      <RedirectToWhatsapp num="3413857748" msj={`Hola acabo de realizar una compra,
       te brindo la url con el detalle para que la atencion sea mas rapida  https://saphire-souvenirs.vercel.app/${location.pathname}`}/>
    <Link to={"/"}> <button style={{width:"100%" , backgroundColor:"#7C3AED", height:"50px", borderRadius:"20px", color:"#fff" }}> REGRESAR A LA PAGINA PRINCIPAL </button>  </Link>
    </div>
  )
}

export default PostShop