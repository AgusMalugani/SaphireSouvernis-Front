import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';

function Navbar() {
  const { deleteToken, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center h-20 px-5 bg-[#c08585] text-white shadow-md relative z-50">
      <Link to="/">
        <img
          src="https://res.cloudinary.com/dxt4qdckz/image/upload/v1744589272/logo-saphire_it2k6r.png"
          alt="imagen empresa"
          className="h-[100px] cursor-pointer"
        />
      </Link>

      <button
        className="md:hidden text-3xl focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      <ul
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row gap-4 md:gap-6 list-none absolute md:static top-20 left-0 w-full md:w-auto bg-[#c08585] md:bg-transparent px-5 py-3 md:p-0`}
      >
        <li>
          <Link to="/shopProducts" className="text-white font-bold px-4 py-2 rounded hover:bg-[#1A252F] transition">
            Comprar
          </Link>
        </li>

        {!isAuthenticated && (
          <li>
            <Link
              to="/login"
              className="bg-white text-[#2C3E50] font-bold px-4 py-2 rounded hover:bg-[#1A252F] hover:text-white transition"
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
                className="bg-white text-[#2C3E50] font-bold px-4 py-2 rounded hover:bg-[#1A252F] hover:text-white transition"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                onClick={deleteToken}
                to="/"
                className="text-white font-bold px-4 py-2 rounded hover:bg-[#1A252F] transition"
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
