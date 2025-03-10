import React, { useState } from 'react'
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import Modal from "react-modal";
import ModalCreateOrder from '../Orders/ModalCreateOrder';
const products =[{id:"1",name:"producto1",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:100},{id:"2",name:"producto2",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:200},{id:"3",name:"producto3",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:300},{id:"4",name:"producto4",img:"https://d22fxaf9t8d39k.cloudfront.net/8da3e3de84c4a864d69ca66c84c07ddd4bd76766d9ed0fad67c47cee97d0ab0c84304.jpeg",price:400}]

function Products() {
  const [cart, setCart] = useState([]); // Estado para los productos agregados
 const [isOpen, setIsOpen] = useState(false); // estado para abrir y cerrar modal

  const addToCart = (product) => {    
    setCart((prevCart) => [...prevCart, product]); // Agrega el producto a la lista
  };


const handleOrderModal = ()=>{
  console.log("entro al modal");
  setIsOpen(true) 
}

  return (
<div style={{ minHeight: "300px", border: "1px solid #ddd", display: "flex" }}>



  
<div
  style={{
    border: "1px solid #ccc",
    width: "70%",
    padding: "20px",
    margin: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  }}
>
  <h2 style={{ color: "#333", marginBottom: "10px" }}>
    MOSTRAR TODOS LOS PRODUCTOS
  </h2>
  {products &&
    products.map((prod) => (
      <Product
        key={prod.id}
        img={prod.img}
        name={prod.name}
        price={prod.price}
        addToCart={addToCart}
      />
    ))}
</div>

  


  <div
    style={{
      border: "1px solid #ccc",
      width: "40%",
      padding: "20px",
      margin: "10px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    }}
  >
    Mostrar el producto que eligió
    <h2 style={{ marginTop: "10px", color: "#333" }}>Carrito</h2>
    <ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>
      {cart.map((item, index) => (
        <OrderDetail
          key={index}
          name={item.name}
          img={item.img}
          price={item.price}
          cuantity={3}
        />
      ))}
    </ul>
    <span style={{ fontWeight: "bold", color: "#333" }}>
      Total= "precio total"
    </span>
    <br />
    <button
      onClick={handleOrderModal}
      style={{
        padding: "8px 12px",
        cursor: "pointer",
        border: "none",
        background: "#007bff",
        color: "white",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      crear orden
    </button>
  </div>




  <ModalCreateOrder isOpen={isOpen} onClose={()=> setIsOpen(false)}/>
</div>
    
    /* 
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
        {cart.map((item) => (
          <OrderDetail name={item.name} img={item.img} price={item.price} cuantity={3} />
        ))}
      </ul>
    <span>Total= "precio total" </span> 
    <br />
     <button onClick={handleOrderModal}  
     style={{padding: "8px 12px", cursor: "pointer", border: "none", background: "#007bff", color: "white", borderRadius: "5px" }}>crear orden</button>
</div>

    </div>

      <ModalCreateOrder isOpen={isOpen} onClose={()=> setIsOpen(false)}/>

    </>
*/
  )
}

export default Products
