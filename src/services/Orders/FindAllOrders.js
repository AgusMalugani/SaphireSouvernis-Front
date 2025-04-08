const API_URL = import.meta.env.VITE_API_URL;

export async function FindAllOrders(){
    const response = await fetch(`${API_URL}/orders`);
    const data = await response.json();
    return data;
}