import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import  styles from './Navbar.module.css';

function Navbar() {
  const { deleteToken, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Link to="/">
        <img
          src="https://res.cloudinary.com/dxt4qdckz/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1742683464/logo-saphire_hj5yra.png"
          alt="imagen empresa"
          className={styles.logo}
        />
      </Link>

      <button className={styles.toggle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      <ul className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}>
        <li>
          <Link to="/shopProducts" className={styles.link}>Comprar</Link>
        </li>
        <li>
          <a href="#" className={styles.link}>Preguntas frecuentes</a>
        </li>
        {!isAuthenticated && (
          <li>
            <Link to="/login" className={styles.authLink}>Iniciar sesión</Link>
          </li>
        )}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/dashboard" className={styles.authLink}>Dashboard</Link>
            </li>
            <li>
              <Link onClick={deleteToken} to="/" className={styles.link}>Salir</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
