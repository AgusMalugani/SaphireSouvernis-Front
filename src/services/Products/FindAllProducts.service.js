import { apiClient } from '../apiClient';

export async function fetchAllProducts() {
  try {
    return await apiClient.get('/products');
  } catch (error) {
    console.error('Error en products:', error);
    throw error;
  }
}
