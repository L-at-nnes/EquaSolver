// ===================================
// NUMERIC INPUT HELPERS
// ===================================

/**
 * Parse a number typed by the user. Accepts a decimal comma ("1,5" on French,
 * German, Spanish, Italian and Russian keyboards) and the unicode minus sign,
 * and rejects trailing garbage ("5abc") instead of silently truncating it.
 * @param {string|number} value
 * @returns {number} the number, or NaN when the text is not a number
 */
function parseDecimal(value) {
    if (typeof value === 'number') return value;
    if (value === null || value === undefined) return NaN;
    const text = String(value).trim().replace(/−/g, '-').replace(',', '.');
    if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(text)) return NaN;
    return parseFloat(text);
}

/**
 * Read a numeric input. A blank field yields the fallback, but a typed 0 is
 * kept (the old `parseFloat(x) || fallback` pattern turned 0 into the fallback).
 * @param {string} id element id
 * @param {number} fallback value used when the field is empty or missing
 * @returns {number} NaN when the field holds something that is not a number
 */
function readNumberInput(id, fallback) {
    const element = document.getElementById(id);
    const raw = element ? element.value : '';
    if (raw === undefined || raw === null || String(raw).trim() === '') return fallback;
    return parseDecimal(raw);
}

/**
 * Escape text before inserting it in innerHTML (expressions typed by the user
 * are echoed back in results and history).
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[ch]);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseDecimal,
        readNumberInput,
        escapeHtml
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.parseDecimal = parseDecimal;
    window.readNumberInput = readNumberInput;
    window.escapeHtml = escapeHtml;
    window.escapeHtml = escapeHtml;
}
