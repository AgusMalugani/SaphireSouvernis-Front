import { apiClient } from '../apiClient';

export async function OneOrder(id) {
  try {
    return await apiClient.get(`/orders/${id}`);
  } catch (error) {
    console.error('Error en order id:', error);
    throw error;
  }
}
