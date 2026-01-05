/* intro-wrapper.js
   Lightweight wrapper to start IntroJS tours safely and consistently.
   - Uses introJs.tour() when available (v8+)
   - Applies sensible defaults (tooltipClass, labels, dark-mode support)
   - Exposes SafeIntro.start(options) and SafeIntro.startFromDataAttrs()
*/
(function (window, document) {
  'use strict';

  const DEFAULT_OPTIONS = {
    tooltipClass: 'bootstrap-card-tooltip',
    highlightClass: 'tour-highlight-custom',
     nextLabel: 'Siguiente',
     prevLabel: 'Anterior',
     doneLabel: 'Listo',
     skipLabel: 'x',
    tooltipPosition: 'auto',
    showBullets: true,
    showStepNumbers: false,
    exitOnOverlayClick: false,
    keyboardNavigation: true,
    overlayOpacity: 0.7
  };

  function merge(a, b) {
    return Object.assign({}, a, b || {});
  }

  function hasIntro() {
    return typeof window.introJs !== 'undefined' && window.introJs !== null;
  }

  function hasTourApi() {
    return hasIntro() && typeof window.introJs.tour === 'function';
  }

  function startTour(options) {
    const opts = merge(DEFAULT_OPTIONS, options || {});
    if (!hasIntro()) {
      console.warn('SafeIntro: introJs not present');
      return false;
    }

    // Helper to clamp tooltip into viewport after each step
    function clampTooltipIntoView() {
      const tip = document.querySelector('.introjs-tooltip');
      if (!tip) return;
      // Use fixed positioning so coordinates are relative to viewport
      tip.classList.add('fixed-by-wrapper');
      // compute size and clamp
      const rect = tip.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const pad = 12; // keep some breathing room

      let left = rect.left;
      let top = rect.top;

      if (rect.left < pad) left = pad;
      if (rect.right > vw - pad) left = Math.max(pad, vw - pad - rect.width);
      if (rect.top < pad) top = pad;
      if (rect.bottom > vh - pad) top = Math.max(pad, vh - pad - rect.height);

      tip.style.left = Math.round(left) + 'px';
      tip.style.top = Math.round(top) + 'px';
      // ensure arrow doesn't overflow (best-effort: keep transform none)
      tip.style.transform = 'none';
    }

    if (hasTourApi()) {
      const inst = window.introJs.tour().setOptions(opts);
      inst.onafterchange(function () {
        // wait a frame for DOM updates then clamp
        window.requestAnimationFrame(() => clampTooltipIntoView());
      });
      inst.onexit(function () { /* cleanup style changes */
        const tip = document.querySelector('.introjs-tooltip');
        if (tip) { tip.classList.remove('fixed-by-wrapper'); tip.style.left = ''; tip.style.top = ''; tip.style.transform = ''; }
      });
      inst.start();
      return true;
    }

    // If the library does not provide tour(), avoid calling introJs() directly to prevent deprecation warnings.
    // As a last resort, if introJs is callable and nothing else is available, call it (may show deprecation warning).
    if (typeof window.introJs === 'function') {
      try {
        const inst = window.introJs().setOptions(opts);
        inst.onafterchange(function () {
          window.requestAnimationFrame(() => clampTooltipIntoView());
        });
        inst.onexit(function () {
          const tip = document.querySelector('.introjs-tooltip');
          if (tip) { tip.classList.remove('fixed-by-wrapper'); tip.style.left = ''; tip.style.top = ''; tip.style.transform = ''; }
        });
        inst.start();
        return true;
      } catch (err) {
        console.warn('SafeIntro: failed to start fallback introJs()', err);
      }
    }

    return false;
  }

  // Build steps from elements with data-step and data-intro attributes
  function collectStepsFromDataAttrs(root) {
    root = root || document;
    const stepNodes = Array.from(root.querySelectorAll('[data-step]'))
      .sort((a, b) => Number(a.getAttribute('data-step')) - Number(b.getAttribute('data-step')));

    const steps = stepNodes.map((el) => {
      return {
        element: el,
        intro: el.getAttribute('data-intro') || '',
        title: el.getAttribute('data-title') || undefined,
        position: el.getAttribute('data-position') || undefined
      };
    });
    return steps;
  }

  function startFromDataAttrs(root, options) {
    const steps = collectStepsFromDataAttrs(root);
    if (!steps || !steps.length) return false;
    const opts = merge(DEFAULT_OPTIONS, options || {});
    opts.steps = steps;
    return startTour(opts);
  }

  // expose API
  window.SafeIntro = {
    start: startTour,
    startFromDataAttrs: startFromDataAttrs,
    isAvailable: hasIntro,
    hasTourApi: hasTourApi,
    defaults: DEFAULT_OPTIONS
  };

})(window, document);
