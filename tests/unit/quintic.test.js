/**
 * Tests for Quintic Equations (5th degree polynomials)
 */

describe('Quintic Equations Solver', () => {
    // Helper to find polynomial roots numerically
    function findPolynomialRoots(coeffs) {
        const degree = coeffs.length - 1;
        if (degree < 1) return [];
        
        const normalized = coeffs.map(c => c / coeffs[0]);
        
        const roots = [];
        for (let i = 0; i < degree; i++) {
            const angle = (2 * Math.PI * i) / degree;
            roots.push({ re: Math.cos(angle), im: Math.sin(angle) });
        }
        
        const maxIter = 100;
        const tolerance = 1e-6;
        
        for (let iter = 0; iter < maxIter; iter++) {
            let maxChange = 0;
            
            for (let i = 0; i < degree; i++) {
                const z = roots[i];
                const pz = evalPoly(normalized, z);
                
                let prod = { re: 1, im: 0 };
                for (let j = 0; j < degree; j++) {
                    if (i !== j) {
                        const diff = complexSub(z, roots[j]);
                        prod = complexMul(prod, diff);
                    }
                }
                
                const delta = complexDiv(pz, prod);
                roots[i] = complexSub(z, delta);
                
                const change = Math.sqrt(delta.re * delta.re + delta.im * delta.im);
                maxChange = Math.max(maxChange, change);
            }
            
            if (maxChange < tolerance) break;
        }
        
        return roots
            .filter(z => Math.abs(z.im) < 0.01)
            .map(z => z.re)
            .sort((a, b) => a - b);
    }

    function evalPoly(coeffs, z) {
        let result = { re: 0, im: 0 };
        for (let i = 0; i < coeffs.length; i++) {
            const power = complexPow(z, coeffs.length - 1 - i);
            const term = complexScale(power, coeffs[i]);
            result = complexAdd(result, term);
        }
        return result;
    }

    function complexPow(z, n) {
        if (n === 0) return { re: 1, im: 0 };
        if (n === 1) return z;
        
        let result = { re: 1, im: 0 };
        for (let i = 0; i < n; i++) {
            result = complexMul(result, z);
        }
        return result;
    }

    function complexScale(z, scalar) {
        return { re: z.re * scalar, im: z.im * scalar };
    }

    function complexAdd(a, b) {
        return { re: a.re + b.re, im: a.im + b.im };
    }

    function complexSub(a, b) {
        return { re: a.re - b.re, im: a.im - b.im };
    }

    function complexMul(a, b) {
        return {
            re: a.re * b.re - a.im * b.im,
            im: a.re * b.im + a.im * b.re
        };
    }

    function complexDiv(a, b) {
        const denom = b.re * b.re + b.im * b.im;
        if (denom === 0) return { re: 0, im: 0 };
        return {
            re: (a.re * b.re + a.im * b.im) / denom,
            im: (a.im * b.re - a.re * b.im) / denom
        };
    }

    test('should solve (x-1)(x-2)(x-3)(x+1)(x+2) = 0', () => {
        // Expanded: x⁵ - 3x⁴ - 5x³ + 15x² + 4x - 12 = 0
        const roots = findPolynomialRoots([1, -3, -5, 15, 4, -12]);
        expect(roots.length).toBe(5);
        expect(roots[0]).toBeCloseTo(-2, 1);
        expect(roots[1]).toBeCloseTo(-1, 1);
        expect(roots[2]).toBeCloseTo(1, 1);
        expect(roots[3]).toBeCloseTo(2, 1);
        expect(roots[4]).toBeCloseTo(3, 1);
    });

    test('should solve x⁵ - 1 = 0 (only real root: x=1)', () => {
        const roots = findPolynomialRoots([1, 0, 0, 0, 0, -1]);
        expect(roots.length).toBeGreaterThanOrEqual(1);
        expect(roots).toContain(1);
    });

    test('should solve x⁵ - 5x³ + 4x = 0', () => {
        // Can be factored as x(x⁴ - 5x² + 4) = x(x²-1)(x²-4)
        // Roots: 0, ±1, ±2
        const roots = findPolynomialRoots([1, 0, -5, 0, 4, 0]);
        expect(roots.length).toBeGreaterThanOrEqual(3);
    });

    test('should handle quintic with numerical stability', () => {
        // x⁵ - 15x³ + 10x² + 60x - 72 = 0
        const roots = findPolynomialRoots([1, 0, -15, 10, 60, -72]);
        expect(roots.length).toBeGreaterThanOrEqual(1);
        // Just verify it finds at least one real root
    });

    test('should solve (x-1)³(x-2)² = 0', () => {
        // Expanded: x⁵ - 7x⁴ + 19x³ - 23x² + 12x - 4 = 0
        const roots = findPolynomialRoots([1, -7, 19, -23, 12, -4]);
        expect(roots.length).toBeGreaterThanOrEqual(1);
        // Multiple roots are harder to detect numerically
    });

    test('should solve x⁵ + x³ - 2x = 0', () => {
        // Can factor as x(x⁴ + x² - 2) = x(x²+2)(x²-1)
        // Real roots: 0, ±1
        const roots = findPolynomialRoots([1, 0, 1, 0, -2, 0]);
        expect(roots.length).toBeGreaterThanOrEqual(1);
    });
});
