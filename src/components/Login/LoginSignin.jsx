import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { Signin } from '../../services/Auth/Signin.service';

const INPUT_CLASS =
  'w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm text-stone-800 placeholder-stone-400 shadow-sm transition-all duration-200 ease-in-out focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200';

const LABEL_CLASS = 'mb-1.5 block text-sm font-semibold text-stone-700';

const PRIMARY_CTA_CLASS =
  'group mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:brightness-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

const GHOST_LINK_CLASS =
  'inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm text-stone-500 transition-all duration-200 ease-in-out hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]';

function FormField({ id, label, type, name, value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={INPUT_CLASS}
      />
    </div>
  );
}

function LoginSignin() {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setLogin((previousLogin) => ({ ...previousLogin, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await toast.promise(Signin(login), {
        pending: 'Iniciando sesión...',
        success: 'Sesión iniciada con éxito 🎉',
        error: 'Credenciales incorrectas. Intentá de nuevo.',
      });

      if (response.data) {
        saveToken(response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error al iniciar sesión');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="login-heading"
      className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 px-6 py-8"
    >
      <div className="w-full max-w-sm rounded-2xl border border-stone-200/60 bg-white/90 px-8 py-10 shadow-sm ring-1 ring-black/5 backdrop-blur-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <FiLock size={20} className="text-rose-400" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
            Panel de administración
          </span>
          <h1
            id="login-heading"
            className="mt-1 font-display text-2xl font-bold text-stone-800"
          >
            Iniciar sesión
          </h1>
        </header>

        <form
          onSubmit={handleSubmit}
          aria-labelledby="login-heading"
          className="flex flex-col gap-5"
          noValidate
        >
          <FormField
            id="login-email"
            label="Email"
            type="email"
            name="email"
            value={login.email}
            onChange={handleOnChange}
            placeholder="admin@saphire.com"
            autoComplete="email"
          />

          <FormField
            id="login-password"
            label="Contraseña"
            type="password"
            name="password"
            value={login.password}
            onChange={handleOnChange}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <button type="submit" disabled={isSubmitting} className={PRIMARY_CTA_CLASS}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            <FiArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 ease-in-out group-hover:translate-x-0.5"
            />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className={GHOST_LINK_CLASS}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LoginSignin;
