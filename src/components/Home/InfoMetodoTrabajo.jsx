import React from 'react';
import styles from './css/InfoMetodoTrabajo.module.css';

function InfoMetodoTrabajo() {
  return (
    <div className={styles.container}>
      <div className={styles.infoBox}>
        <h2 className={styles.title}>MODALIDAD DE TRABAJO</h2>
        
        <p className={styles.paragraph}>
          ▪ Hacer el pedido por la web así completan todos los datos que les pide y de ahí crean la orden. Se redirige al Whatsapp.
        </p>

        <p className={styles.paragraph}>
          ▪ El pedido se agenda una vez realizado la seña del 50% o 30% o bien el pago total de la compra.
        </p>

        <p className={styles.paragraph}>
          ▪ De no ser abonado dentro de las 48hs se da de baja automáticamente, teniendo que volver a consultar costos y disponibilidad.
        </p>

        <p className={styles.paragraph}>
          ▪ Una vez confirmado el pedido se realizan las muestras y se envían para que den el OK.
        </p>
      </div>

      <img
        className={styles.image}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE0-hHH-tYkE1_CqnxjiBpfZkU1vs32Hlsjg&s"
        alt="Imagen de trabajo"
      />
    </div>
  );
}

export default InfoMetodoTrabajo;
