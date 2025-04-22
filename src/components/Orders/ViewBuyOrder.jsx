import React, { useEffect, useState } from 'react'
import { OneOrder } from '../../services/Orders/OneOrder'

function ViewBuyOrder({ id }) {
  const [order, setOrder] = useState({})

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const resp = await OneOrder(id)
        setOrder(resp)
      } catch (error) {
        console.log("Error al traer la orden")
        throw error
      }
    }

    fetchOrder()
  }, [id])

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <h2 className="text-gray-800 text-2xl font-semibold mb-4">
        Los productos que eligió son:
      </h2>

      <div className="space-y-2 text-gray-600">
        <h3><strong>Dirección:</strong> {order.address}</h3>
        <h3><strong>Fecha de creación:</strong> {order.createAt}</h3>
        <h3><strong>Fecha de entrega:</strong> {order.endOrder}</h3>
        <h3><strong>Cliente:</strong> {order.nameClient}</h3>
        <h3><strong>Email:</strong> {order.email}</h3>
        <h3><strong>Nombre en tarjeta:</strong> {order.nameForCard}</h3>
        <h3><strong>Teléfono:</strong> {order.numCel}</h3>
        <h3><strong>Teléfono secundario:</strong> {order.num2Cel}</h3>
        <h3><strong>Estado del pedido:</strong> {order.state}</h3>
        <h3><strong>Tema:</strong> {order.theme}</h3>
        <h3 className="text-red-600 font-bold text-lg mt-4">
          Total a pagar: ${order.totalPrice}
        </h3>
        <h3><strong>Tipo de transacción:</strong> {order.transactionType}</h3>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        {order.orderDetails?.map((orderDet, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-4 mb-4 flex flex-col sm:flex-row gap-4"
          >
            <img
              src={orderDet.product.img_url}
              alt={orderDet.product.name}
              className="w-28 h-auto rounded-md object-cover"
            />
            <div>
              <h3 className="text-blue-600 font-semibold">{orderDet.product.name}</h3>
              <p className="text-gray-600">
                <strong>Detalles:</strong> {orderDet.product.details}
              </p>
              <p className="text-green-600">
                <strong>Precio:</strong> ${orderDet.product.price}
              </p>
              <p className="text-gray-600">
                <strong>Cantidad:</strong> {orderDet.cuantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewBuyOrder
