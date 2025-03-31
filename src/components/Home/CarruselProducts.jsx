import React, { useContext, useEffect, useState } from 'react'
import { ProductsContext } from '../../contexts/ProductsContext';
//import { fetchAllProducts } from '../services/Products.service';
//import {productsJson} from "../../products"

function CarruselProducts() {
  const [index, setIndex] = useState(0);
  const {products} = useContext(ProductsContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 3) % products.length);
    }, 10000); // Cambia cada 10 seg

    return () => clearInterval(interval);
  }, [products.length]);

return (
  <div>
    <div
      style={{
        height: "350px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderRadius: "10px", // Bordes redondeados para un toque más suave
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave para profundidad 
      }}
    >
      { !products ? <h2>Cargando...</h2> : products.slice(index, index + 3).map((product) => (
        <div
          key={product.id}
          style={{
            border: "0,5px solid",
            width: "250px",
            height: "auto",
            margin: "5px",
            textAlign: "center",
            backgroundColor: "#fafafa", // Fondo suave para cada producto
            borderRadius: "8px", // Bordes redondeados para cada producto
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Sombra suave en los productos
            padding: "10px", // Espaciado interno
          }}
        >
          <img
            src={product.img_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px", // Bordes redondeados en la imagen
            }}
          />
          <h4>{product.name}</h4>
        </div>
      ))}
    </div>
  </div>
);
}

export default CarruselProducts
