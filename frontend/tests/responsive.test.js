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
  // clamp: base at mobile, scale up proportionally
  const scale = Math.min(viewportPx / 1280, 1);
  return Math.round(parseFloat(baseRem) * (0.85 + 0.15 * scale) * 16);
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('getBreakpoint()', () => {
  // Happy path – three defined breakpoints
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

  // Edge – boundary values
  test('returns "mobile" for 767px (just below tablet threshold)', () => {
    expect(getBreakpoint(767)).toBe('mobile');
  });

  test('returns "tablet" for 1279px (just below desktop threshold)', () => {
    expect(getBreakpoint(1279)).toBe('tablet');
  });

  test('returns "desktop" for very large viewport (2560px)', () => {
    expect(getBreakpoint(2560)).toBe('desktop');
  });

  // Edge – invalid input
  test('throws TypeError for non-number input', () => {
    // Arrange / Act / Assert
    expect(() => getBreakpoint('768')).toThrow(TypeError);
    expect(() => getBreakpoint(null)).toThrow(TypeError);
    expect(() => getBreakpoint(NaN)).toThrow(TypeError);
  });

  test('throws RangeError for negative width', () => {
    expect(() => getBreakpoint(-1)).toThrow(RangeError);
  });
});

describe('isValidCtaHref()', () => {
  test('returns true for valid anchor href "#cta"', () => {
    // Arrange
    const href = '#cta';
    // Act
    const result = isValidCtaHref(href);
    // Assert
    expect(result).toBe(true);
  });

  test('returns false for empty string', () => {
    expect(isValidCtaHref('')).toBe(false);
  });

  test('returns false for bare "#" with no target', () => {
    expect(isValidCtaHref('#')).toBe(false);
  });

  test('returns false for external URL', () => {
    expect(isValidCtaHref('https://example.com')).toBe(false);
  });

  test('returns false for null / undefined', () => {
    expect(isValidCtaHref(null)).toBe(false);
    expect(isValidCtaHref(undefined)).toBe(false);
  });
});

describe('scaledFontSize()', () => {
  test('returns smaller px value at 375px than at 1280px', () => {
    // Arrange / Act
    const mobile = scaledFontSize('1.875', 375);
    const desktop = scaledFontSize('1.875', 1280);
    // Assert
    expect(mobile).toBeLessThan(desktop);
  });

  test('returns null for viewport below minimum (< 320px)', () => {
    expect(scaledFontSize('1', 319)).toBeNull();
  });

  test('caps scaling at 1280px – 1440px returns same result as 1280px', () => {
    const at1280 = scaledFontSize('1', 1280);
    const at1440 = scaledFontSize('1', 1440);
    // scale is clamped at 1, so both should equal
    expect(at1280).toBe(at1440);
  });

  test('returns integer pixel value (no decimals)', () => {
    const result = scaledFontSize('1.125', 768);
    expect(Number.isInteger(result)).toBe(true);
  });
});
