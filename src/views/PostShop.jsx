import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import RedirectToWhatsapp from '../components/RedirectToWhatsapp'
import ViewBuyOrder from '../components/Orders/ViewBuyOrder'

function PostShop() {
  const { id } = useParams()
  const location = useLocation()

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans flex items-center justify-center">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-green-600 text-3xl text-center font-bold mb-6">
          GRACIAS POR TU COMPRA
        </h1>

        <ViewBuyOrder id={id} />

        <RedirectToWhatsapp
          num="3417120039"
          msj={`Hola acabo de realizar una compra, te brindo la url con el detalle para que la atención sea más rápida: https://saphire-souvenirs-shop.vercel.app${location.pathname}`}
        />

        <Link to="/" className="block mt-6">
          <button
            className="w-full text-white rounded-[20px] h-[50px] font-semibold"
            style={{ backgroundColor: '#7C3AED' }}
          >
            REGRESAR A LA PÁGINA PRINCIPAL
          </button>
        </Link>
      </div>
    </div>
  )
}

export default PostShop
