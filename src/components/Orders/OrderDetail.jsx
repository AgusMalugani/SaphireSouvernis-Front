import React from 'react';
import styles from './css/OrderDetail.module.css';

function OrderDetail({ cuantity, img_url, name, price }) {
  const subtotal = price * cuantity;

  return (
    <div className={styles.card}>
      <img src={img_url} alt={name} className={styles.image} />
      <h3 className={styles.name}>{name}</h3>
      <span className={styles.text}>${subtotal}</span>
      <span className={styles.text}>{cuantity}</span>
      <button className={styles.button}>❌</button>
    </div>
  );
}

export default OrderDetail;
