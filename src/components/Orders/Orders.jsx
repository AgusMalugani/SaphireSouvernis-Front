import { useContext, useEffect, useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import {
  getOrderStateSelectOptions,
  getOrderTransactionSelectOptions,
} from '../../utils/orders/orderStatusConfig';
import Order from './Order';

const SELECT_CLASS =
  'cursor-pointer appearance-none rounded-full border border-stone-200 bg-white py-2 pl-4 pr-9 text-sm text-stone-700 transition-all duration-200 ease-in-out hover:border-rose-200 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200';

function Orders() {
  const {
    orders,
    ordersMeta,
    ordersFilters,
    setOrdersFilters,
    isLoadingOrders,
  } = useContext(OrdersContext);

  const [searchInput, setSearchInput] = useState(ordersFilters.q ?? '');

  useEffect(() => {
    setSearchInput(ordersFilters.q ?? '');
  }, [ordersFilters.q]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setOrdersFilters((previousFilters) => {
        if (previousFilters.q === searchInput) {
          return previousFilters;
        }

        return {
          ...previousFilters,
          q: searchInput,
          page: 1,
        };
      });
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, setOrdersFilters]);

  const handleFilterChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setOrdersFilters((previousFilters) => ({
      ...previousFilters,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (nextPage) => {
    setOrdersFilters((previousFilters) => ({
      ...previousFilters,
      page: nextPage,
    }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setOrdersFilters((previousFilters) => ({
      ...previousFilters,
      state: '',
      transactionType: '',
      q: '',
      page: 1,
    }));
  };

  const hasActiveFilters =
    ordersFilters.state || ordersFilters.transactionType || ordersFilters.q;

  const orderCountLabel =
    ordersMeta.total === 1
      ? '1 orden encontrada'
      : `${ordersMeta.total} órdenes encontradas`;

  const stateOptions = getOrderStateSelectOptions();
  const transactionOptions = getOrderTransactionSelectOptions();

  return (
    <>
      <p className="mb-6 text-sm font-light text-stone-500">{orderCountLabel}</p>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-stone-400">
          <FiFilter size={15} aria-hidden="true" />
          <span className="text-sm font-medium text-stone-500">Filtrar:</span>
        </div>

        <div className="relative min-w-[220px] flex-1">
          <FiSearch
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(inputEvent) => setSearchInput(inputEvent.target.value)}
            placeholder="Buscar por nombre, email, teléfono o ID..."
            aria-label="Buscar pedidos"
            className="w-full rounded-full border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm text-stone-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        <div className="relative">
          <select
            name="state"
            value={ordersFilters.state}
            onChange={handleFilterChange}
            className={SELECT_CLASS}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {stateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            name="transactionType"
            value={ordersFilters.transactionType}
            onChange={handleFilterChange}
            className={SELECT_CLASS}
            aria-label="Filtrar por tipo de transacción"
          >
            <option value="">Tipo de transacción</option>
            {transactionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md px-1 text-xs text-stone-400 underline transition-all duration-200 ease-in-out hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {isLoadingOrders ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-200 border-t-rose-400" />
          <p className="font-display text-2xl text-stone-400">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <p className="font-display text-3xl text-stone-300">Sin resultados</p>
          <p className="text-sm font-light text-stone-500">
            No hay órdenes que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.map((order) => (
              <Order key={order.id} order={order} />
            ))}
          </div>

          {ordersMeta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={ordersMeta.page <= 1}
                onClick={() => handlePageChange(ordersMeta.page - 1)}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-sm text-stone-500">
                Página {ordersMeta.page} de {ordersMeta.totalPages}
              </span>
              <button
                type="button"
                disabled={ordersMeta.page >= ordersMeta.totalPages}
                onClick={() => handlePageChange(ordersMeta.page + 1)}
                className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Orders;
