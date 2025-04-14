const API_URL = import.meta.env.VITE_API_URL;

export async function EditOrderService(id,order){
    
    try {
    const response = await fetch(`${API_URL}/orders/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(order)
    });
    if (!response.ok) {
        const errorData = await response.json();
          throw new Error(errorData.message)
    }
    const data = response.json();
    return data;
    
} catch (error) {
    console.error('Error en  edit order :', error);    
    throw error
}
}