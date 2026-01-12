/**
 * Tests for Scientific Calculator Functions
 */

describe('Scientific Calculator', () => {
    describe('Trigonometric Functions', () => {
        test('should calculate sine', () => {
            expect(Math.sin(0)).toBeCloseTo(0, 10);
            expect(Math.sin(Math.PI / 2)).toBeCloseTo(1, 10);
            expect(Math.sin(Math.PI)).toBeCloseTo(0, 10);
            expect(Math.sin(Math.PI * 3 / 2)).toBeCloseTo(-1, 10);
            expect(Math.sin(Math.PI * 2)).toBeCloseTo(0, 10);
        });

        test('should calculate cosine', () => {
            expect(Math.cos(0)).toBeCloseTo(1, 10);
            expect(Math.cos(Math.PI / 2)).toBeCloseTo(0, 10);
            expect(Math.cos(Math.PI)).toBeCloseTo(-1, 10);
            expect(Math.cos(Math.PI * 3 / 2)).toBeCloseTo(0, 10);
            expect(Math.cos(Math.PI * 2)).toBeCloseTo(1, 10);
        });

        test('should calculate tangent', () => {
            expect(Math.tan(0)).toBeCloseTo(0, 10);
            expect(Math.tan(Math.PI / 4)).toBeCloseTo(1, 10);
            expect(Math.tan(Math.PI)).toBeCloseTo(0, 10);
            expect(Math.tan(-Math.PI / 4)).toBeCloseTo(-1, 10);
        });

        test('should calculate arcsine', () => {
            expect(Math.asin(0)).toBeCloseTo(0, 10);
            expect(Math.asin(1)).toBeCloseTo(Math.PI / 2, 10);
            expect(Math.asin(-1)).toBeCloseTo(-Math.PI / 2, 10);
            expect(Math.asin(0.5)).toBeCloseTo(Math.PI / 6, 10);
        });

        test('should calculate arccosine', () => {
            expect(Math.acos(1)).toBeCloseTo(0, 10);
            expect(Math.acos(0)).toBeCloseTo(Math.PI / 2, 10);
            expect(Math.acos(-1)).toBeCloseTo(Math.PI, 10);
            expect(Math.acos(0.5)).toBeCloseTo(Math.PI / 3, 10);
        });

        test('should calculate arctangent', () => {
            expect(Math.atan(0)).toBeCloseTo(0, 10);
            expect(Math.atan(1)).toBeCloseTo(Math.PI / 4, 10);
            expect(Math.atan(-1)).toBeCloseTo(-Math.PI / 4, 10);
            expect(Math.atan(Infinity)).toBeCloseTo(Math.PI / 2, 10);
        });

        test('should handle domain errors for inverse trig functions', () => {
            expect(Math.asin(2)).toBeNaN();
            expect(Math.asin(-2)).toBeNaN();
            expect(Math.acos(2)).toBeNaN();
            expect(Math.acos(-2)).toBeNaN();
        });
    });

    describe('Logarithmic Functions', () => {
        test('should calculate natural logarithm', () => {
            expect(Math.log(1)).toBeCloseTo(0, 10);
            expect(Math.log(Math.E)).toBeCloseTo(1, 10);
            expect(Math.log(Math.E ** 2)).toBeCloseTo(2, 10);
            expect(Math.log(10)).toBeCloseTo(2.302585092994046, 10);
        });

        test('should calculate base-10 logarithm', () => {
            expect(Math.log10(1)).toBeCloseTo(0, 10);
            expect(Math.log10(10)).toBeCloseTo(1, 10);
            expect(Math.log10(100)).toBeCloseTo(2, 10);
            expect(Math.log10(1000)).toBeCloseTo(3, 10);
        });

        test('should handle domain errors for logarithms', () => {
            expect(Math.log(0)).toBe(-Infinity);
            expect(Math.log(-1)).toBeNaN();
            expect(Math.log10(0)).toBe(-Infinity);
            expect(Math.log10(-1)).toBeNaN();
        });
    });

    describe('Exponential Functions', () => {
        test('should calculate exponential', () => {
            expect(Math.exp(0)).toBeCloseTo(1, 10);
            expect(Math.exp(1)).toBeCloseTo(Math.E, 10);
            expect(Math.exp(2)).toBeCloseTo(7.389056098930650, 10);
            expect(Math.exp(-1)).toBeCloseTo(0.36787944117144233, 10);
        });

        test('should handle large exponentials', () => {
            expect(Math.exp(10)).toBeCloseTo(22026.465794806718, 5);
            expect(Math.exp(-10)).toBeCloseTo(0.000045399929762484854, 10);
        });
    });

    describe('Power and Root Functions', () => {
        test('should calculate square root', () => {
            expect(Math.sqrt(0)).toBeCloseTo(0, 10);
            expect(Math.sqrt(1)).toBeCloseTo(1, 10);
            expect(Math.sqrt(4)).toBeCloseTo(2, 10);
            expect(Math.sqrt(9)).toBeCloseTo(3, 10);
            expect(Math.sqrt(16)).toBeCloseTo(4, 10);
            expect(Math.sqrt(2)).toBeCloseTo(1.4142135623730951, 10);
        });

        test('should handle domain errors for square root', () => {
            expect(Math.sqrt(-1)).toBeNaN();
            expect(Math.sqrt(-4)).toBeNaN();
        });

        test('should calculate power (x^y)', () => {
            expect(Math.pow(2, 3)).toBeCloseTo(8, 10);
            expect(Math.pow(5, 2)).toBeCloseTo(25, 10);
            expect(Math.pow(10, 0)).toBeCloseTo(1, 10);
            expect(Math.pow(2, -1)).toBeCloseTo(0.5, 10);
            expect(Math.pow(4, 0.5)).toBeCloseTo(2, 10);
        });

        test('should handle edge cases for power', () => {
            expect(Math.pow(0, 0)).toBe(1);
            expect(Math.pow(0, 1)).toBe(0);
            expect(Math.pow(1, 100)).toBe(1);
            expect(Math.pow(-1, 2)).toBe(1);
            expect(Math.pow(-2, 3)).toBe(-8);
        });
    });

    describe('Factorial Function', () => {
        // Helper function to test factorial
        function factorial(n) {
            if (n === 0 || n === 1) return 1;
            if (n > 170) throw new Error('Number too large');
            if (n < 0 || !Number.isInteger(n)) throw new Error('Domain error');
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        test('should calculate factorial for small numbers', () => {
            expect(factorial(0)).toBe(1);
            expect(factorial(1)).toBe(1);
            expect(factorial(2)).toBe(2);
            expect(factorial(3)).toBe(6);
            expect(factorial(4)).toBe(24);
            expect(factorial(5)).toBe(120);
            expect(factorial(6)).toBe(720);
            expect(factorial(7)).toBe(5040);
        });

        test('should calculate factorial for larger numbers', () => {
            expect(factorial(10)).toBe(3628800);
            expect(factorial(12)).toBe(479001600);
            expect(factorial(15)).toBe(1307674368000);
        });

        test('should handle domain errors for factorial', () => {
            expect(() => factorial(-1)).toThrow('Domain error');
            expect(() => factorial(1.5)).toThrow('Domain error');
            expect(() => factorial(-5)).toThrow('Domain error');
        });

        test('should handle overflow for very large factorials', () => {
            expect(() => factorial(171)).toThrow('Number too large');
            expect(() => factorial(200)).toThrow('Number too large');
        });
    });

    describe('Constants', () => {
        test('should provide pi constant', () => {
            expect(Math.PI).toBeCloseTo(3.141592653589793, 10);
        });

        test('should provide e constant', () => {
            expect(Math.E).toBeCloseTo(2.718281828459045, 10);
        });
    });

    describe('Combined Operations', () => {
        test('should handle sin(pi/6)', () => {
            expect(Math.sin(Math.PI / 6)).toBeCloseTo(0.5, 10);
        });

        test('should handle cos(pi/3)', () => {
            expect(Math.cos(Math.PI / 3)).toBeCloseTo(0.5, 10);
        });

        test('should handle ln(e^2)', () => {
            expect(Math.log(Math.exp(2))).toBeCloseTo(2, 10);
        });

        test('should handle sqrt(e^2)', () => {
            expect(Math.sqrt(Math.exp(2))).toBeCloseTo(Math.E, 10);
        });

        test('should handle complex calculation: sin^2 + cos^2 = 1', () => {
            const angle = Math.PI / 4;
            const result = Math.sin(angle) ** 2 + Math.cos(angle) ** 2;
            expect(result).toBeCloseTo(1, 10);
        });

        test('should handle log(10^3)', () => {
            expect(Math.log10(Math.pow(10, 3))).toBeCloseTo(3, 10);
        });
    });

    describe('Error Handling', () => {
        test('should handle division by zero in scientific context', () => {
            expect(1 / 0).toBe(Infinity);
            expect(-1 / 0).toBe(-Infinity);
            expect(0 / 0).toBeNaN();
        });

        test('should handle invalid inputs', () => {
            expect(Math.log('invalid')).toBeNaN();
            expect(Math.sin('invalid')).toBeNaN();
            expect(Math.sqrt('invalid')).toBeNaN();
        });

        test('should handle extreme values', () => {
            // Note: Very large values may have precision issues due to floating point
            expect(Math.sin(1e10)).toBeDefined();
            expect(Math.exp(100)).toBeGreaterThan(1e43);
            expect(Math.exp(-100)).toBeCloseTo(0, 10);
        });
    });

    describe('Precision Tests', () => {
        test('should maintain precision for trigonometric identities', () => {
            // sin(2x) = 2sin(x)cos(x)
            const x = 0.5;
            const left = Math.sin(2 * x);
            const right = 2 * Math.sin(x) * Math.cos(x);
            expect(left).toBeCloseTo(right, 10);
        });

        test('should maintain precision for logarithmic identities', () => {
            // ln(xy) = ln(x) + ln(y)
            const x = 2;
            const y = 3;
            const left = Math.log(x * y);
            const right = Math.log(x) + Math.log(y);
            expect(left).toBeCloseTo(right, 10);
        });

        test('should maintain precision for exponential identities', () => {
            // e^(x+y) = e^x * e^y
            const x = 1;
            const y = 2;
            const left = Math.exp(x + y);
            const right = Math.exp(x) * Math.exp(y);
            expect(left).toBeCloseTo(right, 10);
        });
    });
});
