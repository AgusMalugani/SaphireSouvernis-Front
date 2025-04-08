const API_URL = import.meta.env.VITE_API_URL;
export async function OneOrder(id){
    const response = await fetch(`${API_URL}/orders/${id}`);
    const data = await response.json()
    return data;
}