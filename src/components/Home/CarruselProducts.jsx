import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../../contexts/Products/ProductsContext';

function CarruselProducts() {
  const [index, setIndex] = useState(0);
  const { products } = useContext(ProductsContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 3) % products.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <div className="w-full py-5">
      {!products ? (
        <h2 className="text-center">Cargando...</h2>
      ) : (
        <div className="flex justify-center items-center gap-4 flex-wrap rounded-xl shadow-lg p-4">
          {products.slice(index, index + 3).map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 w-64 bg-gray-50 rounded-lg shadow-sm p-4 text-center transition-transform transform hover:scale-105"
            >
              <img
                src={product.img_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
                style={{ width: '100%', height: '200px' }} // Fijo tamaño
              />
              <h4 className="mt-2">{product.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarruselProducts;
