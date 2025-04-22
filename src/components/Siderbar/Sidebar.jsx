import { FaHome } from "react-icons/fa";
import { BiNotepad } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Mobile menu button */}
      <div className="lg:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
        <span className="text-xl font-semibold">Menú</span>
        <button onClick={() => setIsOpen(!isOpen)}>
          <IoMenu size={24} />
        </button>
      </div>

      {/* Sidebar - large screens */}
      <div className="hidden lg:flex flex-col h-full w-48 bg-gray-800 text-white shadow-md p-4">
        <NavItem icon={<FaHome />} label="Inicio" onClick={() => handleNav("/")} />
        <NavItem icon={<AiFillProduct />} label="Cargar Productos" onClick={() => handleNav("/product/create")} />
        <NavItem icon={<AiFillProduct />} label="Editar Productos" onClick={() => handleNav("#")} />
        <NavItem icon={<BiNotepad />} label="Pedidos" onClick={() => handleNav("/orders")} />
      </div>

      {/* Sidebar - small screens (hamburger expanded) */}
      {isOpen && (
        <div className="flex flex-col bg-gray-800 text-white p-4 lg:hidden">
          <NavItem icon={<FaHome />} label="Inicio" onClick={() => handleNav("/")} />
          <NavItem icon={<AiFillProduct />} label="Cargar Productos" onClick={() => handleNav("/product/create")} />
          <NavItem icon={<AiFillProduct />} label="Editar Productos" onClick={() => handleNav("#")} />
          <NavItem icon={<BiNotepad />} label="Pedidos" onClick={() => handleNav("/orders")} />
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 px-2 py-3 hover:bg-gray-700 cursor-pointer transition-all rounded"
  >
    {icon}
    <span>{label}</span>
  </div>
);
