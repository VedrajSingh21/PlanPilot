import { describe, it, expect } from 'vitest';
import { allocate, rebalance, enforceTotal, applyTradeOff } from '../src/lib/budget';

describe('Budget Math Engine', () => {
  it('Scenario 1: Jaipur wedding (12,00,000 INR) sums to total exactly with 5-10% contingency', () => {
    const total = 1200000;
    const items = allocate(total, 'wedding', 'balanced');

    const sum = items.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(total);

    const contingency = items.find(row => row.category.toLowerCase().includes('contingency'));
    expect(contingency).toBeDefined();
    expect(contingency!.percent).toBeGreaterThanOrEqual(5);
    expect(contingency!.percent).toBeLessThanOrEqual(10);
    expect(contingency!.amount).toBeGreaterThan(0);
  });

  it('Scenario 2: $500 surprise birthday sums to total exactly with integer amounts', () => {
    const total = 500;
    const items = allocate(total, 'birthday', 'balanced');

    const sum = items.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(total);

    // Verify all amounts are integers
    items.forEach(item => {
      expect(Number.isInteger(item.amount)).toBe(true);
      expect(item.amount).toBeGreaterThanOrEqual(0);
    });

    const contingency = items.find(row => row.category.toLowerCase().includes('contingency'));
    expect(contingency).toBeDefined();
    expect(contingency!.percent).toBeGreaterThanOrEqual(5);
    expect(contingency!.percent).toBeLessThanOrEqual(10);
  });

  it('Scenario 3: Volunteers-only / Zero budget event ($0) results in zero amounts and no crash', () => {
    const total = 0;
    const items = allocate(total, 'community', 'budgetSaver');

    const sum = items.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(0);

    items.forEach(item => {
      expect(item.amount).toBe(0);
    });
  });

  it('Scenario 4: Vague input with default fallback budget allocates accurately', () => {
    const total = 150000;
    const items = allocate(total, 'celebration', 'balanced');

    const sum = items.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(total);

    const percentSum = items.reduce((acc, row) => acc + row.percent, 0);
    expect(percentSum).toBe(100);
  });

  it('Scenario 5: $1000 150-guest wedding sums to total exactly with no fractional rounding leaks', () => {
    const total = 1000;
    const items = allocate(total, 'wedding', 'budgetSaver');

    const sum = items.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(total);

    items.forEach(item => {
      expect(Number.isInteger(item.amount)).toBe(true);
    });
  });

  it('Handles tiny budget ($10 or $33) with clean rounding', () => {
    const total = 33;
    const items = allocate(total, 'birthday', 'balanced');

    const sum = items.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(total);
  });

  it('rebalance adjusts slider while maintaining 100% total sum and 100% total percent', () => {
    const total = 50000;
    const items = allocate(total, 'wedding', 'balanced');

    // Change venue (index 0) from 35% to 50%
    const rebalanced = rebalance(items, 0, 50, total);

    const sum = rebalanced.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(total);

    const percentSum = rebalanced.reduce((acc, row) => acc + row.percent, 0);
    expect(percentSum).toBe(100);
    expect(rebalanced[0].percent).toBe(50);
  });

  it('applyTradeOff updates total budget and re-enforces exact sum', () => {
    const initialTotal = 100000;
    const items = allocate(initialTotal, 'wedding', 'balanced');

    const costDelta = -15000; // -15,000 cost savings
    const { updatedRows, updatedTotal } = applyTradeOff(items, initialTotal, costDelta);

    expect(updatedTotal).toBe(85000);
    const sum = updatedRows.reduce((acc, row) => acc + row.amount, 0);
    expect(sum).toBe(85000);
  });

  it('enforceTotal guarantees exact sum even on arbitrarily distorted raw rows', () => {
    const rawRows = [
      { id: '1', category: 'Cat 1', percent: 33, amount: 999, tip: '' },
      { id: '2', category: 'Cat 2', percent: 33, amount: 999, tip: '' },
      { id: '3', category: 'Cat 3', percent: 34, amount: 999, tip: '' }
    ];
    const target = 100000;
    const reconciled = enforceTotal(rawRows, target);

    const sum = reconciled.reduce((acc, r) => acc + r.amount, 0);
    expect(sum).toBe(target);
  });
});
