import React, { useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import Product from './Product';
import OrderDetail from '../Orders/OrderDetail';
import ModalCreateOrder from '../Orders/ModalCreateOrder';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import CatalogFilters from './CatalogFilters';
import {
  filterCatalogProducts,
  getCatalogEmptyMessage,
} from '../../utils/products/filterCatalogProducts';
import { toast } from 'react-toastify';
import { HiShoppingBag, HiX } from 'react-icons/hi';
import { FiSearch, FiPackage } from 'react-icons/fi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { getPrimaryProductImageUrl } from '../../utils/products/productImageUrls';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';
import { EmptyState, Button, Pagination, Skeleton } from '../ui';
import { MIN_QUANTITY_PER_PRODUCT } from '../../constants/orderRules';

const ITEMS_PER_PAGE = 9;

function Products() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsCart, setProductsCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  const { products } = useContext(ProductsContext);

  useBodyScrollLock(showCart);

  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  const productsFilter = useMemo(
    () =>
      filterCatalogProducts(products, {
        category: selectedCategory,
        searchQuery,
      }),
    [products, selectedCategory, searchQuery],
  );

  const emptyMessage = useMemo(
    () =>
      getCatalogEmptyMessage({
        category: selectedCategory,
        searchQuery,
      }),
    [selectedCategory, searchQuery],
  );

  const hasInvalidQuantities = useMemo(
    () => cart.some((item) => item.cuantity < MIN_QUANTITY_PER_PRODUCT),
    [cart],
  );

  const canCreateOrder = productsCart.length > 0 && !hasInvalidQuantities;

  const totalPages = Math.ceil((productsFilter?.length || 0) / ITEMS_PER_PAGE);
  const paginatedProducts = productsFilter.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
  };

  const handleSearchChange = (nextSearchQuery) => {
    setSearchQuery(nextSearchQuery);
    setCurrentPage(1);
  };

  const addToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex !== -1) {
      const nextQuantity = cart[existingIndex].cuantity + product.cuantity;

      const updatedCart = cart.map((item, index) =>
        index === existingIndex
          ? { ...item, cuantity: nextQuantity }
          : item,
      );
      setCart(updatedCart);

      const updatedProductsCart = productsCart.map((item, index) =>
        index === existingIndex
          ? { ...item, cuantity: nextQuantity }
          : item,
      );
      setProductsCart(updatedProductsCart);
    } else {
      setCart([...cart, product]);
      setProductsCart([
        ...productsCart,
        { productId: product.id, cuantity: product.cuantity },
      ]);
    }

    setTotal(total + product.price * product.cuantity);
    toast.success(`${product.name} agregado al carrito`);
  };

  const updateCartQuantity = (index, nextQuantity) => {
    if (nextQuantity < 1) return;

    const currentItem = cart[index];
    if (!currentItem) return;

    const quantityDelta = nextQuantity - currentItem.cuantity;

    setCart((previousCart) =>
      previousCart.map((item, itemIndex) =>
        itemIndex === index ? { ...item, cuantity: nextQuantity } : item,
      ),
    );

    setProductsCart((previousProductsCart) =>
      previousProductsCart.map((item, itemIndex) =>
        itemIndex === index ? { ...item, cuantity: nextQuantity } : item,
      ),
    );

    setTotal((previousTotal) => previousTotal + currentItem.price * quantityDelta);
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

  return (
    <>
      <div className="lg:hidden max-w-full overflow-x-hidden">
        <CatalogFilters
          layout="mobile-sticky"
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-stretch gap-8 px-4 pb-28 sm:px-8 lg:flex-row">
        <aside className="hidden w-full shrink-0 flex-col gap-6 lg:flex lg:w-72 xl:w-80">
          <CatalogFilters
            layout="sidebar"
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
          />

          <div className="rounded-3xl border border-white/60 bg-white/60 p-5 shadow-sm backdrop-blur-md">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-800">
              Tu Carrito
            </h3>

            {cart.length === 0 ? (
              <div className="py-6">
                <FiPackage size={32} className="mx-auto mb-2 text-stone-300" aria-hidden="true" />
                <p className="text-center text-xs text-stone-400">
                  Tu carrito está vacío
                </p>
              </div>
            ) : (
              <ul className="scrollbar-thin-rose flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
                {cart.map((prod, index) => (
                  <OrderDetail
                    key={index}
                    prod={prod}
                    deleteToCart={() => deleteToCart(index)}
                    onQuantityChange={(nextQuantity) =>
                      updateCartQuantity(index, nextQuantity)
                    }
                  />
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-stone-100 pt-4">
              <p className="text-sm font-bold text-stone-800">
                Total: <span className="text-rose-500">${total}</span>
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              className="mt-4 w-full shadow-md shadow-rose-300/30"
              onClick={handleOrderModal}
              disabled={!canCreateOrder}
            >
              Crear orden
            </Button>
            {hasInvalidQuantities && (
              <p className="mt-2 text-center text-[11px] text-rose-500">
                Cada producto debe tener al menos {MIN_QUANTITY_PER_PRODUCT} unidades
              </p>
            )}
          </div>
        </aside>

        <section
          aria-label="Listado de productos"
          className="min-w-0 w-full flex-1"
        >
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/60 p-3 backdrop-blur-sm sm:p-4">
                  <Skeleton variant="card" />
                  <Skeleton variant="text" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                  <div className="mt-2 flex gap-2">
                    <Skeleton variant="button" className="h-8 w-14" />
                    <Skeleton variant="button" className="flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsFilter?.length === 0 ? (
            <div className="flex min-h-[28rem] w-full items-center justify-center rounded-3xl border border-dashed border-stone-200/80 bg-white/40 px-6 backdrop-blur-sm">
              <EmptyState
                icon={FiSearch}
                title="Sin resultados"
                description={emptyMessage}
                actionLabel="Ver todo el catálogo"
                onAction={() => {
                  setSelectedCategory('TODOS');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {paginatedProducts.map((prod) => {
                  const primaryImageUrl = getPrimaryProductImageUrl(prod);
                  const displayImageUrl = primaryImageUrl
                    ? toCloudinaryDisplayUrl(primaryImageUrl)
                    : undefined;

                  return (
                  <Product
                    key={prod.id}
                    id={prod.id}
                    img_url={displayImageUrl}
                    name={prod.name}
                    price={prod.price}
                    addToCart={addToCart}
                  />
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          )}
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setShowCart(!showCart)}
          aria-label="Ver carrito"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-300/50 transition-all duration-300 hover:scale-110"
        >
          <HiShoppingBag size={22} />
          {cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-rose-500 shadow-sm">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <Modal
        isOpen={showCart}
        appElement={document.getElementById('root') || undefined}
        onRequestClose={() => setShowCart(false)}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          },
          content: {
            inset: 'unset',
            padding: 0,
            border: 'none',
            background: 'none',
            overflow: 'visible',
            width: '100%',
          },
        }}
      >
        <div className="relative flex max-h-[90vh] w-full flex-col rounded-t-3xl border-t border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-center pb-1 pt-3">
            <div className="h-1 w-10 rounded-full bg-stone-200" />
          </div>

          <div className="flex items-center justify-between px-5 py-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
              Tu Carrito
            </h3>
            <button
              type="button"
              onClick={() => setShowCart(false)}
              aria-label="Cerrar carrito"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-500"
            >
              <HiX size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-2">
            {cart.length === 0 ? (
              <EmptyState
                icon={FiPackage}
                title="Tu carrito está vacío"
                description="Explorá nuestro catálogo y agregá los souvenirs que más te gusten"
                variant="cart"
              />
            ) : (
              <ul className="flex flex-col gap-2">
                {cart.map((prod, index) => (
                  <OrderDetail
                    key={index}
                    prod={prod}
                    deleteToCart={() => deleteToCart(index)}
                    onQuantityChange={(nextQuantity) =>
                      updateCartQuantity(index, nextQuantity)
                    }
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-stone-100 bg-white/90 px-5 py-4 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-stone-500">Total del pedido</p>
              <p className="text-base font-bold text-rose-500">${total}</p>
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-full shadow-md shadow-rose-300/30"
              onClick={handleOrderModal}
              disabled={!canCreateOrder}
            >
              Crear orden
            </Button>
            {hasInvalidQuantities && (
              <p className="mt-2 text-center text-[11px] text-rose-500">
                Cada producto debe tener al menos {MIN_QUANTITY_PER_PRODUCT} unidades
              </p>
            )}
          </div>
        </div>
      </Modal>

      {isOpen && (
        <ModalCreateOrder
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          products={productsCart}
          cartItems={cart}
          total={total}
        />
      )}
    </>
  );
}

export default Products;
