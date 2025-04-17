const API_URL = import.meta.env.VITE_API_URL;
export async function ImageProduct(id,file,token){
    const formData = new FormData();
  formData.append("file", file); // Solo enviamos la imagen
    
  const response =  await fetch(`${API_URL}/products/upload/${id}`,{
        method:"POST",
        headers:{"authorization":`Bearer ${token}`},
          body:formData
    })
    if (!response.ok) {
      const errorData = await response.json();
        throw new Error(errorData)
  }
    const data = await response.json()
    return data;
}