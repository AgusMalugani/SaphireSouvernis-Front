import { describe, expect, it } from 'vitest';
import { validateIntegralOrderEdit } from './validateIntegralOrderEdit';

const catalogProducts = [{ id: 'prod-1', price: 5000 }];

const validEditForm = {
  nameClient: 'María López',
  personalizationName: 'MARIA LOPEZ',
  email: 'maria@test.com',
  numCel: '3417123456',
  num2Cel: '3417999999',
  theme: 'Jardín',
  endOrder: '2026-12-01',
  address: 'Calle 123',
  transactionType: 'send',
  depositAmount: '5000',
  products: [{ productId: 'prod-1', cuantity: 2, unitPrice: 5000 }],
};

describe('validateIntegralOrderEdit', () => {
  it('accepts valid integral edit form', () => {
    expect(validateIntegralOrderEdit(validEditForm, catalogProducts).valid).toBe(true);
  });

  it('rejects deposit greater than estimated total', () => {
    const result = validateIntegralOrderEdit(
      { ...validEditForm, depositAmount: '20000' },
      catalogProducts,
    );
    expect(result.valid).toBe(false);
    expect(result.errors?.depositAmount).toBeTruthy();
  });

  it('rejects empty products', () => {
    const result = validateIntegralOrderEdit(
      { ...validEditForm, products: [] },
      catalogProducts,
    );
    expect(result.valid).toBe(false);
  });
});
