import React, { useContext, useEffect, useState } from 'react';
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import SearchProducts from './SearchProducts';
import { toast } from 'react-toastify';

function Products() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsCart, setProductsCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false); // para mostrar/ocultar carrito en mobile

  const { products } = useContext(ProductsContext);
  const [productsFilter, setProductsFilter] = useState(products);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setProductsCart([...productsCart, { productId: product.id, cuantity: product.cuantity }]);
    const suma = total + product.price * product.cuantity;
    toast.success(`${product.name} agregado al carrito`);
    setTotal(suma);
  };

  const deleteToCart = (index) => {
    // Crear una copia del carrito actual
    const newCart = [...cart];
    // Remover el producto en el índice especificado
    const [removedProduct] = newCart.splice(index, 1); //actualiza el carrito, eliminando el producto
    setCart(newCart);
  
    // Actualizar el estado de productsCart
    const newProductsCart = [...productsCart];
    newProductsCart.splice(index, 1);
    setProductsCart(newProductsCart);
  
    // Actualizar el total restando el precio del producto eliminado
    const suma = total - removedProduct.price * removedProduct.cuantity;
    setTotal(suma);
  
    // Mostrar un mensaje de éxito
    toast.success(`${removedProduct.name} eliminado del carrito`);
  };

  const handleOrderModal = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleOnChangeCategories = (e) => {
    const { value } = e.target;
    if (value !== "TODOS") {
      const prodFil = products.filter(prod =>
        prod.categories.some(cat => cat.name === value)
      );
      setProductsFilter(prodFil);
    } else {
      setProductsFilter(products);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between relative">

      {/* Buscador */}
      <SearchProducts handleOnChangeCategories={handleOnChangeCategories} />

      {/* Lista de productos */}
      <div className="w-full border border-gray-300 p-5 rounded-lg bg-white shadow-md md:w-[60%] md:max-h-[500px] md:overflow-y-auto order-2 md:order-none">
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

      {/* Carrito en desktop o si showCart en mobile */}
      {(showCart || window.innerWidth >= 768) && (
        <div className="w-full border border-gray-300 p-5 rounded-lg bg-white shadow-md md:w-[35%] mt-2 md:mt-0 order-1 md:order-none">
          <ul className="list-none p-0 my-2">
            {cart.map((prod, index) => (
              <OrderDetail
              key={index}
              prod={prod}
              deleteToCart={() => deleteToCart(index)} // Pasar el índice
            
              />
            ))}
          </ul>

          <span className="font-bold text-gray-800">
            <p>Total: ${total}</p>
          </span>

          <button
            onClick={handleOrderModal}
            disabled={productsCart.length === 0}
            className="px-4 py-2 mt-3 rounded-md bg-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            Crear orden
          </button>
        </div>
      )}

      {/* Botón flotante para carrito en mobile */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg relative"
        >
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center text-white">
              {cart.length}
            </span>
          )}
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
