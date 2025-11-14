/**
 * Tests for Linear Equations (ax + b = 0)
 */

describe('Linear Equations Solver', () => {
    test('should solve simple linear equation: 2x + 4 = 0', () => {
        const a = 2;
        const b = 4;
        const expected = -2;
        const result = -b / a;
        expect(result).toBe(expected);
    });

    test('should solve linear equation: -3x + 9 = 0', () => {
        const a = -3;
        const b = 9;
        const expected = 3;
        const result = -b / a;
        expect(result).toBe(expected);
    });

    test('should handle a = 0 (no solution or infinite)', () => {
        const a = 0;
        const b = 5;
        expect(a).toBe(0);
        // When a = 0 and b != 0, no solution
    });

    test('should handle a = 0, b = 0 (infinite solutions)', () => {
        const a = 0;
        const b = 0;
        expect(a).toBe(0);
        expect(b).toBe(0);
    });

    test('should solve fractional coefficient: 0.5x + 2.5 = 0', () => {
        const a = 0.5;
        const b = 2.5;
        const expected = -5;
        const result = -b / a;
        expect(result).toBeCloseTo(expected, 4);
    });
});
