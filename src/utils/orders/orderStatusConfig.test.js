import { describe, expect, it } from 'vitest';
import {
  canCancelOrder,
  canRegisterDeposit,
  getOrderStateConfig,
  getOrderStateFilterOptions,
  getOrderStateLabel,
  getOrderStateSelectOptions,
  getOrderTransactionConfig,
  getOrderTransactionLabel,
  isOrderCancelled,
  ORDER_STATE_VALUES,
} from './orderStatusConfig';

describe('orderStatusConfig', () => {
  it('maps inProcess to En proceso', () => {
    expect(getOrderStateLabel(ORDER_STATE_VALUES.IN_PROCESS)).toBe('En proceso');
  });

  it('maps cancelled to Cancelado', () => {
    expect(getOrderStateLabel(ORDER_STATE_VALUES.CANCELLED)).toBe('Cancelado');
  });

  it('returns badge config for known state', () => {
    expect(getOrderStateConfig('paid').label).toBe('Pagado');
  });

  it('returns fallback for unknown state without exposing enum', () => {
    expect(getOrderStateLabel('unknown_xyz')).toBe('Estado desconocido');
  });

  it('maps transaction types to spanish labels', () => {
    expect(getOrderTransactionLabel('send')).toBe('Envío');
    expect(getOrderTransactionLabel('withdraw')).toBe('Retiro en local');
  });

  it('select options exclude cancelled', () => {
    const options = getOrderStateSelectOptions();
    expect(options.find((option) => option.value === 'inProcess')?.label).toBe(
      'En proceso',
    );
    expect(options.some((option) => option.value === 'cancelled')).toBe(false);
  });

  it('filter options include cancelled', () => {
    const options = getOrderStateFilterOptions();
    expect(options.some((option) => option.value === 'cancelled')).toBe(true);
  });

  it('transaction config fallback', () => {
    expect(getOrderTransactionConfig('invalid').label).toBe('Tipo desconocido');
  });

  it('canRegisterDeposit only for inProcess with zero deposit', () => {
    expect(
      canRegisterDeposit({ state: 'inProcess', depositAmount: 0 }),
    ).toBe(true);
    expect(
      canRegisterDeposit({ state: 'inProcess', depositAmount: undefined }),
    ).toBe(true);
    expect(
      canRegisterDeposit({ state: 'partialPayment', depositAmount: undefined }),
    ).toBe(false);
    expect(
      canRegisterDeposit({ state: 'inProcess', depositAmount: 1000 }),
    ).toBe(false);
    expect(canRegisterDeposit({ state: 'cancelled', depositAmount: 0 })).toBe(
      false,
    );
  });

  it('canCancelOrder for inProcess and partialPayment only', () => {
    expect(canCancelOrder({ state: 'inProcess' })).toBe(true);
    expect(canCancelOrder({ state: 'partialPayment' })).toBe(true);
    expect(canCancelOrder({ state: 'paid' })).toBe(false);
    expect(canCancelOrder({ state: 'cancelled' })).toBe(false);
  });

  it('isOrderCancelled detects cancelled state', () => {
    expect(isOrderCancelled({ state: 'cancelled' })).toBe(true);
    expect(isOrderCancelled({ state: 'paid' })).toBe(false);
  });
});
