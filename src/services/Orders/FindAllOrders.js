import { apiClient } from '../apiClient';

/**
 * @param {Record<string, string | number | undefined>} filters
 * @returns {Promise<unknown>}
 */
export async function FindAllOrders(filters = {}) {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([filterKey, filterValue]) => {
      if (filterValue !== '' && filterValue != null) {
        queryParams.append(filterKey, String(filterValue));
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';

    return await apiClient.get(endpoint);
  } catch (error) {
    console.error('Error en findAllOrders:', error);
    throw error;
  }
}
