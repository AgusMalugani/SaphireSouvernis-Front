import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductHomeView() {
  const navigate = useNavigate();

  return (
    <div className="h-[250px] flex flex-col justify-center items-center text-center p-5 gap-4">
      <h3 className="text-[20px] font-bold tracking-[1px] text-[#3e5f5e]">
        CONOCE LA LISTA DE PRODUCTOS
      </h3>
    
      <button
        className="h-[50px] px-6 py-3 text-[16px] font-bold bg-[#5a7d7c] text-white border-2 border-[#3e5f5e] rounded-[8px] cursor-pointer transition-all duration-300 ease-in-out"
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3e5f5e")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5a7d7c")}
        onClick={() => navigate("/shopProducts")}
      >
        Ver Productos
      </button>
    </div>
  );
}

export default ProductHomeView;
