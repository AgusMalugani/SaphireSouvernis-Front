import React, { useState } from 'react'
import Product from './Product';
const products =[{id:"1",name:"producto1",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:100},{id:"2",name:"producto2",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:200},{id:"3",name:"producto3",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:300},{id:"4",name:"producto4",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:400}]

function Products() {
  const [cart, setCart] = useState([]); // Estado para los productos agregados

  const addToCart = (product) => {
    console.log(product);
    
    setCart((prevCart) => [...prevCart, product]); // Agrega el producto a la lista
  };



  return (
    <>
    <div style={{ minHeight:"300px", border:"1px solid" , display:"flex"}}>

<div style={{border:"1px solid", width:"70%"}} >
    MOSTRAR TODOS LOS PRODUCTOS
    {products && products.map(prod=> {
           return <Product img = {prod.img} name={prod.name} price={prod.price} addToCart = {addToCart} />
        } )}

</div>

<div style={{border:"1px solid", width:"40%" }}>
    Mostrar el producto que eligio  
    <h2>Carrito</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.name} - ${item.price}</li>
        ))}
      </ul>
     
</div>



    </div>



    </>

  )
}

export default Products
