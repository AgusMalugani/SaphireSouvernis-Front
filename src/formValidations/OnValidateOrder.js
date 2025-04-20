export function onValidateOrder(form){
    let isError = false;
  let errors={}

if(form.endOrder===""){
errors.endOrder = "el campo 'NOMBRE' no debe ser vacio"
isError = true;
}

if(form.address===""){
errors.address = "el campo 'DIRECCION' no debe ser vacio"
isError = true;
}
if(form.theme===""){
errors.theme = "el campo 'TEMA' no debe ser vacio"
isError = true;
}  
if(form.nameClient===""){
errors.nameClient = "el campo 'NOMBRE' no debe ser vacio"
isError = true;
}  
if(form.nameForCard===""){
errors.nameForCard = "el campo 'NOMBRE PARA TARJETA' no debe ser vacio"
isError = true;
}  
if(form.numCel===""){
errors.numCel = "el campo 'TELEFONO PRINCIPAL' no debe ser vacio"
isError = true;
}
if(form.num2Cel===""){
errors.num2Cel = "el campo 'TELEFONO SECUNDARIO' no debe ser vacio"
isError = true;
} 
if(form.products.length < 1){
  errors.products = "el campo de productos no debe ser vacio"
  isError = true;
  }       
  
if(form.email===""){
  errors.email = "el campo 'EMAIL' no debe ser vacio"
  isError = true;
  }
  
  

return isError ? errors : null
  
}