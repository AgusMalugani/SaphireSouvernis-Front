/**
 * @template T
 * @param {{ data?: T } | T | null | undefined} response
 * @returns T
 */
export function unwrapApiData(response) {
  if (response != null && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
}
