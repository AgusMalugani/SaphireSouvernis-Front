import { describe, expect, it } from 'vitest';
import { paginateItems } from './paginateItems';

describe('paginateItems', () => {
  const items = Array.from({ length: 13 }, (_, index) => ({ id: String(index + 1) }));

  it('returns first page slice', () => {
    const result = paginateItems(items, { page: 1, limit: 10 });
    expect(result.data).toHaveLength(10);
    expect(result.meta.total).toBe(13);
    expect(result.meta.totalPages).toBe(2);
  });

  it('returns second page slice', () => {
    const result = paginateItems(items, { page: 2, limit: 10 });
    expect(result.data).toHaveLength(3);
    expect(result.meta.page).toBe(2);
  });

  it('clamps page above totalPages', () => {
    const result = paginateItems(items, { page: 99, limit: 10 });
    expect(result.meta.page).toBe(2);
  });
});
