/**
 * Tests for Standard Calculator Operations
 */

describe('Standard Calculator', () => {
    describe('Basic Arithmetic', () => {
        test('should add two numbers', () => {
            expect(5 + 3).toBe(8);
            expect(-5 + 3).toBe(-2);
            expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
        });

        test('should subtract two numbers', () => {
            expect(10 - 4).toBe(6);
            expect(-5 - 3).toBe(-8);
            expect(5.5 - 2.3).toBeCloseTo(3.2, 5);
        });

        test('should multiply two numbers', () => {
            expect(6 * 7).toBe(42);
            expect(-3 * 4).toBe(-12);
            expect(2.5 * 4).toBe(10);
        });

        test('should divide two numbers', () => {
            expect(15 / 3).toBe(5);
            expect(10 / 4).toBe(2.5);
            expect(-20 / 5).toBe(-4);
        });

        test('should handle division by zero', () => {
            expect(5 / 0).toBe(Infinity);
            expect(-5 / 0).toBe(-Infinity);
        });
    });

    describe('Advanced Operations', () => {
        test('should calculate percentage', () => {
            expect(50 / 100).toBe(0.5);
            expect(25 / 100).toBe(0.25);
        });

        test('should calculate power (x²)', () => {
            expect(5 * 5).toBe(25);
            expect(3 * 3).toBe(9);
            expect(-4 * -4).toBe(16);
        });

        test('should handle decimal operations', () => {
            expect(0.1 + 0.1).toBeCloseTo(0.2, 5);
            expect(0.3 - 0.1).toBeCloseTo(0.2, 5);
            expect(0.2 * 0.5).toBeCloseTo(0.1, 5);
        });
    });

    describe('Order of Operations', () => {
        test('should follow PEMDAS: 2 + 3 * 4', () => {
            const result = 2 + (3 * 4);
            expect(result).toBe(14);
        });

        test('should handle parentheses: (2 + 3) * 4', () => {
            const result = (2 + 3) * 4;
            expect(result).toBe(20);
        });

        test('should handle complex expression: (8 - 2) / 3 + 5', () => {
            const result = (8 - 2) / 3 + 5;
            expect(result).toBeCloseTo(7, 5);
        });
    });

    describe('Edge Cases', () => {
        test('should handle zero', () => {
            expect(0 + 0).toBe(0);
            expect(0 * 5).toBe(0);
            expect(0 - 0).toBe(0);
        });

        test('should handle negative numbers', () => {
            expect(-5 + -3).toBe(-8);
            expect(-5 * -3).toBe(15);
            expect(-10 / -2).toBe(5);
        });

        test('should handle very large numbers', () => {
            expect(1000000 + 1000000).toBe(2000000);
            expect(999999 * 2).toBe(1999998);
        });

        test('should handle very small numbers', () => {
            expect(0.0001 + 0.0001).toBeCloseTo(0.0002, 5);
            expect(0.001 * 0.1).toBeCloseTo(0.0001, 5);
        });
    });
});
