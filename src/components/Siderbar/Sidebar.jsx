import { FiHome, FiPlusCircle, FiClipboard, FiGrid } from 'react-icons/fi';
import { IoMenu, IoClose } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { icon: FiHome, label: 'Inicio', path: '/' },
  { icon: FiGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: FiPlusCircle, label: 'Cargar Producto', path: '/product/create' },
  { icon: FiClipboard, label: 'Pedidos', path: '/orders' },
];

export default function Sidebar({ variant = 'desktop' }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (variant === 'mobile') {
    return (
      <>
        <div className="flex items-center justify-between border-b border-stone-100 bg-white px-4 py-3 shadow-sm">
          <span className="font-display text-base font-semibold text-stone-700">
            Admin Panel
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-400"
          >
            <IoMenu size={22} />
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar menú"
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-4">
                <div>
                  <p className="font-display text-base font-semibold text-stone-700">
                    Admin Panel
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">Saphire Souvenirs</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar menú"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-400"
                >
                  <IoClose size={22} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Navegación admin">
                {NAV_ITEMS.map((item) => (
                  <NavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.path}
                    onClick={() => handleNav(item.path)}
                  />
                ))}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-1 border-r border-stone-100 bg-white p-4 shadow-sm">
      <div className="mb-2 border-b border-stone-100 px-2 py-4">
        <p className="font-display text-base font-semibold text-stone-700">
          Admin Panel
        </p>
        <p className="mt-0.5 text-xs text-stone-400">Saphire Souvenirs</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Navegación admin">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.path}
            onClick={() => handleNav(item.path)}
          />
        ))}
      </nav>
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-rose-50 text-rose-500'
            : 'text-stone-600 hover:bg-rose-50/50 hover:text-rose-400'
        }
      `}
    >
      <Icon size={18} className={isActive ? 'text-rose-400' : 'text-stone-400'} />
      {label}
    </button>
  );
}
