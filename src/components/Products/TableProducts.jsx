import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiImage,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';
import { formatProductPrice } from '../../utils/products/formatProductPrice';
import {
  filterInventoryProducts,
  getInventoryEmptyMessage,
} from '../../utils/products/filterInventoryProducts';
import { paginateItems } from '../../utils/products/paginateItems';
import {
  getProductAvailabilityConfig,
  isProductActive,
} from '../../utils/products/productAvailabilityConfig';
import ConfirmProductAvailabilityModal from './ConfirmProductAvailabilityModal';

const SELECT_CLASS =
  'cursor-pointer appearance-none rounded-full border border-stone-200 bg-white py-2 pl-4 pr-9 text-sm text-stone-700 transition-all duration-200 ease-in-out hover:border-rose-200 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function getPrimaryCategoryName(product) {
  const firstCategory = product?.categories?.[0];
  if (!firstCategory) {
    return null;
  }

  return typeof firstCategory === 'string' ? firstCategory : firstCategory.name;
}

function TableProducts({ viewProduct }) {
  const { products, setProductAvailability } = useContext(ProductsContext);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    productId: '',
    productName: '',
    mode: 'disable',
  });
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const filteredProducts = useMemo(
    () =>
      filterInventoryProducts(products, {
        searchQuery: debouncedSearchQuery,
        statusFilter,
      }),
    [products, debouncedSearchQuery, statusFilter],
  );

  const paginatedResult = useMemo(
    () => paginateItems(filteredProducts, { page, limit: pageSize }),
    [filteredProducts, page, pageSize],
  );

  const { data: visibleProducts, meta: paginationMeta } = paginatedResult;

  const resultCountLabel =
    filteredProducts.length === 1
      ? '1 producto encontrado'
      : `${filteredProducts.length} productos encontrados`;

  const rangeStart =
    filteredProducts.length === 0 ? 0 : (paginationMeta.page - 1) * paginationMeta.limit + 1;
  const rangeEnd = Math.min(
    paginationMeta.page * paginationMeta.limit,
    filteredProducts.length,
  );

  const emptyMessage = getInventoryEmptyMessage({
    searchQuery: debouncedSearchQuery,
    statusFilter,
  });

  const handleStatusFilterChange = (changeEvent) => {
    setStatusFilter(changeEvent.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (changeEvent) => {
    setPageSize(Number(changeEvent.target.value));
    setPage(1);
  };

  const handleEditProduct = (productId) => {
    navigate(`/product/edit/${productId}`);
  };

  const openAvailabilityConfirm = (product) => {
    setConfirmState({
      isOpen: true,
      productId: product.id,
      productName: product.name,
      mode: isProductActive(product) ? 'disable' : 'enable',
    });
  };

  const closeAvailabilityConfirm = () => {
    if (isTogglingAvailability) {
      return;
    }

    setConfirmState({
      isOpen: false,
      productId: '',
      productName: '',
      mode: 'disable',
    });
  };

  const handleConfirmAvailability = async () => {
    const nextStock = confirmState.mode === 'enable';
    setIsTogglingAvailability(true);

    try {
      await toast.promise(
        setProductAvailability(confirmState.productId, nextStock),
        {
          pending: nextStock ? 'Habilitando producto...' : 'Inhabilitando producto...',
          success: nextStock ? 'Producto habilitado ✅' : 'Producto inhabilitado ✅',
          error: 'No se pudo actualizar la disponibilidad 😓',
        },
      );
      closeAvailabilityConfirm();
    } catch (error) {
      console.error('Error al cambiar disponibilidad del producto', error);
    } finally {
      setIsTogglingAvailability(false);
      setConfirmState({
        isOpen: false,
        productId: '',
        productName: '',
        mode: 'disable',
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
            Administración
          </span>
          <h2 className="mt-1 font-display text-3xl font-bold text-stone-800 sm:text-4xl">
            Inventario de Productos
          </h2>
          <p className="mt-1 text-sm font-light text-stone-500">{resultCountLabel}</p>
        </div>

        <Link
          to="/product/create"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition hover:scale-105"
        >
          <FiPlus size={16} aria-hidden="true" />
          Cargar producto
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-stone-400">
          <FiFilter size={15} aria-hidden="true" />
          <span className="text-sm font-medium text-stone-500">Filtrar:</span>
        </div>

        <div className="relative min-w-[220px] flex-1">
          <FiSearch
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(inputEvent) => setSearchInput(inputEvent.target.value)}
            placeholder="Buscar por nombre..."
            aria-label="Buscar productos en inventario"
            className="w-full rounded-full border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm text-stone-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className={SELECT_CLASS}
          aria-label="Filtrar por estado de disponibilidad"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="disabled">Inhabilitados</option>
        </select>

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className={SELECT_CLASS}
          aria-label="Cantidad de productos por página"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              Mostrar {option}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-sm backdrop-blur-sm">
        {!products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <p className="font-display text-3xl text-stone-300">Sin productos</p>
            <p className="text-sm font-light text-stone-500">{emptyMessage}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <p className="font-display text-3xl text-stone-300">Sin resultados</p>
            <p className="text-sm font-light text-stone-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm">
                <tr className="border-b border-stone-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => {
                  const availabilityConfig = getProductAvailabilityConfig(product);
                  const categoryName = getPrimaryCategoryName(product);
                  const displayImageUrl = product.img_url
                    ? toCloudinaryDisplayUrl(product.img_url)
                    : null;
                  const isActiveProduct = isProductActive(product);

                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-stone-100 transition-colors duration-200 hover:bg-rose-50/40 ${
                        isActiveProduct ? '' : 'bg-stone-50/70 opacity-75'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {displayImageUrl ? (
                            <img
                              src={displayImageUrl}
                              alt={product.name ?? 'Producto'}
                              className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-stone-100"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-300 ring-1 ring-stone-100">
                              <FiImage size={16} aria-hidden="true" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-stone-800">
                              {product.name}
                            </p>
                            {categoryName && (
                              <span className="mt-1 inline-flex rounded-full border border-stone-100 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-600">
                                {categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-stone-800">
                        {formatProductPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${availabilityConfig.className}`}
                        >
                          {availabilityConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white/80 p-1">
                            <button
                              type="button"
                              onClick={() => viewProduct(product.id)}
                              aria-label={`Ver detalle de ${product.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                            >
                              <FiEye size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditProduct(product.id)}
                              aria-label={`Editar ${product.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-rose-50 hover:text-rose-500"
                            >
                              <FiEdit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openAvailabilityConfirm(product)}
                              aria-label={
                                isActiveProduct
                                  ? `Inhabilitar ${product.name}`
                                  : `Habilitar ${product.name}`
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition hover:bg-amber-50 hover:text-amber-600"
                            >
                              {isActiveProduct ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-stone-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">
              Mostrando {rangeStart}–{rangeEnd} de {filteredProducts.length}
            </p>

            {paginationMeta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={paginationMeta.page <= 1}
                  onClick={() => setPage(paginationMeta.page - 1)}
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="text-sm text-stone-500">
                  Página {paginationMeta.page} de {paginationMeta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={paginationMeta.page >= paginationMeta.totalPages}
                  onClick={() => setPage(paginationMeta.page + 1)}
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmProductAvailabilityModal
        isOpen={confirmState.isOpen}
        productName={confirmState.productName}
        mode={confirmState.mode}
        onConfirm={handleConfirmAvailability}
        onCancel={closeAvailabilityConfirm}
        isSubmitting={isTogglingAvailability}
      />
    </div>
  );
}

export default TableProducts;
