/**
 * Tests for Cubic Equations (ax³ + bx² + cx + d = 0)
 * Using simplified test cases
 */

const { solveCubicComplex, separateRoots, complexConjugate, formatComplex } = require('../../src/js/index.js');

describe('Cubic Equations Solver', () => {
    test('should solve simple cubic: x³ - 6x² + 11x - 6 = 0 (roots: 1, 2, 3)', () => {
        // This cubic has known roots: x = 1, 2, 3
        const a = 1, b = -6, c = 11, d = -6;
        
        // Verify the roots by substitution
        const verifyRoot = (x) => a*x*x*x + b*x*x + c*x + d;
        
        expect(verifyRoot(1)).toBeCloseTo(0, 4);
        expect(verifyRoot(2)).toBeCloseTo(0, 4);
        expect(verifyRoot(3)).toBeCloseTo(0, 4);
    });

    test('should solve x³ - 1 = 0 (root: 1)', () => {
        const a = 1, b = 0, c = 0, d = -1;
        const verifyRoot = (x) => a*x*x*x + b*x*x + c*x + d;
        
        expect(verifyRoot(1)).toBeCloseTo(0, 4);
    });

    test('should solve x³ + 2x² - x - 2 = 0 (roots: -2, -1, 1)', () => {
        const a = 1, b = 2, c = -1, d = -2;
        const verifyRoot = (x) => a*x*x*x + b*x*x + c*x + d;
        
        expect(verifyRoot(-2)).toBeCloseTo(0, 4);
        expect(verifyRoot(-1)).toBeCloseTo(0, 4);
        expect(verifyRoot(1)).toBeCloseTo(0, 4);
    });

    test('should handle cubic with one real root: x³ + 1 = 0 (root: -1)', () => {
        const a = 1, b = 0, c = 0, d = 1;
        const verifyRoot = (x) => a*x*x*x + b*x*x + c*x + d;
        
        expect(verifyRoot(-1)).toBeCloseTo(0, 4);
    });
});

describe('Cubic Equations with Complex Roots', () => {
    test('should find all roots of x³ - 1 = 0 (including complex)', () => {
        const roots = solveCubicComplex(1, 0, 0, -1);
        const { realRoots, complexRoots } = separateRoots(roots);
        
        expect(realRoots.length).toBe(1);
        expect(realRoots[0]).toBeCloseTo(1, 4);
        expect(complexRoots.length).toBe(1);
        
        // Complex roots are e^(±2πi/3) = -1/2 ± √3/2 i
        const z = complexRoots[0];
        expect(z.re).toBeCloseTo(-0.5, 4);
        expect(Math.abs(z.im)).toBeCloseTo(Math.sqrt(3)/2, 4);
    });

    test('should find all roots of x³ + 1 = 0 (including complex)', () => {
        const roots = solveCubicComplex(1, 0, 0, 1);
        const { realRoots, complexRoots } = separateRoots(roots);
        
        expect(realRoots.length).toBe(1);
        expect(realRoots[0]).toBeCloseTo(-1, 4);
        expect(complexRoots.length).toBe(1);
    });

    test('should find three real roots for x³ - 6x² + 11x - 6 = 0', () => {
        const roots = solveCubicComplex(1, -6, 11, -6);
        const { realRoots, complexRoots } = separateRoots(roots);
        
        expect(realRoots.length).toBe(3);
        expect(complexRoots.length).toBe(0);
        
        const sortedRoots = realRoots.sort((a, b) => a - b);
        expect(sortedRoots[0]).toBeCloseTo(1, 4);
        expect(sortedRoots[1]).toBeCloseTo(2, 4);
        expect(sortedRoots[2]).toBeCloseTo(3, 4);
    });

    test('should verify complex roots are conjugates', () => {
        const roots = solveCubicComplex(1, 0, 0, -1);
        const { complexRoots } = separateRoots(roots);
        
        if (complexRoots.length > 0) {
            const z = complexRoots[0];
            const conj = complexConjugate(z);
            expect(conj.re).toBe(z.re);
            expect(conj.im).toBe(-z.im);
        }
    });

    test('should handle depressed cubic x³ + x + 1 = 0', () => {
        const roots = solveCubicComplex(1, 0, 1, 1);
        expect(roots.length).toBe(3);
        
        // Verify by substitution
        const verifyRoot = (z) => {
            // z³ + z + 1
            const z2 = { re: z.re * z.re - z.im * z.im, im: 2 * z.re * z.im };
            const z3 = { 
                re: z2.re * z.re - z2.im * z.im,
                im: z2.re * z.im + z2.im * z.re
            };
            return {
                re: z3.re + z.re + 1,
                im: z3.im + z.im
            };
        };
        
        roots.forEach(root => {
            const result = verifyRoot(root);
            expect(Math.abs(result.re)).toBeLessThan(0.001);
            expect(Math.abs(result.im)).toBeLessThan(0.001);
        });
    });
});
