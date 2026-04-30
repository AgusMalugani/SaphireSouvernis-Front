import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

function Navbar() {
  const { deleteToken, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const isHomePage = pathname === '/';

  useEffect(() => {
    // passive: true permite al browser optimizar el scroll sin bloquear el thread principal
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // En rutas que no son Home siempre mostramos el glass (no hay Hero debajo)
  const showGlass = !isHomePage || scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 h-20 flex items-center justify-between px-6
        transition-all duration-500
        ${showGlass
          ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/30'
          : 'bg-transparent'
        }
      `}
    >
      {/* Logo — tamaño ajustado al nav, sin desbordamiento */}
      <Link to="/" className="shrink-0">
        <img
          src={import.meta.env.VITE_LOGO_URL}
          alt="Saphire Souvenirs logo"
          className={`cursor-pointer object-contain transition-all duration-500
            ${showGlass ? 'h-10 sm:h-12' : 'h-12 sm:h-14'}
          `}
        />
      </Link>

      {/* Hamburguer mobile — react-icons en lugar de unicode */}
      <button
        className={`md:hidden text-2xl focus:outline-none transition-colors duration-300
          ${showGlass ? 'text-stone-700' : 'text-white'}
        `}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Abrir menú de navegación"
      >
        {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
      </button>

      {/* Links de navegación */}
      <ul
        className={`
          ${isMenuOpen ? 'flex' : 'hidden'} md:flex
          flex-col md:flex-row gap-4 md:gap-2
          absolute md:static top-20 left-0 right-0 md:right-auto md:w-auto
          px-5 py-4 md:p-0
          ${isMenuOpen
            ? 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-md'
            : 'md:bg-transparent'
          }
        `}
      >
        <li>
          <Link
            to="/shopProducts"
            onClick={() => setIsMenuOpen(false)}
            className={`block font-medium px-4 py-2 rounded-full transition-all duration-300
              ${showGlass
                ? 'text-stone-700 hover:text-rose-500 hover:bg-rose-50'
                : 'text-white hover:text-rose-200'
              }
            `}
          >
            Comprar
          </Link>
        </li>

        {!isAuthenticated && (
          <li>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className={`block font-semibold px-5 py-2 rounded-full border transition-all duration-300
                ${showGlass
                  ? 'border-rose-400 text-rose-500 hover:bg-rose-400 hover:text-white'
                  : 'border-white/70 text-white hover:bg-white hover:text-stone-800'
                }
              `}
            >
              Iniciar sesión
            </Link>
          </li>
        )}

        {isAuthenticated && (
          <>
            <li>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-semibold px-5 py-2 rounded-full border transition-all duration-300
                  ${showGlass
                    ? 'border-rose-400 text-rose-500 hover:bg-rose-400 hover:text-white'
                    : 'border-white/70 text-white hover:bg-white hover:text-stone-800'
                  }
                `}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => { deleteToken(); setIsMenuOpen(false); }}
                className={`block font-medium px-4 py-2 rounded-full transition-all duration-300
                  ${showGlass
                    ? 'text-stone-500 hover:text-rose-500 hover:bg-rose-50'
                    : 'text-white/80 hover:text-white'
                  }
                `}
              >
                Salir
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
