export async function OneProductById(id){

  const response= await fetch(`http://localhost:3000/products/${id}`)

  const data = await response.json();
  return data

}