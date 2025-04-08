import React from 'react'
import RedirectToWhatsapp from '../components/RedirectToWhatsapp';
import HeaderQuienSomos from '../components/Home/HeaderQuienSomos';
import CarruselProducts from '../components/Home/CarruselProducts';
import ProductHomeView from '../components/Home/ProductHomeView';
import InfoMetodoTrabajo from '../components/Home/InfoMetodoTrabajo';
import Footer from '../components/Home/Footer';

function Home() {

  return (
    <div style={{ 
      background: "linear-gradient(to right,rgb(250, 232, 241),rgb(245, 195, 206))" }}>
      
      <HeaderQuienSomos/>
      <CarruselProducts/>
    <ProductHomeView/>
      <InfoMetodoTrabajo/>

<RedirectToWhatsapp num="3413857748" msj="Este es un msj de prueba"/>

<Footer/>



    </ div>
  )
}

export default Home
