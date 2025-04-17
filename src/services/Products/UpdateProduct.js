const API_URL = import.meta.env.VITE_API_URL;
export async function UpdateProduct(id,updateProduct,token){

try {
    const response = await fetch(`${API_URL}/products/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "authorization":`Bearer ${token}`},
        body:JSON.stringify(updateProduct)
    })
    if (!response.ok) {
        const errorData = await response.json();
          throw new Error(errorData.message)
    }
    const data = await response.json();
    return data; 
} catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
}

   
}