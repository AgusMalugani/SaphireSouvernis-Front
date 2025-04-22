export function onValidateOrder(form){
    let isError = false;
  let errors={}
  //const nameRegex = /^(?! )[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*(?<! )$/;
  //const addressRegex = /^(?! )[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+)*(?<! )$/;
  //const numCelRegex = /^\d{10,15}$/;
  //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if(form.endOrder===""){
errors.endOrder = "el campo 'FECHA EVENTO' no debe ser vacio"
isError = true;
}


if(form.address===""){
errors.address = "el campo 'DIRECCION' no debe ser vacio"
isError = true;
}
//else if (!addressRegex.test(form.address)) {
 // errors.address = "La dirección no debe tener símbolos ni espacios al inicio o al final";
 // isError = true;/
//}


if(form.theme===""){
errors.theme = "el campo 'TEMA' no debe ser vacio"
isError = true;
}  


if(form.nameClient===""){
errors.nameClient = "el campo 'NOMBRE' no debe ser vacio"
isError = true;
}
//else if (!nameRegex.test(form.nameClient)) {
  //errors.name = "El nombre no debe contener números, símbolos ni espacios al inicio o al final";
  //isError = true;
//}
  


if(form.nameForCard===""){
errors.nameForCard = "el campo 'NOMBRE PARA TARJETA' no debe ser vacio"
isError = true;
} 
//else if (!nameRegex.test(form.nameForCard)) {
 // errors.name = "El nombre para la tarjeta no debe contener números, símbolos ni espacios al inicio o al final";
  //isError = true;/
//}


if(form.numCel===""){
errors.numCel = "el campo 'TELEFONO PRINCIPAL' no debe ser vacio"
isError = true;
}
//else if (!numCelRegex.test(form.numCel)) {
 // errors.numCel = "El número debe tener entre 10 y 15 dígitos, sin letras ni símbolos";
 // isError = true;/
//}


if(form.num2Cel===""){
errors.num2Cel = "el campo 'TELEFONO SECUNDARIO' no debe ser vacio"
isError = true;
} 
//else if (!numCelRegex.test(form.numCel)) {
 // errors.numCel = "El número debe tener entre 10 y 15 dígitos, sin letras ni símbolos";
 // isError = true;/
//}



if(form.products.length < 1){
  errors.products = "el campo de productos no debe ser vacio"
  isError = true;
  }       

  
if(form.email===""){
  errors.email = "el campo 'EMAIL' no debe ser vacio"
  isError = true;
  }
  //else if (!emailRegex.test(form.email)) {
   // errors.email = "El email no es válido";
    //isError = true;
  //}
  

return isError ? errors : null
  
}