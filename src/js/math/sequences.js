// ===================================
// SEQUENCES
// ===================================

function generateArithmeticSequence(a1, d, n) {
    const terms = [];
    for (let i = 0; i < n; i++) {
        terms.push(a1 + i * d);
    }
    const nthTerm = a1 + (n - 1) * d;
    const sum = (n / 2) * (2 * a1 + (n - 1) * d);
    return { terms, nthTerm, sum, formula: `aₙ = ${a1} + (n-1)×${d}` };
}

function generateGeometricSequence(a1, r, n) {
    const terms = [];
    for (let i = 0; i < n; i++) {
        terms.push(a1 * Math.pow(r, i));
    }
    const nthTerm = a1 * Math.pow(r, n - 1);
    const sum = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r);
    return { terms, nthTerm, sum, formula: `aₙ = ${a1} × ${r}^(n-1)` };
}

function generateFibonacciSequence(n) {
    const terms = [0, 1];
    for (let i = 2; i < n; i++) {
        terms.push(terms[i - 1] + terms[i - 2]);
    }
    const sum = terms.slice(0, n).reduce((a, b) => a + b, 0);
    return { terms: terms.slice(0, n), nthTerm: terms[n - 1], sum, formula: 'Fₙ = Fₙ₋₁ + Fₙ₋₂' };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateArithmeticSequence,
        generateGeometricSequence,
        generateFibonacciSequence
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.generateArithmeticSequence = generateArithmeticSequence;
    window.generateGeometricSequence = generateGeometricSequence;
    window.generateFibonacciSequence = generateFibonacciSequence;
}