const API_URL = import.meta.env.VITE_API_URL;

export async function DeleteProduct(id, token) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar producto');
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        throw error;
    }
}