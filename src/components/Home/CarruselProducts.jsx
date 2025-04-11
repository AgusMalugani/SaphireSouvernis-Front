import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from '../../contexts/Products/ProductsContext'; 
import styles from './css/CarruselProducts.module.css';

function CarruselProducts() {
  const [index, setIndex] = useState(0);
  const { products } = useContext(ProductsContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 3) % products.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <div className={styles.container}>
      {!products ? (
        <h2>Cargando...</h2>
      ) : (
        <div className={styles.carousel}>
          {products.slice(index, index + 3).map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img
                src={product.img_url}
                alt={product.name}
                className={styles.productImage}
              />
              <h4>{product.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarruselProducts;
