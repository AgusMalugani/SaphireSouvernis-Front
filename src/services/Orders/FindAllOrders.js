import { apiClient } from '../apiClient';

export async function FindAllOrders() {
  try {
    return await apiClient.get('/orders');
  } catch (error) {
    console.error('Error en findAllOrders:', error);
    throw error;
  }
}
