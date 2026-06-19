import { describe, expect, it } from 'vitest';
import {
  normalizeProductForEdit,
  resolveProductFromCatalog,
} from './resolveProductFromCatalog';

const catalogProducts = [
  {
    id: 'c40f9013-d90e-4010-8fc7-79da7101e2d6',
    name: 'Llaveros',
    price: 1500,
  },
  {
    id: 42,
    name: 'Numeric id product',
    price: 100,
  },
];

describe('resolveProductFromCatalog', () => {
  it('returns product on cache hit by string id', () => {
    expect(
      resolveProductFromCatalog(
        catalogProducts,
        'c40f9013-d90e-4010-8fc7-79da7101e2d6',
      ),
    ).toEqual(catalogProducts[0]);
  });

  it('matches numeric id with string lookup', () => {
    expect(resolveProductFromCatalog(catalogProducts, '42')).toEqual(
      catalogProducts[1],
    );
  });

  it('returns null on cache miss', () => {
    expect(resolveProductFromCatalog(catalogProducts, 'missing-id')).toBeNull();
  });

  it('returns null for invalid inputs', () => {
    expect(resolveProductFromCatalog(null, '1')).toBeNull();
    expect(resolveProductFromCatalog(catalogProducts, '')).toBeNull();
    expect(resolveProductFromCatalog(catalogProducts, null)).toBeNull();
  });
});

describe('normalizeProductForEdit', () => {
  it('maps category objects to names', () => {
    expect(
      normalizeProductForEdit({
        id: '1',
        name: 'Test',
        categories: [{ name: 'Bautismo' }, { name: 'Comunión' }],
      }),
    ).toMatchObject({
      categories: ['Bautismo', 'Comunión'],
    });
  });

  it('keeps string categories as-is', () => {
    expect(
      normalizeProductForEdit({
        id: '1',
        categories: ['Bautismo'],
      }),
    ).toMatchObject({
      categories: ['Bautismo'],
    });
  });

  it('defaults categories to empty array', () => {
    expect(normalizeProductForEdit({ id: '1' })).toMatchObject({
      categories: [],
    });
  });
});
