import React, { useContext, useState } from 'react';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { toast } from 'react-toastify';
import { FiCheck } from 'react-icons/fi';

// token eliminado — era importado de AuthContext pero nunca usado en este componente

function EditOrder({ id, action, onClose }) {
  const { getOrderById, editOrderContext } = useContext(OrdersContext);

  const orderContext = getOrderById(id);
  const [order, setOrder] = useState(orderContext || {});

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        editOrderContext(id, order),
        {
          pending: 'Modificando orden...',
          success: 'Orden modificada ✅',
          error: 'Falló 😓',
        }
      );
      onClose();
    } catch (error) {
      console.log('Error al editar la orden');
      throw error;
    }
  };

  const inputClass = 'w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all';
  const labelClass = 'text-sm font-semibold text-stone-700';

  return (
    <div>

      {/* Formulario — Forma de entrega */}
      {action === 'envio/Retiro' && (
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <div>
            <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
              Actualizar
            </span>
            <h2 className="font-display text-2xl text-stone-800 font-bold mt-1">
              Método de Entrega
            </h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Forma de entrega</label>
            <select
              name="transactionType"
              value={order.transactionType || ''}
              onChange={handleOnChange}
              className={inputClass}
            >
              <option value="">Seleccione Envío - Retiro</option>
              <option value="withdraw">Retiro en local</option>
              <option value="send">Envío</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Dirección de envío</label>
            <input
              type="text"
              name="address"
              value={order.address || ''}
              onChange={handleOnChange}
              placeholder="Ingrese la dirección"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300 mt-2"
          >
            <FiCheck size={16} />
            Guardar cambios
          </button>
        </form>
      )}

      {/* Formulario — Estado del pago */}
      {action === 'estadoPago' && (
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <div>
            <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
              Actualizar
            </span>
            <h2 className="font-display text-2xl text-stone-800 font-bold mt-1">
              Estado de Pago
            </h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Estado del pago</label>
            <select
              name="state"
              value={order.state || ''}
              onChange={handleOnChange}
              className={inputClass}
            >
              <option value="">Seleccione el estado</option>
              <option value="inProcces">Sin pagar</option>
              <option value="paid">Pagado completo</option>
              <option value="partialPayment">Señado</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300 mt-2"
          >
            <FiCheck size={16} />
            Guardar cambios
          </button>
        </form>
      )}
    </div>
  );
}

export default EditOrder;
