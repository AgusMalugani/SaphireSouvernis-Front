import React, { useState } from 'react'
import ModalActionOrder from './ModalActionOrder';

function Order({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("");

  const handleInteractuar = (action) => {
    setIsOpen(true)
    setAction(action);
  }

  return (
    <div className="p-4 m-4 flex justify-center">
      <div className="border border-gray-300 rounded-lg w-full max-w-sm flex flex-col items-center p-4 shadow-md bg-white">
        <h2 className="text-gray-800 text-2xl">{order.nameClient}</h2>
        <h3 className="text-gray-600 text-base">{order.endOrder}</h3>
        <h3 className="text-gray-600 text-base">{order.numCel}</h3>
        <h3 className="text-gray-600 text-base">{order.transactionType}</h3>
        <h3 className="text-gray-600 text-base">{order.state}</h3>

        <details className="w-full mt-4">
          <summary className="cursor-pointer font-bold mb-2">Interactuar</summary>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => handleInteractuar("ver")}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              Ver
            </button>
            <button
              onClick={() => handleInteractuar("estadoPago")}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-lg cursor-pointer"
            >
              Cambiar estado de pago
            </button>
            <button
              onClick={() => handleInteractuar("envio/Retiro")}
              className="w-full py-2 px-4 bg-yellow-500 text-black rounded-lg cursor-pointer"
            >
              Cambiar método Envío/Retiro
            </button>
          </div>
        </details>
      </div>

      {isOpen && (
        <ModalActionOrder
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          id={order.id}
          action={action}
        />
      )}
    </div>
  )
}

export default Order
