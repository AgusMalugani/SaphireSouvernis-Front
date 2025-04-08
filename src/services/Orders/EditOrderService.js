const API_URL = import.meta.env.VITE_API_URL;

export async function EditOrderService(id,order){
    const response = await fetch(`${API_URL}/orders/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(order)
    });
    const data = response.json();
    return data;
}