// ===================================
// GEOMETRY FORMULAS
// ===================================

// Number of dimensions each shape expects, in input order.
const SHAPE_DIMENSIONS = {
    circle: 1,
    rectangle: 2,
    triangle: 3,
    sphere: 1,
    cylinder: 2,
    cone: 2,
    box: 3
};

// Returns an object of measurements (area, perimeter, volume, surface), or null for invalid dimensions.
// Dimensions are r | w,h | a,b,c (sides) | r,h | l,w,h.
function computeShape(shape, dims) {
    const expected = SHAPE_DIMENSIONS[shape];
    if (!expected || !Array.isArray(dims) || dims.length !== expected) return null;
    if (!dims.every(d => Number.isFinite(d) && d > 0)) return null;

    switch (shape) {
        case 'circle': {
            const [r] = dims;
            return { area: Math.PI * r * r, perimeter: 2 * Math.PI * r };
        }
        case 'rectangle': {
            const [w, h] = dims;
            return { area: w * h, perimeter: 2 * (w + h) };
        }
        case 'triangle': {
            const [a, b, c] = dims;
            if (a + b <= c || a + c <= b || b + c <= a) return null;
            const s = (a + b + c) / 2;
            return { area: Math.sqrt(s * (s - a) * (s - b) * (s - c)), perimeter: a + b + c };
        }
        case 'sphere': {
            const [r] = dims;
            return { volume: 4 / 3 * Math.PI * r ** 3, surface: 4 * Math.PI * r * r };
        }
        case 'cylinder': {
            const [r, h] = dims;
            return { volume: Math.PI * r * r * h, surface: 2 * Math.PI * r * (r + h) };
        }
        case 'cone': {
            const [r, h] = dims;
            const slant = Math.hypot(r, h);
            return { volume: Math.PI * r * r * h / 3, surface: Math.PI * r * (r + slant), slant };
        }
        case 'box': {
            const [l, w, h] = dims;
            return { volume: l * w * h, surface: 2 * (l * w + l * h + w * h) };
        }
    }
    return null;
}

// Parses "3, 4" or "3 4" into numbers; accepts a decimal comma between digits. Returns null on bad input.
function parseDimensions(text) {
    if (typeof text !== 'string') return null;
    const parts = text.replace(/(\d),(\d)/g, '$1.$2').split(/[\s;,]+/).filter(Boolean);
    if (!parts.length) return null;
    const values = parts.map(p => (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(p) ? parseFloat(p) : NaN));
    return values.every(Number.isFinite) ? values : null;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SHAPE_DIMENSIONS, computeShape, parseDimensions };
}

if (typeof window !== 'undefined') {
    window.SHAPE_DIMENSIONS = SHAPE_DIMENSIONS;
    window.computeShape = computeShape;
    window.parseDimensions = parseDimensions;
}
