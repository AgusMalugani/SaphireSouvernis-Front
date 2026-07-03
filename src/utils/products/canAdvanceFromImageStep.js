import { hasValidPersistedImageUrls } from './productImageUrls';

export const CREATE_IMAGE_REQUIRED_MESSAGE =
  'Debés seleccionar una imagen para continuar.';

export const EDIT_IMAGE_REQUIRED_MESSAGE =
  'Este producto no tiene imagen. Subí una para continuar.';

export const MAX_PRODUCT_IMAGES_MESSAGE = 'Máximo 3 imágenes.';

/**
 * @param {string | null | undefined} imageUrl
 * @returns {boolean}
 */
export function hasExistingProductImage(imageUrl) {
  return typeof imageUrl === 'string' && imageUrl.trim().length > 0;
}

/**
 * @param {string[]} existingImageUrls
 * @returns {boolean}
 */
export function hasExistingProductImages(existingImageUrls) {
  if (!Array.isArray(existingImageUrls)) {
    return false;
  }
  return existingImageUrls.some((url) => hasExistingProductImage(url));
}

/**
 * @param {{ mode: 'create' | 'edit', newFilesCount?: number, existingImageUrls?: string[] }} params
 * @returns {boolean}
 */
export function canAdvanceFromImageStep({
  mode,
  newFilesCount = 0,
  existingImageUrls = [],
}) {
  if (newFilesCount > 0) {
    return true;
  }

  if (mode === 'create') {
    return false;
  }

  if (mode === 'edit') {
    return hasValidPersistedImageUrls(existingImageUrls);
  }

  return false;
}

/**
 * @param {{ mode: 'create' | 'edit', existingImageUrls?: string[] }} params
 * @returns {string}
 */
export function getImageStepBlockMessage({ mode, existingImageUrls = [] }) {
  if (mode === 'edit' && !hasValidPersistedImageUrls(existingImageUrls)) {
    return EDIT_IMAGE_REQUIRED_MESSAGE;
  }

  return CREATE_IMAGE_REQUIRED_MESSAGE;
}
