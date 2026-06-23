/**
 * @param {string} text
 * @returns {string}
 */
export function normalizeSearchText(text) {
  if (text == null || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}
