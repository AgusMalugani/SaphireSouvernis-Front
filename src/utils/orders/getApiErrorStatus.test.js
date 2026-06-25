import { describe, expect, it } from 'vitest';
import { getApiErrorStatus } from './getApiErrorStatus';

describe('getApiErrorStatus', () => {
  it('reads status from error.status', () => {
    const error = new Error('Not found');
    error.status = 404;
    expect(getApiErrorStatus(error)).toBe(404);
  });

  it('parses status from error message fallback', () => {
    expect(getApiErrorStatus(new Error('Error 409'))).toBe(409);
  });

  it('returns undefined when status is unavailable', () => {
    expect(getApiErrorStatus(new Error('Network failure'))).toBeUndefined();
    expect(getApiErrorStatus(null)).toBeUndefined();
  });
});
