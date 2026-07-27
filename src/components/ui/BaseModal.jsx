import Modal from 'react-modal';
import { HiX } from 'react-icons/hi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const MODAL_SIZES = {
  sm: 'w-[90vw] max-w-sm',
  md: 'w-[90vw] max-w-md',
  action: 'w-[90vw] max-w-lg',
  lg: 'w-[92vw] sm:w-[520px]',
  xl: 'w-[92vw] sm:w-[640px]',
  full: 'w-[90vw] max-w-3xl',
};

const OVERLAY_STYLES = {
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(6px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const CONTENT_STYLES = {
  inset: 'unset',
  padding: 0,
  border: 'none',
  background: 'none',
  overflow: 'visible',
};

function BaseModal({
  isOpen,
  onClose,
  children,
  size = 'md',
  showCloseButton = true,
  closeDisabled = false,
  closeOnOverlayClick = true,
  closeButtonPosition = 'top-4 right-4',
  maxHeight = 'max-h-[92vh]',
  className = '',
  ariaLabel,
}) {
  useBodyScrollLock(isOpen);

  const sizeClass = MODAL_SIZES[size] || MODAL_SIZES.md;

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={closeDisabled ? undefined : onClose}
      shouldCloseOnOverlayClick={closeOnOverlayClick && !closeDisabled}
      aria-label={ariaLabel}
      style={{
        overlay: OVERLAY_STYLES,
        content: CONTENT_STYLES,
      }}
    >
      <div
        className={`relative rounded-3xl border border-white/60 bg-white/90 shadow-2xl backdrop-blur-md ${sizeClass} ${maxHeight} ${className}`}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Cerrar modal"
            className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50 ${closeButtonPosition}`}
          >
            <HiX size={16} aria-hidden="true" />
          </button>
        )}

        {children}
      </div>
    </Modal>
  );
}

export default BaseModal;
