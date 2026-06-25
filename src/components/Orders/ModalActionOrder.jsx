import React, { useContext } from 'react';
import Modal from 'react-modal';
import ViewBuyOrder from './ViewBuyOrder';
import EditOrder from './EditOrder';
import EditOrderIntegral from './EditOrderIntegral';
import { HiX } from 'react-icons/hi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { canEditOrderIntegral } from '../../utils/orders/orderIntegralEdit';
import { canRegisterDeposit } from '../../utils/orders/orderStatusConfig';

function ModalActionOrder({ isOpen, onClose, id, action }) {
  const { getOrderById } = useContext(OrdersContext);
  const order = getOrderById(id);
  const showRegistrarSeña =
    action === 'registrarSeña' && canRegisterDeposit(order);
  const showEditarPedido =
    action === 'editarPedido' && canEditOrderIntegral(order);
  const isWideModal = action === 'editarPedido' || action === 'ver';

  useBodyScrollLock(isOpen);

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          inset: 'unset',
          padding: 0,
          border: 'none',
          background: 'none',
          overflow: 'visible',
        },
      }}
    >
      <div
        className={`relative max-h-[90vh] w-[90vw] overflow-y-auto rounded-3xl border border-white/60 bg-white/90 shadow-2xl backdrop-blur-md scrollbar-thin-rose ${
          isWideModal ? 'max-w-3xl' : 'max-w-lg'
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-500"
        >
          <HiX size={16} />
        </button>

        <div className="p-6">
          {action === 'ver' && <ViewBuyOrder id={id} variant="admin" />}
          {action === 'registrarSeña' && showRegistrarSeña && (
            <EditOrder id={id} action={action} onClose={onClose} />
          )}
          {showEditarPedido && (
            <EditOrderIntegral id={id} onClose={onClose} />
          )}
          {action === 'envio/Retiro' && (
            <EditOrder id={id} action={action} onClose={onClose} />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalActionOrder;
