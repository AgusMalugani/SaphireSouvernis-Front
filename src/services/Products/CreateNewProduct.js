import { apiClient } from '../apiClient';
import { unwrapApiData } from '../../utils/api/unwrapApiData';

export async function CreateNewProduct(formData) {
  try {
    const response = await apiClient.postFormData('/products', formData);
    return unwrapApiData(response);
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
}
