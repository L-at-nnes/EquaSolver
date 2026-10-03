// ===================================
// POLYNOMIAL FACTORING OVER THE RATIONALS
// ===================================
// Rational root theorem: any root p/q of an integer polynomial has p dividing the
// constant term and q dividing the leading coefficient. Roots are peeled off with
// their multiplicity; whatever is left (degree 2+, no rational root) is kept as is.

function factorGcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function integerDivisors(n) {
    n = Math.abs(n);
    const small = [];
    const large = [];
    for (let d = 1; d * d <= n; d++) {
        if (n % d === 0) {
            small.push(d);
            if (d * d !== n) large.push(n / d);
        }
    }
    return [...small, ...large.reverse()];
}

// Evaluate P(p/q) * q^n exactly with integers (Horner on the homogenised polynomial)
function evaluateAtRational(coeffs, p, q) {
    let value = 0;
    for (let i = 0; i < coeffs.length; i++) {
        value = value * p + coeffs[i] * Math.pow(q, i);
    }
    return value;
}

// Divide by (q x - p) when it divides exactly; coefficients stay integers
function divideByLinear(coeffs, p, q) {
    const quotient = [];
    let carry = 0;
    for (let i = 0; i < coeffs.length - 1; i++) {
        const value = coeffs[i] + carry;
        if (value % q !== 0) return null;
        const c = value / q;
        quotient.push(c);
        carry = c * p;
    }
    return coeffs[coeffs.length - 1] + carry === 0 ? quotient : null;
}

/**
 * Factor an integer polynomial (highest power first).
 * @param {number[]} coeffs
 * @returns {null | {content:number, factors:{coeffs:number[], multiplicity:number}[]}}
 *   content is the integer multiplier; each factor is primitive. null for constants or unsafe sizes.
 */
function factorPolynomial(coeffs) {
    if (!Array.isArray(coeffs) || coeffs.length < 2 || !coeffs.every(Number.isSafeInteger)) return null;
    let poly = [...coeffs];
    while (poly.length > 1 && poly[0] === 0) poly.shift();
    if (poly.length < 2) return null;

    let content = poly.reduce((g, c) => factorGcd(g, c), 0) || 1;
    if (poly[0] < 0) content = -content;
    poly = poly.map(c => c / content);

    const found = new Map();
    const add = (key, factorCoeffs) => {
        const entry = found.get(key);
        if (entry) entry.multiplicity++;
        else found.set(key, { coeffs: factorCoeffs, multiplicity: 1 });
    };

    // Trailing zeros: x^k
    let zeros = 0;
    while (poly.length > 1 && poly[poly.length - 1] === 0) {
        poly.pop();
        zeros++;
    }
    for (let i = 0; i < zeros; i++) add('0/1', [1, 0]);

    let progress = true;
    while (poly.length > 2 && progress) {
        progress = false;
        const constant = Math.abs(poly[poly.length - 1]);
        const leading = Math.abs(poly[0]);
        if (constant > 1e9 || leading > 1e9) break;
        const ps = integerDivisors(constant);
        const qs = integerDivisors(leading);
        search: for (const q of qs) {
            for (const p of ps) {
                if (factorGcd(p, q) !== 1) continue;
                for (const sign of [1, -1]) {
                    const root = sign * p;
                    const value = evaluateAtRational(poly, root, q);
                    if (!Number.isSafeInteger(value) || value !== 0) continue;
                    const quotient = divideByLinear(poly, root, q);
                    if (!quotient) continue;
                    add(`${root}/${q}`, [q, -root]);
                    poly = quotient;
                    progress = true;
                    break search;
                }
            }
        }
    }

    // What remains: a linear factor, or an irreducible-over-Q polynomial
    if (poly.length === 2) {
        const g = factorGcd(poly[0], poly[1]) || 1;
        const lin = poly.map(c => c / g);
        content *= g;
        add(`${-lin[1]}/${lin[0]}`, lin);
    } else if (poly.length > 2) {
        const g = poly.reduce((acc, c) => factorGcd(acc, c), 0) || 1;
        const rest = poly.map(c => c / g);
        content *= g;
        add(`irr:${rest.join(',')}`, rest);
    }

    const factors = [...found.values()].sort((a, b) => a.coeffs.length - b.coeffs.length || b.multiplicity - a.multiplicity);
    return { content, factors };
}

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function superscript(n) {
    return String(n).split('').map(d => SUPERSCRIPT_DIGITS[Number(d)]).join('');
}

function formatFactorTerms(coeffs) {
    const degree = coeffs.length - 1;
    let out = '';
    coeffs.forEach((c, i) => {
        if (c === 0) return;
        const power = degree - i;
        const abs = Math.abs(c);
        const body = power === 0 ? String(abs) : `${abs === 1 ? '' : abs}x${power === 1 ? '' : superscript(power)}`;
        out += out === '' ? (c < 0 ? `-${body}` : body) : ` ${c < 0 ? '-' : '+'} ${body}`;
    });
    return out;
}

/** "2(x - 1)²(x + 3)(x² + x + 1)" */
function formatFactoredPolynomial(result) {
    const parts = result.factors.map(({ coeffs, multiplicity }) => {
        const text = `(${formatFactorTerms(coeffs)})`;
        return multiplicity > 1 ? text + superscript(multiplicity) : text;
    });
    const lead = result.content === 1 ? '' : result.content === -1 ? '-' : String(result.content);
    return lead + parts.join('');
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { factorPolynomial, formatFactoredPolynomial, integerDivisors };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.factorPolynomial = factorPolynomial;
    window.formatFactoredPolynomial = formatFactoredPolynomial;
}
