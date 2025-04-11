import React from 'react';
import styles from './RedirectToWhatsapp.module.css';

function RedirectToWhatsapp({ num, msj }) {

  const redirectToWsp = () => {
    const phoneNumber = `549${num}`;
    const message = encodeURIComponent(msj);

    console.log(num);
    console.log(msj);
    console.log(phoneNumber);
    console.log(message);

    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={redirectToWsp}
      className={styles.whatsappButton}
      onMouseEnter={(e) => (e.target.style.backgroundColor = '#128C7E')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = '#25D366')}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        className={styles.icon}
      />
    </button>
  );
}

export default RedirectToWhatsapp;
