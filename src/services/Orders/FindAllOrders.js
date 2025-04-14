const API_URL = import.meta.env.VITE_API_URL;

export async function FindAllOrders(){
    try{
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
        const errorData = await response.json();
          throw new Error(errorData.message)
    }
    const data = await response.json();
    return data;

}catch(error){
    console.error('Error en updateProduct:', error);
    throw error
}
}