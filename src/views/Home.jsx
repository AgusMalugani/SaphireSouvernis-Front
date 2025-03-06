import React from 'react'
import Navbar from './../components/Navbar';
import HeaderQuienSomos from '../components/HeaderQuienSomos';

function Home() {
  return (
    <>
    <Navbar/>
      
      <HeaderQuienSomos/>

    <div style={{border:"1px solid" } } >
       
    <div  style={{border:"1px solid", height:"250px", display:"flex", justifyContent:"space-around", alignItems:"center" }}>
        <div style={{border:"1px solid", 
            width:"200px", height:"200px", margin: "5px" }  } > 
        </div>
        <div style={{border:"1px solid", 
            width:"200px", height:"200px", margin: "5px" }  } > 
        </div>
        <div style={{border:"1px solid", 
            width:"200px", height:"200px", margin: "5px" }  } > 
        </div>
    </div>

    </div>

    </>
  )
}

export default Home
