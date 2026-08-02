import { describe, it, expect } from 'vitest';
import { smoothstep } from './FactCallout';

describe('smoothstep', () => {
  it('returns 0 when x is less than or equal to lower bound (a)', () => {
    expect(smoothstep(0.4, 0.9, 0.3)).toBe(0);
    expect(smoothstep(0.4, 0.9, 0.4)).toBe(0);
  });

  it('returns 1 when x is greater than or equal to upper bound (b)', () => {
    expect(smoothstep(0.4, 0.9, 0.9)).toBe(1);
    expect(smoothstep(0.4, 0.9, 1.0)).toBe(1);
  });

  it('returns interpolated value between 0 and 1 when x is between a and b', () => {
    // midpoint
    const midpoint = (0.4 + 0.9) / 2;
    expect(smoothstep(0.4, 0.9, midpoint)).toBe(0.5);

    // quarter point
    const quarterPoint = 0.4 + (0.9 - 0.4) * 0.25;
    const tQuarter = (quarterPoint - 0.4) / (0.9 - 0.4);
    const expectedQuarter = tQuarter * tQuarter * (3 - 2 * tQuarter);
    expect(smoothstep(0.4, 0.9, quarterPoint)).toBeCloseTo(expectedQuarter);
  });

  it('handles edge case when a == b', () => {
    // Math.max(0, Math.min(1, (x - a) / (b - a)))
    // (x - a) / 0 = Infinity or -Infinity or NaN
    // NaN => t = NaN => returns NaN
    // Infinity => Math.min(1, Infinity) = 1 => Math.max(0, 1) = 1 => 1
    // -Infinity => Math.min(1, -Infinity) = -Infinity => Math.max(0, -Infinity) = 0 => 0
    expect(smoothstep(0.5, 0.5, 0.6)).toBe(1);
    expect(smoothstep(0.5, 0.5, 0.4)).toBe(0);
    expect(smoothstep(0.5, 0.5, 0.5)).toBeNaN();
  });
});
