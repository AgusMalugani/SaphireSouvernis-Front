import { apiClient } from '../apiClient';

export async function FindAllCategories() {
  try {
    return await apiClient.get('/categories');
  } catch (error) {
    console.error('Error en allCategories:', error);
    throw error;
  }
}
