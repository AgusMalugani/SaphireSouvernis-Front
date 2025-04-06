export async function OneOrder(id){
    const response = await fetch(`http://localhost:3000/orders/${id}`);
    const data = await response.json()
    return data;
}