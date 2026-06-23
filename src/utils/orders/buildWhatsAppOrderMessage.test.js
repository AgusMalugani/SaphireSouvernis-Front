import { describe, expect, it } from 'vitest';
import {
  buildWhatsAppOrderMessage,
  normalizeShopUrl,
} from './buildWhatsAppOrderMessage';

const sampleOrder = {
  id: 'abc-123',
  nameClient: 'María López',
  totalPrice: 4500,
  endOrder: '2026-07-01',
  theme: 'Bautismo',
  orderDetails: [
    { product: { name: 'Llaveros' }, cuantity: 2 },
    { product: { name: 'Difusores' }, cuantity: 1 },
  ],
};

describe('normalizeShopUrl', () => {
  it('removes trailing slash', () => {
    expect(normalizeShopUrl('https://shop.example.com/')).toBe(
      'https://shop.example.com',
    );
  });
});

describe('buildWhatsAppOrderMessage', () => {
  it('includes detailed product lines and theme', () => {
    const message = buildWhatsAppOrderMessage({
      order: sampleOrder,
      shopUrl: 'https://shop.example.com/',
    });

    expect(message).toContain('María López');
    expect(message).toContain('Bautismo');
    expect(message).toContain('- Llaveros × 2');
    expect(message).toContain('- Difusores × 1');
    expect(message).toContain('https://shop.example.com/post-shop/abc-123');
  });

  it('works without products or theme', () => {
    const message = buildWhatsAppOrderMessage({
      order: {
        id: 'x1',
        nameClient: 'Juan',
        totalPrice: 1000,
        endOrder: '2026-08-01',
      },
      shopUrl: 'https://shop.example.com',
    });

    expect(message).not.toContain('Productos:');
    expect(message).not.toContain('Tema del evento');
    expect(message).toContain('/post-shop/x1');
  });

  it('uses relative link when shopUrl missing', () => {
    const message = buildWhatsAppOrderMessage({
      order: { id: 'z9', nameClient: 'Ana', totalPrice: 500, endOrder: '2026-09-01' },
      shopUrl: '',
    });

    expect(message).toContain('Ver pedido: /post-shop/z9');
  });
});
