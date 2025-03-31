import React, { useContext, useEffect, useState } from 'react'
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { ProductsContext } from '../../contexts/ProductsContext';
//import { fetchAllProducts } from '../../services/Products.service';

function Products() {
  const [cart, setCart] = useState([]); // Estado para los productos agregados
 // const [productsState, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [productsCart,setProductsCart] = useState([])
  const [total,setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // estado para abrir y cerrar modal

  const{products} = useContext(ProductsContext)

  useEffect(()=>{
    setIsLoading(false)
  },[products])

  const addToCart = (product) => {    
    setCart([...cart,product])
    setProductsCart([...productsCart,{productId:product.id,cuantity:product.cuantity}])
    const suma = total + (product.price * product.cuantity);
    setTotal( suma )
  };


const handleOrderModal = ()=>{
  if(!isOpen)setIsOpen(true) 
}
 return (
<div style={{ minHeight: "300px", border: "1px solid #ddd", display: "flex" }}>

<div style={{    border: "1px solid #ccc", width: "70%",padding: "20px", margin: "10px",borderRadius: "8px",boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
  backgroundColor: "#fff",
  maxHeight: "500px", // Ajusta la altura máxima según necesites
  overflowY: "auto", // Agrega scroll vertical si el contenido excede la altura
  }}>
  
  { isLoading ? <h1>cargando ...</h1> : products.length === 0 ? <h1>No hay productos</h1> : products.map((prod) => (
      <Product
        key={prod.id}
        id={prod.id}
        img_url={prod.img_url}
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
          img_url={prod.img_url}
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

  {isOpen && <ModalCreateOrder isOpen={isOpen} onClose={()=> setIsOpen(false)} products={productsCart}/>}
</div>
      )
}

export default Products
