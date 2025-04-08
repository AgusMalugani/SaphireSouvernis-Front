const API_URL = import.meta.env.VITE_API_URL;
export async function ImageProduct(id,file){
    const formData = new FormData();
  formData.append("file", file); // Solo enviamos la imagen
    
  const response =  await fetch(`${API_URL}/products/upload/${id}`,{
        method:"POST",
          body:formData
    })
    const data = await response.json()
    return data;
}