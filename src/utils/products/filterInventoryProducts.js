import { productMatchesName } from './filterCatalogProducts.js';
import { isProductActive } from './productAvailabilityConfig.js';

/**
 * @param {{ stock?: boolean }} product
 * @param {'all' | 'active' | 'disabled'} statusFilter
 * @returns {boolean}
 */
export function productMatchesStatusFilter(product, statusFilter) {
  if (statusFilter === 'active') {
    return isProductActive(product);
  }

  if (statusFilter === 'disabled') {
    return product?.stock === false;
  }

  return true;
}

/**
 * @param {Array<object>} products
 * @param {{ searchQuery?: string, statusFilter?: 'all' | 'active' | 'disabled' }} filters
 * @returns {Array<object>}
 */
export function filterInventoryProducts(
  products,
  { searchQuery = '', statusFilter = 'all' } = {},
) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.filter(
    (product) =>
      productMatchesStatusFilter(product, statusFilter) &&
      productMatchesName(product, searchQuery),
  );
}

/**
 * @param {{ searchQuery?: string, statusFilter?: string }} filters
 * @returns {string}
 */
export function getInventoryEmptyMessage({
  searchQuery = '',
  statusFilter = 'all',
} = {}) {
  const trimmedQuery = searchQuery.trim();
  const hasSearch = trimmedQuery.length > 0;
  const hasStatusFilter = statusFilter && statusFilter !== 'all';

  if (hasSearch && hasStatusFilter) {
    const statusLabel =
      statusFilter === 'active' ? 'activos' : 'inhabilitados';
    return `Ningún producto ${statusLabel} coincide con «${trimmedQuery}».`;
  }

  if (hasSearch) {
    return `Ningún producto coincide con «${trimmedQuery}».`;
  }

  if (statusFilter === 'active') {
    return 'No hay productos activos en el catálogo.';
  }

  if (statusFilter === 'disabled') {
    return 'No hay productos inhabilitados.';
  }

  return 'El catálogo está vacío todavía.';
}
