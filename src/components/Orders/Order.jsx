import React, { useContext, useMemo, useState } from 'react';
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
import { ActionMenu } from '../ui';

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

  const actionItems = useMemo(() => {
    const items = [
      {
        id: 'ver',
        label: 'Ver detalle',
        icon: FiEye,
        tone: 'default',
        onClick: () => handleInteractuar('ver'),
      },
    ];

    if (showRegistrarSeña) {
      items.push({
        id: 'registrarSeña',
        label: 'Registrar seña',
        icon: FiCreditCard,
        tone: 'rose',
        onClick: () => handleInteractuar('registrarSeña'),
      });
    }

    if (showCancelar) {
      items.push({
        id: 'cancelar',
        label: 'Cancelar pedido',
        icon: FiXCircle,
        tone: 'danger',
        onClick: () => setIsCancelModalOpen(true),
      });
    }

    if (showEditarPedido) {
      items.push({
        id: 'editarPedido',
        label: 'Editar pedido',
        icon: FiEdit3,
        tone: 'violet',
        onClick: () => handleInteractuar('editarPedido'),
      });
    }

    items.push({
      id: 'envioRetiro',
      label: 'Envío / Retiro',
      icon: FiTruck,
      tone: 'sky',
      onClick: () => handleInteractuar('envio/Retiro'),
    });

    return items;
  }, [showRegistrarSeña, showCancelar, showEditarPedido]);

  return (
    <>
      <div className="relative z-0 flex flex-col rounded-3xl border border-white/60 bg-white/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:z-10 hover:shadow-md hover:shadow-rose-200/30">
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
              <FiCalendar size={13} className="shrink-0 text-stone-400" aria-hidden="true" />
              <span>{order.endOrder}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <FiPhone size={13} className="shrink-0 text-stone-400" aria-hidden="true" />
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

        <div className="relative z-20 border-t border-stone-100 p-3">
          <ActionMenu label="Acciones" items={actionItems} />
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
