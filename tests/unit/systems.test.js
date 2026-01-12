/**
 * Tests for Systems of Linear Equations (Cramer's Rule)
 * ax + by = e
 * cx + dy = f
 */

describe('System of Equations Solver', () => {
    test('should solve simple system: x + y = 3, x - y = 1', () => {
        const a = 1, b = 1, e = 3;
        const c = 1, d = -1, f = 1;
        
        const det = a * d - b * c;
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        expect(x).toBe(2);
        expect(y).toBe(1);
    });

    test('should solve 2x + 3y = 8, 4x - y = 2', () => {
        const a = 2, b = 3, e = 8;
        const c = 4, d = -1, f = 2;
        
        const det = a * d - b * c;
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        expect(x).toBeCloseTo(1, 4);
        expect(y).toBeCloseTo(2, 4);
    });

    test('should detect parallel lines (det = 0): 2x + 4y = 8, x + 2y = 3', () => {
        const a = 2, b = 4;
        const c = 1, d = 2;
        
        const det = a * d - b * c;
        expect(det).toBe(0);
    });

    test('should solve system with negative coefficients: -2x + y = -5, x - 3y = 6', () => {
        const a = -2, b = 1, e = -5;
        const c = 1, d = -3, f = 6;
        
        const det = a * d - b * c;
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        expect(x).toBeCloseTo(1.8, 2);
        expect(y).toBeCloseTo(-1.4, 2);
    });

    test('should solve system with fractional solution: 3x + 2y = 7, x - y = 1', () => {
        const a = 3, b = 2, e = 7;
        const c = 1, d = -1, f = 1;
        
        const det = a * d - b * c;
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        expect(x).toBeCloseTo(1.8, 4);
        expect(y).toBeCloseTo(0.8, 4);
    });

    test('should handle unique solution case', () => {
        const a = 5, b = 3, e = 11;
        const c = 2, d = -1, f = 1;
        
        const det = a * d - b * c;
        expect(det).not.toBe(0); // Unique solution exists
        
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        expect(x).toBeCloseTo(1.27, 2);
        expect(y).toBeCloseTo(1.55, 2);
    });
});
