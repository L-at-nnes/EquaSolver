// ===================================
// HASH ROUTING
// ===================================

/**
 * Turn a location hash ("#quadratic", "#/graph") into a known tool id.
 * @param {string} hash
 * @param {string[]} toolIds ids of the panels that exist
 * @returns {string|null} the tool id, or null when the hash names nothing known
 */
function parseToolHash(hash, toolIds) {
    const id = String(hash || '').replace(/^#\/?/, '').trim();
    return toolIds.includes(id) ? id : null;
}

/**
 * Reflect the open tool in the address bar without adding history entries,
 * so a copied link reopens the same tool. Passing null clears the hash.
 * @param {string|null} toolId
 */
function writeToolHash(toolId) {
    if (typeof history === 'undefined' || typeof location === 'undefined') return;
    const url = location.pathname + location.search + (toolId ? `#${toolId}` : '');
    history.replaceState(null, '', url);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseToolHash, writeToolHash };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.parseToolHash = parseToolHash;
    window.writeToolHash = writeToolHash;
}
