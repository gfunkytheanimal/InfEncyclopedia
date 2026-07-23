import { describe, it, expect } from 'vitest';
import { hashString, paletteForId } from './placeholderArt';

describe('placeholderArt', () => {
  describe('hashString', () => {
    it('returns a number', () => {
      expect(typeof hashString('test')).toBe('number');
    });

    it('is deterministic', () => {
      const hash1 = hashString('test-string-123');
      const hash2 = hashString('test-string-123');
      expect(hash1).toBe(hash2);
    });

    it('returns different hashes for different strings', () => {
      const hash1 = hashString('hello');
      const hash2 = hashString('world');
      expect(hash1).not.toBe(hash2);
    });

    it('handles empty strings', () => {
      expect(typeof hashString('')).toBe('number');
    });
  });

  describe('paletteForId', () => {
    it('returns a ThemePalette object with correct properties', () => {
      const palette = paletteForId('test');
      expect(palette).toHaveProperty('bg');
      expect(palette).toHaveProperty('accent');
      expect(palette).toHaveProperty('ink');
    });

    it('is deterministic', () => {
      const palette1 = paletteForId('test-string-123');
      const palette2 = paletteForId('test-string-123');
      expect(palette1).toEqual(palette2);
    });

    it('returns correctly formatted hsl strings', () => {
      const palette = paletteForId('formatting-test');

      const hslRegex = /^hsl\(\d+ \d+% \d+%\)$/;
      expect(palette.bg).toMatch(hslRegex);
      expect(palette.accent).toMatch(hslRegex);
      expect(palette.ink).toMatch(hslRegex);
    });

    it('returns different palettes for different ids', () => {
      const palette1 = paletteForId('id-1');
      const palette2 = paletteForId('id-2');

      // It's possible but extremely unlikely they perfectly match.
      // We can just check that at least one property is different
      expect(palette1).not.toEqual(palette2);
    });

    it('handles empty string id', () => {
      const palette = paletteForId('');
      const hslRegex = /^hsl\(\d+ \d+% \d+%\)$/;
      expect(palette.bg).toMatch(hslRegex);
      expect(palette.accent).toMatch(hslRegex);
      expect(palette.ink).toMatch(hslRegex);
    });
  });
});
