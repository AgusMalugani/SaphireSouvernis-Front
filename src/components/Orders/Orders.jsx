import React, { useContext, useState } from 'react';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import Order from './Order';
import { FiFilter } from 'react-icons/fi';

function Orders() {
  const { orders } = useContext(OrdersContext);

  // endOrder eliminado — era estado muerto (nunca se usaba en el .filter())
  const [filters, setFilters] = useState({
    state: '',
    transactionType: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesState = filters.state ? order.state === filters.state : true;
    const matchesTransactionType = filters.transactionType
      ? order.transactionType === filters.transactionType
      : true;
    return matchesState && matchesTransactionType;
  });

  return (
    <div className="min-h-screen bg-stone-50 px-4 sm:px-8 py-10">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
          Panel de Administración
        </span>
        <h1 className="font-display text-3xl sm:text-4xl text-stone-800 font-bold mt-1">
          Órdenes
        </h1>
        <p className="text-stone-400 text-sm mt-1 font-light">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'orden encontrada' : 'órdenes encontradas'}
        </p>
      </div>

      {/* Filtros estilizados */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-stone-400">
          <FiFilter size={15} />
          <span className="text-sm font-medium text-stone-500">Filtrar:</span>
        </div>

        {/* Select — Estado */}
        <div className="relative">
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="appearance-none pl-4 pr-9 py-2 text-sm border border-stone-200 rounded-full bg-white text-stone-700 focus:outline-none focus:border-rose-300 cursor-pointer transition-all duration-200 hover:border-rose-200"
          >
            <option value="">Todos los estados</option>
            <option value="paid">Pagado</option>
            <option value="partialPayment">Señado</option>
            <option value="inProcces">Sin pagar</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Select — Tipo de transacción */}
        <div className="relative">
          <select
            name="transactionType"
            value={filters.transactionType}
            onChange={handleFilterChange}
            className="appearance-none pl-4 pr-9 py-2 text-sm border border-stone-200 rounded-full bg-white text-stone-700 focus:outline-none focus:border-rose-300 cursor-pointer transition-all duration-200 hover:border-rose-200"
          >
            <option value="">Tipo de transacción</option>
            <option value="send">Envío</option>
            <option value="withdraw">Retiro</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Limpiar filtros — solo visible cuando hay filtros activos */}
        {(filters.state || filters.transactionType) && (
          <button
            onClick={() => setFilters({ state: '', transactionType: '' })}
            className="text-xs text-stone-400 hover:text-rose-400 underline transition-colors duration-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid de órdenes */}
      <div className="max-w-7xl mx-auto">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="font-display text-3xl text-stone-300">Sin resultados</p>
            <p className="text-stone-400 text-sm font-light">
              No hay órdenes que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOrders.map((order) => (
              <Order key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
