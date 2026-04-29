import React, { useContext, useEffect, useState } from 'react';
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import SearchProducts from './SearchProducts';
import { toast } from 'react-toastify';
import { HiShoppingBag } from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ITEMS_PER_PAGE = 9;

function Products() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsCart, setProductsCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { products } = useContext(ProductsContext);
  const [productsFilter, setProductsFilter] = useState([]);

  useEffect(() => {
    setProductsFilter(products);
    setIsLoading(false);
    setCurrentPage(1);
  }, [products]);

  // Valores derivados de la paginación — no necesitan estado propio
  const totalPages = Math.ceil((productsFilter?.length || 0) / ITEMS_PER_PAGE);
  const paginatedProducts = productsFilter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      // El producto ya existe: actualizar cantidad con .map() (inmutabilidad)
      const updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? { ...item, cuantity: item.cuantity + product.cuantity }
          : item
      );
      setCart(updatedCart);

      // Sincronizar el mismo merge en productsCart (payload del API de órdenes)
      const updatedProductsCart = productsCart.map((item, index) =>
        index === existingIndex
          ? { ...item, cuantity: item.cuantity + product.cuantity }
          : item
      );
      setProductsCart(updatedProductsCart);
    } else {
      setCart([...cart, product]);
      setProductsCart([...productsCart, { productId: product.id, cuantity: product.cuantity }]);
    }

    setTotal(total + product.price * product.cuantity);
    toast.success(`${product.name} agregado al carrito`);
  };

  const deleteToCart = (index) => {
    const newCart = [...cart];
    const [removedProduct] = newCart.splice(index, 1);
    setCart(newCart);

    const newProductsCart = [...productsCart];
    newProductsCart.splice(index, 1);
    setProductsCart(newProductsCart);

    setTotal(total - removedProduct.price * removedProduct.cuantity);
    toast.success(`${removedProduct.name} eliminado del carrito`);
  };

  const handleOrderModal = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleOnChangeCategories = (e) => {
    const { value } = e.target;
    setCurrentPage(1); // resetear paginación al cambiar de categoría
    if (value !== 'TODOS') {
      setProductsFilter(
        products.filter((prod) => prod.categories.some((cat) => cat.name === value))
      );
    } else {
      setProductsFilter(products);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-stone-50 to-pink-50/30">

      {/* Page Header */}
      <div className="text-center py-12 px-4">
        <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
          Saphire Souvenirs
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-stone-800 font-bold mt-2">
          Nuestro Catálogo
        </h1>
        <p className="text-stone-500 mt-3 max-w-sm mx-auto text-sm font-light">
          Encontrá el souvenir perfecto para tu celebración especial
        </p>
      </div>

      {/* Main layout: sidebar lg:w-1/4 + grid lg:w-3/4 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-28 flex flex-col lg:flex-row gap-8 items-start">

        {/* Sidebar izquierda — 1/4 del ancho en desktop */}
        <aside className="w-full lg:w-1/4 shrink-0 flex flex-col gap-6">
          <SearchProducts handleOnChangeCategories={handleOnChangeCategories} />

          {/* Panel del carrito:
              mobile: visible cuando showCart es true (FAB)
              desktop lg+: siempre visible via lg:block */}
          <div className={`${showCart ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm p-5">
              <h3 className="font-semibold text-stone-800 mb-4 text-sm uppercase tracking-wider">
                Tu Carrito
              </h3>

              {cart.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-4 font-light">
                  Aún no hay productos
                </p>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[360px] overflow-y-auto scrollbar-thin-rose pr-1">
                  {cart.map((prod, index) => (
                    <OrderDetail
                      key={index}
                      prod={prod}
                      deleteToCart={() => deleteToCart(index)}
                    />
                  ))}
                </ul>
              )}

              <div className="border-t border-stone-100 mt-4 pt-4">
                <p className="font-bold text-stone-800 text-sm">
                  Total: <span className="text-rose-500">${total}</span>
                </p>
              </div>

              <button
                onClick={handleOrderModal}
                disabled={productsCart.length === 0}
                className="mt-4 w-full py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-sm font-semibold shadow-md shadow-rose-300/30 hover:shadow-rose-400/50 hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                Crear orden
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid — 3/4 del ancho en desktop */}
        <main className="w-full lg:w-3/4">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <p className="font-display text-2xl text-stone-400 animate-pulse">
                Cargando productos...
              </p>
            </div>
          ) : productsFilter?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="font-display text-3xl text-stone-300">Sin resultados</p>
              <p className="text-stone-400 text-sm font-light">
                No hay productos en esta categoría todavía.
              </p>
            </div>
          ) : (
            <>
              {/* Máximo 3 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((prod) => (
                  <Product
                    key={prod.id}
                    id={prod.id}
                    img_url={prod.img_url}
                    name={prod.name}
                    price={prod.price}
                    addToCart={addToCart}
                  />
                ))}
              </div>

              {/* Paginación rose-gold */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center flex-wrap gap-2 mt-10">
                  <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-rose-200 text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <FiChevronLeft size={15} />
                    Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition-all duration-200
                        ${currentPage === page
                          ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md shadow-rose-300/40'
                          : 'text-stone-500 hover:bg-rose-50 hover:text-rose-500'
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-rose-200 text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Siguiente
                    <FiChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* FAB carrito — solo mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={() => setShowCart(!showCart)}
          aria-label="Ver carrito"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-300/50 hover:scale-110 transition-all duration-300"
        >
          <HiShoppingBag size={22} />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-rose-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
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
          cartItems={cart}
          total={total}
        />
      )}
    </div>
  );
}

export default Products;
