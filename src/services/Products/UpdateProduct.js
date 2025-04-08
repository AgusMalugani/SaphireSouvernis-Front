const API_URL = import.meta.env.VITE_API_URL;
export async function UpdateProduct(id,updateProduct){
   const response = await fetch(`${API_URL}/products/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(updateProduct)
    })
    const data = await response.json();
    return data;
}