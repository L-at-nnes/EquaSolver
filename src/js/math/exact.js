// ===================================
// EXACT FORMS
// ===================================

function exactGcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * Split n into k^2 * m with m squarefree.
 * @param {number} n positive integer
 * @returns {{k:number, m:number}}
 */
function extractSquare(n) {
    let k = 1;
    let m = n;
    for (let p = 2; p * p <= m; p++) {
        while (m % (p * p) === 0) {
            m /= p * p;
            k *= p;
        }
    }
    return { k, m };
}

// Scale decimal coefficients (0.5, 1.25) to integers; null when that is not safe
function toIntegerCoefficients(values) {
    let factor = 1;
    for (const value of values) {
        if (!Number.isFinite(value)) return null;
        let scaled = value;
        let steps = 0;
        while (!Number.isInteger(parseFloat(scaled.toPrecision(12))) && steps < 6) {
            scaled *= 10;
            steps++;
        }
        if (!Number.isInteger(parseFloat(scaled.toPrecision(12)))) return null;
        factor = Math.max(factor, Math.pow(10, steps));
    }
    const scaled = values.map(v => Math.round(v * factor));
    return scaled.every(Number.isSafeInteger) ? scaled : null;
}

function formatFraction(numerator, denominator) {
    const g = exactGcd(numerator, denominator) || 1;
    let n = numerator / g;
    let d = denominator / g;
    if (d < 0) {
        n = -n;
        d = -d;
    }
    return d === 1 ? String(n) : `${n}/${d}`;
}

/**
 * Exact roots of ax^2 + bx + c = 0 for rational coefficients.
 * @returns {null | {kind:'rational'|'radical'|'complex', roots:string[], combined:string|null}}
 *   roots[0] is the "+" root. combined uses the plus-minus sign for radical/complex results.
 *   null when the inputs are not rational, a = 0, or the numbers get too large to stay exact.
 */
function exactQuadraticRoots(a, b, c) {
    const ints = toIntegerCoefficients([a, b, c]);
    if (!ints || ints[0] === 0) return null;

    let [A, B, C] = ints;
    if (A < 0) {
        A = -A;
        B = -B;
        C = -C;
    }
    const common = exactGcd(exactGcd(A, B), C) || 1;
    A /= common;
    B /= common;
    C /= common;

    const delta = B * B - 4 * A * C;
    if (!Number.isSafeInteger(delta)) return null;

    if (delta === 0) {
        const root = formatFraction(-B, 2 * A);
        return { kind: 'rational', roots: [root], combined: null };
    }

    const { k, m } = extractSquare(Math.abs(delta));

    if (delta > 0 && m === 1) {
        return {
            kind: 'rational',
            roots: [formatFraction(-B + k, 2 * A), formatFraction(-B - k, 2 * A)],
            combined: null
        };
    }

    // (-B +/- k*sqrt(m)) / 2A, reduced by the common factor of B, k and 2A
    const g = exactGcd(exactGcd(B, k), 2 * A) || 1;
    const real = -B / g;
    const radicalCoefficient = k / g;
    const denominator = (2 * A) / g;
    const lead = radicalCoefficient === 1 ? '' : radicalCoefficient;
    // sqrt(1) is dropped: a purely imaginary part with a perfect-square discriminant is just "2i"
    const radical = delta < 0 && m === 1 ? `${lead}i` : `${lead}${delta < 0 ? 'i' : ''}√${m}`;

    const build = sign => {
        const top = real === 0
            ? `${sign === '-' ? '-' : ''}${radical}`
            : `${real} ${sign} ${radical}`;
        if (denominator === 1) return top;
        return real === 0 ? `${top}/${denominator}` : `(${top}) / ${denominator}`;
    };

    const combined = real === 0
        ? (denominator === 1 ? `±${radical}` : `±${radical}/${denominator}`)
        : (denominator === 1 ? `${real} ± ${radical}` : `(${real} ± ${radical}) / ${denominator}`);

    return {
        kind: delta < 0 ? 'complex' : 'radical',
        roots: [build('+'), build('-')],
        combined
    };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exactQuadraticRoots, extractSquare, toIntegerCoefficients };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.exactQuadraticRoots = exactQuadraticRoots;
}
