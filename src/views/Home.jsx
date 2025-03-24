import React from 'react'
import Navbar from './../components/Navbar';
import HeaderQuienSomos from '../components/HeaderQuienSomos';
import CarruselProducts from './../components/CarruselProducts';
import InfoMetodoTrabajo from '../components/InfoMetodoTrabajo';
import Footer from '../components/Footer';
import ProductHomeView from '../components/ProductHomeView';
import RedirectToWhatsapp from '../components/RedirectToWhatsapp';



function Home() {
  return (
    <>
      
      <HeaderQuienSomos/>
      {/*<CarruselProducts/> */}
      <InfoMetodoTrabajo/>


<ProductHomeView/>

<RedirectToWhatsapp num="3413857748" msj="Este es un msj de prueba"/>

<Footer/>



    </>
  )
}

export default Home
