const API_URL = import.meta.env.VITE_API_URL;

export async function CreateNewProduct(formdata){
    const response = await fetch(`${API_URL}/products`,{
        method:"POST",
        body:formdata
    });
    const data = await response.json();
    return data
}