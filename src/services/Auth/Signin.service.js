const API_URL = import.meta.env.VITE_API_URL;

export async function Signin(login) {
    try {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(login)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el login');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en signin:', error);
        throw error;
    }
}