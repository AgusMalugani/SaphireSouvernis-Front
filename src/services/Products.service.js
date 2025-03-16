import axios from 'axios';
//const API_URL= "https://saphiresouvenirs-back.onrender.com/products";
const API_URL="http://localhost:3000"

export async function fetchAllProducts() {
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    return response.data
  } catch (error) {
    console.error(error);
  }
}