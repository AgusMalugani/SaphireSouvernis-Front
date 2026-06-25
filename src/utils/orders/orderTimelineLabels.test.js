import { describe, expect, it } from 'vitest';
import { getOrderTimelineDescription } from './orderTimelineLabels';

describe('orderTimelineLabels', () => {
  it('describes payment_updated with formatted amounts', () => {
    const description = getOrderTimelineDescription({
      type: 'payment_updated',
      payload: {
        fromDeposit: 0,
        toDeposit: 5000,
        remainingBalance: 10000,
      },
    });

    expect(description).toContain('Seña actualizada');
    expect(description).toContain('Saldo pendiente');
  });

  it('describes order_cancelled with reason', () => {
    const description = getOrderTimelineDescription({
      type: 'order_cancelled',
      payload: {
        previousState: 'partialPayment',
        reason: 'Cliente desistió',
      },
    });

    expect(description).toContain('Pedido cancelado');
    expect(description).toContain('Cliente desistió');
  });

  it('describes order_edited with field changes and products', () => {
    const description = getOrderTimelineDescription({
      type: 'order_edited',
      payload: {
        productsChanged: true,
        changes: {
          nameClient: { from: 'Ana', to: 'Ana García' },
          totalPrice: { from: 10000, to: 15000 },
        },
      },
    });

    expect(description).toContain('Productos actualizados');
    expect(description).toContain('Nombre: Ana → Ana García');
    expect(description).toContain('Total:');
  });

  it('stubs order_edited for P2', () => {
    expect(
      getOrderTimelineDescription({ type: 'order_edited', payload: {} }),
    ).toBe('Pedido editado');
  });

  it('preserves legacy state_changed', () => {
    expect(
      getOrderTimelineDescription({
        type: 'state_changed',
        payload: { fromLabel: 'En proceso', toLabel: 'Señado' },
      }),
    ).toBe('Estado: En proceso → Señado');
  });
});
