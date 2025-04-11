import React, { useState } from 'react';
import ModalViewProduct from './ModalViewProduct';
import styles from './css/Product.module.css';

function Product({ id, img_url, name, price, addToCart }) {
  const [cantidad, setCantidad] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [idProduct, setIdProduct] = useState('');

  const viewProduct = (id) => {
    setIdProduct(id);
    setIsOpen(true);
  };

  const handleChange = (event) => {
    setCantidad(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const prod = { id, img_url, name, price, cuantity: cantidad };
    return addToCart(prod);
  };

  return (
    <div className={styles.card}>
      <img src={img_url} alt={name} className={styles.image} />
      <h3 className={styles.name}>{name}</h3>
      <span className={styles.price}>${price}</span>

      <label>
        Cantidad
        <input
          type="number"
          value={cantidad}
          onChange={handleChange}
          min={1}
          className={styles.inputCantidad}
        />
      </label>

      <button onClick={() => viewProduct(id)}>Ver</button>

      <button onClick={handleSubmit} className={styles.buttonAdd}>
        Add
      </button>

      {isOpen && (
        <ModalViewProduct
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          idProduct={idProduct}
        />
      )}
    </div>
  );
}

export default Product;
