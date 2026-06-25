import { describe, expect, it } from 'vitest';
import {
  buildIntegralEditPayload,
  canEditOrderIntegral,
  estimateIntegralEditTotal,
  mapOrderToIntegralEditForm,
} from './orderIntegralEdit';

describe('orderIntegralEdit', () => {
  const sampleOrder = {
    id: 'order-1',
    state: 'partialPayment',
    depositAmount: 5000,
    totalPrice: 15000,
    nameClient: 'María',
    email: 'maria@test.com',
    orderDetails: [
      {
        cuantity: 2,
        product: { id: 'prod-1', name: 'Taza', price: 5000 },
      },
    ],
  };

  it('canEditOrderIntegral is false for cancelled', () => {
    expect(canEditOrderIntegral({ state: 'cancelled' })).toBe(false);
    expect(canEditOrderIntegral({ state: 'inProcess' })).toBe(true);
  });

  it('maps order details to edit form', () => {
    const editForm = mapOrderToIntegralEditForm(sampleOrder);
    expect(editForm.products).toHaveLength(1);
    expect(editForm.products[0].productId).toBe('prod-1');
    expect(editForm.depositAmount).toBe('5000');
  });

  it('estimates total from product lines', () => {
    const total = estimateIntegralEditTotal(
      [{ productId: 'prod-1', cuantity: 2, unitPrice: 5000 }],
      [],
    );
    expect(total).toBe(10000);
  });

  it('buildIntegralEditPayload includes depositAmount when changed', () => {
    const editForm = {
      ...mapOrderToIntegralEditForm(sampleOrder),
      depositAmount: '8000',
    };

    const payload = buildIntegralEditPayload(editForm, sampleOrder);
    expect(payload.depositAmount).toBe(8000);
    expect(payload.products).toEqual([{ productId: 'prod-1', cuantity: 2 }]);
  });

  it('omits depositAmount when unchanged', () => {
    const editForm = mapOrderToIntegralEditForm(sampleOrder);
    const payload = buildIntegralEditPayload(editForm, sampleOrder);
    expect(payload.depositAmount).toBeUndefined();
  });
});
