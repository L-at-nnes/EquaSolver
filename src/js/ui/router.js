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
    return parseToolRoute(hash, toolIds).tool;
}

const SHARE_LIMITS = { entries: 60, valueLength: 500 };

/**
 * Split "#quadratic?quadA=1&quadB=-3" into the tool id and its saved inputs.
 * Unknown tools give tool = null; keys that are not plain ids and over-long values are dropped.
 * @param {string} hash
 * @param {string[]} toolIds
 * @returns {{tool: string|null, params: Object<string,string>}}
 */
function parseToolRoute(hash, toolIds) {
    const raw = String(hash || '').replace(/^#\/?/, '').trim();
    const cut = raw.indexOf('?');
    const id = (cut === -1 ? raw : raw.slice(0, cut)).trim();
    const tool = toolIds.includes(id) ? id : null;
    const params = {};
    if (tool && cut !== -1) {
        let count = 0;
        for (const [key, value] of new URLSearchParams(raw.slice(cut + 1))) {
            if (count >= SHARE_LIMITS.entries) break;
            if (!/^[A-Za-z][\w-]*$/.test(key) || value.length > SHARE_LIMITS.valueLength) continue;
            params[key] = value;
            count++;
        }
    }
    return { tool, params };
}

/** Current values of the form controls of a panel, keyed by element id (empty ones skipped). */
function collectPanelParams(panel) {
    const params = {};
    panel.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
        if (['button', 'submit', 'reset', 'file', 'password'].includes(el.type) || el.dataset.noShare !== undefined) return;
        if (el.type === 'checkbox' || el.type === 'radio') {
            params[el.id] = el.checked ? '1' : '0';
        } else if (String(el.value).trim() !== '' && el.value.length <= SHARE_LIMITS.valueLength) {
            params[el.id] = el.value;
        }
    });
    return params;
}

/**
 * Put saved values back. Selects go first and fire "change" so dependent fields (matrix
 * grids, unit lists) are rebuilt before their values are filled in.
 * @returns {number} how many controls were set
 */
function applyPanelParams(panel, params) {
    let applied = 0;
    const find = id => (/^[A-Za-z][\w-]*$/.test(id) ? panel.querySelector(`[id="${id}"]`) : null);
    const entries = Object.entries(params);

    entries.forEach(([id, value]) => {
        const el = find(id);
        if (!el || el.tagName !== 'SELECT') return;
        if ([...el.options].some(option => option.value === value)) {
            el.value = value;
            el.dispatchEvent(new Event('change', { bubbles: true }));
            applied++;
        }
    });
    entries.forEach(([id, value]) => {
        const el = find(id);
        if (!el || el.tagName === 'SELECT') return;
        if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = value === '1';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        applied++;
    });
    return applied;
}

/** "https://host/app/index.html#quadratic?quadA=1&quadB=-3" */
function buildShareUrl(base, toolId, params) {
    const query = new URLSearchParams(params).toString();
    return `${base}#${toolId}${query ? `?${query}` : ''}`;
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
    module.exports = { parseToolHash, parseToolRoute, writeToolHash, collectPanelParams, applyPanelParams, buildShareUrl };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.parseToolHash = parseToolHash;
    window.parseToolRoute = parseToolRoute;
    window.collectPanelParams = collectPanelParams;
    window.applyPanelParams = applyPanelParams;
    window.buildShareUrl = buildShareUrl;
    window.writeToolHash = writeToolHash;
}
