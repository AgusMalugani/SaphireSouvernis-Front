/**
 * @param {Array<unknown>} items
 * @param {{ page?: number, limit?: number }} options
 * @returns {{ data: Array<unknown>, meta: { total: number, page: number, limit: number, totalPages: number } }}
 */
export function paginateItems(items, { page = 1, limit = 10 } = {}) {
  const safeItems = Array.isArray(items) ? items : [];
  const safeLimit = Math.max(1, Number(limit) || 10);
  const total = safeItems.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const startIndex = (safePage - 1) * safeLimit;

  return {
    data: safeItems.slice(startIndex, startIndex + safeLimit),
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    },
  };
}
