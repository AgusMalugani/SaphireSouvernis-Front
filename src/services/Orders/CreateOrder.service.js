import { apiClient } from '../apiClient';

export async function fetchCreateOrder(newOrder) {
  try {
    return await apiClient.post('/orders', newOrder);
  } catch (error) {
    console.error('Error en newOrder:', error);
    throw error;
  }
}
