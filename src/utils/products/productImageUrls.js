export const PRODUCT_IMAGE_PLACEHOLDER_URL = 'http://www.exampleImg.com';

export const MAX_PRODUCT_IMAGES = 3;

/**
 * @param {string | null | undefined} imageUrl
 * @returns {boolean}
 */
export function isPlaceholderImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string') {
    return true;
  }
  const trimmedUrl = imageUrl.trim();
  return trimmedUrl.length === 0 || trimmedUrl === PRODUCT_IMAGE_PLACEHOLDER_URL;
}

/**
 * @param {string} imageUrl
 * @returns {boolean}
 */
function isValidImageUrl(imageUrl) {
  return typeof imageUrl === 'string' && !isPlaceholderImageUrl(imageUrl);
}

/**
 * @param {{ img_urls?: string[], img_url?: string } | null | undefined} product
 * @returns {string[]}
 */
export function getProductImageUrls(product) {
  if (!product) {
    return [];
  }

  if (Array.isArray(product.img_urls) && product.img_urls.length > 0) {
    const normalizedUrls = product.img_urls.filter(isValidImageUrl);
    if (normalizedUrls.length > 0) {
      return normalizedUrls;
    }
  }

  if (isValidImageUrl(product.img_url)) {
    return [product.img_url.trim()];
  }

  return [];
}

/**
 * @param {{ img_urls?: string[], img_url?: string } | null | undefined} product
 * @returns {string | undefined}
 */
export function getPrimaryProductImageUrl(product) {
  return getProductImageUrls(product)[0];
}

/**
 * @param {{ img_urls?: string[], img_url?: string } | null | undefined} product
 * @returns {boolean}
 */
export function hasValidProductImages(product) {
  return getProductImageUrls(product).length > 0;
}

/**
 * @param {string[]} imageUrls
 * @returns {boolean}
 */
export function hasValidPersistedImageUrls(imageUrls) {
  if (!Array.isArray(imageUrls)) {
    return false;
  }
  return imageUrls.filter(isValidImageUrl).length > 0;
}
