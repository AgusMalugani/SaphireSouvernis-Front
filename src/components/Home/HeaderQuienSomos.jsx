import React from 'react';

function HeaderQuienSomos() {
  return (
    <header className="relative h-[300px] w-full flex items-center justify-center text-white text-center px-4">
      {/* Capa oscura para mejorar el contraste */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl">
        <p className="text-2xl sm:text-3xl font-bold mb-3">
          Bienvenidos a SaphireSouvenirs. Donde cada recuerdo se convierte en magia
        </p>

        <p className="text-base sm:text-lg font-medium mb-4">
          En Saphire, creamos souvenirs personalizados para cumpleaños infantiles, bautismos,
          baby showers y todo tipo de celebraciones especiales. Cada pieza está hecha con amor,
          cuidando cada detalle para que tu evento sea inolvidable.
        </p>

        {/* Redes */}
        <div className="flex gap-4 justify-center">
          <a
            href="https://www.instagram.com/saphire_souvenirs/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar Instagram"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
              alt="Logo de Instagram"
              className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition"
            />
          </a>
          <a
            href="https://wa.me/3413857748"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enviar mensaje por WhatsApp"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="Logo de WhatsApp"
              className="w-10 h-10 rounded-full border-2 border-white hover:scale-110 transition"
            />
          </a>
        </div>
      </div>

      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL2pvYjEzOTctYmctMTBlLmpwZw.jpg")',
        }}
        aria-hidden="true"
      />
    </header>
  );
}

export default HeaderQuienSomos;
