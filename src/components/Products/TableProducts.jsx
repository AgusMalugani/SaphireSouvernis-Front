import React, { useContext } from 'react';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEye, FiEdit3 } from 'react-icons/fi';

function TableProducts({ viewProduct }) {
  const { products } = useContext(ProductsContext);
  const navigate = useNavigate();

  const handleEditProduct = (id) => {
    toast.success('Fuiste redirigido para editar el producto.', {
      hideProgressBar: true,
      autoClose: 3000,
    });
    navigate(`/product/edit/${id}`);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado de sección */}
      <div>
        <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
          Administración
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-stone-800 font-bold mt-1">
          Inventario de Productos
        </h2>
        <p className="text-stone-400 text-sm mt-1 font-light">
          {products?.length ?? 0} productos en catálogo
        </p>
      </div>

      {/* Tabla con contenedor glassmorphism */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl shadow-sm overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="font-display text-3xl text-stone-300">Sin productos</p>
            <p className="text-stone-400 text-sm font-light">
              El catálogo está vacío todavía.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Ver
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="border-b border-stone-100 hover:bg-rose-50/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-stone-800 text-sm font-medium">
                    {prod.name}
                  </td>
                  <td className="px-6 py-4 text-stone-500 text-sm">
                    ${prod.price}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewProduct(prod.id)}
                      aria-label={`Ver detalle de ${prod.name}`}
                      className="flex items-center justify-center w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-200"
                    >
                      <FiEye size={15} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditProduct(prod.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-rose-200 text-rose-500 hover:bg-rose-400 hover:text-white hover:border-rose-400 transition-all duration-200"
                    >
                      <FiEdit3 size={12} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TableProducts;
