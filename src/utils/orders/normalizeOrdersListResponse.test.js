import { describe, expect, it } from 'vitest';
import { normalizeOrdersListResponse } from './normalizeOrdersListResponse';

const sampleOrders = [
  { id: '1', state: 'inProcess', nameClient: 'Ana', createAt: '2026-06-01' },
  { id: '2', state: 'paid', nameClient: 'Luis', createAt: '2026-06-02' },
];

describe('normalizeOrdersListResponse', () => {
  it('passes through paginated response', () => {
    const raw = {
      data: [sampleOrders[0]],
      meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };

    expect(normalizeOrdersListResponse(raw)).toEqual(raw);
  });

  it('filters legacy array client-side', () => {
    const result = normalizeOrdersListResponse(sampleOrders, { state: 'paid' });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('2');
    expect(result.meta.total).toBe(1);
  });

  it('returns empty safe shape for invalid input', () => {
    const result = normalizeOrdersListResponse(null);
    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
  });
});
