import { apiClient } from '../apiClient';

export async function EditOrderService(id, order) {
  try {
    return await apiClient.put(`/orders/${id}`, order);
  } catch (error) {
    console.error('Error en edit order:', error);
    throw error;
  }
}
