import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Signin } from '../../services/Auth/Signin.service' 

function LoginSignin() {

const[login,setLogin]=useState({
    email:"",
    password:""
})
const navigate = useNavigate()
const {saveToken} = useContext(AuthContext)

const handleOnChange=(e)=>{
    e.preventDefault()
const{name,value}= e.target 
setLogin({...login,[name]:value})
}

const handleSubmit= async (e)=>{
e.preventDefault();

const response = await Signin(login) 
   if(response.data) {
    saveToken(response.data.token)  //guardo token
    alert("Inicio de sesion correcto.")
    navigate("/dashboard")
 } else{
    console.log(response);
    
 }

}


  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    }}
  >
    <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>
      Login
    </h1>

    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        background: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        width: "300px",
      }}
    >
      <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>
        Email
        <input
          name="email"
          value={login.email}
          onChange={handleOnChange}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            marginBottom: "15px",
            width: "100%",
          }}
          type="email"
        />
      </label>

      <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>
        Password
        <input
          name="password"
          value={login.password}
          onChange={handleOnChange}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            marginBottom: "15px",
            width: "100%",
          }}
          type="password"
        />
      </label>

      <button
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Iniciar sesión
      </button>
    </form>
  </div>
  )
}

export default LoginSignin
