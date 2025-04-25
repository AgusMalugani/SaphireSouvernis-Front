export function onValidateProduct(form){
    let isError = false;
  let errors={}


if(form.name===""){
errors.name = "el campo 'NOMBRE' no debe ser vacio"
isError = true;
}



if(form.details===""){
errors.details = "el campo 'DETALLE' no debe ser vacio"
isError = true;
}

if(form.price <= 0){
errors.price = "el campo 'PRECIO' no debe ser 0 ni negativo"
isError = true;
}  

if(form.categories?.length===0){
    errors.categories = "el campo 'CATEGORIAS' no debe ser vacio"
    isError = true;
    } 
  

return isError ? errors : null
  
}