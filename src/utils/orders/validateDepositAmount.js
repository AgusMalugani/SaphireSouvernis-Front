/**
 * @param {number | string} depositAmountInput
 * @param {number | null | undefined} totalPrice
 * @returns {{ valid: boolean, message?: string, value?: number }}
 */
export function validateDepositAmount(depositAmountInput, totalPrice) {
  const normalizedInput = String(depositAmountInput ?? '').trim();

  if (normalizedInput === '') {
    return { valid: false, message: 'Ingresá el monto de la seña.' };
  }

  const depositAmount = Number(normalizedInput);

  if (!Number.isFinite(depositAmount) || !Number.isInteger(depositAmount)) {
    return { valid: false, message: 'El monto debe ser un número entero.' };
  }

  if (depositAmount < 0) {
    return { valid: false, message: 'El monto no puede ser negativo.' };
  }

  const orderTotal = Number(totalPrice ?? 0);

  if (Number.isFinite(orderTotal) && depositAmount > orderTotal) {
    return { valid: false, message: 'La seña no puede superar el total del pedido.' };
  }

  return { valid: true, value: depositAmount };
}
