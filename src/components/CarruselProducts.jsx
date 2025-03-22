import React, { useEffect, useState } from 'react'
import { fetchAllProducts } from '../services/Products.service';

function CarruselProducts() {
  const [index, setIndex] = useState(0);
  const [products, setProducts]=useState([])

  useEffect(()=>{
    const response = async ()=>{
      const res = await fetchAllProducts();
      setProducts(res);
      return res;
    }
    response();
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 3) % products.length);
    }, 10000); // Cambia cada 10 seg

    return () => clearInterval(interval);
  }, [products.length]);

console.log(products);

return (
  <div
      >
    <div
      style={{
        height: "350px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff", // Fondo blanco para el contenedor interno
        borderRadius: "10px", // Bordes redondeados para un toque más suave
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave para profundidad
     background: "linear-gradient(to right, #f5f7fa, #c3cfe2)", // Fondo degradado
   
      }}
    >
      {products.slice(index, index + 3).map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid",
            width: "250px",
            height: "300px",
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
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px", // Bordes redondeados en la imagen
            }}
          />
          <h4>{product.name}</h4>
          <p>{product.details}</p>
        </div>
      ))}
    </div>
  </div>
);
}

export default CarruselProducts
