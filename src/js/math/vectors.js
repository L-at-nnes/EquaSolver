// ===================================
// VECTOR OPERATIONS
// ===================================

// Parses "1, 2, 3", "1 2 3" or "(1;2;3)" into an array of numbers (2 to 6 components), or null.
function parseVector(text) {
    if (typeof text !== 'string') return null;
    const parts = text.replace(/[()[\]]/g, ' ').replace(/(\d),(\d)/g, '$1.$2').split(/[\s;,]+/).filter(Boolean);
    if (parts.length < 2 || parts.length > 6) return null;
    const values = parts.map(p => (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(p) ? parseFloat(p) : NaN));
    return values.every(Number.isFinite) ? values : null;
}

function vectorAdd(a, b) {
    return a.length === b.length ? a.map((x, i) => x + b[i]) : null;
}

function vectorSub(a, b) {
    return a.length === b.length ? a.map((x, i) => x - b[i]) : null;
}

function dotProduct(a, b) {
    return a.length === b.length ? a.reduce((s, x, i) => s + x * b[i], 0) : null;
}

// 3D cross product; for two 2D vectors returns the scalar z component.
function crossProduct(a, b) {
    if (a.length !== b.length) return null;
    if (a.length === 2) return a[0] * b[1] - a[1] * b[0];
    if (a.length !== 3) return null;
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function vectorNorm(a) {
    return Math.hypot(...a);
}

// Angle in radians in [0, pi], or null for a zero vector or mismatched sizes.
function vectorAngle(a, b) {
    const na = vectorNorm(a);
    const nb = vectorNorm(b);
    const dot = dotProduct(a, b);
    if (dot === null || na === 0 || nb === 0) return null;
    return Math.acos(Math.min(1, Math.max(-1, dot / (na * nb))));
}

// Projection of a onto b.
function vectorProjection(a, b) {
    const dot = dotProduct(a, b);
    const bb = dotProduct(b, b);
    if (dot === null || bb === 0) return null;
    return b.map(x => x * dot / bb);
}

function formatVector(v, decimals = 4) {
    return '(' + v.map(x => String(parseFloat(x.toFixed(decimals)))).join(', ') + ')';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseVector, vectorAdd, vectorSub, dotProduct, crossProduct, vectorNorm, vectorAngle, vectorProjection, formatVector };
}

if (typeof window !== 'undefined') {
    window.parseVector = parseVector;
    window.vectorAdd = vectorAdd;
    window.vectorSub = vectorSub;
    window.dotProduct = dotProduct;
    window.crossProduct = crossProduct;
    window.vectorNorm = vectorNorm;
    window.vectorAngle = vectorAngle;
    window.vectorProjection = vectorProjection;
    window.formatVector = formatVector;
}
