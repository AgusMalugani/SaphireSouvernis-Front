import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

function HeaderQuienSomos() {
  return (
    <header className="relative min-h-[90vh] w-full flex items-center justify-center text-white text-center px-6 overflow-hidden">

      {/* Imagen de fondo con leve zoom estático */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage:
            'url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL2pvYjEzOTctYmctMTBlLmpwZw.jpg")',
        }}
        aria-hidden="true"
      />

      {/* Overlay gradiente multicapa — toque rose-gold en la base */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-rose-950/50 z-[1]" />

      {/* Blob decorativo — superior izquierda */}
      <div
        className="absolute top-16 left-8 w-48 h-48 rounded-full bg-rose-300/20 blur-3xl z-[2] pointer-events-none"
        style={{ animation: 'float 7s ease-in-out infinite' }}
        aria-hidden="true"
      />

      {/* Blob decorativo — inferior derecha */}
      <div
        className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-pink-200/15 blur-3xl z-[2] pointer-events-none"
        style={{ animation: 'float-slow 9s ease-in-out infinite' }}
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className="relative z-10 max-w-3xl flex flex-col items-center gap-5">

        {/* Eyebrow label */}
        <span className="uppercase tracking-[0.3em] text-rose-200 text-xs font-medium">
          Souvenirs Personalizados
        </span>

        {/* Titular H1 con Playfair Display */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
          Donde cada recuerdo
          <br />
          <em className="not-italic text-rose-300">se convierte en magia</em>
        </h1>

        {/* Subtítulo */}
        <p className="text-base sm:text-lg text-stone-200 max-w-xl font-light leading-relaxed">
          En Saphire, creamos souvenirs personalizados para cumpleaños infantiles,
          bautismos, baby showers y toda celebración especial. Cada pieza hecha con
          amor, cuidando cada detalle.
        </p>

        {/* Íconos sociales con react-icons */}
        <div className="flex gap-4 mt-2">
          <a
            href="https://www.instagram.com/saphire_souvenirs/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar Instagram de Saphire Souvenirs"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-rose-400/40 hover:border-rose-300 transition-all duration-300 hover:scale-110"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://wa.me/3413857748"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enviar mensaje por WhatsApp"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-green-500/40 hover:border-green-300 transition-all duration-300 hover:scale-110"
          >
            <FaWhatsapp size={22} />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-6 flex flex-col items-center gap-2 text-white/40 text-xs select-none">
          <span className="tracking-widest uppercase">Desplazá para explorar</span>
          <div className="w-px h-8 bg-white/25" />
        </div>
      </div>
    </header>
  );
}

export default HeaderQuienSomos;
