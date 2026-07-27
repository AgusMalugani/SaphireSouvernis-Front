import { useContext } from 'react';
import ViewBuyOrder from './ViewBuyOrder';
import EditOrder from './EditOrder';
import EditOrderIntegral from './EditOrderIntegral';
import { BaseModal } from '../ui';
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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size={isWideModal ? 'full' : 'action'}
      maxHeight="max-h-[90vh]"
      className="overflow-y-auto scrollbar-thin-rose"
      ariaLabel="Acción de pedido"
    >
      <div className="p-6">
        {action === 'ver' && <ViewBuyOrder id={id} variant="admin" />}
        {action === 'registrarSeña' && showRegistrarSeña && (
          <EditOrder id={id} action={action} onClose={onClose} />
        )}
        {showEditarPedido && <EditOrderIntegral id={id} onClose={onClose} />}
        {action === 'envio/Retiro' && (
          <EditOrder id={id} action={action} onClose={onClose} />
        )}
      </div>
    </BaseModal>
  );
}

export default ModalActionOrder;
