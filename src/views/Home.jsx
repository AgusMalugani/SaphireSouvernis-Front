import React from 'react'
import Navbar from './../components/Navbar';
import HeaderQuienSomos from '../components/HeaderQuienSomos';
import CarruselProducts from './../components/CarruselProducts';
import InfoMetodoTrabajo from '../components/InfoMetodoTrabajo';

function Home() {
  return (
    <>
      
      <HeaderQuienSomos/>
      <CarruselProducts/>
      <InfoMetodoTrabajo/>


<div style={{border:"1px solid", height:"300px"}} > 
      <button style={{height:"50px"}} > Ver Productos </button>
</div> 

<footer style={{border:"1px solid", background:"grey"}} >
  <p>SaphireSouvenirs</p>
</footer>



    </>
  )
}

export default Home
