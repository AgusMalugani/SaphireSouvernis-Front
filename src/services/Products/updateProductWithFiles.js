import { apiClient } from '../apiClient';
import { unwrapApiData } from '../../utils/api/unwrapApiData';

export async function updateProductWithFiles(productId, formData) {
  try {
    const response = await apiClient.putFormData(`/products/${productId}`, formData);
    return unwrapApiData(response);
  } catch (error) {
    console.error('Error en updateProductWithFiles:', error);
    throw error;
  }
}
