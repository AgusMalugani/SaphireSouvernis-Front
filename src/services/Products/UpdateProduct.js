export async function UpdateProduct(id,updateProduct){
   const response = await fetch(`http://localhost:3000/products/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(updateProduct)
    })
    const data = await response.json();
    return data;
}