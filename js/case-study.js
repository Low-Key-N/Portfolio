/* =========================================
   CASE-STUDY SCROLL CONTROLS
   Keeps the right rail in sync with the visible section and provides
   accessible smooth scrolling for the in-page links.
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const sections = [...document.querySelectorAll('[data-case-section]')];
    const links = [...document.querySelectorAll('.case-rail a')];
    const rail = document.querySelector('.case-rail');
    const backdrop = document.querySelector('.case-section-backdrop');
    let scheduled = false;

    // Read layout once per animation frame so rapid scrolling stays inexpensive.
    const updateTracker = () => {
        scheduled = false;
        let active = sections[0];
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= 160) active = section;
        }
        if (scrollY + innerHeight >= document.documentElement.scrollHeight - 8) active = sections.at(-1);
        links.forEach(link => {
            if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        if (rail && backdrop) {
            const bounds = backdrop.getBoundingClientRect();
            const railBounds = rail.getBoundingClientRect();
            const midpoint = railBounds.top + railBounds.height / 2;
            rail.classList.toggle('is-over-dark', bounds.top <= midpoint && bounds.bottom >= midpoint);
        }
    };

    // Preserve modifier-key behavior while making normal in-page links smooth and focusable.
    document.querySelectorAll('.case-rail a, .case-end-links a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const section = document.querySelector(link.hash);
            if (!section) return;
            event.preventDefault();
            history.pushState(null, '', link.hash);
            section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
            section.setAttribute('tabindex', '-1');
            section.focus({ preventScroll: true });
        });
    });

    // Coalesce scroll events into one visual update per frame.
    window.addEventListener('scroll', () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(updateTracker);
    }, { passive: true });
    window.addEventListener('resize', updateTracker);
    updateTracker();
});
