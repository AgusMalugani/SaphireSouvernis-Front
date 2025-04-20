import React, { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Signin } from '../../services/Auth/Signin.service'
import { toast } from 'react-toastify'

function LoginSignin() {
  const [login, setLogin] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const { saveToken } = useContext(AuthContext)

  const handleOnChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setLogin({ ...login, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await toast.promise(
        Signin(login),
        {
          pending: 'Iniciando sesión...',
          success: 'Sesión iniciada con éxito 🎉',
          error: 'Error al iniciar sesión ❌',
        }
      )

      if (response.data) {
        saveToken(response.data.token)
        navigate("/dashboard")
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log("Error al iniciar sesion")
      throw error
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Login</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded-lg px-6 py-8"
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
          <input
            name="email"
            value={login.email}
            onChange={handleOnChange}
            type="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
          Password
          <input
            name="password"
            value={login.password}
            onChange={handleOnChange}
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mt-6"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}

export default LoginSignin
