import React, { useContext } from 'react';
import { ProductsContext } from '../../contexts/Products/ProductsContext';

function CarruselProducts() {
  const { products } = useContext(ProductsContext);

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-16 flex justify-center">
        <p className="text-stone-400 text-sm tracking-widest uppercase animate-pulse">
          Cargando productos...
        </p>
      </div>
    );
  }

  // Mostrar hasta 6 productos destacados en el bento grid
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="w-full px-4 sm:px-8 py-16 max-w-6xl mx-auto">

      {/* Encabezado de sección */}
      <div className="text-center mb-10">
        <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
          Nuestra Colección
        </span>
        <h2 className="font-display text-3xl sm:text-4xl text-stone-800 mt-2 font-semibold">
          Productos destacados
        </h2>
      </div>

      {/* Bento Grid — 2 columnas mobile, 3 columnas desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`group relative overflow-hidden rounded-3xl shadow-md cursor-pointer
              ${index === 0 ? 'col-span-2 sm:col-span-1' : ''}
            `}
          >
            {/* Imagen con aspect-ratio cuadrado y efecto scale al hover */}
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={product.img_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            {/* Overlay con nombre — se desliza desde abajo al hacer hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-end p-4">
              <span className="text-white font-semibold text-sm sm:text-base leading-snug">
                {product.name}
              </span>
            </div>

            {/* Punto decorativo rose-gold que aparece al hover */}
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-rose-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CarruselProducts;
