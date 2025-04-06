export async function EditOrderService(id,order){
    const response = await fetch(`http://localhost:3000/orders/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(order)
    });
    const data = response.json();
    return data;
}