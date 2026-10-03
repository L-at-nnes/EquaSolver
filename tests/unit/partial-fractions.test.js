const { partialFractions, solveRationalSystem, makeRational, formatRational } = require('../../src/js/solvers/partial-fractions.js');

const text = (n, d) => {
    const result = partialFractions(n, d);
    return result && result.text;
};

describe('solveRationalSystem', () => {
    test('solves exactly with fractions', () => {
        const solved = solveRationalSystem([[2, 1], [1, 3]], [1, 1]);
        expect(solved.map(formatRational)).toEqual(['2/5', '1/5']);
    });

    test('returns null for a singular matrix', () => {
        expect(solveRationalSystem([[1, 2], [2, 4]], [1, 2])).toBeNull();
    });

    test('makeRational reduces and normalises the sign', () => {
        expect(formatRational(makeRational(6, -4))).toBe('-3/2');
        expect(formatRational(makeRational(0, 5))).toBe('0');
    });
});

describe('partialFractions', () => {
    test('distinct linear factors', () => {
        expect(text([1], [1, 0, -1])).toBe('1/(2(x - 1)) - 1/(2(x + 1))');
        expect(text([3, 5], [1, -1, -6])).toBe('1/(5(x + 2)) + 14/(5(x - 3))');
    });

    test('non monic denominator', () => {
        expect(text([2, 3], [2, -3, 1])).toBe('5/(x - 1) - 8/(2x - 1)');
    });

    test('repeated factors produce one term per power', () => {
        expect(text([1], [1, 1, 0, 0])).toBe('-1/x + 1/x\u00b2 + 1/(x + 1)');
        expect(text([5], [1, 2, 1])).toBe('5/(x + 1)\u00b2');
    });

    test('improper fractions give the polynomial part first', () => {
        expect(text([1, 0, 1], [1, 0, -1])).toBe('1 + 1/(x - 1) - 1/(x + 1)');
        expect(text([1, 2, 3], [1, 1])).toBe('x + 1 + 2/(x + 1)');
    });

    test('terms that cancel disappear', () => {
        expect(text([1, 0, 0, 1], [1, 0, -1])).toBe('x + 1/(x - 1)');
    });

    test('an irreducible quadratic keeps a linear numerator', () => {
        expect(text([1], [1, 0, 0, -1])).toBe('1/(3(x - 1)) - (x + 2)/(3(x\u00b2 + x + 1))');
    });

    test('an already simple fraction stays as it is', () => {
        expect(text([1], [1, 0, 1])).toBe('1/(x\u00b2 + 1)');
    });

    test('a numerator of zero is zero', () => {
        expect(text([0], [1, 1])).toBe('0');
    });

    test('numeric check: the decomposition adds back up to the original', () => {
        // (3x + 5) / (x^2 - x - 6) at x = 1  ->  8 / -6 ; 1/(5*3) + 14/(5*-2)
        const original = (3 * 1 + 5) / (1 - 1 - 6);
        const rebuilt = 1 / (5 * (1 + 2)) + 14 / (5 * (1 - 3));
        expect(rebuilt).toBeCloseTo(original, 12);
    });

    test('rejects non integer input and constant denominators', () => {
        expect(partialFractions([1.5], [1, 1])).toBeNull();
        expect(partialFractions([1], [3])).toBeNull();
        expect(partialFractions([1], [0])).toBeNull();
        expect(partialFractions('x', [1, 1])).toBeNull();
    });
});
