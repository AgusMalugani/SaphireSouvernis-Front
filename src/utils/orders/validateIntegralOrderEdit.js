import { onValidateOrder } from '../../formValidations/OnValidateOrder';
import { validateDepositAmount } from './validateDepositAmount';
import { estimateIntegralEditTotal } from './orderIntegralEdit';

/**
 * @param {object} editForm
 * @param {Array<{ id: string, price: number }>} catalogProducts
 * @returns {{ valid: boolean, errors?: Record<string, string> }}
 */
export function validateIntegralOrderEdit(editForm, catalogProducts = []) {
  const orderValidationErrors = onValidateOrder({
    ...editForm,
    products: editForm.products?.map((lineItem) => ({
      productId: lineItem.productId,
      cuantity: lineItem.cuantity,
    })),
  });

  const fieldErrors = orderValidationErrors ? { ...orderValidationErrors } : {};

  const productLines = editForm.products ?? [];

  if (productLines.length < 1) {
    fieldErrors.products = 'Debés mantener al menos un producto en el pedido.';
  }

  productLines.forEach((lineItem, lineIndex) => {
    const quantity = Number(lineItem.cuantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      fieldErrors[`products.${lineIndex}`] = 'La cantidad debe ser un entero mayor a 0.';
    }
  });

  const estimatedTotal = estimateIntegralEditTotal(productLines, catalogProducts);
  const depositValidation = validateDepositAmount(
    editForm.depositAmount,
    estimatedTotal || editForm.totalPrice,
  );

  if (!depositValidation.valid) {
    fieldErrors.depositAmount = depositValidation.message;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, errors: fieldErrors };
  }

  return { valid: true };
}
