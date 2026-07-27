import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiAlertTriangle } from 'react-icons/fi';
import { BaseModal, Button } from '../ui';
import { getApiErrorStatus } from '../../utils/orders/getApiErrorStatus';

const MAX_CANCEL_REASON_LENGTH = 500;

function CancelOrderModal({ isOpen, onClose, order, onConfirmCancel }) {
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setCancelReason('');
    onClose();
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    const trimmedReason = cancelReason.trim();
    const cancelPayload = trimmedReason ? { cancelReason: trimmedReason } : {};

    setIsSubmitting(true);

    try {
      const result = await onConfirmCancel(order.id, cancelPayload);

      if (!result?.wasAlreadyCancelled) {
        toast.success('Pedido cancelado');
      }

      setCancelReason('');
      onClose();
    } catch (error) {
      if (getApiErrorStatus(error) === 409) {
        toast.error('No se puede cancelar un pedido pagado.');
      } else {
        toast.error('No se pudo cancelar el pedido. Intentá de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      closeDisabled={isSubmitting}
      closeOnOverlayClick={!isSubmitting}
      maxHeight=""
      className="overflow-hidden"
      ariaLabel="Cancelar pedido"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
        <div className="flex items-start gap-3 pr-8">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-400">
            <FiAlertTriangle size={18} aria-hidden="true" />
          </span>
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
              Cancelar pedido
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
              ¿Confirmar cancelación?
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              El pedido de <strong>{order?.nameClient}</strong> dejará de estar
              activo. Esta acción no se puede deshacer desde el panel.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="cancel-reason"
            className="text-sm font-semibold text-stone-700"
          >
            Motivo (opcional)
          </label>
          <textarea
            id="cancel-reason"
            value={cancelReason}
            onChange={(changeEvent) =>
              setCancelReason(changeEvent.target.value.slice(0, MAX_CANCEL_REASON_LENGTH))
            }
            rows={3}
            placeholder="Ej. Cliente desistió de la compra"
            className="w-full resize-none rounded-2xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm text-stone-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
          <p className="text-right text-xs text-stone-400">
            {cancelReason.length}/{MAX_CANCEL_REASON_LENGTH}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Volver
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Cancelando...' : 'Confirmar cancelación'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}

export default CancelOrderModal;
