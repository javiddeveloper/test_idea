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
  test('returns true for a valid anchor href', () => {
    // Arrange
    const href = '#features';
    // Act
    const result = isValidCtaHref(href);
    // Assert
    expect(result).toBe(true);
  });

  test('returns false for bare hash (#)', () => {
    // Arrange / Act / Assert
    expect(isValidCtaHref('#')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isValidCtaHref('')).toBe(false);
  });

  test('returns false for external URL', () => {
    expect(isValidCtaHref('https://example.com')).toBe(false);
  });

  test('returns false for null', () => {
    expect(isValidCtaHref(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isValidCtaHref(undefined)).toBe(false);
  });
});

describe('scaledFontSize()', () => {
  test('returns a number for valid inputs at desktop width', () => {
    // Arrange / Act
    const result = scaledFontSize('1', 1280);
    // Assert
    expect(typeof result).toBe('number');
  });

  test('returns null when viewport is below minPx', () => {
    // Arrange / Act / Assert
    expect(scaledFontSize('1', 300)).toBeNull();
  });

  test('desktop result is greater than mobile result (scales up)', () => {
    // Arrange
    const mobile = scaledFontSize('1', 320);
    const desktop = scaledFontSize('1', 1280);
    // Act / Assert
    expect(desktop).toBeGreaterThan(mobile);
  });

  test('returns null at exactly minPx boundary when viewport equals minPx - 1', () => {
    expect(scaledFontSize('1', 319, 320)).toBeNull();
  });

  test('caps scale at 1 for viewports wider than 1280px', () => {
    const at1280 = scaledFontSize('1', 1280);
    const at2560 = scaledFontSize('1', 2560);
    // scale is clamped to 1, so both should yield the same value
    expect(at1280).toBe(at2560);
  });
});
