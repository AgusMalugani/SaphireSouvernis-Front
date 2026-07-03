import { apiClient } from '../apiClient';
import { unwrapApiData } from '../../utils/api/unwrapApiData';

export async function fetchAllProducts() {
  try {
    const response = await apiClient.get('/products');
    return unwrapApiData(response);
  } catch (error) {
    console.error('Error en products:', error);
    throw error;
  }
}
