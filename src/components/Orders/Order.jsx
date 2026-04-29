import React, { useState } from 'react';
import ModalActionOrder from './ModalActionOrder';
import { FiEye, FiCreditCard, FiTruck, FiCalendar, FiPhone } from 'react-icons/fi';

// Mapeo de valores del API → labels legibles + estilos de badge
const STATE_CONFIG = {
  paid:           { label: 'Pagado',    className: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  partialPayment: { label: 'Señado',    className: 'text-amber-600 bg-amber-50 border-amber-200' },
  inProcces:      { label: 'Sin pagar', className: 'text-rose-600 bg-rose-50 border-rose-200' },
};

const TRANSACTION_CONFIG = {
  send:     { label: 'Envío',   className: 'text-sky-600 bg-sky-50 border-sky-200' },
  withdraw: { label: 'Retiro',  className: 'text-violet-600 bg-violet-50 border-violet-200' },
};

function Order({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('');

  const handleInteractuar = (selectedAction) => {
    setAction(selectedAction);
    setIsOpen(true);
  };

  const stateConfig = STATE_CONFIG[order.state]
    ?? { label: order.state, className: 'text-stone-500 bg-stone-50 border-stone-200' };

  const transactionConfig = TRANSACTION_CONFIG[order.transactionType]
    ?? { label: order.transactionType, className: 'text-stone-500 bg-stone-50 border-stone-200' };

  return (
    <>
      <div className="flex flex-col bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl shadow-sm hover:shadow-md hover:shadow-rose-200/30 transition-all duration-300 overflow-hidden">

        {/* Badges de estado y transacción */}
        <div className="flex flex-wrap gap-2 p-4 pb-0">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${stateConfig.className}`}>
            {stateConfig.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${transactionConfig.className}`}>
            {transactionConfig.label}
          </span>
        </div>

        {/* Información principal */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h2 className="font-display text-xl text-stone-800 font-semibold leading-tight">
            {order.nameClient}
          </h2>

          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <FiCalendar size={13} className="text-stone-400 shrink-0" />
              <span>{order.endOrder}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500 text-sm">
              <FiPhone size={13} className="text-stone-400 shrink-0" />
              <span>{order.numCel}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción — siempre visibles, reemplaza <details>/<summary> */}
        <div className="border-t border-stone-100 p-3 flex items-center justify-between gap-1">
          <button
            onClick={() => handleInteractuar('ver')}
            aria-label="Ver detalle de la orden"
            className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-full text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all duration-200"
          >
            <FiEye size={14} />
            Ver
          </button>

          <div className="w-px h-5 bg-stone-100" />

          <button
            onClick={() => handleInteractuar('estadoPago')}
            aria-label="Cambiar estado de pago"
            className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-full text-xs font-medium text-stone-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
          >
            <FiCreditCard size={14} />
            Pago
          </button>

          <div className="w-px h-5 bg-stone-100" />

          <button
            onClick={() => handleInteractuar('envio/Retiro')}
            aria-label="Cambiar método de envío"
            className="flex items-center gap-1.5 flex-1 justify-center py-2 rounded-full text-xs font-medium text-stone-500 hover:text-sky-500 hover:bg-sky-50 transition-all duration-200"
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
    </>
  );
}

export default Order;
