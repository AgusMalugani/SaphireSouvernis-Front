import { describe, expect, it } from 'vitest';
import { formatProductPrice } from './formatProductPrice';

describe('formatProductPrice', () => {
  it('formats ARS currency', () => {
    expect(formatProductPrice(1500)).toMatch(/\$|ARS/);
    expect(formatProductPrice(1500)).toContain('1');
  });

  it('returns dash for invalid values', () => {
    expect(formatProductPrice(null)).toBe('—');
    expect(formatProductPrice(undefined)).toBe('—');
  });
});
