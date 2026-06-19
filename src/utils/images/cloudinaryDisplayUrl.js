const CLOUDINARY_DISPLAY_TRANSFORM = 'w_400,h_400,c_fill';
const UPLOAD_PATH_SEGMENT = '/upload/';

/**
 * URL elegible: host cloudinary.com y segmento /upload/ en la ruta.
 * @param {string | null | undefined} imageUrl
 * @returns {boolean}
 */
export function isCloudinaryEligibleUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    return (
      parsedUrl.hostname.includes('cloudinary.com') &&
      parsedUrl.pathname.includes(UPLOAD_PATH_SEGMENT)
    );
  } catch {
    return false;
  }
}

/**
 * Devuelve URL Cloudinary con transformación de visualización o la original si no aplica.
 * @param {string | null | undefined} imageUrl
 * @returns {string | null | undefined}
 */
export function toCloudinaryDisplayUrl(imageUrl) {
  if (!imageUrl || !isCloudinaryEligibleUrl(imageUrl)) {
    return imageUrl;
  }

  if (imageUrl.includes(CLOUDINARY_DISPLAY_TRANSFORM)) {
    return imageUrl;
  }

  const uploadIndex = imageUrl.indexOf(UPLOAD_PATH_SEGMENT);
  if (uploadIndex === -1) {
    return imageUrl;
  }

  const prefix = imageUrl.slice(0, uploadIndex + UPLOAD_PATH_SEGMENT.length);
  const suffix = imageUrl.slice(uploadIndex + UPLOAD_PATH_SEGMENT.length);

  return `${prefix}${CLOUDINARY_DISPLAY_TRANSFORM}/${suffix}`;
}
