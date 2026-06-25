import { describe, expect, it } from 'vitest';
import { validateDepositAmount } from './validateDepositAmount';

describe('validateDepositAmount', () => {
  it('accepts valid integer within total', () => {
    expect(validateDepositAmount('5000', 15000)).toEqual({
      valid: true,
      value: 5000,
    });
  });

  it('accepts zero', () => {
    expect(validateDepositAmount(0, 10000)).toEqual({ valid: true, value: 0 });
  });

  it('rejects empty input', () => {
    expect(validateDepositAmount('', 10000).valid).toBe(false);
  });

  it('rejects non-integer', () => {
    expect(validateDepositAmount('12.5', 10000).valid).toBe(false);
  });

  it('rejects amount greater than total', () => {
    expect(validateDepositAmount(20000, 15000).valid).toBe(false);
  });
});
