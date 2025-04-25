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
      <RedirectToWhatsapp num="3417120039" msj="Hola, me gustaria saber acerca de: " />
    </div>
  )
}

export default Home
