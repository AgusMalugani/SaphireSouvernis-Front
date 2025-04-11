import React, { useContext, useEffect, useState } from 'react';
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import styles from './css/Products.module.css';
import SearchProducts from './SearchProducts';

function Products() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsCart, setProductsCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { products } = useContext(ProductsContext);
 // const[category,setCategory]=useState("")
  const[productsFilter,setProductsFilter]=useState(products);



  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setProductsCart([...productsCart, { productId: product.id, cuantity: product.cuantity }]);
    const suma = total + product.price * product.cuantity;
    setTotal(suma);
  };

  const handleOrderModal = () => {
    if (!isOpen) setIsOpen(true);
  };
  
  const handleOnChangeCategories=(e)=>{
    const{value}=e.target
    if(value !== "TODOS"){
      const prodFil = products.filter(prod => prod.categories.some(cat=>cat.name === value))
      setProductsFilter(prodFil)
    }else{
      setProductsFilter(products)
    }
  }
  return (
    <div className={styles.container}>
      <SearchProducts handleOnChangeCategories={handleOnChangeCategories} />
      <div className={styles.productsSection}>
        {isLoading ? (
          <h1>Cargando...</h1>
        ) : productsFilter?.length === 0 ? (
          <h1>No hay productos</h1>
        ) : ( 
          productsFilter?.map((prod) => (
            <Product
              key={prod.id}
              id={prod.id}
              img_url={prod.img_url}
              name={prod.name}
              price={prod.price}
              addToCart={addToCart}
            />
          ))
        )}
      </div>

      <div className={styles.detailSection}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
          {cart.map((prod, index) => (
            <OrderDetail
              key={index}
              name={prod.name}
              img_url={prod.img_url}
              price={prod.price}
              cuantity={prod.cuantity}
            />
          ))}
        </ul>
        <span style={{ fontWeight: 'bold', color: '#333' }}>
          <p>Total: ${total}</p>
        </span>
        <br />
        <button
          onClick={handleOrderModal}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            border: 'none',
            background: '#007bff',
            color: 'white',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          Crear orden
        </button>
      </div>

      {isOpen && (
        <ModalCreateOrder
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          products={productsCart}
        />
      )}
    </div>
  );
}

export default Products;
