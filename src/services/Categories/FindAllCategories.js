const API_URL = import.meta.env.VITE_API_URL;

export async function FindAllCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener categorías');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en allCategories:', error);
        throw error;
    }
}