import React, { useContext, useState } from 'react';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import Order from './Order';

function Orders() {
  const { orders } = useContext(OrdersContext);

  // Estados para los filtros
  const [filters, setFilters] = useState({
    state: '',
    transactionType: '',
    endOrder: '',
  });

  // Función para manejar los cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Función para filtrar las órdenes
  const filteredOrders = orders.filter((order) => {
    
    const matchesState = filters.state ? order.state === filters.state : true;  //se usa true para evitar que tire undefined, y muestre todos
    const matchesTransactionType = filters.transactionType ? order.transactionType === filters.transactionType : true;

    return matchesState && matchesTransactionType;
  });

  return (
    <div className="p-4 max-w-screen-xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-center text-3xl mb-6 text-gray-800">Ver órdenes</h1>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          name="state"
          value={filters.state}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Estado</option>
          <option value="paid">Pagado</option>
          <option value="partialPayment">Señado</option>
          <option value="inProcces">Sin pagar</option>
        </select>

        <select
          name="transactionType"
          value={filters.transactionType}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Tipo de transacción</option>
          <option value="send">Envío</option>
          <option value="withdraw">Retiro</option>
        </select>

     
      </div>

      {/* Lista de órdenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredOrders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export default Orders;