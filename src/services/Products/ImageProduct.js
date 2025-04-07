export async function ImageProduct(id,file){
    const formData = new FormData();
  formData.append("file", file); // Solo enviamos la imagen
    
  const response =  await fetch(`http://localhost:3000/products/upload/${id}`,{
        method:"POST",
          body:formData
    })
    const data = await response.json()
    return data;
}