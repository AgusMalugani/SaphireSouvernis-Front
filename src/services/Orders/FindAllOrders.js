const API_URL = import.meta.env.VITE_API_URL;

export async function FindAllOrders(token) {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener órdenes');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en findAllOrders:', error);
        throw error;
    }
}