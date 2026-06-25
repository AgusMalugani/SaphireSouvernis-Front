import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { FiAlertTriangle } from 'react-icons/fi';
import { HiX } from 'react-icons/hi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { getApiErrorStatus } from '../../utils/orders/getApiErrorStatus';

const MAX_CANCEL_REASON_LENGTH = 500;

function CancelOrderModal({ isOpen, onClose, order, onConfirmCancel }) {
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useBodyScrollLock(isOpen);

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
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={!isSubmitting}
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
      <div className="relative w-[90vw] max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
        >
          <HiX size={16} />
        </button>

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
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:border-stone-300 disabled:opacity-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition hover:scale-[1.02] disabled:opacity-60"
            >
              {isSubmitting ? 'Cancelando...' : 'Confirmar cancelación'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CancelOrderModal;
