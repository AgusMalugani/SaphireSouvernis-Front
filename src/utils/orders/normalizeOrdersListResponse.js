import { filterOrdersClientSide } from './filterOrdersClientSide.js';

/**
 * @param {unknown} rawResponse
 * @returns {boolean}
 */
export function isPaginatedOrdersResponse(rawResponse) {
  return (
    rawResponse != null &&
    typeof rawResponse === 'object' &&
    Array.isArray(rawResponse.data) &&
    rawResponse.meta != null &&
    typeof rawResponse.meta === 'object'
  );
}

/**
 * @param {unknown} rawResponse
 * @param {object} filters
 * @returns {{ data: Array<object>, meta: { total: number, page: number, limit: number, totalPages: number } }}
 */
export function normalizeOrdersListResponse(rawResponse, filters = {}) {
  if (isPaginatedOrdersResponse(rawResponse)) {
    return {
      data: rawResponse.data,
      meta: {
        total: rawResponse.meta.total ?? rawResponse.data.length,
        page: rawResponse.meta.page ?? 1,
        limit: rawResponse.meta.limit ?? filters.limit ?? 20,
        totalPages: rawResponse.meta.totalPages ?? 1,
      },
    };
  }

  if (Array.isArray(rawResponse)) {
    return filterOrdersClientSide(rawResponse, filters);
  }

  return {
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: filters.limit ?? 20,
      totalPages: 1,
    },
  };
}
