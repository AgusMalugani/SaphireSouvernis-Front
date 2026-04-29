import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

function Footer() {
  const whatsappNum = import.meta.env.VITE_WHATSAPP_NUM;

  return (
    <footer className="bg-stone-100 border-t border-stone-200 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            src={import.meta.env.VITE_LOGO_URL}
            alt="Saphire Souvenirs logo"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-display text-lg font-semibold text-stone-700">
            Saphire Souvenirs
          </span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/saphire_souvenirs/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Saphire Souvenirs"
            className="text-stone-400 hover:text-rose-400 transition-colors duration-200"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href={`https://wa.me/549${whatsappNum}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp de Saphire Souvenirs"
            className="text-stone-400 hover:text-rose-400 transition-colors duration-200"
          >
            <FaWhatsapp size={22} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-stone-400 font-light">
          © {new Date().getFullYear()} Saphire Souvenirs. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
