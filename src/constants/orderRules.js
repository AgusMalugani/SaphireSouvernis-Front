export const MIN_QUANTITY_PER_PRODUCT = 10;

export const MIN_QUANTITY_MESSAGE =
  'La cantidad mínima por producto es de 10 unidades';

export function getMinQuantityShortfallMessage(productName, currentQuantity) {
  const missing = MIN_QUANTITY_PER_PRODUCT - currentQuantity;
  return `Necesitás al menos ${MIN_QUANTITY_PER_PRODUCT} unidades de ${productName}. Actualmente tenés ${currentQuantity}, agregá ${missing} más.`;
}
