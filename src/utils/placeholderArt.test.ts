import { describe, it, expect } from 'vitest';
import { hashString } from './placeholderArt';

describe('hashString', () => {
  it('should be deterministic (same string produces same hash)', () => {
    const str = 'hello world';
    const hash1 = hashString(str);
    const hash2 = hashString(str);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different strings', () => {
    const hash1 = hashString('string1');
    const hash2 = hashString('string2');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty strings', () => {
    const hash = hashString('');
    expect(typeof hash).toBe('number');
    expect(hash).toBeGreaterThanOrEqual(0);
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    const hash = hashString(longString);
    expect(typeof hash).toBe('number');
    expect(hash).toBeGreaterThanOrEqual(0);
  });

  it('should handle special characters', () => {
    const specialChars = '!@#$%^&*()_+{}:"<>?|~`-=[];\',./';
    const hash = hashString(specialChars);
    expect(typeof hash).toBe('number');
    expect(hash).toBeGreaterThanOrEqual(0);
  });

  it('should handle unicode characters', () => {
    const unicodeStr = 'こんにちは世界 🌍'; // Hello world + Earth emoji
    const hash = hashString(unicodeStr);
    expect(typeof hash).toBe('number');
    expect(hash).toBeGreaterThanOrEqual(0);
  });

  it('should always return a positive integer or zero', () => {
    const stringsToTest = [
      'a',
      'abc',
      'long string with many words',
      '1234567890',
      ' ',
      '\n\t\r'
    ];

    for (const str of stringsToTest) {
      const hash = hashString(str);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(hash)).toBe(true);
    }
  });

  it('should distribute hashes reasonably well (not identical for small changes)', () => {
    const hash1 = hashString('foo');
    const hash2 = hashString('bar');
    const hash3 = hashString('baz');
    expect(hash1).not.toBe(hash2);
    expect(hash2).not.toBe(hash3);
    expect(hash1).not.toBe(hash3);
  });
});
