import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#c08585] py-8 px-5 text-[#4b2c2c] text-base font-poppins flex justify-center items-center flex-wrap">
      <div className="flex items-center gap-2.5">
        <img
          src="https://res.cloudinary.com/dxt4qdckz/image/upload/v1744589272/logo-saphire_it2k6r.png" // Cambia esto por tu logo real
          alt="Saphire Logo"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold text-lg">SaphireSouvenirs</span>
        
        <a
          href="https://www.instagram.com/saphire_souvenirs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
            alt="instagram ❤"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
        </a>
        <a
          href="https://wa.me/3417120039"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="whatsapp ❎"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
