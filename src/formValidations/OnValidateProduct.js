export function onValidateProduct(form){
    let isError = false;
  let errors={}
  const nameRegex = /^(?! )[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*(?<! )$/;


if(form.name===""){
errors.name = "el campo 'NOMBRE' no debe ser vacio"
isError = true;
}else if (!nameRegex.test(form.name)) {
  errors.name = "El nombre no debe contener números, símbolos ni espacios al inicio o al final";
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