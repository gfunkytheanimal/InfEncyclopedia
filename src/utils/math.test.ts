import { describe, it, expect } from 'vitest';
import { smoothstep } from './math';

describe('smoothstep', () => {
  it('should return 0 when x is less than or equal to a', () => {
    expect(smoothstep(0, 10, -5)).toBe(0);
    expect(smoothstep(0, 10, 0)).toBe(0);
  });

  it('should return 1 when x is greater than or equal to b', () => {
    expect(smoothstep(0, 10, 10)).toBe(1);
    expect(smoothstep(0, 10, 15)).toBe(1);
  });

  it('should return 0.5 when x is exactly halfway between a and b', () => {
    expect(smoothstep(0, 10, 5)).toBe(0.5);
  });

  it('should smoothly interpolate values between a and b', () => {
    // For x = 2, a = 0, b = 10, t = 0.2
    // return 0.2 * 0.2 * (3 - 2 * 0.2) = 0.04 * (3 - 0.4) = 0.04 * 2.6 = 0.104
    expect(smoothstep(0, 10, 2)).toBeCloseTo(0.104, 5);

    // For x = 8, a = 0, b = 10, t = 0.8
    // return 0.8 * 0.8 * (3 - 2 * 0.8) = 0.64 * (3 - 1.6) = 0.64 * 1.4 = 0.896
    expect(smoothstep(0, 10, 8)).toBeCloseTo(0.896, 5);
  });
});
