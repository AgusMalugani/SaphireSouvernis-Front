import { describe, expect, it } from 'vitest';
import {
  filterInventoryProducts,
  getInventoryEmptyMessage,
} from './filterInventoryProducts';

const inventoryProducts = [
  { id: '1', name: 'Llaveros', stock: true },
  { id: '2', name: 'Certificado', stock: false },
  { id: '3', name: 'Difusor', stock: true },
];

describe('filterInventoryProducts', () => {
  it('returns all products by default', () => {
    expect(filterInventoryProducts(inventoryProducts)).toHaveLength(3);
  });

  it('filters active products', () => {
    expect(
      filterInventoryProducts(inventoryProducts, { statusFilter: 'active' }),
    ).toHaveLength(2);
  });

  it('filters disabled products', () => {
    expect(
      filterInventoryProducts(inventoryProducts, { statusFilter: 'disabled' }),
    ).toHaveLength(1);
  });

  it('filters by name and status', () => {
    expect(
      filterInventoryProducts(inventoryProducts, {
        statusFilter: 'active',
        searchQuery: 'lla',
      }),
    ).toHaveLength(1);
  });
});

describe('getInventoryEmptyMessage', () => {
  it('returns disabled empty message', () => {
    expect(getInventoryEmptyMessage({ statusFilter: 'disabled' })).toMatch(
      /inhabilitados/i,
    );
  });
});
