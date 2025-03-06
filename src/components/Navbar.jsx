import React from 'react'

function Navbar() {
  return (
    <nav style={{display:"flex" , justifyContent:"space-between", alignItems:"center",border: "1px solid", height:"80px", width:"auto" }} > 
      <img src="#" alt="imagen empresa" />
      <ul style={{display:"flex",justifyContent:"space-between"}} >
        <li> <a href="#">Sobre nosotros</a></li>
        <li><a href="#">Preguntas frecuentes</a></li>
        <li><a href="#">Registrarse</a></li>
        <li><a href="#">Iniciar sesion</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
