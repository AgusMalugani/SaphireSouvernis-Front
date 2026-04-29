import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Signin } from '../../services/Auth/Signin.service';
import { toast } from 'react-toastify';
import { FiArrowRight, FiLock } from 'react-icons/fi';

function LoginSignin() {
  const [login, setLogin] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        Signin(login),
        {
          pending: 'Iniciando sesión...',
          success: 'Sesión iniciada con éxito 🎉',
          error: 'Credenciales incorrectas. Intentá de nuevo.',
        }
      );

      if (response.data) {
        saveToken(response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error al iniciar sesión');
      throw error;
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 placeholder-stone-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200';
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-1.5';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 px-4">

      {/* Card glassmorphism */}
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl shadow-xl shadow-rose-100/40 px-8 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-rose-100 mb-4">
            <FiLock size={20} className="text-rose-500" />
          </div>
          <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
            Panel de administración
          </span>
          <h1 className="font-display text-2xl text-stone-800 font-bold mt-1">
            Iniciar sesión
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              value={login.email}
              onChange={handleOnChange}
              type="email"
              placeholder="admin@saphire.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contraseña</label>
            <input
              name="password"
              value={login.password}
              onChange={handleOnChange}
              type="password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300 mt-2"
          >
            Ingresar
            <FiArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginSignin;
