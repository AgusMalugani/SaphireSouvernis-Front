import React, { useCallback, useContext, useEffect, useState } from 'react';
import { OrdersContext } from './OrdersContext';
import { FindAllOrders } from '../../services/Orders/FindAllOrders';
import { AuthContext } from '../Auth/AuthContext';
import { EditOrderService } from '../../services/Orders/EditOrderService';
import { normalizeOrdersListResponse } from '../../utils/orders/normalizeOrdersListResponse';
import { getOrderTransactionLabel, ORDER_STATE_VALUES } from '../../utils/orders/orderStatusConfig';

const DEFAULT_ORDERS_FILTERS = {
  state: '',
  transactionType: '',
  q: '',
  page: 1,
  limit: 20,
  sort: 'createAt',
  order: 'desc',
};

const DEFAULT_ORDERS_META = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
};

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [ordersMeta, setOrdersMeta] = useState(DEFAULT_ORDERS_META);
  const [ordersFilters, setOrdersFilters] = useState(DEFAULT_ORDERS_FILTERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [optimisticTimelineByOrderId, setOptimisticTimelineByOrderId] = useState(
    {},
  );
  const [adminRefetchSignal, setAdminRefetchSignal] = useState({
    orderId: null,
    at: 0,
  });
  const { token } = useContext(AuthContext);

  const getOrderById = useCallback(
    (orderId) => orders.find((orderItem) => orderItem.id === orderId),
    [orders],
  );

  const signalAdminRefetch = useCallback((orderId) => {
    setAdminRefetchSignal({ orderId, at: Date.now() });
  }, []);

  const fetchOrders = useCallback(
    async (nextFilters = ordersFilters) => {
      if (!token) {
        setOrders([]);
        setOrdersMeta(DEFAULT_ORDERS_META);
        return;
      }

      setIsLoadingOrders(true);
      setOrdersError(null);

      try {
        const rawResponse = await FindAllOrders(nextFilters);
        const normalizedResponse = normalizeOrdersListResponse(
          rawResponse,
          nextFilters,
        );
        setOrders(normalizedResponse.data);
        setOrdersMeta(normalizedResponse.meta);
      } catch (error) {
        console.error('Error al traer todas las ordenes', error);
        setOrdersError(error);
        setOrders([]);
        setOrdersMeta(DEFAULT_ORDERS_META);
        throw error;
      } finally {
        setIsLoadingOrders(false);
      }
    },
    [token, ordersFilters],
  );

  const editOrderContext = async (orderId, payload) => {
    const response = await EditOrderService(orderId, payload);
    setOrders((previousOrders) =>
      previousOrders.map((orderItem) =>
        orderItem.id === orderId ? { ...orderItem, ...response } : orderItem,
      ),
    );
    return response;
  };

  const appendOptimisticTimelineEvent = useCallback((orderId, timelineEvent) => {
    setOptimisticTimelineByOrderId((previousEvents) => ({
      ...previousEvents,
      [orderId]: [...(previousEvents[orderId] ?? []), timelineEvent],
    }));
  }, []);

  const clearOptimisticTimelineEvents = useCallback((orderId) => {
    setOptimisticTimelineByOrderId((previousEvents) => {
      if (!previousEvents[orderId]) {
        return previousEvents;
      }

      const { [orderId]: _removedEvents, ...remainingEvents } = previousEvents;
      return remainingEvents;
    });
  }, []);

  const cancelOrderContext = async (orderId, { cancelReason } = {}) => {
    const previousOrder = getOrderById(orderId);
    const wasAlreadyCancelled =
      previousOrder?.state === ORDER_STATE_VALUES.CANCELLED;

    const cancelPayload = { state: ORDER_STATE_VALUES.CANCELLED };
    if (cancelReason) {
      cancelPayload.cancelReason = cancelReason;
    }

    const response = await EditOrderService(orderId, cancelPayload);

    setOrders((previousOrders) =>
      previousOrders.map((orderItem) =>
        orderItem.id === orderId ? { ...orderItem, ...response } : orderItem,
      ),
    );

    clearOptimisticTimelineEvents(orderId);
    signalAdminRefetch(orderId);

    return { response, wasAlreadyCancelled };
  };

  const appendOptimisticEditEvent = useCallback(
    (orderId, { action, previousOrder, updatedOrder }) => {
      if (
        action === 'envio/Retiro' &&
        (previousOrder?.transactionType !== updatedOrder?.transactionType ||
          previousOrder?.address !== updatedOrder?.address)
      ) {
        appendOptimisticTimelineEvent(orderId, {
          id: `optimistic-transaction-${Date.now()}`,
          type: 'transaction_changed',
          payload: {
            fromLabel: getOrderTransactionLabel(previousOrder?.transactionType),
            toLabel: getOrderTransactionLabel(updatedOrder?.transactionType),
          },
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        });
      }
    },
    [appendOptimisticTimelineEvent],
  );

  useEffect(() => {
    if (!token) {
      setOrders([]);
      setOrdersMeta(DEFAULT_ORDERS_META);
      return;
    }

    fetchOrders(ordersFilters).catch(() => {});
  }, [token, ordersFilters, fetchOrders]);

  const value = {
    orders,
    setOrders,
    ordersMeta,
    ordersFilters,
    setOrdersFilters,
    fetchOrders,
    isLoadingOrders,
    ordersError,
    getOrderById,
    editOrderContext,
    cancelOrderContext,
    optimisticTimelineByOrderId,
    appendOptimisticTimelineEvent,
    clearOptimisticTimelineEvents,
    appendOptimisticEditEvent,
    adminRefetchSignal,
    signalAdminRefetch,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export default OrdersProvider;
