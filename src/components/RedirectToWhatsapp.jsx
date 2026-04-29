import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * RedirectToWhatsapp
 *
 * variant="block" (default) — botón full-width inline, usado en PostShop.
 * variant="fab"             — botón flotante fijo (bottom-right), usado en App.jsx globalmente.
 */
function RedirectToWhatsapp({
  num,
  msj,
  label = 'Contactar por WhatsApp',
  variant = 'block',
}) {
  const redirectToWsp = () => {
    const phoneNumber = `549${num}`;
    const encodedMessage = encodeURIComponent(msj);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'fab') {
    return (
      <button
        onClick={redirectToWsp}
        aria-label="Contactar por WhatsApp"
        className="
          fixed bottom-6 right-6 z-40
          flex items-center justify-center
          w-14 h-14 rounded-full
          bg-[#25D366] hover:bg-[#128C7E]
          text-white
          shadow-lg shadow-emerald-400/40
          hover:shadow-emerald-600/50
          hover:scale-110 active:scale-95
          transition-all duration-300
          animate-pulse
        "
        style={{ animationDuration: '3s' }}
      >
        <FaWhatsapp size={26} />
      </button>
    );
  }

  // variant="block" — botón inline completo con label
  return (
    <button
      onClick={redirectToWsp}
      aria-label="Abrir WhatsApp"
      className="
        group inline-flex items-center justify-center gap-3
        w-full px-6 py-3.5
        bg-[#25D366] hover:bg-[#128C7E]
        text-white font-semibold text-sm
        rounded-full shadow-md shadow-emerald-300/40
        hover:shadow-emerald-600/40 hover:scale-105
        active:scale-95
        transition-all duration-300
      "
    >
      <FaWhatsapp size={20} className="shrink-0" />
      {label}
    </button>
  );
}

export default RedirectToWhatsapp;
