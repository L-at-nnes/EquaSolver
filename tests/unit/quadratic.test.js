/**
 * Tests for Quadratic Equations (ax² + bx + c = 0)
 */

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
