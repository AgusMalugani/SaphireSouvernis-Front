import React, { useEffect, useState } from 'react'
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import Modal from "react-modal";
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { fetchAllProducts } from '../../services/Products.service';

function Products() {
  const [cart, setCart] = useState([]); // Estado para los productos agregados
 const [isOpen, setIsOpen] = useState(false); // estado para abrir y cerrar modal
const [products, setProducts] = useState([])
const [isLoading, setIsLoading] = useState(true)

const [total,setTotal] = useState(0);


useEffect(()=>{
 const responseFetch = async ()=>{
 try {
   const res = await fetchAllProducts()
   setProducts(res);
   setIsLoading(false)
   console.log("efecct");
   return res
 } catch (error) {
  console.log(error);
 }
} 
responseFetch()
},[])

  const addToCart = (product) => {    
    setCart((prevCart) => [...prevCart, product]); // Agrega el producto a la lista
    const suma = total + (product.price * product.cuantity);
    setTotal( suma )
  };


const handleOrderModal = ()=>{
  setIsOpen(true) 
}
 
 return (
<div style={{ minHeight: "300px", border: "1px solid #ddd", display: "flex" }}>

<div style={{    border: "1px solid #ccc", width: "70%",padding: "20px", margin: "10px",borderRadius: "8px",boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff",}}>
  
  { isLoading ? <h1>cargando ...</h1> : products && products.map((prod) => (
      <Product
        key={prod.id}
        id={prod.id}
        img={prod.img}
        name={prod.name}
        price={prod.price}
        addToCart={addToCart}
      />
    ))}

</div>


  <div
    style={{border: "1px solid #ccc",width: "40%",padding: "20px",margin: "10px",borderRadius: "8px",boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",backgroundColor: "#fff",
    }}
  >
    <ul style={{ listStyle: "none", padding: 0, margin: "10px 0" }}>

      {cart.map((prod,index) => (
        <OrderDetail
          key={index}
          name={prod.name}
          img={prod.img}
          price={prod.price}
          cuantity={prod.cuantity}/> 
          ))}

    </ul>
    <span style={{ fontWeight: "bold", color: "#333" }}>
      <p>total ${total}</p>
    </span>
    <br />
    <button onClick={handleOrderModal}
      style={{padding: "8px 12px",cursor: "pointer",border: "none",background: "#007bff",color: "white",borderRadius: "5px",marginTop: "10px",}}>
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
