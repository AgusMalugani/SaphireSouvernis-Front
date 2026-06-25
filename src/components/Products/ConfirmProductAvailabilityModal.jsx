import Modal from 'react-modal';
import { FiAlertCircle } from 'react-icons/fi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const modalStyles = {
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
};

function ConfirmProductAvailabilityModal({
  isOpen,
  productName,
  mode = 'disable',
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  useBodyScrollLock(isOpen);

  const isDisableMode = mode === 'disable';
  const title = isDisableMode ? 'Inhabilitar producto' : 'Habilitar producto';
  const description = isDisableMode
    ? `¿Inhabilitar «${productName}»? Dejará de verse en la tienda.`
    : `¿Habilitar «${productName}»? Volverá a mostrarse en la tienda.`;
  const confirmLabel = isDisableMode ? 'Inhabilitar' : 'Habilitar';

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onCancel}
      shouldCloseOnOverlayClick={!isSubmitting}
      style={modalStyles}
    >
      <div className="relative w-[90vw] max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400">
          <FiAlertCircle size={22} aria-hidden="true" />
        </div>

        <h3 className="font-display text-xl font-bold text-stone-800">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmProductAvailabilityModal;
