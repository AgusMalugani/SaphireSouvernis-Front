import { apiClient } from '../apiClient';

export async function UpdateProduct(id, updatedProduct) {
  try {
    return await apiClient.put(`/products/${id}`, updatedProduct);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
}
