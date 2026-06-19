export const CREATE_IMAGE_REQUIRED_MESSAGE =
  'Debés seleccionar una imagen para continuar.';

export const EDIT_IMAGE_REQUIRED_MESSAGE =
  'Este producto no tiene imagen. Subí una para continuar.';

/**
 * @param {string | null | undefined} imageUrl
 * @returns {boolean}
 */
export function hasExistingProductImage(imageUrl) {
  return typeof imageUrl === 'string' && imageUrl.trim().length > 0;
}

/**
 * @param {{ mode: 'create' | 'edit', hasNewFile: boolean, existingImageUrl?: string }} params
 * @returns {boolean}
 */
export function canAdvanceFromImageStep({
  mode,
  hasNewFile,
  existingImageUrl = '',
}) {
  if (hasNewFile) {
    return true;
  }

  if (mode === 'create') {
    return false;
  }

  if (mode === 'edit') {
    return hasExistingProductImage(existingImageUrl);
  }

  return false;
}

/**
 * @param {{ mode: 'create' | 'edit', existingImageUrl?: string }} params
 * @returns {string}
 */
export function getImageStepBlockMessage({ mode, existingImageUrl = '' }) {
  if (mode === 'edit' && !hasExistingProductImage(existingImageUrl)) {
    return EDIT_IMAGE_REQUIRED_MESSAGE;
  }

  return CREATE_IMAGE_REQUIRED_MESSAGE;
}
