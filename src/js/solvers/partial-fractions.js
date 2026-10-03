// ===================================
// PARTIAL FRACTION DECOMPOSITION
// ===================================
// P(x) / Q(x) with integer coefficients. Q is factored over the rationals
// (solvers/factor.js); every factor f^m contributes A_k / f^k for k = 1..m, with a
// constant numerator for linear f and a polynomial of degree deg f - 1 otherwise.
// The unknowns come from an exact rational linear system, so results are fractions.

// ---------- exact rational arithmetic (BigInt) ----------

function bigAbs(a) {
    return a < 0n ? -a : a;
}

function bigGcd(a, b) {
    a = bigAbs(a);
    b = bigAbs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function makeRational(n, d = 1n) {
    // Already a rational {n, d}: keep it as is
    if (n !== null && typeof n === 'object') return { n: n.n, d: n.d };
    n = BigInt(n);
    d = BigInt(d);
    if (d < 0n) {
        n = -n;
        d = -d;
    }
    const g = bigGcd(n, d) || 1n;
    return { n: n / g, d: d / g };
}

const rationalOps = {
    add: (a, b) => makeRational(a.n * b.d + b.n * a.d, a.d * b.d),
    sub: (a, b) => makeRational(a.n * b.d - b.n * a.d, a.d * b.d),
    mul: (a, b) => makeRational(a.n * b.n, a.d * b.d),
    div: (a, b) => makeRational(a.n * b.d, a.d * b.n),
    isZero: a => a.n === 0n
};

/** Exact Gauss-Jordan on an n x n rational system; null when singular. */
function solveRationalSystem(A, b) {
    const n = A.length;
    const rows = A.map((row, i) => [...row.map(v => makeRational(v)), makeRational(b[i])]);
    for (let col = 0; col < n; col++) {
        let pivot = col;
        while (pivot < n && rationalOps.isZero(rows[pivot][col])) pivot++;
        if (pivot === n) return null;
        [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
        const lead = rows[col][col];
        rows[col] = rows[col].map(value => rationalOps.div(value, lead));
        for (let r = 0; r < n; r++) {
            if (r === col || rationalOps.isZero(rows[r][col])) continue;
            const factor = rows[r][col];
            rows[r] = rows[r].map((value, c) => rationalOps.sub(value, rationalOps.mul(factor, rows[col][c])));
        }
    }
    return rows.map(row => row[n]);
}

// ---------- integer polynomials (highest power first) ----------

function polyMultiply(p, q) {
    const out = new Array(p.length + q.length - 1).fill(0);
    p.forEach((a, i) => q.forEach((b, j) => {
        out[i + j] += a * b;
    }));
    return out;
}

function polyPower(p, n) {
    let out = [1];
    for (let i = 0; i < n; i++) out = polyMultiply(out, p);
    return out;
}

function polyTrim(p) {
    let start = 0;
    while (start < p.length - 1 && p[start] === 0) start++;
    return p.slice(start);
}

// Long division with exact rationals: returns {quotient, remainder} as rational arrays
function polyDivideExact(numerator, denominator) {
    let remainder = numerator.map(c => makeRational(c));
    const quotient = [];
    const lead = makeRational(denominator[0]);
    const steps = numerator.length - denominator.length + 1;
    for (let i = 0; i < steps; i++) {
        const q = rationalOps.div(remainder[i], lead);
        quotient.push(q);
        denominator.forEach((c, j) => {
            remainder[i + j] = rationalOps.sub(remainder[i + j], rationalOps.mul(q, makeRational(c)));
        });
    }
    return { quotient, remainder: remainder.slice(Math.max(steps, 0)) };
}

// ---------- formatting ----------

const PF_SUPERSCRIPTS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function pfSuperscript(n) {
    return String(n).split('').map(d => PF_SUPERSCRIPTS[Number(d)]).join('');
}

function formatRational(r) {
    return r.d === 1n ? String(r.n) : `${r.n}/${r.d}`;
}

function formatPolyTerms(coeffs) {
    const degree = coeffs.length - 1;
    let out = '';
    coeffs.forEach((c, i) => {
        if (c === 0) return;
        const power = degree - i;
        const abs = Math.abs(c);
        const body = power === 0 ? String(abs) : `${abs === 1 ? '' : abs}x${power === 1 ? '' : pfSuperscript(power)}`;
        out += out === '' ? (c < 0 ? `-${body}` : body) : ` ${c < 0 ? '-' : '+'} ${body}`;
    });
    return out || '0';
}

function lcmBig(a, b) {
    return (a / bigGcd(a, b)) * b;
}

/**
 * Text of one term: numerator coefficients (rationals, highest power first) over factor^power.
 * Returns {sign: '+'|'-', text}.
 */
function formatPartialTerm(numeratorCoeffs, factorCoeffs, power) {
    const nonZero = numeratorCoeffs.filter(c => !rationalOps.isZero(c));
    if (nonZero.length === 0) return null;

    // Clear fractions: numerator integers over one common denominator
    const common = numeratorCoeffs.reduce((l, c) => lcmBig(l, c.d), 1n);
    const ints = numeratorCoeffs.map(c => Number((c.n * common) / c.d));
    const firstNonZero = ints.find(v => v !== 0);
    const negative = firstNonZero < 0;
    const shown = negative ? ints.map(v => -v) : ints;

    const trimmed = polyTrim(shown);
    const single = trimmed.length === 1;
    const numeratorText = formatPolyTerms(trimmed);
    const numerator = single || trimmed.filter(v => v !== 0).length === 1 ? numeratorText : `(${numeratorText})`;

    // A bare "x" needs no parentheses
    const isBareX = factorCoeffs.length === 2 && factorCoeffs[0] === 1 && factorCoeffs[1] === 0;
    const factorBody = isBareX ? 'x' : `(${formatPolyTerms(factorCoeffs)})`;
    const factorText = `${factorBody}${power > 1 ? pfSuperscript(power) : ''}`;
    const denominator = common === 1n ? factorText : `${common}${factorText}`;
    const wrapped = common === 1n ? denominator : `(${denominator})`;
    return { sign: negative ? '-' : '+', text: `${numerator}/${common === 1n ? denominator : wrapped}` };
}

// ---------- decomposition ----------

/**
 * @param {number[]} numerator integer coefficients, highest power first
 * @param {number[]} denominator integer coefficients, highest power first
 * @returns {null | {polynomial: string|null, terms: {sign:string,text:string}[], text: string}}
 *   null when an input is not an integer polynomial, the denominator is constant,
 *   or factor() is unavailable.
 */
function partialFractions(numerator, denominator) {
    if (!Array.isArray(numerator) || !Array.isArray(denominator)) return null;
    if (![...numerator, ...denominator].every(Number.isSafeInteger)) return null;
    const num = polyTrim(numerator);
    const den = polyTrim(denominator);
    if (den.length < 2 || den.every(c => c === 0)) return null;

    const factor = typeof factorPolynomial === 'function' ? factorPolynomial : require('./factor.js').factorPolynomial;
    const factored = factor(den);
    if (!factored) return null;

    // Polynomial part
    let remainder = num.map(c => makeRational(c));
    let polynomialText = null;
    if (num.length >= den.length) {
        const division = polyDivideExact(num, den);
        remainder = division.remainder;
        const quotient = division.quotient;
        const common = quotient.reduce((l, c) => lcmBig(l, c.d), 1n);
        const ints = quotient.map(c => Number((c.n * common) / c.d));
        if (ints.some(v => v !== 0)) {
            const text = formatPolyTerms(polyTrim(ints));
            polynomialText = common === 1n ? text : `(${text})/${common}`;
        }
    }

    // Basis: for every factor power, the numerator polynomials multiplying the common denominator
    const content = BigInt(factored.content);
    const basis = [];
    const full = factored.factors.reduce((acc, f) => polyMultiply(acc, polyPower(f.coeffs, f.multiplicity)), [1]);
    factored.factors.forEach(({ coeffs: f, multiplicity }) => {
        for (let k = 1; k <= multiplicity; k++) {
            // full / f^k, computed by multiplying the other factors
            let rest = [1];
            factored.factors.forEach(other => {
                const exponent = other.coeffs === f ? multiplicity - k : other.multiplicity;
                rest = polyMultiply(rest, polyPower(other.coeffs, exponent));
            });
            for (let shift = 0; shift < f.length - 1; shift++) {
                basis.push({ factor: f, power: k, shift, numerator: polyMultiply(rest, polyPower([1, 0], shift)) });
            }
        }
    });

    const size = full.length - 1;
    if (basis.length !== size) return null;

    // remainder / content = sum c_j * numerator_j  (compare coefficients, highest power first)
    const padded = r => {
        const out = new Array(size).fill(0n);
        const offset = size - r.length;
        r.forEach((value, i) => {
            out[offset + i] = value;
        });
        return out;
    };
    const A = [];
    for (let row = 0; row < size; row++) {
        A.push(basis.map(term => {
            const p = polyTrim(term.numerator);
            const offset = size - p.length;
            const index = row - offset;
            return index >= 0 && index < p.length ? p[index] : 0;
        }));
    }
    const target = padded(remainder.map(r => rationalOps.div(r, makeRational(content)))).map(v =>
        typeof v === 'bigint' ? makeRational(v) : v);
    const solved = solveRationalSystem(A, target);
    if (!solved) return null;

    // Group the unknowns of each factor power back into one numerator polynomial
    const groups = new Map();
    basis.forEach((term, index) => {
        const key = `${term.factor.join(',')}^${term.power}`;
        if (!groups.has(key)) groups.set(key, { factor: term.factor, power: term.power, coeffs: new Array(term.factor.length - 1).fill(makeRational(0)) });
        const group = groups.get(key);
        group.coeffs[group.coeffs.length - 1 - term.shift] = solved[index];
    });

    const terms = [];
    groups.forEach(group => {
        const term = formatPartialTerm(group.coeffs, group.factor, group.power);
        if (term) terms.push(term);
    });

    let text = polynomialText || '';
    terms.forEach(term => {
        if (text === '') text = term.sign === '-' ? `-${term.text}` : term.text;
        else text += ` ${term.sign} ${term.text}`;
    });
    return { polynomial: polynomialText, terms, text: text || '0' };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { partialFractions, solveRationalSystem, makeRational, formatRational };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.partialFractions = partialFractions;
}
