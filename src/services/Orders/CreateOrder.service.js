
const API_URL = import.meta.env.VITE_API_URL;


export async function fetchCreateOrder(newOrder){
const response = await fetch(`${API_URL}/orders`,{
    method:"POST",
    headers:{"Content-Type" : "application/json"},
    body:JSON.stringify(newOrder)
})
return response.json();
}