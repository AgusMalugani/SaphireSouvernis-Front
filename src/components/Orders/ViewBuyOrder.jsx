import React, { useEffect, useState } from 'react';
import { OneOrder } from '../../services/Orders/OneOrder';

// Mismos mapeos que en Order.jsx para mostrar valores legibles al admin
const STATE_LABELS = {
  paid:           'Pagado',
  partialPayment: 'Señado',
  inProcces:      'Sin pagar',
};

const TRANSACTION_LABELS = {
  send:     'Envío',
  withdraw: 'Retiro',
};

function ViewBuyOrder({ id }) {
  const [order, setOrder] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Lazy loading: los detalles de la orden se traen solo al abrir el modal "Ver"
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await OneOrder(id);
        setOrder(response);
      } catch (error) {
        console.log('Error al traer la orden');
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-rose-200 border-t-rose-400 animate-spin" />
        <p className="font-display text-lg text-stone-400">Cargando detalle...</p>
      </div>
    );
  }

  const orderDetails = order.orderDetails ?? [];
  const infoItems = [
    { label: 'Dirección',         value: order.address },
    { label: 'Fecha de creación', value: order.createAt },
    { label: 'Fecha de entrega',  value: order.endOrder },
    { label: 'Email',             value: order.email },
    { label: 'Nombre en tarjeta', value: order.nameForCard },
    { label: 'Teléfono',          value: order.numCel },
    { label: 'Teléfono secundario', value: order.num2Cel },
    { label: 'Estado del pedido', value: STATE_LABELS[order.state] ?? order.state },
    { label: 'Tema',              value: order.theme },
    { label: 'Tipo de entrega',   value: TRANSACTION_LABELS[order.transactionType] ?? order.transactionType },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado del modal */}
      <div>
        <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
          Detalle del pedido
        </span>
        <h2 className="font-display text-2xl text-stone-800 font-bold mt-1">
          {order.nameClient}
        </h2>
      </div>

      {/* Grid de información general */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {infoItems.map(({ label, value }) =>
          value ? (
            <div key={label} className="flex flex-col gap-0.5">
              <p className="text-[10px] text-stone-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm text-stone-700 font-medium">{value}</p>
            </div>
          ) : null
        )}
      </div>

      {/* Total destacado */}
      <div className="flex items-center justify-between bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
        <span className="text-stone-600 font-medium text-sm">Total a pagar</span>
        <span className="text-rose-500 font-bold text-xl">${order.totalPrice}</span>
      </div>

      {/* Lista de productos del pedido */}
      {orderDetails.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">
            Productos del pedido
          </p>

          {orderDetails.map((orderDet, index) => (
            <div
              key={orderDet.id ?? index}
              className="flex gap-4 bg-stone-50/80 border border-stone-100 rounded-2xl p-3"
            >
              <img
                src={orderDet.product.img_url}
                alt={orderDet.product.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-stone-800 font-semibold text-sm leading-snug">
                  {orderDet.product.name}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
                  {orderDet.product.details}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-1">
                  <span className="text-rose-500 font-bold text-sm">
                    ${orderDet.product.price}
                  </span>
                  <span className="text-stone-400 text-xs">
                    ×{orderDet.cuantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewBuyOrder;
