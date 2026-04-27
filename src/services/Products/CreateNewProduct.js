import { apiClient } from '../apiClient';

export async function CreateNewProduct(formData) {
  try {
    return await apiClient.postFormData('/products', formData);
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
}
