import { apiClient } from '../apiClient';

export async function OneProductById(id) {
  try {
    return await apiClient.get(`/products/${id}`);
  } catch (error) {
    console.error('Error en product id:', error);
    throw error;
  }
}
