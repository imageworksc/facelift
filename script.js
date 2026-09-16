/* ==========================================================================
   ImageWorks Creative — Homepage Facelift

   Everything else on the page is CSS. Two things need a script: the entrance
   reveal, because it has to know when a section comes into view, and the FAQ,
   which scrolls an answer back into view if it opens off the edge. Both are
   the system's own routines, unchanged.

   Loaded with `defer`, so the document is parsed by the time this runs.
   ========================================================================== */

'use strict';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const ANCHOR_OFFSET = 24;

/* --------------------------------------------------------------------------
   Entrance reveals. Once per element, and only where the browser supports
   IntersectionObserver and the visitor has not asked for reduced motion.
   -------------------------------------------------------------------------- */
function setupReveals() {
  const targets = Array.from(document.querySelectorAll('.reveal'));
  if (!targets.length) return;

  // Either way the flag goes on: the stylesheet only hides a reveal while the
  // page is in a position to bring it back.
  root.setAttribute('data-anim', 'on');

  if (reduced.matches || !('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-revealed');
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      io.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  for (const el of targets) io.observe(el);

  // The negative rootMargin means anything sitting in the last slice of a
  // fully-scrolled page would never trigger. Once the visitor reaches the
  // bottom, reveal whatever is still waiting.
  const revealRemainder = () => {
    const atBottom = window.innerHeight + window.scrollY >=
                     document.documentElement.scrollHeight - 2;
    if (!atBottom) return;

    for (const el of targets) {
      if (el.classList.contains('is-revealed')) continue;
      el.classList.add('is-revealed');
      io.unobserve(el);
    }
    window.removeEventListener('scroll', revealRemainder);
  };

  window.addEventListener('scroll', revealRemainder, { passive: true });
  window.addEventListener('load', revealRemainder);
  revealRemainder();
}

/* --------------------------------------------------------------------------
   FAQ. The accordion itself is native <details>; this only nudges an opened
   answer back into view if it ended up above the top edge or past the fold.
   -------------------------------------------------------------------------- */
function setupFaq() {
  const faq = document.querySelector('[data-faq]');
  if (!faq) return;

  for (const item of faq.querySelectorAll('details')) {
    item.addEventListener('toggle', () => {
      if (!item.open) return;

      const settle = () => {
        const box = item.getBoundingClientRect();
        const hiddenAbove = box.top < ANCHOR_OFFSET;
        const hiddenBelow = box.bottom > window.innerHeight &&
                            box.height < window.innerHeight - ANCHOR_OFFSET;
        if (!hiddenAbove && !hiddenBelow) return;

        window.scrollTo({
          top: box.top + window.scrollY - ANCHOR_OFFSET,
          behavior: reduced.matches ? 'auto' : 'smooth',
        });
      };

      // wait out the height transition before measuring
      if (reduced.matches) settle();
      else window.setTimeout(settle, 380);
    });
  }
}

setupReveals();
setupFaq();
