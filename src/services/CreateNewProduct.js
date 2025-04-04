/*export async function CreateNewProduct(product){
    const response = await fetch("http://localhost:3000/products",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(product)
    });
    const data = await response.json();
    return data
}*/

export async function CreateNewProduct(formdata){
    const response = await fetch("http://localhost:3000/products",{
        method:"POST",
        body:formdata
    });
    const data = await response.json();
    return data
}