import React, { useEffect, useState } from 'react'
import { FindAllOrders } from '../../services/FindAllOrders'
import Order from './Order'

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const response = async () => {
      const resp = await FindAllOrders()
      setOrders(resp);
    }
    response()
  }, [])

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
