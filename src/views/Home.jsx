import React from 'react'
import Navbar from './../components/Navbar';
import HeaderQuienSomos from '../components/HeaderQuienSomos';
import CarruselProducts from './../components/CarruselProducts';
import InfoMetodoTrabajo from '../components/InfoMetodoTrabajo';
import Footer from '../components/Footer';
import ProductHomeView from '../components/ProductHomeView';

function Home() {
  return (
    <>
      
      <HeaderQuienSomos/>
      <CarruselProducts/>
      <InfoMetodoTrabajo/>


<ProductHomeView/>

<Footer/>



    </>
  )
}

export default Home
