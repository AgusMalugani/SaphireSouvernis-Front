/**
 * @param {Record<string, unknown>} product
 * @returns {{ name: string, price: number, details: string, categories: string[], stock?: boolean }}
 */
export function buildProductMetadataPayload(product) {
  const categories = (product.categories ?? []).map((category) =>
    typeof category === 'string' ? category : category.name,
  );

  const payload = {
    name: product.name,
    price: Number(product.price),
    details: product.details,
    categories,
  };

  if (product.stock !== undefined && product.stock !== null) {
    payload.stock = Boolean(product.stock);
  }

  return payload;
}
