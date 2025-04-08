import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchAllProducts() {
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    return response.data
  } catch (error) {
    console.error(error);
    throw new Error(error);
    
  }
}