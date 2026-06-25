import React, { useContext, useState } from 'react';
import ModalActionOrder from './ModalActionOrder';
import CancelOrderModal from './CancelOrderModal';
import OrderPaymentSummary from './OrderPaymentSummary';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import {
  FiEye,
  FiCreditCard,
  FiTruck,
  FiCalendar,
  FiPhone,
  FiXCircle,
  FiEdit3,
} from 'react-icons/fi';
import {
  canCancelOrder,
  canRegisterDeposit,
  getOrderStateConfig,
  getOrderTransactionConfig,
} from '../../utils/orders/orderStatusConfig';
import { canEditOrderIntegral } from '../../utils/orders/orderIntegralEdit';

function Order({ order }) {
  const { cancelOrderContext } = useContext(OrdersContext);
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleInteractuar = (selectedAction) => {
    setAction(selectedAction);
    setIsOpen(true);
  };

  const stateConfig = getOrderStateConfig(order.state);
  const transactionConfig = getOrderTransactionConfig(order.transactionType);
  const productNames = (order.orderDetails ?? [])
    .map((orderDetail) => orderDetail?.product?.name)
    .filter(Boolean);
  const showRegistrarSeña = canRegisterDeposit(order);
  const showCancelar = canCancelOrder(order);
  const showEditarPedido = canEditOrderIntegral(order);

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-rose-200/30">
        <div className="flex flex-wrap gap-2 p-4 pb-0">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${stateConfig.className}`}
          >
            {stateConfig.label}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${transactionConfig.className}`}
          >
            {transactionConfig.label}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="font-display text-xl font-semibold leading-tight text-stone-800">
            {order.nameClient}
          </h2>

          <div className="mt-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <FiCalendar size={13} className="shrink-0 text-stone-400" />
              <span>{order.endOrder}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <FiPhone size={13} className="shrink-0 text-stone-400" />
              <span>{order.numCel}</span>
            </div>
          </div>

          <OrderPaymentSummary order={order} compact />

          {productNames.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {productNames.map((productName) => (
                <span
                  key={productName}
                  className="rounded-full border border-stone-100 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-600"
                >
                  {productName}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 border-t border-stone-100 p-3">
          <button
            onClick={() => handleInteractuar('ver')}
            aria-label="Ver detalle de la orden"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-stone-500 transition-all duration-200 hover:bg-stone-100 hover:text-stone-800"
          >
            <FiEye size={14} />
            Ver
          </button>

          {showRegistrarSeña && (
            <>
              <div className="h-5 w-px bg-stone-100" />
              <button
                onClick={() => handleInteractuar('registrarSeña')}
                aria-label="Registrar seña"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-stone-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500"
              >
                <FiCreditCard size={14} />
                Registrar seña
              </button>
            </>
          )}

          {showCancelar && (
            <>
              <div className="h-5 w-px bg-stone-100" />
              <button
                onClick={() => setIsCancelModalOpen(true)}
                aria-label="Cancelar pedido"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-stone-500 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
              >
                <FiXCircle size={14} />
                Cancelar
              </button>
            </>
          )}

          {showEditarPedido && (
            <>
              <div className="h-5 w-px bg-stone-100" />
              <button
                onClick={() => handleInteractuar('editarPedido')}
                aria-label="Editar pedido"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-stone-500 transition-all duration-200 hover:bg-violet-50 hover:text-violet-500"
              >
                <FiEdit3 size={14} />
                Editar
              </button>
            </>
          )}

          <div className="h-5 w-px bg-stone-100" />

          <button
            onClick={() => handleInteractuar('envio/Retiro')}
            aria-label="Cambiar método de envío"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-stone-500 transition-all duration-200 hover:bg-sky-50 hover:text-sky-500"
          >
            <FiTruck size={14} />
            Envío
          </button>
        </div>
      </div>

      {isOpen && (
        <ModalActionOrder
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          id={order.id}
          action={action}
        />
      )}

      {isCancelModalOpen && (
        <CancelOrderModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          order={order}
          onConfirmCancel={cancelOrderContext}
        />
      )}
    </>
  );
}

export default Order;
