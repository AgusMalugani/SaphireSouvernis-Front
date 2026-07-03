import { apiClient } from '../apiClient';
import { unwrapApiData } from '../../utils/api/unwrapApiData';

export async function OneProductById(id) {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return unwrapApiData(response);
  } catch (error) {
    console.error('Error en product id:', error);
    throw error;
  }
}
