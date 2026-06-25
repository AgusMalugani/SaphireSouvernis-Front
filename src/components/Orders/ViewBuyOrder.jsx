import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { OneOrder } from '../../services/Orders/OneOrder';
import { FindOrderAdmin } from '../../services/Orders/FindOrderAdmin';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import {
  getOrderStateLabel,
  getOrderTransactionLabel,
} from '../../utils/orders/orderStatusConfig';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';
import { formatProductPrice } from '../../utils/products/formatProductPrice';
import OrderTimeline from './OrderTimeline';
import AdminOrderNotes from './AdminOrderNotes';

function mapAdminNotes(notes = []) {
  return notes.map((noteItem, index) =>
    typeof noteItem === 'string'
      ? { id: `legacy-note-${index}`, text: noteItem }
      : noteItem,
  );
}

function sortTimelineEvents(events) {
  return [...events].sort((leftEvent, rightEvent) => {
    const leftTime = new Date(leftEvent.createdAt ?? 0).getTime();
    const rightTime = new Date(rightEvent.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function ViewBuyOrder({
  id,
  variant = 'public',
  onOrderLoaded,
}) {
  const isAdminVariant = variant === 'admin';
  const {
    optimisticTimelineByOrderId,
    appendOptimisticTimelineEvent,
    clearOptimisticTimelineEvents,
  } = useContext(OrdersContext);

  const [order, setOrder] = useState({});
  const [adminNotes, setAdminNotes] = useState([]);
  const [serverTimelineEvents, setServerTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [adminDataUnavailable, setAdminDataUnavailable] = useState(false);

  const fetchAdminData = useCallback(async (options = {}) => {
    const isMounted = options.isMounted ?? (() => true);

    try {
      const adminOrder = await FindOrderAdmin(id);
      if (!isMounted()) {
        return;
      }

      setServerTimelineEvents(adminOrder.timeline ?? []);
      setAdminNotes(mapAdminNotes(adminOrder.notes ?? adminOrder.adminNotes ?? []));
      setAdminDataUnavailable(false);
      clearOptimisticTimelineEvents(id);
    } catch (adminError) {
      if (!isMounted()) {
        return;
      }

      setServerTimelineEvents([]);
      setAdminDataUnavailable(true);
    }
  }, [clearOptimisticTimelineEvents, id]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      setIsLoading(true);
      setLoadError(false);

      try {
        const publicOrder = await OneOrder(id);
        if (!isMounted) {
          return;
        }

        setOrder(publicOrder);
        onOrderLoaded?.(publicOrder);

        if (isAdminVariant) {
          await fetchAdminData({ isMounted: () => isMounted });
        }
      } catch (error) {
        console.error('Error al traer la orden', error);
        if (!isMounted) {
          return;
        }
        setLoadError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [fetchAdminData, id, isAdminVariant, onOrderLoaded]);

  const mergedTimelineEvents = useMemo(() => {
    if (!adminDataUnavailable) {
      return sortTimelineEvents(serverTimelineEvents);
    }

    const optimisticEvents = optimisticTimelineByOrderId[id] ?? [];
    return sortTimelineEvents(optimisticEvents);
  }, [adminDataUnavailable, id, optimisticTimelineByOrderId, serverTimelineEvents]);

  const handleNoteAdded = useCallback(async () => {
    await fetchAdminData();
  }, [fetchAdminData]);

  const handleOptimisticNote = (noteText) => {
    appendOptimisticTimelineEvent(id, {
      id: `optimistic-note-${Date.now()}`,
      type: 'admin_note_added',
      payload: { note: noteText },
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    });

    setAdminNotes((previousNotes) => [
      {
        id: `local-note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString(),
      },
      ...previousNotes,
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-200 border-t-rose-400" />
        <p className="font-display text-lg text-stone-400">Cargando detalle...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="font-display text-xl text-stone-600">No encontramos este pedido</p>
        <p className="text-sm text-stone-500">
          El enlace puede estar incorrecto o el pedido ya no está disponible.
        </p>
      </div>
    );
  }

  const orderDetails = order.orderDetails ?? [];
  const infoItems = [
    { label: 'Dirección', value: order.address },
    { label: 'Fecha de creación', value: order.createAt },
    { label: 'Fecha de entrega', value: order.endOrder },
    { label: 'Email', value: order.email },
    { label: 'Nombre para el diseño', value: order.personalizationName },
    { label: 'Teléfono', value: order.numCel },
    { label: 'Teléfono secundario', value: order.num2Cel },
    { label: 'Estado del pedido', value: getOrderStateLabel(order.state) },
    { label: 'Tema', value: order.theme },
    {
      label: 'Tipo de entrega',
      value: getOrderTransactionLabel(order.transactionType),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
          Detalle del pedido
        </span>
        <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
          {order.nameClient}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {infoItems.map(({ label, value }) =>
          value ? (
            <div key={label} className="flex flex-col gap-0.5">
              <p className="text-[10px] uppercase tracking-wider text-stone-400">
                {label}
              </p>
              <p className="text-sm font-medium text-stone-700">{value}</p>
            </div>
          ) : null,
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
        <span className="text-sm font-medium text-stone-600">Total a pagar</span>
        <span className="text-xl font-bold text-rose-500">
          {formatProductPrice(order.totalPrice)}
        </span>
      </div>

      {orderDetails.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            Productos del pedido
          </p>

          {orderDetails.map((orderDetail, index) => {
            const product = orderDetail.product ?? {};
            const displayImageUrl = product.img_url
              ? toCloudinaryDisplayUrl(product.img_url)
              : null;

            return (
            <div
              key={orderDetail.id ?? index}
              className="flex gap-4 rounded-2xl border border-stone-100 bg-stone-50/80 p-3"
            >
              {displayImageUrl ? (
                <img
                  src={displayImageUrl}
                  alt={product.name ?? 'Producto'}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-stone-100"
                />
              ) : null}
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-sm font-semibold leading-snug text-stone-800">
                  {product.name ?? 'Producto'}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-stone-500">
                  {product.details}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-1">
                  <span className="text-sm font-bold text-rose-500">
                    {formatProductPrice(product.price)}
                  </span>
                  <span className="text-xs text-stone-400">
                    ×{orderDetail.cuantity}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {isAdminVariant && (
        <>
          <div>
            <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-stone-400">
              Historial
            </p>
            <OrderTimeline
              events={mergedTimelineEvents}
              emptyMessage={
                adminDataUnavailable
                  ? 'El historial completo estará disponible cuando el backend esté actualizado.'
                  : 'Sin eventos registrados todavía.'
              }
            />
          </div>

          <AdminOrderNotes
            orderId={id}
            notes={adminNotes}
            onNoteAdded={handleNoteAdded}
            onOptimisticNote={handleOptimisticNote}
          />
        </>
      )}
    </div>
  );
}

export default ViewBuyOrder;
