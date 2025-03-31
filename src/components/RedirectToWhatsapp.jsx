import React from 'react'



function RedirectToWhatsapp({num,msj}) {

    const redirectToWsp = ()=>{
        const phoneNumber = `549${num}`;  // Cambia este número por el de tu contacto
        const message = encodeURIComponent(msj);
         console.log(num);
         console.log(msj);
         
        console.log(phoneNumber);
        console.log(message);
        
        
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
          window.open(url, '_blank');  // Abre el enlace en una nueva pestaña
      }

  return (
<button
  onClick={redirectToWsp}
  style={{
    position: 'fixed',        // Fija el botón en la pantalla
    bottom: '100px',           // Espacio desde la parte inferior de la pantalla
    right: '20px',            // Espacio desde la parte derecha de la pantalla
    backgroundColor: '#25D366', /* Color verde de WhatsApp */
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '50px', /* Bordes redondeados */
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px', /* Espaciado entre el ícono y el texto */
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = '#128C7E')} // Cambio de color al pasar el mouse
  onMouseLeave={(e) => (e.target.style.backgroundColor = '#25D366')} // Vuelve al color original al salir el mouse
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    style={{
      width: '24px', // Tamaño del ícono
      height: '24px',
    }}
  />
</button>


  )
}

export default RedirectToWhatsapp
