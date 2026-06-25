import { ORDER_STATE_VALUES } from './orderStatusConfig.js';

export const ORDER_INTEGRAL_EDIT_FIELD_LABELS = {
  nameClient: 'Nombre',
  personalizationName: 'Nombre diseño',
  email: 'Email',
  numCel: 'Teléfono',
  num2Cel: 'Teléfono secundario',
  theme: 'Tema',
  address: 'Dirección',
  endOrder: 'Fecha evento',
  transactionType: 'Entrega',
  totalPrice: 'Total',
  depositAmount: 'Seña',
};

/**
 * @param {object | null | undefined} order
 * @returns {boolean}
 */
export function canEditOrderIntegral(order) {
  if (!order) {
    return false;
  }

  return order.state !== ORDER_STATE_VALUES.CANCELLED;
}

/**
 * @param {object} order
 * @returns {object}
 */
export function mapOrderToIntegralEditForm(order) {
  const orderDetails = Array.isArray(order?.orderDetails) ? order.orderDetails : [];

  return {
    nameClient: order?.nameClient ?? '',
    personalizationName: order?.personalizationName ?? '',
    email: order?.email ?? '',
    numCel: order?.numCel ?? '',
    num2Cel: order?.num2Cel ?? '',
    theme: order?.theme ?? '',
    endOrder: order?.endOrder ?? '',
    address: order?.address ?? '',
    transactionType: order?.transactionType ?? '',
    depositAmount: String(order?.depositAmount ?? 0),
    products: orderDetails
      .map((orderDetail) => ({
        productId: orderDetail?.product?.id ?? orderDetail?.productId,
        cuantity: Number(orderDetail?.cuantity ?? 1),
        productName: orderDetail?.product?.name ?? 'Producto',
        unitPrice: Number(orderDetail?.product?.price ?? 0),
      }))
      .filter((lineItem) => lineItem.productId),
  };
}

/**
 * @param {Array<{ productId: string, cuantity: number, unitPrice?: number }>} productLines
 * @param {Array<{ id: string, price: number }>} catalogProducts
 * @returns {number}
 */
export function estimateIntegralEditTotal(productLines, catalogProducts) {
  const priceByProductId = new Map(
    (catalogProducts ?? []).map((catalogProduct) => [
      catalogProduct.id,
      Number(catalogProduct.price ?? 0),
    ]),
  );

  return productLines.reduce((accumulatedTotal, lineItem) => {
    const unitPrice =
      lineItem.unitPrice ?? priceByProductId.get(lineItem.productId) ?? 0;
    const quantity = Number(lineItem.cuantity ?? 0);
    return accumulatedTotal + unitPrice * quantity;
  }, 0);
}

/**
 * @param {object} editForm
 * @param {object} originalOrder
 * @returns {object}
 */
export function buildIntegralEditPayload(editForm, originalOrder) {
  const payload = {
    nameClient: editForm.nameClient,
    personalizationName: editForm.personalizationName,
    email: editForm.email,
    numCel: editForm.numCel,
    num2Cel: editForm.num2Cel,
    theme: editForm.theme,
    endOrder: editForm.endOrder,
    address: editForm.address,
    transactionType: editForm.transactionType,
    products: editForm.products.map((lineItem) => ({
      productId: lineItem.productId,
      cuantity: Number(lineItem.cuantity),
    })),
  };

  const nextDepositAmount = Number(editForm.depositAmount ?? 0);
  const previousDepositAmount = Number(originalOrder?.depositAmount ?? 0);

  if (nextDepositAmount !== previousDepositAmount) {
    payload.depositAmount = nextDepositAmount;
  }

  return payload;
}
