// ===================================
// MOTION HELPERS
// ===================================

/**
 * Run a DOM update inside a View Transition when the browser supports it, so the
 * outgoing and incoming states cross-fade (and shared elements morph). Falls back
 * to a plain synchronous update, and skips animation for reduced-motion users.
 * @param {() => void} update
 */
function runViewTransition(update) {
    const supported = typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
    const reduced = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supported || reduced) {
        update();
        return;
    }
    document.startViewTransition(update);
}

/**
 * Feed the pointer position to tiles as --mx / --my so CSS can draw a spotlight
 * that follows the cursor. Delegated, so tiles rendered later work too.
 * @param {ParentNode} root
 */
function trackPointerSpotlight(root = document) {
    root.addEventListener('pointermove', event => {
        const tile = event.target.closest && event.target.closest('.tool-card');
        if (!tile) return;
        const box = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', `${event.clientX - box.left}px`);
        tile.style.setProperty('--my', `${event.clientY - box.top}px`);
    }, { passive: true });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runViewTransition,
        trackPointerSpotlight
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.runViewTransition = runViewTransition;
    window.trackPointerSpotlight = trackPointerSpotlight;
}
