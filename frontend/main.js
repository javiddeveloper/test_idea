'use strict';

/**
 * Smoothly scrolls to the target element of a CTA link.
 * @param {MouseEvent} event
 */
function handleCtaClick(event) {
  const href = event.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Attaches click handlers to all CTA buttons.
 */
function initCtaButtons() {
  const ctaButtons = document.querySelectorAll('.btn');
  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', handleCtaClick);
  });
}

/**
 * Logs the current viewport width for responsive debugging.
 */
function logViewport() {
  const width = window.innerWidth;
  let breakpoint = 'mobile (< 768px)';
  if (width >= 1280) breakpoint = 'desktop (>= 1280px)';
  else if (width >= 768) breakpoint = 'tablet (>= 768px)';
  console.info(`[ttttt] Viewport: ${width}px — ${breakpoint}`);
}

document.addEventListener('DOMContentLoaded', () => {
  initCtaButtons();
  logViewport();
  window.addEventListener('resize', logViewport);
});
