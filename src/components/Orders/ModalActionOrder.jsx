import React from 'react';
import Modal from 'react-modal';
import ViewBuyOrder from './ViewBuyOrder';
import EditOrder from './EditOrder';
import { HiX } from 'react-icons/hi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

function ModalActionOrder({ isOpen, onClose, id, action }) {
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
      <div className="relative bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl shadow-2xl w-[90vw] max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin-rose">

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-200"
        >
          <HiX size={16} />
        </button>

        <div className="p-6">
          {action === 'ver' && <ViewBuyOrder id={id} />}
          {(action === 'estadoPago' || action === 'envio/Retiro') && (
            <EditOrder id={id} action={action} onClose={onClose} />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalActionOrder;
