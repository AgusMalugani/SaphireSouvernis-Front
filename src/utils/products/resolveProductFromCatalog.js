/**
 * Busca un producto en el catálogo de sesión (array products del contexto).
 * @param {Array<{ id: string | number }>} catalogProducts
 * @param {string | number | null | undefined} productId
 * @returns {object | null}
 */
export function resolveProductFromCatalog(catalogProducts, productId) {
  if (!Array.isArray(catalogProducts) || productId == null || productId === '') {
    return null;
  }

  const normalizedProductId = String(productId);
  return (
    catalogProducts.find(
      (catalogProduct) => String(catalogProduct.id) === normalizedProductId,
    ) ?? null
  );
}

/**
 * Normaliza categories del producto para el formulario de edición (array de strings).
 * @param {object} rawProduct
 * @returns {object}
 */
export function normalizeProductForEdit(rawProduct) {
  return {
    ...rawProduct,
    categories:
      rawProduct.categories?.map((category) =>
        typeof category === 'string' ? category : category.name,
      ) ?? [],
  };
}
