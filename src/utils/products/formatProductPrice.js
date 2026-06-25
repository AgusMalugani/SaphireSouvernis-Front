const ARS_CURRENCY_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/**
 * @param {number | null | undefined} price
 * @returns {string}
 */
export function formatProductPrice(price) {
  if (price == null || Number.isNaN(Number(price))) {
    return '—';
  }

  return ARS_CURRENCY_FORMATTER.format(Number(price));
}
