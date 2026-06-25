import { normalizeSearchText } from './normalizeSearchText.js';

const DEFAULT_FILTERS = {
  state: '',
  transactionType: '',
  q: '',
  page: 1,
  limit: 20,
  sort: 'createAt',
  order: 'desc',
};

/**
 * @param {object} order
 * @param {string} query
 * @returns {boolean}
 */
export function orderMatchesSearchQuery(order, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return true;
  }

  const searchableFields = [
    order?.nameClient,
    order?.email,
    order?.numCel,
    order?.num2Cel,
    order?.id,
    order?.theme,
  ];

  return searchableFields.some((fieldValue) =>
    normalizeSearchText(String(fieldValue ?? '')).includes(normalizedQuery),
  );
}

/**
 * @param {object} leftOrder
 * @param {object} rightOrder
 * @param {string} sortField
 * @param {string} sortOrder
 * @returns {number}
 */
function compareOrders(leftOrder, rightOrder, sortField, sortOrder) {
  const leftValue = leftOrder?.[sortField] ?? '';
  const rightValue = rightOrder?.[sortField] ?? '';

  if (leftValue === rightValue) {
    return 0;
  }

  const comparison = leftValue > rightValue ? 1 : -1;
  return sortOrder === 'asc' ? comparison : -comparison;
}

/**
 * @param {Array<object>} orders
 * @param {object} filters
 * @returns {{ data: Array<object>, meta: { total: number, page: number, limit: number, totalPages: number } }}
 */
export function filterOrdersClientSide(orders, filters = {}) {
  const mergedFilters = { ...DEFAULT_FILTERS, ...filters };
  const safeOrders = Array.isArray(orders) ? orders : [];

  let filteredOrders = safeOrders.filter((orderItem) => {
    const matchesState = mergedFilters.state
      ? orderItem.state === mergedFilters.state
      : orderItem.state !== 'cancelled';
    const matchesTransactionType =
      !mergedFilters.transactionType ||
      orderItem.transactionType === mergedFilters.transactionType;
    const matchesQuery = orderMatchesSearchQuery(orderItem, mergedFilters.q);

    return matchesState && matchesTransactionType && matchesQuery;
  });

  filteredOrders = [...filteredOrders].sort((leftOrder, rightOrder) =>
    compareOrders(
      leftOrder,
      rightOrder,
      mergedFilters.sort,
      mergedFilters.order,
    ),
  );

  const total = filteredOrders.length;
  const limit = Math.max(1, Number(mergedFilters.limit) || DEFAULT_FILTERS.limit);
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const page = Math.min(
    Math.max(1, Number(mergedFilters.page) || 1),
    totalPages,
  );
  const startIndex = (page - 1) * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

  return {
    data: paginatedOrders,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
