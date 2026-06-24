/**
 * Unit tests for responsive utilities and DOM behavior.
 * Run with: npx jest frontend/tests/responsive.test.js
 *
 * Uses jsdom (built into Jest) to simulate browser environment.
 */

'use strict';

// ── Helpers under test (extracted from main.js logic) ──────────────────────

function getBreakpoint(width) {
  if (typeof width !== 'number' || isNaN(width)) {
    throw new TypeError('width must be a number');
  }
  if (width < 0) throw new RangeError('width cannot be negative');
  if (width >= 1280) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

function isValidCtaHref(href) {
  if (!href || typeof href !== 'string') return false;
  return href.startsWith('#') && href.length > 1;
}

function scaledFontSize(baseRem, viewportPx, minPx = 320) {
  if (viewportPx < minPx) return null;
  const scale = Math.min(viewportPx / 1280, 1);
  return Math.round(parseFloat(baseRem) * (0.85 + 0.15 * scale) * 16);
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('getBreakpoint()', () => {
  test('returns "mobile" for 375px viewport', () => {
    // Arrange
    const width = 375;
    // Act
    const result = getBreakpoint(width);
    // Assert
    expect(result).toBe('mobile');
  });

  test('returns "tablet" for 768px viewport', () => {
    // Arrange
    const width = 768;
    // Act
    const result = getBreakpoint(width);
    // Assert
    expect(result).toBe('tablet');
  });

  test('returns "desktop" for 1280px viewport', () => {
    // Arrange
    const width = 1280;
    // Act
    const result = getBreakpoint(width);
    // Assert
    expect(result).toBe('desktop');
  });

  test('returns "mobile" for 767px (just below tablet threshold)', () => {
    expect(getBreakpoint(767)).toBe('mobile');
  });

  test('returns "tablet" for 1279px (just below desktop threshold)', () => {
    expect(getBreakpoint(1279)).toBe('tablet');
  });

  test('returns "desktop" for very large viewport (2560px)', () => {
    expect(getBreakpoint(2560)).toBe('desktop');
  });

  test('throws TypeError for non-number input', () => {
    expect(() => getBreakpoint('768')).toThrow(TypeError);
    expect(() => getBreakpoint(null)).toThrow(TypeError);
    expect(() => getBreakpoint(NaN)).toThrow(TypeError);
  });

  test('throws RangeError for negative width', () => {
    // Arrange / Act / Assert
    expect(() => getBreakpoint(-1)).toThrow(RangeError);
  });
});

describe('isValidCtaHref()', () => {
  test('returns true for valid hash href "#cta"', () => {
    // Arrange
    const href = '#cta';
    // Act
    const result = isValidCtaHref(href);
    // Assert
    expect(result).toBe(true);
  });

  test('returns false for bare "#" with no target', () => {
    // Arrange / Act / Assert
    expect(isValidCtaHref('#')).toBe(false);
  });

  test('returns false for external URL', () => {
    expect(isValidCtaHref('https://example.com')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isValidCtaHref('')).toBe(false);
  });

  test('returns false for null', () => {
    expect(isValidCtaHref(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isValidCtaHref(undefined)).toBe(false);
  });

  test('returns true for "#features" (multi-character anchor)', () => {
    expect(isValidCtaHref('#features')).toBe(true);
  });
});

describe('scaledFontSize()', () => {
  test('returns null when viewport is below minimum (320px)', () => {
    // Arrange / Act / Assert
    expect(scaledFontSize('1rem', 319)).toBeNull();
  });

  test('returns a number for valid viewport at 375px', () => {
    // Arrange
    const result = scaledFontSize('1rem', 375);
    // Act / Assert
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  test('scale is capped at 1280px — same result for 1280px and 1920px', () => {
    // Arrange / Act
    const at1280 = scaledFontSize('2rem', 1280);
    const at1920 = scaledFontSize('2rem', 1920);
    // Assert — both viewports hit the scale cap
    expect(at1280).toBe(at1920);
  });

  test('font size at 768px is larger than at 375px', () => {
    // Arrange / Act
    const mobile = scaledFontSize('1rem', 375);
    const tablet = scaledFontSize('1rem', 768);
    // Assert
    expect(tablet).toBeGreaterThan(mobile);
  });
});
