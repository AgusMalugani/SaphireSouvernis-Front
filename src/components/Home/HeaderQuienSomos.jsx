import React from 'react'

function HeaderQuienSomos() {
  return (
<header
  style={{
    height: "300px",
    width: "100%",
    backgroundImage: `url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL2pvYjEzOTctYmctMTBlLmpwZw.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
  }}
>
  <p
    style={{
      fontSize: "25px",
      fontWeight: "bold",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "5px 10px",
      borderRadius: "5px",
    }}
  >
   Bienvenidos a SaphireSouvenirs. Donde cada recuerdo se convierte en magia 

  </p>
  <p
    style={{
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "5px 10px",
      borderRadius: "5px",
    }}
  >
En Saphire, creamos souvenirs personalizados para cumpleaños infantiles, bautismos, baby showers y
 todo tipo de celebraciones especiales. Cada pieza está hecha con amor, cuidando cada detalle para que tu evento 
 sea inolvidable.
 
  </p>
 

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    }}
  >
    <a href="https://www.instagram.com/saphire_souvenirs/" target="_blank" rel="noopener noreferrer">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
        alt="instagram ❤"
        style={{
          width: "40px",
          height: "40px",
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
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      />
    </a>
  </div>
</header>

  )
}

export default HeaderQuienSomos
