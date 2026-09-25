// ===================================
// COMBINATORICS
// ===================================

function factorialBig(n) {
    if (n < 0) return null;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function factorial(n) {
    return factorialBig(n);
}

// Computed as products of r terms (not factorial ratios) so that values like
// C(200, 2) stay exact instead of overflowing to Infinity / Infinity = NaN.
function permutation(n, r) {
    if (n < 0 || r < 0 || r > n) return null;
    let result = 1;
    for (let i = 0; i < r; i++) {
        result *= n - i;
    }
    return result;
}

function combination(n, r) {
    if (n < 0 || r < 0 || r > n) return null;
    const k = Math.min(r, n - r);
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result = result * (n - k + i) / i;
    }
    return Math.round(result);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        factorial,
        factorialBig,
        permutation,
        combination
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.factorial = factorial;
    window.factorialBig = factorialBig;
    window.permutation = permutation;
    window.combination = combination;
}