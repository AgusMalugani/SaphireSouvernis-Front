import { UpdateProduct } from './UpdateProduct';

/**
 * @param {string} productId
 * @param {boolean} isAvailable
 * @returns {Promise<unknown>}
 */
export async function setProductAvailability(productId, isAvailable) {
  return UpdateProduct(productId, { stock: isAvailable });
}
