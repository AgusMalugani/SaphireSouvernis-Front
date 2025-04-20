// TableProducts.js
import React, { useContext } from 'react';
import { ProductsContext } from '../../contexts/Products/ProductsContext'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function TableProducts({ viewProduct }) {
  const { products } = useContext(ProductsContext);
  const navigate = useNavigate();

  const handleEditProduct = (id) => {
    toast.success(`Fuiste redirigido para editar el producto.`, {
      hideProgressBar: true,
      autoClose: 3000,
    });
    navigate(`/product/edit/${id}`);
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <h2 className="text-center mb-4">Inventario de Productos</h2>

      <table className="w-full border-collapse bg-white shadow-md">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2 text-left border-b border-gray-300">Nombre</th>
            <th className="px-4 py-2 text-left border-b border-gray-300">Precio</th>
            <th className="px-4 py-2 text-left border-b border-gray-300"></th>
            <th className="px-4 py-2 text-left border-b border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {products?.map((prod, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-b border-gray-300">{prod.name}</td>
              <td className="px-4 py-2 border-b border-gray-300">{prod.price}</td>
              <td className="px-4 py-2 border-b border-gray-300">
                <button onClick={() => viewProduct(prod.id)} className="text-blue-500 hover:text-blue-700">Ver</button>
              </td>
              <td className="px-4 py-2 border-b border-gray-300">
                <button onClick={() => handleEditProduct(prod.id)} className="text-green-500 hover:text-green-700">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableProducts;
