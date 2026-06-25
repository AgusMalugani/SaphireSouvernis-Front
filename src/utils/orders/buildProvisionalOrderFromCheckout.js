/**
 * Arma un pedido provisional desde location.state tras el checkout,
 * para mostrar resumen y WhatsApp antes de que responda GET /orders/:id.
 *
 * @param {{ orderId: string, checkoutState?: { orderForm?: object, cartItems?: Array<object>, total?: number } | null }} params
 * @returns {object | null}
 */
export function buildProvisionalOrderFromCheckout({ orderId, checkoutState }) {
  if (!orderId || !checkoutState || typeof checkoutState !== 'object') {
    return null;
  }

  const { orderForm, cartItems = [], total } = checkoutState;
  if (!orderForm || typeof orderForm !== 'object') {
    return null;
  }

  const orderDetails = Array.isArray(cartItems)
    ? cartItems.map((cartItem) => ({
        product: {
          name: cartItem.name,
          price: cartItem.price,
          img_url: cartItem.img_url,
        },
        cuantity: cartItem.cuantity ?? cartItem.quantity ?? 1,
      }))
    : [];

  return {
    id: orderId,
    nameClient: orderForm.nameClient ?? '',
    totalPrice: total ?? 0,
    endOrder: orderForm.endOrder ?? '',
    theme: orderForm.theme ?? '',
    personalizationName: orderForm.personalizationName ?? '',
    transactionType: orderForm.transactionType ?? '',
    orderDetails,
  };
}
