// ===================================
// TOOL SEARCH
// ===================================

/**
 * Lowercase and strip accents so "equations" matches "Équations".
 * @param {string} text
 */
function normalizeSearchText(text) {
    return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * True when every word of the query appears somewhere in the text.
 * An empty query matches everything.
 * @param {string} query
 * @param {string} text
 */
function matchesSearch(query, text) {
    const words = normalizeSearchText(query).split(/\s+/).filter(Boolean);
    const haystack = normalizeSearchText(text);
    return words.every(word => haystack.includes(word));
}

/**
 * Show only the tool tiles that match the query and reveal the empty message
 * when nothing does.
 * @param {string} query
 * @param {ParentNode} root
 * @returns {number} how many tiles stay visible
 */
function filterToolCards(query, root = document) {
    let visible = 0;
    root.querySelectorAll('.tool-card').forEach(card => {
        const show = matchesSearch(query, card.textContent);
        card.hidden = !show;
        if (show) visible++;
    });
    const empty = root.querySelector('#toolSearchEmpty');
    if (empty) empty.hidden = visible > 0;
    return visible;
}

function setupToolSearch() {
    const input = document.getElementById('toolSearch');
    if (!input) return;
    input.addEventListener('input', () => filterToolCards(input.value));
    // Escape clears the filter
    input.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            input.value = '';
            filterToolCards('');
        }
    });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalizeSearchText, matchesSearch, filterToolCards, setupToolSearch };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.matchesSearch = matchesSearch;
    window.filterToolCards = filterToolCards;
    window.setupToolSearch = setupToolSearch;
}
