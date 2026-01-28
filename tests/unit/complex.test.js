/**
 * Tests for Complex Number Operations and Complex Root Finding
 */

const {
    complexAdd,
    complexSub,
    complexMul,
    complexDiv,
    complexScale,
    complexPow,
    complexSqrt,
    complexAbs,
    complexConjugate,
    complexFromReal,
    formatComplex,
    isEssentiallyReal,
    isEssentiallyZero,
    solveQuadraticComplex,
    solveCubicComplex,
    findPolynomialRootsComplex,
    separateRoots
} = require('../../src/js/index.js');

describe('Complex Number Basic Operations', () => {
    describe('complexAdd', () => {
        test('should add two complex numbers', () => {
            const a = { re: 1, im: 2 };
            const b = { re: 3, im: 4 };
            const result = complexAdd(a, b);
            expect(result.re).toBe(4);
            expect(result.im).toBe(6);
        });

        test('should add complex number with real number', () => {
            const a = { re: 5, im: 3 };
            const b = { re: 2, im: 0 };
            const result = complexAdd(a, b);
            expect(result.re).toBe(7);
            expect(result.im).toBe(3);
        });

        test('should handle negative values', () => {
            const a = { re: -1, im: -2 };
            const b = { re: 3, im: -4 };
            const result = complexAdd(a, b);
            expect(result.re).toBe(2);
            expect(result.im).toBe(-6);
        });
    });

    describe('complexSub', () => {
        test('should subtract two complex numbers', () => {
            const a = { re: 5, im: 7 };
            const b = { re: 2, im: 3 };
            const result = complexSub(a, b);
            expect(result.re).toBe(3);
            expect(result.im).toBe(4);
        });

        test('should handle result with negative parts', () => {
            const a = { re: 1, im: 2 };
            const b = { re: 3, im: 4 };
            const result = complexSub(a, b);
            expect(result.re).toBe(-2);
            expect(result.im).toBe(-2);
        });
    });

    describe('complexMul', () => {
        test('should multiply two complex numbers: (1+2i)(3+4i) = -5+10i', () => {
            const a = { re: 1, im: 2 };
            const b = { re: 3, im: 4 };
            const result = complexMul(a, b);
            expect(result.re).toBe(-5);
            expect(result.im).toBe(10);
        });

        test('should multiply by pure imaginary: (2+3i)(i) = -3+2i', () => {
            const a = { re: 2, im: 3 };
            const b = { re: 0, im: 1 };
            const result = complexMul(a, b);
            expect(result.re).toBe(-3);
            expect(result.im).toBe(2);
        });

        test('should multiply by real number', () => {
            const a = { re: 2, im: 3 };
            const b = { re: 4, im: 0 };
            const result = complexMul(a, b);
            expect(result.re).toBe(8);
            expect(result.im).toBe(12);
        });

        test('should handle i*i = -1', () => {
            const i = { re: 0, im: 1 };
            const result = complexMul(i, i);
            expect(result.re).toBe(-1);
            expect(result.im).toBeCloseTo(0);
        });
    });

    describe('complexDiv', () => {
        test('should divide two complex numbers', () => {
            const a = { re: 4, im: 2 };
            const b = { re: 1, im: 1 };
            const result = complexDiv(a, b);
            expect(result.re).toBe(3);
            expect(result.im).toBe(-1);
        });

        test('should divide by real number', () => {
            const a = { re: 6, im: 8 };
            const b = { re: 2, im: 0 };
            const result = complexDiv(a, b);
            expect(result.re).toBe(3);
            expect(result.im).toBe(4);
        });

        test('should handle division by zero returning NaN', () => {
            const a = { re: 1, im: 1 };
            const b = { re: 0, im: 0 };
            const result = complexDiv(a, b);
            expect(result.re).toBeNaN();
            expect(result.im).toBeNaN();
        });
    });

    describe('complexScale', () => {
        test('should scale complex number by scalar', () => {
            const z = { re: 2, im: 3 };
            const result = complexScale(z, 4);
            expect(result.re).toBe(8);
            expect(result.im).toBe(12);
        });

        test('should handle negative scalar', () => {
            const z = { re: 2, im: 3 };
            const result = complexScale(z, -2);
            expect(result.re).toBe(-4);
            expect(result.im).toBe(-6);
        });
    });

    describe('complexPow', () => {
        test('should compute z^0 = 1', () => {
            const z = { re: 5, im: 3 };
            const result = complexPow(z, 0);
            expect(result.re).toBe(1);
            expect(result.im).toBe(0);
        });

        test('should compute z^1 = z', () => {
            const z = { re: 5, im: 3 };
            const result = complexPow(z, 1);
            expect(result.re).toBe(5);
            expect(result.im).toBe(3);
        });

        test('should compute (1+i)^2 = 2i', () => {
            const z = { re: 1, im: 1 };
            const result = complexPow(z, 2);
            expect(result.re).toBeCloseTo(0, 10);
            expect(result.im).toBeCloseTo(2, 10);
        });

        test('should compute i^4 = 1', () => {
            const i = { re: 0, im: 1 };
            const result = complexPow(i, 4);
            expect(result.re).toBeCloseTo(1, 10);
            expect(result.im).toBeCloseTo(0, 10);
        });
    });

    describe('complexSqrt', () => {
        test('should compute sqrt of positive real: sqrt(4) = 2', () => {
            const z = { re: 4, im: 0 };
            const result = complexSqrt(z);
            expect(result.re).toBeCloseTo(2, 10);
            expect(result.im).toBeCloseTo(0, 10);
        });

        test('should compute sqrt of negative real: sqrt(-1) = i', () => {
            const z = { re: -1, im: 0 };
            const result = complexSqrt(z);
            expect(result.re).toBeCloseTo(0, 10);
            expect(result.im).toBeCloseTo(1, 10);
        });

        test('should compute sqrt(-4) = 2i', () => {
            const z = { re: -4, im: 0 };
            const result = complexSqrt(z);
            expect(result.re).toBeCloseTo(0, 10);
            expect(result.im).toBeCloseTo(2, 10);
        });

        test('should compute sqrt of complex number', () => {
            const z = { re: 0, im: 2 };
            const result = complexSqrt(z);
            // sqrt(2i) = 1 + i
            expect(result.re).toBeCloseTo(1, 5);
            expect(result.im).toBeCloseTo(1, 5);
        });
    });

    describe('complexAbs', () => {
        test('should compute |3+4i| = 5', () => {
            const z = { re: 3, im: 4 };
            expect(complexAbs(z)).toBe(5);
        });

        test('should compute |1+0i| = 1', () => {
            const z = { re: 1, im: 0 };
            expect(complexAbs(z)).toBe(1);
        });

        test('should compute |0+i| = 1', () => {
            const z = { re: 0, im: 1 };
            expect(complexAbs(z)).toBe(1);
        });
    });

    describe('complexConjugate', () => {
        test('should compute conjugate of 3+4i = 3-4i', () => {
            const z = { re: 3, im: 4 };
            const result = complexConjugate(z);
            expect(result.re).toBe(3);
            expect(result.im).toBe(-4);
        });

        test('should compute conjugate of real number', () => {
            const z = { re: 5, im: 0 };
            const result = complexConjugate(z);
            expect(result.re).toBe(5);
            expect(result.im).toBeCloseTo(0);
        });
    });

    describe('complexFromReal', () => {
        test('should create complex from real number', () => {
            const result = complexFromReal(5);
            expect(result.re).toBe(5);
            expect(result.im).toBe(0);
        });
    });

    describe('isEssentiallyReal', () => {
        test('should return true for real number', () => {
            const z = { re: 5, im: 0 };
            expect(isEssentiallyReal(z)).toBe(true);
        });

        test('should return true for almost real number', () => {
            const z = { re: 5, im: 1e-12 };
            expect(isEssentiallyReal(z)).toBe(true);
        });

        test('should return false for complex number', () => {
            const z = { re: 5, im: 0.1 };
            expect(isEssentiallyReal(z)).toBe(false);
        });
    });

    describe('isEssentiallyZero', () => {
        test('should return true for zero', () => {
            const z = { re: 0, im: 0 };
            expect(isEssentiallyZero(z)).toBe(true);
        });

        test('should return true for almost zero', () => {
            const z = { re: 1e-12, im: -1e-12 };
            expect(isEssentiallyZero(z)).toBe(true);
        });

        test('should return false for non-zero', () => {
            const z = { re: 0.001, im: 0 };
            expect(isEssentiallyZero(z)).toBe(false);
        });
    });
});

describe('formatComplex', () => {
    test('should format zero', () => {
        expect(formatComplex({ re: 0, im: 0 })).toBe('0');
    });

    test('should format real number', () => {
        expect(formatComplex({ re: 3.5, im: 0 })).toBe('3.5000');
    });

    test('should format pure imaginary i', () => {
        expect(formatComplex({ re: 0, im: 1 })).toBe('i');
    });

    test('should format pure imaginary -i', () => {
        expect(formatComplex({ re: 0, im: -1 })).toBe('-i');
    });

    test('should format pure imaginary 2i', () => {
        expect(formatComplex({ re: 0, im: 2 })).toBe('2.0000i');
    });

    test('should format complex with positive imaginary', () => {
        expect(formatComplex({ re: 3, im: 4 })).toBe('3.0000 + 4.0000i');
    });

    test('should format complex with negative imaginary', () => {
        expect(formatComplex({ re: 3, im: -4 })).toBe('3.0000 - 4.0000i');
    });

    test('should format complex with imaginary part = 1', () => {
        expect(formatComplex({ re: 2, im: 1 })).toBe('2.0000 + i');
    });

    test('should format complex with imaginary part = -1', () => {
        expect(formatComplex({ re: 2, im: -1 })).toBe('2.0000 - i');
    });

    test('should format with custom decimals', () => {
        expect(formatComplex({ re: 3.14159, im: 2.71828 }, 2)).toBe('3.14 + 2.72i');
    });
});

describe('solveQuadraticComplex', () => {
    test('should solve x² - 5x + 6 = 0 (two real roots)', () => {
        const roots = solveQuadraticComplex(1, -5, 6);
        expect(roots.length).toBe(2);
        const realRoots = roots.map(r => r.re).sort((a, b) => a - b);
        expect(realRoots[0]).toBeCloseTo(2, 10);
        expect(realRoots[1]).toBeCloseTo(3, 10);
        expect(roots[0].im).toBeCloseTo(0, 10);
        expect(roots[1].im).toBeCloseTo(0, 10);
    });

    test('should solve x² - 4x + 4 = 0 (double root)', () => {
        const roots = solveQuadraticComplex(1, -4, 4);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(2, 10);
        expect(roots[1].re).toBeCloseTo(2, 10);
    });

    test('should solve x² + 1 = 0 (complex roots)', () => {
        const roots = solveQuadraticComplex(1, 0, 1);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(0, 10);
        expect(roots[0].im).toBeCloseTo(1, 10);
        expect(roots[1].re).toBeCloseTo(0, 10);
        expect(roots[1].im).toBeCloseTo(-1, 10);
    });

    test('should solve x² + 4 = 0 (complex roots ±2i)', () => {
        const roots = solveQuadraticComplex(1, 0, 4);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(0, 10);
        expect(Math.abs(roots[0].im)).toBeCloseTo(2, 10);
        expect(roots[1].re).toBeCloseTo(0, 10);
        expect(Math.abs(roots[1].im)).toBeCloseTo(2, 10);
    });

    test('should solve x² - 2x + 5 = 0 (complex roots 1±2i)', () => {
        const roots = solveQuadraticComplex(1, -2, 5);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(1, 10);
        expect(roots[0].im).toBeCloseTo(2, 10);
        expect(roots[1].re).toBeCloseTo(1, 10);
        expect(roots[1].im).toBeCloseTo(-2, 10);
    });

    test('should handle linear equation when a=0', () => {
        const roots = solveQuadraticComplex(0, 2, -4);
        expect(roots.length).toBe(1);
        expect(roots[0].re).toBeCloseTo(2, 10);
    });
});

describe('solveCubicComplex', () => {
    test('should solve x³ - 6x² + 11x - 6 = 0 (roots 1, 2, 3)', () => {
        const roots = solveCubicComplex(1, -6, 11, -6);
        const { realRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(3);
        expect(realRoots).toContainEqual(expect.closeTo(1, 4));
        expect(realRoots).toContainEqual(expect.closeTo(2, 4));
        expect(realRoots).toContainEqual(expect.closeTo(3, 4));
    });

    test('should solve x³ - 1 = 0 (one real, two complex)', () => {
        const roots = solveCubicComplex(1, 0, 0, -1);
        const { realRoots, complexRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(1);
        expect(realRoots[0]).toBeCloseTo(1, 4);
        expect(complexRoots.length).toBe(1);
    });

    test('should solve x³ + 1 = 0 (one real root -1)', () => {
        const roots = solveCubicComplex(1, 0, 0, 1);
        const { realRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(1);
        expect(realRoots[0]).toBeCloseTo(-1, 4);
    });

    test('should solve x³ - 3x² + 3x - 1 = 0 (triple root x=1)', () => {
        const roots = solveCubicComplex(1, -3, 3, -1);
        const { realRoots } = separateRoots(roots);
        // All roots should be approximately 1
        realRoots.forEach(r => {
            expect(r).toBeCloseTo(1, 4);
        });
    });

    test('should handle quadratic when a=0', () => {
        const roots = solveCubicComplex(0, 1, -5, 6);
        const { realRoots } = separateRoots(roots);
        expect(realRoots).toContainEqual(expect.closeTo(2, 4));
        expect(realRoots).toContainEqual(expect.closeTo(3, 4));
    });
});

describe('findPolynomialRootsComplex', () => {
    test('should solve linear equation x + 2 = 0', () => {
        const roots = findPolynomialRootsComplex([1, 2]);
        expect(roots.length).toBe(1);
        expect(roots[0].re).toBeCloseTo(-2, 10);
    });

    test('should solve quartic x⁴ - 1 = 0', () => {
        const roots = findPolynomialRootsComplex([1, 0, 0, 0, -1]);
        expect(roots.length).toBe(4);
        // Roots are 1, -1, i, -i
        const { realRoots, complexRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(2);
        expect(realRoots).toContainEqual(expect.closeTo(1, 4));
        expect(realRoots).toContainEqual(expect.closeTo(-1, 4));
        expect(complexRoots.length).toBe(1); // +i only (conjugate pairs)
    });

    test('should solve quartic with only complex roots: x⁴ + 1 = 0', () => {
        const roots = findPolynomialRootsComplex([1, 0, 0, 0, 1]);
        expect(roots.length).toBe(4);
        const { realRoots, complexRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(0);
        expect(complexRoots.length).toBe(2); // Two conjugate pairs
    });

    test('should solve x⁴ - 5x² + 4 = 0 (roots ±1, ±2)', () => {
        const roots = findPolynomialRootsComplex([1, 0, -5, 0, 4]);
        const { realRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(4);
        expect(realRoots).toContainEqual(expect.closeTo(1, 4));
        expect(realRoots).toContainEqual(expect.closeTo(-1, 4));
        expect(realRoots).toContainEqual(expect.closeTo(2, 4));
        expect(realRoots).toContainEqual(expect.closeTo(-2, 4));
    });
});

describe('separateRoots', () => {
    test('should separate real roots', () => {
        const roots = [
            { re: 1, im: 0 },
            { re: 2, im: 0 },
            { re: 3, im: 0 }
        ];
        const { realRoots, complexRoots } = separateRoots(roots);
        expect(realRoots).toEqual([1, 2, 3]);
        expect(complexRoots).toEqual([]);
    });

    test('should separate complex roots (only positive imaginary)', () => {
        const roots = [
            { re: 1, im: 2 },
            { re: 1, im: -2 },
            { re: 3, im: 0 }
        ];
        const { realRoots, complexRoots } = separateRoots(roots);
        expect(realRoots).toEqual([3]);
        expect(complexRoots.length).toBe(1);
        expect(complexRoots[0].re).toBe(1);
        expect(complexRoots[0].im).toBe(2);
    });

    test('should handle mixed roots', () => {
        const roots = [
            { re: 0, im: 1 },
            { re: 0, im: -1 },
            { re: 1, im: 0 },
            { re: -1, im: 0 }
        ];
        const { realRoots, complexRoots } = separateRoots(roots);
        expect(realRoots).toEqual([-1, 1]);
        expect(complexRoots.length).toBe(1);
    });
});

// Custom matcher for closeTo in arrays
expect.extend({
    closeTo(received, expected, precision = 4) {
        const pass = Math.abs(received - expected) < Math.pow(10, -precision);
        return {
            pass,
            message: () => `expected ${received} to be close to ${expected}`
        };
    }
});
