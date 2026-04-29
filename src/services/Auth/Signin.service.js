import { apiClient } from '../apiClient';

export async function Signin(login) {
  try {
const loginResponse = await apiClient.post('/auth/signin', login);     
console.log("loginResponse",loginResponse);

    return  loginResponse;
  } catch (error) {
    console.error('Error en signin:', error);
    throw error;
  }
}
