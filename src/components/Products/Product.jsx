import React, { useState } from 'react';
import ModalViewProduct from './ModalViewProduct';

function Product({ id, img_url, name, price, addToCart }) {
  const [cantidad, setCantidad] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [idProduct, setIdProduct] = useState('');

  const viewProduct = (id) => {
    setIdProduct(id);
    setIsOpen(true);
  };

  const handleChange = (event) => {
    setCantidad(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const prod = { id, img_url, name, price, cuantity: cantidad };
    return addToCart(prod);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-gray-300 rounded-lg w-full max-w-md bg-white shadow-md mx-auto md:flex-row md:items-center md:justify-between md:gap-4">
      <img
        src={img_url}
        alt={name}
        className="w-24 h-24 object-cover rounded-md self-center"
      />

      <h3 className="flex-1 text-gray-800 text-lg font-medium">{name}</h3>

      <span className="text-base font-bold text-gray-700">${price}</span>

      <label className="flex flex-col text-sm text-gray-700">
        Cantidad
        <input
          type="number"
          value={cantidad}
          onChange={handleChange}
          min={1}
          className="w-16 h-8 text-center text-base border border-gray-300 rounded-md p-1 focus:outline-none"
        />
      </label>

      <button
        onClick={() => viewProduct(id)}
        className="px-3 py-1 text-sm text-gray-800 font-medium bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        Ver
      </button>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Add
      </button>

      {isOpen && (
        <ModalViewProduct
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          idProduct={idProduct}
        />
      )}
    </div>
  );
}

export default Product;
