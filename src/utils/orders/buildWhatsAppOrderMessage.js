/**
 * @param {string} shopUrl
 * @returns {string}
 */
export function normalizeShopUrl(shopUrl) {
  if (typeof shopUrl !== 'string' || shopUrl.trim().length === 0) {
    return '';
  }

  return shopUrl.trim().replace(/\/+$/, '');
}

/**
 * @param {string} orderId
 * @param {string} shopUrl
 * @returns {string}
 */
export function buildPostShopPublicUrl(orderId, shopUrl) {
  const normalizedShopUrl = normalizeShopUrl(shopUrl);

  if (normalizedShopUrl) {
    return `${normalizedShopUrl}/post-shop/${orderId}`;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/post-shop/${orderId}`;
  }

  return `/post-shop/${orderId}`;
}

/**
 * @param {{ orderDetails?: Array<{ product?: { name?: string }, cuantity?: number }> }} order
 * @returns {string[]}
 */
function buildProductLines(order) {
  const orderDetails = order?.orderDetails;
  if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
    return [];
  }

  return orderDetails
    .map((orderDetail) => {
      const productName = orderDetail?.product?.name;
      const quantity = orderDetail?.cuantity ?? orderDetail?.quantity;
      if (!productName || quantity == null) {
        return null;
      }
      return `- ${productName} × ${quantity}`;
    })
    .filter(Boolean);
}

/**
 * @param {{ order: object, shopUrl: string }} params
 * @returns {string}
 */
export function buildWhatsAppOrderMessage({ order, shopUrl }) {
  const normalizedShopUrl = normalizeShopUrl(shopUrl);
  const orderId = order?.id ?? '';
  const orderLink = normalizedShopUrl
    ? `${normalizedShopUrl}/post-shop/${orderId}`
    : `/post-shop/${orderId}`;

  const lines = [
    '¡Hola! Acabo de realizar un pedido en Saphire Souvenirs.',
    '',
    `Pedido: ${orderId}`,
    `Nombre: ${order?.nameClient ?? ''}`,
    `Total: $${order?.totalPrice ?? 0}`,
    `Fecha de entrega: ${order?.endOrder ?? ''}`,
  ];

  if (order?.theme?.trim()) {
    lines.push(`Tema del evento: ${order.theme.trim()}`);
  }

  const productLines = buildProductLines(order);
  if (productLines.length > 0) {
    lines.push('', 'Productos:');
    lines.push(...productLines);
  }

  lines.push('', `Ver pedido: ${orderLink}`);
  lines.push('', 'Quedo atento/a para coordinar pago y personalización. ¡Gracias!');

  return lines.join('\n');
}
