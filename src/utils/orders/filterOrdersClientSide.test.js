import { describe, expect, it } from 'vitest';
import { filterOrdersClientSide } from './filterOrdersClientSide';

const sampleOrders = [
  {
    id: '1',
    state: 'inProcess',
    transactionType: 'send',
    nameClient: 'María',
    email: 'maria@test.com',
    numCel: '3417123456',
    createAt: '2026-06-01',
  },
  {
    id: '2',
    state: 'paid',
    transactionType: 'withdraw',
    nameClient: 'Juan',
    email: 'juan@test.com',
    numCel: '3417999999',
    createAt: '2026-06-10',
  },
  {
    id: '3',
    state: 'cancelled',
    transactionType: 'send',
    nameClient: 'Ana',
    email: 'ana@test.com',
    numCel: '3417111111',
    createAt: '2026-06-12',
  },
];

describe('filterOrdersClientSide', () => {
  it('filters by state', () => {
    const result = filterOrdersClientSide(sampleOrders, { state: 'inProcess' });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('1');
    expect(result.meta.total).toBe(1);
  });

  it('filters by search query on name', () => {
    const result = filterOrdersClientSide(sampleOrders, { q: 'juan' });
    expect(result.data[0].nameClient).toBe('Juan');
  });

  it('paginates results', () => {
    const result = filterOrdersClientSide(sampleOrders, { page: 1, limit: 1 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.totalPages).toBe(2);
  });

  it('combines state and transaction filters', () => {
    const result = filterOrdersClientSide(sampleOrders, {
      state: 'paid',
      transactionType: 'withdraw',
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('2');
  });

  it('excludes cancelled orders by default', () => {
    const result = filterOrdersClientSide(sampleOrders, {});
    expect(result.data.map((orderItem) => orderItem.id)).toEqual(['2', '1']);
  });

  it('filters only cancelled orders when state is cancelled', () => {
    const result = filterOrdersClientSide(sampleOrders, { state: 'cancelled' });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('3');
  });
});
