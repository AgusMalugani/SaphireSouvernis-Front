import { apiClient } from '../apiClient';
import { unwrapApiData } from '../../utils/api/unwrapApiData';

export async function UpdateProduct(id, updatedProduct) {
  try {
    const response = await apiClient.put(`/products/${id}`, updatedProduct);
    return unwrapApiData(response);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
}
