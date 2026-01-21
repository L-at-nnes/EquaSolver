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

function permutation(n, r) {
    if (n < 0 || r < 0 || r > n) return null;
    return factorialBig(n) / factorialBig(n - r);
}

function combination(n, r) {
    if (n < 0 || r < 0 || r > n) return null;
    return factorialBig(n) / (factorialBig(r) * factorialBig(n - r));
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