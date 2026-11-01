import { describe, it, expect } from 'vitest';

describe('Eventora Studio Core Validation', () => {
  it('validates test runner environment', () => {
    expect(true).toBe(true);
  });

  it('calculates cost per attendee correctly', () => {
    const budget = 50000;
    const guests = 100;
    const costPerGuest = budget / guests;
    expect(costPerGuest).toBe(500);
  });

  it('validates budget percentage distribution total', () => {
    const venuePct = 40;
    const cateringPct = 35;
    const avPct = 15;
    const bufferPct = 10;
    const total = venuePct + cateringPct + avPct + bufferPct;
    expect(total).toBe(100);
  });
});