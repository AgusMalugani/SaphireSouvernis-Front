import React from 'react'

function HeaderQuienSomos() {
  return (
<header
  style={{
    border: "1px solid #ccc",
    height: "150px",
    width: "100%",
    backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj1RtM1NzlyHV_29yTD-kpiqGru4xRhIWMmw&s")`,
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
      fontSize: "16px",
      fontWeight: "bold",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: "5px 10px",
      borderRadius: "5px",
    }}
  >
    Lorem ipsum aaa lorem ipsum asdohsd lorem ipsum asd lorem ipsum asd
  </p>

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    }}
  >
    <a href="#">
      <img
        src="#"
        alt="instagram ❤"
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "2px solid white",
        }}
      />
    </a>
    <a href="#">
      <img
        src="#"
        alt="whatsapp ❎"
        style={{
          width: "30px",
          height: "30px",
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
