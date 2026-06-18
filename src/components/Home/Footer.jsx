import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { envs } from '../../config/env.js';

const SOCIAL_ICON_CLASS =
  'flex min-h-11 min-w-11 items-center justify-center rounded-full text-stone-400 transition-all duration-200 ease-in-out hover:bg-rose-50 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-95';

const NAV_LINK_CLASS =
  'rounded-md px-1 text-sm text-stone-500 transition-all duration-200 ease-in-out hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

function SocialIconLink({ href, ariaLabel, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={SOCIAL_ICON_CLASS}
    >
      {children}
    </a>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-100 bg-stone-50/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 sm:px-8">
        {/* Brand + social */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-xl transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]"
            aria-label="Ir al inicio de Saphire Souvenirs"
          >
            <img
              src={envs.logoUrl}
              alt=""
              aria-hidden="true"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-black/5 transition-all duration-200 group-hover:ring-rose-200/60"
            />
            <span className="font-display text-lg font-semibold text-stone-800">
              Saphire Souvenirs
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <SocialIconLink
              href="https://www.instagram.com/saphire_souvenirs/"
              ariaLabel="Instagram de Saphire Souvenirs"
            >
              <FaInstagram size={22} aria-hidden="true" />
            </SocialIconLink>
            <SocialIconLink
              href={`https://wa.me/549${envs.whatsappNum}`}
              ariaLabel="WhatsApp de Saphire Souvenirs"
            >
              <FaWhatsapp size={22} aria-hidden="true" />
            </SocialIconLink>
          </div>
        </div>

        {/* Legal + copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-200/60 pt-6 md:flex-row">
          <nav
            aria-label="Enlaces legales e informativos"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          >
            <Link to="/about-us" className={NAV_LINK_CLASS}>
              Quiénes somos
            </Link>
            <span className="hidden text-stone-300 sm:inline" aria-hidden="true">
              ·
            </span>
            <Link to="/privacy-policy" className={NAV_LINK_CLASS}>
              Privacidad
            </Link>
            <span className="hidden text-stone-300 sm:inline" aria-hidden="true">
              ·
            </span>
            <Link to="/terms-of-service" className={NAV_LINK_CLASS}>
              Términos
            </Link>
          </nav>

          <p className="text-center text-xs font-light leading-relaxed text-stone-500 md:text-right">
            © {currentYear} Saphire Souvenirs. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
