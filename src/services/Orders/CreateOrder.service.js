
const API_URL = import.meta.env.VITE_API_URL;


export async function fetchCreateOrder(newOrder){
    try{
    const response = await fetch(`${API_URL}/orders`,{
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify(newOrder)
    })
    if (!response.ok) {
        const errorData = await response.json();
          throw new Error(errorData.message)
    }
    const data = await response.json();
    return data

}catch(error){
    console.error('Error en newOrder:', error);
    throw error
}
}