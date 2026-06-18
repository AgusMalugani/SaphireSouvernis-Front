import { useContext, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import Order from './Order';

const SELECT_CLASS =
  'cursor-pointer appearance-none rounded-full border border-stone-200 bg-white py-2 pl-4 pr-9 text-sm text-stone-700 transition-all duration-200 ease-in-out hover:border-rose-200 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200';

function Orders() {
  const { orders } = useContext(OrdersContext);

  const [filters, setFilters] = useState({
    state: '',
    transactionType: '',
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesState = filters.state ? order.state === filters.state : true;
    const matchesTransactionType = filters.transactionType
      ? order.transactionType === filters.transactionType
      : true;
    return matchesState && matchesTransactionType;
  });

  const orderCountLabel =
    filteredOrders.length === 1
      ? '1 orden encontrada'
      : `${filteredOrders.length} órdenes encontradas`;

  return (
    <>
      <p className="mb-6 text-sm font-light text-stone-500">{orderCountLabel}</p>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-stone-400">
          <FiFilter size={15} aria-hidden="true" />
          <span className="text-sm font-medium text-stone-500">Filtrar:</span>
        </div>

        <div className="relative">
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className={SELECT_CLASS}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            <option value="paid">Pagado</option>
            <option value="partialPayment">Señado</option>
            <option value="inProcces">Sin pagar</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="h-3.5 w-3.5 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            name="transactionType"
            value={filters.transactionType}
            onChange={handleFilterChange}
            className={SELECT_CLASS}
            aria-label="Filtrar por tipo de transacción"
          >
            <option value="">Tipo de transacción</option>
            <option value="send">Envío</option>
            <option value="withdraw">Retiro</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="h-3.5 w-3.5 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {(filters.state || filters.transactionType) && (
          <button
            type="button"
            onClick={() => setFilters({ state: '', transactionType: '' })}
            className="rounded-md px-1 text-xs text-stone-400 underline transition-all duration-200 ease-in-out hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98]"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <p className="font-display text-3xl text-stone-300">Sin resultados</p>
          <p className="text-sm font-light text-stone-500">
            No hay órdenes que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}

export default Orders;
