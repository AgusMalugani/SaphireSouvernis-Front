import React, { useContext } from 'react'
import { OrdersContext } from '../../contexts/Orders/OrdersContext'
import Order from './Order'

function Orders() {
  const { orders } = useContext(OrdersContext)

  return (
    <div className="p-4 max-w-screen-xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-center text-3xl mb-6 text-gray-800">
        Ver órdenes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders?.map(order => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

export default Orders
