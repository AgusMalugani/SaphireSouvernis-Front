import { apiClient } from '../apiClient';

export async function Signin(login) {
  try {
    return await apiClient.post('/auth/signin', login);
  } catch (error) {
    console.error('Error en signin:', error);
    throw error;
  }
}
