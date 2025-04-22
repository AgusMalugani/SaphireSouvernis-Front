import React from 'react'
import RedirectToWhatsapp from '../components/RedirectToWhatsapp'
import HeaderQuienSomos from '../components/Home/HeaderQuienSomos'
import CarruselProducts from '../components/Home/CarruselProducts'
import ProductHomeView from '../components/Home/ProductHomeView'
import InfoMetodoTrabajo from '../components/Home/InfoMetodoTrabajo'

function Home() {
  return (
    <div className="bg-gradient-to-r from-pink-100 to-pink-200 min-h-screen">
      <HeaderQuienSomos />
      <CarruselProducts />
      <ProductHomeView />
      <InfoMetodoTrabajo />
      <RedirectToWhatsapp num="3413857748" msj="Este es un msj de prueba" />
    </div>
  )
}

export default Home
