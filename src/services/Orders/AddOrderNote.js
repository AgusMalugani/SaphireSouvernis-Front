import { apiClient } from '../apiClient';

export async function AddOrderNote(orderId, note) {
  try {
    return await apiClient.post(`/orders/${orderId}/notes`, { note });
  } catch (error) {
    console.error('Error en addOrderNote:', error);
    throw error;
  }
}
