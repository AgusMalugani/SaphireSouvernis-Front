export async function FindAllOrders(){
    const response = await fetch("http://localhost:3000/orders");
    const data = await response.json();
    return data;
}