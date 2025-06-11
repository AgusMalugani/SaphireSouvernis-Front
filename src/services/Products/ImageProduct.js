const API_URL = import.meta.env.VITE_API_URL;

export async function ImageProduct(id, file, token) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch(`${API_URL}/products/upload/${id}`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al subir imagen');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en imageProduct:', error);
        throw error;
    }
}