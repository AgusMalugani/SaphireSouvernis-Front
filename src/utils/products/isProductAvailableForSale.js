/**
 * @param {{ stock?: boolean } | null | undefined} product
 * @returns {boolean}
 */
export function isProductAvailableForSale(product) {
  return product?.stock !== false;
}
