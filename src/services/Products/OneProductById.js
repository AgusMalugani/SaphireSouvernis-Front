const API_URL = import.meta.env.VITE_API_URL;
export async function OneProductById(id){
  const response= await fetch(`${API_URL}/products/${id}`)
  const data = await response.json();
  return data

}