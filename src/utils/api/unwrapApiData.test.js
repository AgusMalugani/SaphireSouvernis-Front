import { describe, expect, it } from 'vitest';
import { unwrapApiData } from './unwrapApiData';

describe('unwrapApiData', () => {
  it('unwraps envelope with data key', () => {
    const product = { id: '1', name: 'Test' };
    expect(unwrapApiData({ data: product })).toEqual(product);
  });

  it('returns legacy flat response unchanged', () => {
    const products = [{ id: '1' }];
    expect(unwrapApiData(products)).toEqual(products);
  });

  it('returns null when response is null', () => {
    expect(unwrapApiData(null)).toBe(null);
  });
});
