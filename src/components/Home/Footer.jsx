import React from 'react'

function Footer() {
  return (
    <footer
    style={{
      background: "#c08585",
      padding: "30px 20px",
      color: "#4b2c2c",
      fontSize: "16px",
      fontFamily: "'Poppins', sans-serif",
        display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "10px"}}>
      <img
        src="https://res.cloudinary.com/dxt4qdckz/image/upload/v1744589272/logo-saphire_it2k6r.png" // Cambia esto por tu logo real
        alt="Saphire Logo"
        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
      />
      <span style={{ fontWeight: "bold", fontSize: "20px" }}>
        SaphireSouvenirs
      </span>
    
      <a href="https://www.instagram.com/saphire_souvenirs/" target="_blank" rel="noopener noreferrer">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
        alt="instagram ❤"
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      />
    </a>
    <a href="https://wa.me/3413857748" target="_blank" rel="noopener noreferrer">
      <img
       src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="whatsapp ❎"
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      />
    </a>
 
    </div>

    
    
  </footer>
  

  )
}

export default Footer
