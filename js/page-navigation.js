/* =========================================
   PAGE TRANSITIONS
   Adds a short fade between local HTML pages. External links, downloads,
   modified clicks, and reduced-motion preferences keep their normal behavior.
   ========================================= */
(() => {
    const root = document.documentElement;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const storageKey = 'pageFadeDestination';
    let navigating = false;

    // Restore the arrival animation only after a recent in-site navigation.
    try {
        const pending = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
        sessionStorage.removeItem(storageKey);
        if (pending && pending.url === location.href && Date.now() - pending.time < 10000 && !reducedMotion.matches) {
            root.dataset.pageFade = 'arriving';
        }
    } catch {
        // Navigation still works when storage is unavailable.
    }

    if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward' && !reducedMotion.matches) {
        root.dataset.pageFade = 'arriving';
    }

    const revealPage = () => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            root.removeAttribute('data-page-fade');
        }));
    };

    document.addEventListener('DOMContentLoaded', () => {
        if (!root.hasAttribute('data-page-fade')) return;
        const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
        Promise.race([fontsReady, new Promise(resolve => setTimeout(resolve, 500))]).then(revealPage);
    }, { once: true });

    // Intercept only ordinary same-site HTML navigation.
    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
        const link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const destination = new URL(link.href, location.href);
        if (destination.origin !== location.origin || !['http:', 'https:', 'file:'].includes(destination.protocol)) return;
        if (destination.pathname === location.pathname && destination.search === location.search) return;
        if (!destination.pathname.endsWith('.html') && !destination.pathname.endsWith('/')) return;

        event.preventDefault();
        if (navigating) return;
        navigating = true;
        root.dataset.pageFade = 'leaving';
        setTimeout(() => {
            try {
                sessionStorage.setItem(storageKey, JSON.stringify({ url: destination.href, time: Date.now() }));
            } catch {
                // Do not hold up a normal link when storage is unavailable.
            }
            location.assign(destination.href);
        }, 180);
    });

    window.addEventListener('pageshow', event => {
        navigating = false;
        if (event.persisted && !reducedMotion.matches) {
            root.dataset.pageFade = 'arriving';
            revealPage();
        } else if (root.dataset.pageFade === 'leaving') {
            root.removeAttribute('data-page-fade');
        }
    });
})();
