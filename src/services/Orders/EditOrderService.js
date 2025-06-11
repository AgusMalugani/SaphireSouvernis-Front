const API_URL = import.meta.env.VITE_API_URL;

export async function EditOrderService(id, order, token) {
    try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(order)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al editar orden');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en edit order:', error);
        throw error;
    }
}