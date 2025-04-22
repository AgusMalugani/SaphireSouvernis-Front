import React, { useContext, useEffect, useState } from 'react';
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import SearchProducts from './SearchProducts';

function Products() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsCart, setProductsCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { products } = useContext(ProductsContext);
  const [productsFilter, setProductsFilter] = useState(products);

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
    <div className="flex flex-col gap-5 p-5 md:flex-row md:items-start md:justify-between">
      <SearchProducts handleOnChangeCategories={handleOnChangeCategories} />

      <div className="w-full border border-gray-300 p-5 rounded-lg bg-white shadow-md md:w-[60%] md:max-h-[500px] md:overflow-y-auto">
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

      <div className="w-full border border-gray-300 p-5 rounded-lg bg-white shadow-md md:w-[35%] mt-2 md:mt-0">
        <ul className="list-none p-0 my-2">
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
