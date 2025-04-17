import React, { useContext } from 'react'
import { FindAllOrders } from '../../services/Orders/FindAllOrders' 
import Order from './Order'
import { OrdersContext } from '../../contexts/Orders/OrdersContext'

function Orders() {
const{orders}= useContext(OrdersContext)
  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        boxSizing: 'border-box',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '2rem',
          marginBottom: '1.5rem',
          color: '#343a40'
        }}
      >
        Ver órdenes
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px"
        }}
      >
        {orders?.map(order => (
          <Order key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

export default Orders
