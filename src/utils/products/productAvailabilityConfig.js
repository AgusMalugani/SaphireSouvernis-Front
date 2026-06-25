import { isProductAvailableForSale } from './isProductAvailableForSale.js';

const ACTIVE_AVAILABILITY_CONFIG = {
  label: 'Activo',
  className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  isActive: true,
};

const DISABLED_AVAILABILITY_CONFIG = {
  label: 'Inhabilitado',
  className: 'border-amber-200 bg-amber-50 text-amber-700',
  isActive: false,
};

/**
 * @param {{ stock?: boolean } | null | undefined} product
 * @returns {boolean}
 */
export function isProductActive(product) {
  return isProductAvailableForSale(product);
}

/**
 * @param {{ stock?: boolean } | null | undefined} product
 * @returns {{ label: string, className: string, isActive: boolean }}
 */
export function getProductAvailabilityConfig(product) {
  if (isProductActive(product)) {
    return ACTIVE_AVAILABILITY_CONFIG;
  }

  return DISABLED_AVAILABILITY_CONFIG;
}
