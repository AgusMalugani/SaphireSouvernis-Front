import axios from 'axios';
const API_URL= "https://saphiresouvenirs-back.onrender.com/products";

export async function fetchAllProducts() {
  try {
    const response = await axios.get(API_URL);
    return response.data
  } catch (error) {
    console.error(error);
  }
}