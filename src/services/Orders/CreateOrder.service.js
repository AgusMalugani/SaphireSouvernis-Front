
//const API_URL="https://saphiresouvenirs-back.onrender.com"
const API_URL="http://localhost:3000"

export async function fetchCreateOrder(newOrder){
const response = await fetch(`${API_URL}/orders`,{
    method:"POST",
    headers:{"Content-Type" : "application/json"},
    body:JSON.stringify(newOrder)
})
return response.json();
}