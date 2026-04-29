const nameRegex    = /^(?! )[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*(?<! )$/;
const numCelRegex  = /^\d{7,15}$/;
const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function onValidateOrder(form) {
  let isError = false;
  let errors = {};

  // ── Nombre del cliente ──────────────────────────────────────────
  if (form.nameClient === '') {
    errors.nameClient = "El campo 'NOMBRE' no puede estar vacío.";
    isError = true;
  } else if (!nameRegex.test(form.nameClient)) {
    errors.nameClient = 'El nombre no debe contener números ni símbolos.';
    isError = true;
  }

  // ── Nombre para tarjeta ─────────────────────────────────────────
  if (form.nameForCard === '') {
    errors.nameForCard = "El campo 'NOMBRE PARA TARJETA' no puede estar vacío.";
    isError = true;
  } else if (!nameRegex.test(form.nameForCard)) {
    errors.nameForCard = 'El nombre para la tarjeta no debe contener números ni símbolos.';
    isError = true;
  }

  // ── Email ───────────────────────────────────────────────────────
  if (form.email === '') {
    errors.email = "El campo 'EMAIL' no puede estar vacío.";
    isError = true;
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'El email no tiene un formato válido.';
    isError = true;
  }

  // ── Teléfono principal ──────────────────────────────────────────
  if (form.numCel === '') {
    errors.numCel = "El campo 'TELÉFONO PRINCIPAL' no puede estar vacío.";
    isError = true;
  } else if (!numCelRegex.test(form.numCel)) {
    errors.numCel = 'El teléfono debe tener entre 7 y 15 dígitos, sin letras ni símbolos.';
    isError = true;
  }

  // ── Teléfono secundario ─────────────────────────────────────────
  if (form.num2Cel === '') {
    errors.num2Cel = "El campo 'TELÉFONO SECUNDARIO' no puede estar vacío.";
    isError = true;
  } else if (!numCelRegex.test(form.num2Cel)) {
    errors.num2Cel = 'El teléfono debe tener entre 7 y 15 dígitos, sin letras ni símbolos.';
    isError = true;
  }

  // ── Forma de entrega ────────────────────────────────────────────
  if (!form.transactionType || form.transactionType === '') {
    errors.transactionType = "Seleccioná una forma de entrega.";
    isError = true;
  }

  // ── Dirección ───────────────────────────────────────────────────
  if (form.address === '') {
    errors.address = "El campo 'DIRECCIÓN' no puede estar vacío.";
    isError = true;
  }

  // ── Tema ────────────────────────────────────────────────────────
  if (form.theme === '') {
    errors.theme = "El campo 'TEMA' no puede estar vacío.";
    isError = true;
  }

  // ── Fecha del evento ────────────────────────────────────────────
  if (form.endOrder === '') {
    errors.endOrder = "El campo 'FECHA EVENTO' no puede estar vacío.";
    isError = true;
  }

  // ── Productos ───────────────────────────────────────────────────
  if (form.products.length < 1) {
    errors.products = 'Debés agregar al menos un producto al carrito.';
    isError = true;
  }

  return isError ? errors : null;
}
