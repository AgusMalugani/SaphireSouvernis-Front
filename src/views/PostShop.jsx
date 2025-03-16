import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from '../components/Products/Product'

function PostShop() {
    const{id}=useParams()
    const[order,setOrder] = useState({})

    useEffect(()=>{
        fetch(`http://localhost:3000/orders/${id}`)
        .then(resp=>resp.json())
        .then(data=> setOrder(data))
    },[id])

console.log(order.orderDetails);

  return (
    <div>
      <h1>GRACIAS POR TU COMPRA {order.nameClient}</h1>
      <h2>Los productos que eligio son: </h2>
   { order.orderDetails && <Product key={order.orderDetails[0].product.id}
        id={order.orderDetails[0].product.id}
        img={order.orderDetails[0].product.img}
        name={order.orderDetails[0].product.name}
        price={order.orderDetails[0].product.price}
   />}
        </div>
  )
}

export default PostShop