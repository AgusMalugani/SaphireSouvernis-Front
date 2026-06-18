import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { envs } from '../../config/env.js';

const HERO_SOCIAL_CLASS =
  'flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-rose-300 hover:bg-rose-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-95';

const SCROLL_HINT_CLASS =
  'group mt-2 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-white/40 transition-all duration-200 ease-in-out hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.98]';

function HeroSocialLink({ href, ariaLabel, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={HERO_SOCIAL_CLASS}
    >
      {children}
    </a>
  );
}

function HeaderQuienSomos() {
  return (
    <header className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden px-6 py-8 text-center text-white sm:px-8">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEwL2pvYjEzOTctYmctMTBlLmpwZw.jpg")',
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/65 via-black/30 to-rose-950/50"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-8 top-16 z-[2] h-48 w-48 rounded-full bg-rose-300/20 blur-3xl"
        style={{ animation: 'float 7s ease-in-out infinite' }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-20 right-10 z-[2] h-64 w-64 rounded-full bg-pink-200/15 blur-3xl"
        style={{ animation: 'float-slow 9s ease-in-out infinite' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-200">
          Souvenirs Personalizados
        </span>

        <h1 className="font-display text-5xl font-bold leading-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
          Donde cada recuerdo
          <br />
          <em className="not-italic text-rose-300">se convierte en magia</em>
        </h1>

        <p className="max-w-xl text-base font-light leading-relaxed text-stone-200 sm:text-lg">
          En Saphire, creamos souvenirs personalizados para cumpleaños infantiles,
          bautismos, baby showers y toda celebración especial. Cada pieza hecha con
          amor, cuidando cada detalle.
        </p>

        <div className="mt-2 flex items-center gap-3">
          <HeroSocialLink
            href="https://www.instagram.com/saphire_souvenirs/"
            ariaLabel="Visitar Instagram de Saphire Souvenirs"
          >
            <FaInstagram size={22} aria-hidden="true" />
          </HeroSocialLink>
          <HeroSocialLink
            href={`https://wa.me/549${envs.whatsappNum}`}
            ariaLabel="Enviar mensaje por WhatsApp"
          >
            <FaWhatsapp size={22} aria-hidden="true" />
          </HeroSocialLink>
        </div>

        <a href="#featured-products" className={SCROLL_HINT_CLASS}>
          <span>Desplazá para explorar</span>
          <span
            className="h-8 w-px bg-white/25 transition-colors duration-200 group-hover:bg-white/50"
            aria-hidden="true"
          />
        </a>
      </div>
    </header>
  );
}

export default HeaderQuienSomos;
