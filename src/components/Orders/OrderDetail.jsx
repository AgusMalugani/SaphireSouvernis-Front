import React from 'react';

function OrderDetail({ prod, deleteToCart }) {
  const { name, img_url, price, cuantity } = prod;
  const subtotal = price * cuantity;

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-md mb-3">
      <img src={img_url} alt={name} className="w-15 h-15 object-cover rounded-md"/>

      <h3 className="flex-1 text-[1.1rem] font-semibold text-gray-800">{name}</h3>

      <span className="text-[0.95rem] text-gray-600 mr-2">${subtotal}</span>
      <span className="text-[0.95rem] text-gray-600 mr-2">{cuantity}</span>

      <button onClick={deleteToCart} className="text-red-600 text-lg hover:scale-125 transition-transform duration-200">
        ❌
      </button>
    </div>
  );
}

export default OrderDetail;
