import { apiClient } from '../apiClient';

export async function ImageProduct(id, file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.postFormData(`/products/upload/${id}`, formData);
  } catch (error) {
    console.error('Error en imageProduct:', error);
    throw error;
  }
}
