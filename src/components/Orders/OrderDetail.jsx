import React from 'react'
import Product from '../Products/Product'

function OrderDetail({cuantity,img,name,price}) {
 //al ahcer click en agregar va a pasarle por props esas props
 //esto evita que haga otra peticion a la bd
// const subtotal = price * cuantity;
    return (
    <div>
        {/*<Product img={img} name={name} subtotal={subtotal} /> */}
      
    </div>
  )
}

export default OrderDetail
