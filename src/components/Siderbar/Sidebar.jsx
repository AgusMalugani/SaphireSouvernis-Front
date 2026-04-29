import { FiHome, FiPlusCircle, FiList, FiClipboard } from "react-icons/fi";
import { IoMenu, IoClose } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

// Source of truth del menú — elimina la duplicación desktop/mobile
const NAV_ITEMS = [
  { icon: FiHome,       label: "Inicio",          path: "/" },
  { icon: FiPlusCircle, label: "Cargar Producto",  path: "/product/create" },
  { icon: FiList,       label: "Inventario",       path: "/dashboard" },
  { icon: FiClipboard,  label: "Pedidos",          path: "/orders" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-stone-100 shadow-sm px-5 py-4 flex justify-between items-center">
        <span className="font-display text-stone-700 text-lg font-semibold">
          Admin Panel
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menú"
          className="text-stone-500 hover:text-rose-400 transition-colors duration-200"
        >
          {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
        </button>
      </div>

      {/* Mobile nav expandido */}
      {isOpen && (
        <div className="flex flex-col bg-white border-b border-stone-100 shadow-md px-4 py-2 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.path}
              onClick={() => handleNav(item.path)}
            />
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full w-56 bg-white border-r border-stone-100 shadow-sm p-4 gap-1">
        {/* Brand header */}
        <div className="px-2 py-4 mb-2 border-b border-stone-100">
          <p className="font-display text-stone-700 text-base font-semibold">
            Admin Panel
          </p>
          <p className="text-stone-400 text-xs mt-0.5">Saphire Souvenirs</p>
        </div>

        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.path}
            onClick={() => handleNav(item.path)}
          />
        ))}
      </div>
    </div>
  );
}

// NavItem recibe el componente ícono (no el elemento) para poder
// controlar size y className según el estado activo
function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
        ${isActive
          ? "bg-rose-50 text-rose-500"
          : "text-stone-600 hover:bg-rose-50/50 hover:text-rose-400"
        }
      `}
    >
      <Icon
        size={18}
        className={isActive ? "text-rose-400" : "text-stone-400"}
      />
      {label}
    </button>
  );
}
