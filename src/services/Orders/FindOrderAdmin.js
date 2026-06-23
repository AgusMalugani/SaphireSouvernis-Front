import { apiClient } from '../apiClient';

export async function FindOrderAdmin(orderId) {
  try {
    return await apiClient.get(`/orders/${orderId}/admin`);
  } catch (error) {
    console.error('Error en findOrderAdmin:', error);
    throw error;
  }
}
