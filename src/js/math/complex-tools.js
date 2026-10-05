// ===================================
// COMPLEX NUMBER INPUT, POLAR FORM AND ROOTS
// ===================================

// Parses "3+4i", "-2.5i", "i", "1e2-i" (also "j", spaces and a decimal comma). Returns {re, im} or null.
function parseComplex(text) {
    if (typeof text !== 'string') return null;
    const s = text.replace(/\s+/g, '').replace(/,/g, '.').toLowerCase();
    if (!s) return null;

    const term = /([+-]?)(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+(?:e[+-]?\d+)?)?([ij]?)/y;
    let re = 0;
    let im = 0;
    let pos = 0;
    while (pos < s.length) {
        term.lastIndex = pos;
        const m = term.exec(s);
        if (!m || m[0].length === 0 || (m[2] === undefined && !m[3])) return null;
        if (pos > 0 && !m[1]) return null;
        const sign = m[1] === '-' ? -1 : 1;
        const value = sign * (m[2] === undefined ? 1 : parseFloat(m[2]));
        if (m[3]) im += value; else re += value;
        pos = term.lastIndex;
    }
    return Number.isFinite(re) && Number.isFinite(im) ? { re, im } : null;
}

function complexArg(z) {
    return Math.atan2(z.im, z.re);
}

function toPolar(z) {
    return { r: Math.hypot(z.re, z.im), theta: complexArg(z) };
}

function fromPolar(r, theta) {
    return { re: r * Math.cos(theta), im: r * Math.sin(theta) };
}

// All n distinct n-th roots of z, starting from the principal one.
function complexRoots(z, n) {
    if (!Number.isInteger(n) || n < 1) return [];
    const { r, theta } = toPolar(z);
    if (r === 0) return [{ re: 0, im: 0 }];
    const radius = Math.pow(r, 1 / n);
    const roots = [];
    for (let k = 0; k < n; k++) roots.push(fromPolar(radius, (theta + 2 * Math.PI * k) / n));
    return roots;
}

// Integer powers by repeated squaring, exact for small Gaussian integers.
function complexIntPow(z, n) {
    if (!Number.isInteger(n)) return null;
    if (n < 0) return complexDiv({ re: 1, im: 0 }, complexIntPow(z, -n));
    let result = { re: 1, im: 0 };
    let base = z;
    let e = n;
    while (e > 0) {
        if (e & 1) result = complexMul(result, base);
        base = complexMul(base, base);
        e = Math.floor(e / 2);
    }
    return result;
}

function formatPolar(z, decimals = 4) {
    const { r, theta } = toPolar(z);
    const deg = theta * 180 / Math.PI;
    return `${r.toFixed(decimals)} (cos ${theta.toFixed(decimals)} + i sin ${theta.toFixed(decimals)})  [${deg.toFixed(2)}°]`;
}

if (typeof module !== 'undefined' && module.exports) {
    const c = require('./complex.js');
    global.complexMul = global.complexMul || c.complexMul;
    global.complexDiv = global.complexDiv || c.complexDiv;
    module.exports = { parseComplex, complexArg, toPolar, fromPolar, complexRoots, complexIntPow, formatPolar };
}

if (typeof window !== 'undefined') {
    window.parseComplex = parseComplex;
    window.complexArg = complexArg;
    window.toPolar = toPolar;
    window.fromPolar = fromPolar;
    window.complexRoots = complexRoots;
    window.complexIntPow = complexIntPow;
    window.formatPolar = formatPolar;
}
