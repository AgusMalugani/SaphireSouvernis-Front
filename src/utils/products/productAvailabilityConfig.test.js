import { describe, expect, it } from 'vitest';
import {
  getProductAvailabilityConfig,
  isProductActive,
} from './productAvailabilityConfig';

describe('productAvailabilityConfig', () => {
  it('treats missing stock as active', () => {
    expect(isProductActive({})).toBe(true);
    expect(getProductAvailabilityConfig({}).label).toBe('Activo');
  });

  it('treats stock true as active', () => {
    expect(isProductActive({ stock: true })).toBe(true);
    expect(getProductAvailabilityConfig({ stock: true }).label).toBe('Activo');
  });

  it('treats stock false as disabled', () => {
    expect(isProductActive({ stock: false })).toBe(false);
    expect(getProductAvailabilityConfig({ stock: false }).label).toBe('Inhabilitado');
  });
});
