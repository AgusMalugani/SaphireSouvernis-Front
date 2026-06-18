import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { envs } from '../../config/env.js';

const INTERACTION_BASE =
  'transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

const MENU_ICON_CLASS =
  'flex min-h-11 min-w-11 items-center justify-center rounded-full text-2xl transition-all duration-200 ease-in-out hover:bg-rose-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-95';

function getNavLinkClass(showGlass) {
  return showGlass
    ? `block rounded-full px-4 py-2 font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-500 ${INTERACTION_BASE}`
    : `block rounded-full px-4 py-2 font-medium text-white hover:bg-white/10 hover:text-rose-200 ${INTERACTION_BASE}`;
}

function getPrimaryCtaClass(showGlass) {
  return showGlass
    ? `block rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-2 font-semibold text-white shadow-sm hover:brightness-105 hover:shadow-md ${INTERACTION_BASE}`
    : `block rounded-full border border-white/70 px-5 py-2 font-semibold text-white hover:bg-white hover:text-stone-800 ${INTERACTION_BASE}`;
}

function getOutlineCtaClass(showGlass) {
  return showGlass
    ? `block rounded-full border border-rose-400 px-5 py-2 font-semibold text-rose-500 hover:bg-rose-400 hover:text-white ${INTERACTION_BASE}`
    : `block rounded-full border border-white/70 px-5 py-2 font-semibold text-white hover:bg-white hover:text-stone-800 ${INTERACTION_BASE}`;
}

function getGhostClass(showGlass) {
  return showGlass
    ? `block rounded-full px-4 py-2 font-medium text-stone-500 hover:bg-rose-50 hover:text-rose-500 ${INTERACTION_BASE}`
    : `block rounded-full px-4 py-2 font-medium text-white/80 hover:bg-white/10 hover:text-white ${INTERACTION_BASE}`;
}

function NavbarLink({ to, onClick, className, children }) {
  return (
    <li>
      <Link to={to} onClick={onClick} className={className}>
        {children}
      </Link>
    </li>
  );
}

function Navbar() {
  const { deleteToken, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const isHomePage = pathname === '/';
  const showGlass = !isHomePage || scrolled;

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const navShellClass = showGlass
    ? 'border-b border-white/60 bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur-md'
    : 'bg-transparent';

  const menuIconTone = showGlass ? 'text-stone-700' : 'text-white';

  const mobileMenuClass = isMenuOpen
    ? 'flex border-b border-stone-100 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur-md'
    : 'hidden md:flex md:bg-transparent md:shadow-none md:ring-0';

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ease-in-out ${navShellClass}`}
      aria-label="Navegación principal"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link
          to="/"
          className={`group shrink-0 rounded-xl ${INTERACTION_BASE}`}
          aria-label="Ir al inicio de Saphire Souvenirs"
        >
          <img
            src={envs.logoUrl}
            alt=""
            aria-hidden="true"
            className={`cursor-pointer object-contain transition-all duration-300 ease-in-out group-hover:brightness-105
              ${showGlass ? 'h-10 sm:h-12' : 'h-12 sm:h-14'}
            `}
          />
        </Link>

        <button
          type="button"
          className={`md:hidden ${MENU_ICON_CLASS} ${menuIconTone}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-menu"
          aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        >
          {isMenuOpen ? <HiX aria-hidden="true" /> : <HiMenuAlt3 aria-hidden="true" />}
        </button>

        <ul
          id="navbar-menu"
          className={`absolute left-0 right-0 top-20 flex-col gap-2 px-5 py-4 md:static md:flex-row md:gap-3 md:p-0 ${mobileMenuClass}`}
        >
          <NavbarLink
            to="/shopProducts"
            onClick={closeMenu}
            className={getNavLinkClass(showGlass)}
          >
            Comprar
          </NavbarLink>

          {!isAuthenticated && (
            <NavbarLink
              to="/login"
              onClick={closeMenu}
              className={getPrimaryCtaClass(showGlass)}
            >
              Iniciar sesión
            </NavbarLink>
          )}

          {isAuthenticated && (
            <>
              <NavbarLink
                to="/dashboard"
                onClick={closeMenu}
                className={getOutlineCtaClass(showGlass)}
              >
                Dashboard
              </NavbarLink>
              <NavbarLink
                to="/"
                onClick={() => {
                  deleteToken();
                  closeMenu();
                }}
                className={getGhostClass(showGlass)}
              >
                Salir
              </NavbarLink>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
