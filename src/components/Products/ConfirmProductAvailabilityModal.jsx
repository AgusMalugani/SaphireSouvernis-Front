import { FiAlertCircle } from 'react-icons/fi';
import { BaseModal, Button } from '../ui';

function ConfirmProductAvailabilityModal({
  isOpen,
  productName,
  mode = 'disable',
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  const isDisableMode = mode === 'disable';
  const title = isDisableMode ? 'Inhabilitar producto' : 'Habilitar producto';
  const description = isDisableMode
    ? `¿Inhabilitar «${productName}»? Dejará de verse en la tienda.`
    : `¿Habilitar «${productName}»? Volverá a mostrarse en la tienda.`;
  const confirmLabel = isDisableMode ? 'Inhabilitar' : 'Habilitar';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      size="md"
      showCloseButton={false}
      closeOnOverlayClick={!isSubmitting}
      closeDisabled={isSubmitting}
      maxHeight=""
      className="overflow-hidden p-6"
      ariaLabel={title}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-400">
        <FiAlertCircle size={22} aria-hidden="true" />
      </div>

      <h3 className="font-display text-xl font-bold text-stone-800">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : confirmLabel}
        </Button>
      </div>
    </BaseModal>
  );
}

export default ConfirmProductAvailabilityModal;
