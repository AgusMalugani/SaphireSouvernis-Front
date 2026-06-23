import { describe, expect, it } from 'vitest';
import {
  getOrderStateConfig,
  getOrderStateLabel,
  getOrderStateSelectOptions,
  getOrderTransactionConfig,
  getOrderTransactionLabel,
  ORDER_STATE_VALUES,
} from './orderStatusConfig';

describe('orderStatusConfig', () => {
  it('maps inProcess to En proceso', () => {
    expect(getOrderStateLabel(ORDER_STATE_VALUES.IN_PROCESS)).toBe('En proceso');
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

  it('select options use enum values with spanish labels', () => {
    const options = getOrderStateSelectOptions();
    expect(options.find((option) => option.value === 'inProcess')?.label).toBe(
      'En proceso',
    );
  });

  it('transaction config fallback', () => {
    expect(getOrderTransactionConfig('invalid').label).toBe('Tipo desconocido');
  });
});
