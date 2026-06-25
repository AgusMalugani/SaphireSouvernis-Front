import React, { useContext, useEffect, useState } from 'react';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { toast } from 'react-toastify';
import { FiCheck } from 'react-icons/fi';
import {
  getOrderStateConfig,
  getOrderStateLabel,
  getOrderTransactionSelectOptions,
} from '../../utils/orders/orderStatusConfig';
import { validateDepositAmount } from '../../utils/orders/validateDepositAmount';

function EditOrder({ id, action, onClose }) {
  const {
    getOrderById,
    editOrderContext,
    clearOptimisticTimelineEvents,
    signalAdminRefetch,
  } = useContext(OrdersContext);

  const orderContext = getOrderById(id);
  const [order, setOrder] = useState(orderContext || {});
  const [depositInput, setDepositInput] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (orderContext) {
      setOrder(orderContext);
    }
  }, [orderContext]);

  const handleOnChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setOrder({ ...order, [name]: value });
  };

  const handleDepositInputChange = (changeEvent) => {
    setDepositInput(changeEvent.target.value);
    setValidationMessage('');
  };

  const handleOnSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    if (action === 'registrarSeña') {
      const validationResult = validateDepositAmount(
        depositInput,
        order.totalPrice,
      );

      if (!validationResult.valid) {
        setValidationMessage(validationResult.message);
        return;
      }

      try {
        await toast.promise(
          editOrderContext(id, { depositAmount: validationResult.value }),
          {
            pending: 'Registrando seña...',
            success: 'Seña registrada ✅',
            error: 'No se pudo registrar la seña 😓',
          },
        );

        clearOptimisticTimelineEvents(id);
        signalAdminRefetch(id);
        onClose();
      } catch (error) {
        console.error('Error al registrar seña', error);
        throw error;
      }

      return;
    }

    const payload = {
      transactionType: order.transactionType,
      address: order.address,
    };

    try {
      await toast.promise(editOrderContext(id, payload), {
        pending: 'Modificando orden...',
        success: 'Orden modificada ✅',
        error: 'Falló 😓',
      });

      clearOptimisticTimelineEvents(id);
      signalAdminRefetch(id);
      onClose();
    } catch (error) {
      console.error('Error al editar la orden', error);
      throw error;
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all';
  const labelClass = 'text-sm font-semibold text-stone-700';
  const transactionOptions = getOrderTransactionSelectOptions();
  const paymentStateConfig = getOrderStateConfig(order.state);

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

      {action === 'registrarSeña' && (
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
              Registrar
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
              Monto de seña
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Estado de pago actual</span>
            <span
              className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${paymentStateConfig.className}`}
            >
              {getOrderStateLabel(order.state)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="deposit-amount" className={labelClass}>
              Monto de seña (ARS)
            </label>
            <input
              id="deposit-amount"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={depositInput}
              onChange={handleDepositInputChange}
              placeholder="Ej. 5000"
              className={inputClass}
            />
            {validationMessage && (
              <p className="text-sm text-rose-500">{validationMessage}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-rose-400/60 active:scale-95"
          >
            <FiCheck size={16} />
            Registrar seña
          </button>
        </form>
      )}
    </div>
  );
}

export default EditOrder;
