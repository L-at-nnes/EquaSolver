const { factorPolynomial, formatFactoredPolynomial, integerDivisors } = require('../../src/js/solvers/factor.js');

const factor = coeffs => {
    const result = factorPolynomial(coeffs);
    return result && formatFactoredPolynomial(result);
};

describe('integerDivisors', () => {
    test('returns divisors in increasing order', () => {
        expect(integerDivisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
        expect(integerDivisors(1)).toEqual([1]);
        expect(integerDivisors(-9)).toEqual([1, 3, 9]);
    });
});

describe('factorPolynomial', () => {
    test('splits a quadratic with rational roots', () => {
        expect(factor([1, -5, 6])).toBe('(x - 2)(x - 3)');
        expect(factor([1, 0, -1])).toBe('(x - 1)(x + 1)');
    });

    test('keeps non-monic linear factors', () => {
        expect(factor([6, 5, 1])).toBe('(2x + 1)(3x + 1)');
        expect(factor([2, -3, 1])).toBe('(x - 1)(2x - 1)');
    });

    test('reports multiplicity with superscripts', () => {
        expect(factor([1, -4, 4])).toBe('(x - 2)²');
        expect(factor([1, 1, -5, 3])).toBe('(x - 1)²(x + 3)');
        expect(factor([1, 0, 0, 0])).toBe('(x)³');
    });

    test('leaves irreducible quadratics and higher factors intact', () => {
        expect(factor([1, 0, 1])).toBe('(x² + 1)');
        expect(factor([1, 0, 0, 0, -1])).toBe('(x - 1)(x + 1)(x² + 1)');
        expect(factor([1, 1, 1])).toBe('(x² + x + 1)');
    });

    test('pulls out the integer content and the sign', () => {
        expect(factor([2, 0, -2])).toBe('2(x - 1)(x + 1)');
        expect(factor([-1, 0, 1])).toBe('-(x - 1)(x + 1)');
        expect(factor([4, 8])).toBe('4(x + 2)');
    });

    test('handles a zero root through trailing zeros', () => {
        expect(factor([1, -3, 2, 0])).toBe('(x)(x - 1)(x - 2)');
    });

    test('factors a cubic with a mixed root structure', () => {
        expect(factor([1, -6, 11, -6])).toBe('(x - 1)(x - 2)(x - 3)');
        expect(factor([2, -3, -3, 2])).toBe('(x + 1)(x - 2)(2x - 1)');
    });

    test('a degree six product round trips', () => {
        const result = factorPolynomial([1, 0, -14, 0, 49, 0, -36]);
        // (x²-1)(x²-4)(x²-9) = x^6 - 14x^4 + 49x^2 - 36
        expect(result.factors.filter(f => f.coeffs.length === 2)).toHaveLength(6);
        expect(result.content).toBe(1);
    });

    test('returns null for constants, non integers and unsafe sizes', () => {
        expect(factorPolynomial([5])).toBeNull();
        expect(factorPolynomial([0, 0])).toBeNull();
        expect(factorPolynomial([1.5, 2])).toBeNull();
        expect(factorPolynomial([1, 2 ** 60])).toBeNull();
        expect(factorPolynomial('x')).toBeNull();
    });

    test('very large constant terms terminate quickly with the remainder kept whole', () => {
        const start = Date.now();
        const result = factorPolynomial([1, 0, 1000000007 * 1000]);
        expect(result).not.toBeNull();
        expect(Date.now() - start).toBeLessThan(1000);
    });
});
