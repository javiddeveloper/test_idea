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

document.addEventListener('DOMContentLoaded', () => {
  initCtaButtons();
});
