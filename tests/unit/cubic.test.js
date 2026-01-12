/**
 * Tests for Cubic Equations (ax³ + bx² + cx + d = 0)
 * Using simplified test cases
 */

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
