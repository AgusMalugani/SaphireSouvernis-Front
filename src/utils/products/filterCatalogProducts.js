/**
 * Normaliza texto para búsqueda: trim, minúsculas, sin acentos.
 * @param {string} text
 * @returns {string}
 */
export function normalizeSearchText(text) {
  if (text == null || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

/**
 * @param {{ name?: string }} product
 * @param {string} searchQuery
 * @returns {boolean}
 */
export function productMatchesName(product, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery);
  if (!normalizedQuery) {
    return true;
  }

  if (!product?.name) {
    return false;
  }

  return normalizeSearchText(product.name).includes(normalizedQuery);
}

/**
 * @param {{ categories?: Array<{ name: string }> }} product
 * @param {string} categoryName
 * @returns {boolean}
 */
export function productMatchesCategory(product, categoryName) {
  if (!categoryName || categoryName === 'TODOS') {
    return true;
  }

  if (!Array.isArray(product?.categories)) {
    return false;
  }

  return product.categories.some((category) => category.name === categoryName);
}

/**
 * @param {Array<object>} products
 * @param {{ category?: string, searchQuery?: string }} filters
 * @returns {Array<object>}
 */
export function filterCatalogProducts(
  products,
  { category = 'TODOS', searchQuery = '' } = {},
) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.filter(
    (product) =>
      productMatchesCategory(product, category) &&
      productMatchesName(product, searchQuery),
  );
}

/**
 * @param {{ category?: string, searchQuery?: string }} filters
 * @returns {string}
 */
export function getCatalogEmptyMessage({ category = 'TODOS', searchQuery = '' } = {}) {
  const trimmedQuery = searchQuery.trim();
  const hasSearch = trimmedQuery.length > 0;
  const hasCategoryFilter = category && category !== 'TODOS';

  if (hasSearch && hasCategoryFilter) {
    return `Ningún producto en ${category} coincide con «${trimmedQuery}».`;
  }

  if (hasSearch) {
    return `Ningún producto coincide con «${trimmedQuery}».`;
  }

  return 'No hay productos en esta categoría todavía.';
}
