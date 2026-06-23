import React, { useContext, useState } from 'react';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { toast } from 'react-toastify';
import { FiCheck } from 'react-icons/fi';
import {
  getOrderStateSelectOptions,
  getOrderTransactionSelectOptions,
} from '../../utils/orders/orderStatusConfig';

function EditOrder({ id, action, onClose }) {
  const { getOrderById, editOrderContext, clearOptimisticTimelineEvents } =
    useContext(OrdersContext);

  const orderContext = getOrderById(id);
  const [order, setOrder] = useState(orderContext || {});

  const handleOnChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setOrder({ ...order, [name]: value });
  };

  const handleOnSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    const payload =
      action === 'estadoPago'
        ? { state: order.state }
        : {
            transactionType: order.transactionType,
            address: order.address,
          };

    try {
      await toast.promise(
        editOrderContext(id, payload),
        {
          pending: 'Modificando orden...',
          success: 'Orden modificada ✅',
          error: 'Falló 😓',
        },
      );

      clearOptimisticTimelineEvents(id);
      onClose();
    } catch (error) {
      console.error('Error al editar la orden', error);
      throw error;
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all';
  const labelClass = 'text-sm font-semibold text-stone-700';
  const stateOptions = getOrderStateSelectOptions();
  const transactionOptions = getOrderTransactionSelectOptions();

  return (
    <div>
      {action === 'envio/Retiro' && (
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
              Actualizar
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
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
              {transactionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-rose-400/60 active:scale-95"
          >
            <FiCheck size={16} />
            Guardar cambios
          </button>
        </form>
      )}

      {action === 'estadoPago' && (
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
              Actualizar
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
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
              {stateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-rose-400/60 active:scale-95"
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
