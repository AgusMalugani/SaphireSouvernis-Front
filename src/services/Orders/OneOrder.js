const API_URL = import.meta.env.VITE_API_URL;
export async function OneOrder(id){
    try{
        const response = await fetch(`${API_URL}/orders/${id}`);
        if (!response.ok) {
            const errorData = await response.json();
              throw new Error(errorData.message)
        }
        const data = await response.json()
        return data;
    
    }catch(error){
        console.error('Error en order id:', error);
        throw error
    }
}