import { describe, expect, it } from 'vitest';
import {
  filterCatalogProducts,
  getCatalogEmptyMessage,
  normalizeSearchText,
  productMatchesName,
} from './filterCatalogProducts';

const sampleProducts = [
  {
    id: '1',
    name: 'Llaveros Gamuza + 2 Dijes',
    categories: [{ name: 'BAUTISMO' }],
    stock: true,
  },
  {
    id: '2',
    name: 'Certificado Comunión',
    categories: [{ name: 'COMUNION' }],
    stock: true,
  },
  {
    id: '3',
    name: 'Estampitas',
    categories: [],
    stock: true,
  },
  {
    id: '4',
    name: 'Producto Inhabilitado',
    categories: [{ name: 'COMUNION' }],
    stock: false,
  },
];

describe('normalizeSearchText', () => {
  it('lowercases and strips accents', () => {
    expect(normalizeSearchText('  Comunión ')).toBe('comunion');
  });
});

describe('productMatchesName', () => {
  it('matches without accents', () => {
    expect(productMatchesName({ name: 'Comunión' }, 'comunion')).toBe(true);
  });

  it('returns true for empty query', () => {
    expect(productMatchesName({ name: 'Test' }, '   ')).toBe(true);
  });
});

describe('filterCatalogProducts', () => {
  it('filters by partial name', () => {
    expect(filterCatalogProducts(sampleProducts, { searchQuery: 'lla' })).toHaveLength(1);
  });

  it('combines category and search with AND', () => {
    expect(
      filterCatalogProducts(sampleProducts, {
        category: 'COMUNION',
        searchQuery: 'cert',
      }),
    ).toHaveLength(1);
  });

  it('returns empty when category has no products', () => {
    expect(
      filterCatalogProducts(sampleProducts, { category: 'BABYSHOWER' }),
    ).toHaveLength(0);
  });

  it('handles product without categories for specific filter', () => {
    expect(
      filterCatalogProducts(sampleProducts, { category: 'BAUTISMO' }),
    ).toHaveLength(1);
    expect(
      filterCatalogProducts(sampleProducts, {
        category: 'BAUTISMO',
        searchQuery: 'estamp',
      }),
    ).toHaveLength(0);
  });

  it('excludes products with stock false from catalog', () => {
    expect(filterCatalogProducts(sampleProducts)).toHaveLength(3);
    expect(
      filterCatalogProducts(sampleProducts, { searchQuery: 'inhabilitado' }),
    ).toHaveLength(0);
  });

  it('treats missing stock as available for sale', () => {
    const legacyProducts = [{ id: '4', name: 'Legacy', categories: [] }];
    expect(filterCatalogProducts(legacyProducts)).toHaveLength(1);
  });
});

describe('getCatalogEmptyMessage', () => {
  it('returns category empty message', () => {
    expect(getCatalogEmptyMessage({ category: 'BAUTISMO', searchQuery: '' })).toMatch(
      /categoría/i,
    );
  });

  it('returns search-only message', () => {
    expect(getCatalogEmptyMessage({ searchQuery: 'xyz' })).toContain('«xyz»');
  });

  it('returns combined message', () => {
    expect(
      getCatalogEmptyMessage({ category: 'BAUTISMO', searchQuery: 'xyz' }),
    ).toContain('BAUTISMO');
  });
});
