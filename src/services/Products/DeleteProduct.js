import { apiClient } from '../apiClient';

export async function DeleteProduct(id) {
  try {
    await apiClient.delete(`/products/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    throw error;
  }
}
