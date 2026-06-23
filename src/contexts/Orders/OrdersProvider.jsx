import React, { useCallback, useContext, useEffect, useState } from 'react';
import { OrdersContext } from './OrdersContext';
import { FindAllOrders } from '../../services/Orders/FindAllOrders';
import { AuthContext } from '../Auth/AuthContext';
import { EditOrderService } from '../../services/Orders/EditOrderService';
import { normalizeOrdersListResponse } from '../../utils/orders/normalizeOrdersListResponse';
import {
  getOrderStateLabel,
  getOrderTransactionLabel,
} from '../../utils/orders/orderStatusConfig';

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
  const { token } = useContext(AuthContext);

  const getOrderById = useCallback(
    (orderId) => orders.find((orderItem) => orderItem.id === orderId),
    [orders],
  );

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

  const appendOptimisticEditEvent = useCallback(
    (orderId, { action, previousOrder, updatedOrder }) => {
      if (action === 'estadoPago' && previousOrder?.state !== updatedOrder?.state) {
        appendOptimisticTimelineEvent(orderId, {
          id: `optimistic-state-${Date.now()}`,
          type: 'state_changed',
          payload: {
            fromLabel: getOrderStateLabel(previousOrder?.state),
            toLabel: getOrderStateLabel(updatedOrder?.state),
          },
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        });
        return;
      }

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
    optimisticTimelineByOrderId,
    appendOptimisticTimelineEvent,
    clearOptimisticTimelineEvents,
    appendOptimisticEditEvent,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export default OrdersProvider;
