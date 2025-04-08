const API_URL = import.meta.env.VITE_API_URL;

export async function FindAllCategories(){
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data;
}