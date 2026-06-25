/**
 * @param {unknown} error
 * @returns {number | undefined}
 */
export function getApiErrorStatus(error) {
  if (error && typeof error === 'object' && 'status' in error) {
    const statusCode = Number(error.status);
    if (!Number.isNaN(statusCode)) {
      return statusCode;
    }
  }

  if (error instanceof Error) {
    const statusMatch = error.message.match(/Error (\d{3})/);
    if (statusMatch) {
      return Number(statusMatch[1]);
    }
  }

  return undefined;
}
