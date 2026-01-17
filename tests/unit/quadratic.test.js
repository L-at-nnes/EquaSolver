/**
 * Tests for Quadratic Equations (ax² + bx + c = 0)
 */

const { solveQuadraticComplex, formatComplex, separateRoots } = require('../../src/js/script.js');

describe('Quadratic Equations Solver', () => {
    test('should solve equation with two real roots: x² - 5x + 6 = 0', () => {
        const a = 1, b = -5, c = 6;
        const delta = b * b - 4 * a * c;
        expect(delta).toBeGreaterThan(0);
        
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        
        expect(x1).toBeCloseTo(3, 4);
        expect(x2).toBeCloseTo(2, 4);
    });

    test('should solve equation with one real root (delta = 0): x² - 4x + 4 = 0', () => {
        const a = 1, b = -4, c = 4;
        const delta = b * b - 4 * a * c;
        expect(delta).toBe(0);
        
        const x = -b / (2 * a);
        expect(x).toBe(2);
    });

    test('should detect no real solutions (delta < 0): x² + x + 1 = 0', () => {
        const a = 1, b = 1, c = 1;
        const delta = b * b - 4 * a * c;
        expect(delta).toBeLessThan(0);
    });

    test('should solve 2x² - 7x + 3 = 0', () => {
        const a = 2, b = -7, c = 3;
        const delta = b * b - 4 * a * c;
        
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        
        expect(x1).toBeCloseTo(3, 4);
        expect(x2).toBeCloseTo(0.5, 4);
    });

    test('should handle negative coefficient: -x² + 4x - 3 = 0', () => {
        const a = -1, b = 4, c = -3;
        const delta = b * b - 4 * a * c;
        
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        
        expect(x1).toBeCloseTo(1, 4);
        expect(x2).toBeCloseTo(3, 4);
    });

    test('should handle fractional coefficients: 0.5x² - 1.5x + 1 = 0', () => {
        const a = 0.5, b = -1.5, c = 1;
        const delta = b * b - 4 * a * c;
        
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        
        expect(x1).toBeCloseTo(2, 4);
        expect(x2).toBeCloseTo(1, 4);
    });
});

describe('Quadratic Equations with Complex Roots', () => {
    test('should return complex conjugate roots for x² + 1 = 0', () => {
        const roots = solveQuadraticComplex(1, 0, 1);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(0, 10);
        expect(roots[0].im).toBeCloseTo(1, 10);
        expect(roots[1].re).toBeCloseTo(0, 10);
        expect(roots[1].im).toBeCloseTo(-1, 10);
    });

    test('should return complex roots for x² + 4 = 0', () => {
        const roots = solveQuadraticComplex(1, 0, 4);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(0, 10);
        expect(Math.abs(roots[0].im)).toBeCloseTo(2, 10);
    });

    test('should return complex roots for x² - 2x + 5 = 0 (roots: 1 ± 2i)', () => {
        const roots = solveQuadraticComplex(1, -2, 5);
        expect(roots.length).toBe(2);
        expect(roots[0].re).toBeCloseTo(1, 10);
        expect(roots[0].im).toBeCloseTo(2, 10);
        expect(roots[1].re).toBeCloseTo(1, 10);
        expect(roots[1].im).toBeCloseTo(-2, 10);
    });

    test('should format complex roots correctly', () => {
        const roots = solveQuadraticComplex(1, -2, 5);
        const formatted1 = formatComplex(roots[0]);
        const formatted2 = formatComplex(roots[1]);
        expect(formatted1).toContain('1.0000');
        expect(formatted1).toContain('2.0000');
        expect(formatted2).toContain('1.0000');
        expect(formatted2).toContain('2.0000');
    });

    test('should return real roots even when using complex solver', () => {
        const roots = solveQuadraticComplex(1, -5, 6);
        const { realRoots } = separateRoots(roots);
        expect(realRoots.length).toBe(2);
        expect(realRoots.some(r => Math.abs(r - 2) < 0.0001)).toBe(true);
        expect(realRoots.some(r => Math.abs(r - 3) < 0.0001)).toBe(true);
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
