import { describe, expect, it } from 'vitest';
import { buildProvisionalOrderFromCheckout } from './buildProvisionalOrderFromCheckout';

describe('buildProvisionalOrderFromCheckout', () => {
  it('returns null without checkout state', () => {
    expect(
      buildProvisionalOrderFromCheckout({ orderId: 'abc', checkoutState: null }),
    ).toBeNull();
  });

  it('maps orderForm and cart items into order shape', () => {
    const provisionalOrder = buildProvisionalOrderFromCheckout({
      orderId: 'order-1',
      checkoutState: {
        orderForm: {
          nameClient: 'María',
          endOrder: '2026-07-15',
          theme: 'Comunión',
          personalizationName: 'Juan',
          transactionType: 'delivery',
        },
        cartItems: [
          { name: 'Llaveros', price: 1500, cuantity: 2, img_url: 'https://img/1' },
        ],
        total: 3000,
      },
    });

    expect(provisionalOrder).toMatchObject({
      id: 'order-1',
      nameClient: 'María',
      totalPrice: 3000,
      endOrder: '2026-07-15',
      theme: 'Comunión',
    });
    expect(provisionalOrder.orderDetails).toHaveLength(1);
    expect(provisionalOrder.orderDetails[0].product.name).toBe('Llaveros');
    expect(provisionalOrder.orderDetails[0].cuantity).toBe(2);
  });
});
