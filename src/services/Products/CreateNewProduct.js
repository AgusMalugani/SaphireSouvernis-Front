const API_URL = import.meta.env.VITE_API_URL;

export async function CreateNewProduct(formdata, token) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`
            },
            body: formdata
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al crear producto');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en createProduct:', error);
        throw error;
    }
}