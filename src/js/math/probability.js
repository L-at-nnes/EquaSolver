// ===================================
// PROBABILITY DISTRIBUTIONS
// ===================================

// erf by its Maclaurin series, erfc by a continued fraction in the tail.
function erf(x) {
    if (Number.isNaN(x)) return NaN;
    if (x < 0) return -erf(-x);
    if (x > 6) return 1;
    if (x > 3) return 1 - erfcTail(x);
    let term = x;
    let sum = x;
    for (let n = 1; n < 200; n++) {
        term *= -x * x / n;
        const add = term / (2 * n + 1);
        sum += add;
        if (Math.abs(add) < 1e-17 * Math.abs(sum)) break;
    }
    return 2 / Math.sqrt(Math.PI) * sum;
}

// Lentz-style evaluation of erfc(x) for x >= 3.
function erfcTail(x) {
    let f = 0;
    for (let k = 60; k >= 1; k--) f = (k / 2) / (x + f);
    return Math.exp(-x * x) / (Math.sqrt(Math.PI) * (x + f));
}

function normalPdf(x, mu = 0, sigma = 1) {
    if (!(sigma > 0)) return NaN;
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

function normalCdf(x, mu = 0, sigma = 1) {
    if (!(sigma > 0)) return NaN;
    const z = (x - mu) / (sigma * Math.SQRT2);
    return z > 3 ? 1 - erfcTail(z) / 2 : z < -3 ? erfcTail(-z) / 2 : 0.5 * (1 + erf(z));
}

// ln(n!) via Lanczos for non-trivial sizes, exact product for small n.
function logFactorial(n) {
    if (n < 2) return 0;
    if (n <= 20) {
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return Math.log(f);
    }
    const x = n + 1;
    const g = 7;
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    const y = x - 1;
    let a = c[0];
    const t = y + g + 0.5;
    for (let i = 1; i < g + 2; i++) a += c[i] / (y + i);
    return 0.5 * Math.log(2 * Math.PI) + (y + 0.5) * Math.log(t) - t + Math.log(a);
}

function isCount(k) {
    return Number.isInteger(k) && k >= 0;
}

function binomialPmf(k, n, p) {
    if (!isCount(n) || !(p >= 0 && p <= 1) || !Number.isInteger(k)) return NaN;
    if (k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    const logP = logFactorial(n) - logFactorial(k) - logFactorial(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
    return Math.exp(logP);
}

function binomialCdf(k, n, p) {
    if (!isCount(n) || !(p >= 0 && p <= 1) || !Number.isInteger(k)) return NaN;
    if (k < 0) return 0;
    if (k >= n) return 1;
    let sum = 0;
    for (let i = 0; i <= k; i++) sum += binomialPmf(i, n, p);
    return Math.min(1, sum);
}

function poissonPmf(k, lambda) {
    if (!(lambda >= 0) || !Number.isInteger(k)) return NaN;
    if (k < 0) return 0;
    if (lambda === 0) return k === 0 ? 1 : 0;
    return Math.exp(k * Math.log(lambda) - lambda - logFactorial(k));
}

function poissonCdf(k, lambda) {
    if (!(lambda >= 0) || !Number.isInteger(k)) return NaN;
    if (k < 0) return 0;
    let sum = 0;
    for (let i = 0; i <= k; i++) sum += poissonPmf(i, lambda);
    return Math.min(1, sum);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { erf, normalPdf, normalCdf, logFactorial, binomialPmf, binomialCdf, poissonPmf, poissonCdf };
}

if (typeof window !== 'undefined') {
    window.normalPdf = normalPdf;
    window.normalCdf = normalCdf;
    window.binomialPmf = binomialPmf;
    window.binomialCdf = binomialCdf;
    window.poissonPmf = poissonPmf;
    window.poissonCdf = poissonCdf;
}
