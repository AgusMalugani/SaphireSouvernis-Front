const API_URL = import.meta.env.VITE_API_URL;

export async function OneProductById(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener el producto');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en product id:', error);
        throw error;
    }
}