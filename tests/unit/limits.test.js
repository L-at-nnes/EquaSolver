/**
 * Tests for Limit Calculator
 * 
 * This test suite covers:
 * - Function evaluation at points
 * - Limits at finite points
 * - Limits at infinity
 * - One-sided limits
 * - Indeterminate forms
 */

// Mock DOM elements
document.body.innerHTML = `
    <input type="text" id="limitFunction" value="x^2">
    <input type="text" id="limitPoint" value="2">
    <select id="limitDirection">
        <option value="both">Both</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
    </select>
    <div id="limitsSolution"></div>
    <button id="calculateLimit"></button>
    <button id="exportLimitsPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        limitResult: "Limit result",
        limitDNE: "Limit does not exist",
        indeterminate: "Indeterminate"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    evaluateLimitFunction
} = require('../../src/js/index.js');

describe('Expression Evaluation', () => {
    describe('Basic expressions', () => {
        test('should evaluate polynomial expressions', () => {
            expect(evaluateLimitFunction('x^2', 3)).toBe(9);
            expect(evaluateLimitFunction('x^3', 2)).toBe(8);
            expect(evaluateLimitFunction('2*x + 1', 5)).toBe(11);
        });

        test('should evaluate expressions with constants', () => {
            expect(evaluateLimitFunction('5', 10)).toBe(5);
            expect(evaluateLimitFunction('pi', 0)).toBeCloseTo(Math.PI, 10);
        });

        test('should evaluate arithmetic operations', () => {
            expect(evaluateLimitFunction('x + 5', 3)).toBe(8);
            expect(evaluateLimitFunction('x - 5', 10)).toBe(5);
            expect(evaluateLimitFunction('x * 3', 4)).toBe(12);
            expect(evaluateLimitFunction('x / 2', 10)).toBe(5);
        });
    });

    describe('Trigonometric functions', () => {
        test('should evaluate sin function', () => {
            expect(evaluateLimitFunction('sin(x)', 0)).toBeCloseTo(0, 10);
            expect(evaluateLimitFunction('sin(x)', Math.PI/2)).toBeCloseTo(1, 10);
        });

        test('should evaluate cos function', () => {
            expect(evaluateLimitFunction('cos(x)', 0)).toBeCloseTo(1, 10);
            expect(evaluateLimitFunction('cos(x)', Math.PI)).toBeCloseTo(-1, 10);
        });

        test('should evaluate tan function', () => {
            expect(evaluateLimitFunction('tan(x)', 0)).toBeCloseTo(0, 10);
            expect(evaluateLimitFunction('tan(x)', Math.PI/4)).toBeCloseTo(1, 10);
        });
    });

    describe('Logarithmic and exponential functions', () => {
        test('should evaluate natural log', () => {
            expect(evaluateLimitFunction('ln(x)', Math.E)).toBeCloseTo(1, 10);
            expect(evaluateLimitFunction('ln(x)', 1)).toBeCloseTo(0, 10);
        });

        test('should evaluate exp function', () => {
            expect(evaluateLimitFunction('exp(x)', 0)).toBeCloseTo(1, 10);
            expect(evaluateLimitFunction('exp(x)', 1)).toBeCloseTo(Math.E, 10);
        });

        test('should evaluate log10', () => {
            expect(evaluateLimitFunction('log(x)', 10)).toBeCloseTo(1, 10);
            expect(evaluateLimitFunction('log(x)', 100)).toBeCloseTo(2, 10);
        });
    });

    describe('Square root and absolute value', () => {
        test('should evaluate sqrt function', () => {
            expect(evaluateLimitFunction('sqrt(x)', 4)).toBe(2);
            expect(evaluateLimitFunction('sqrt(x)', 9)).toBe(3);
        });

        test('should evaluate abs function', () => {
            expect(evaluateLimitFunction('abs(x)', -5)).toBe(5);
            expect(evaluateLimitFunction('abs(x)', 5)).toBe(5);
        });
    });

    describe('Complex expressions', () => {
        test('should evaluate combined expressions', () => {
            expect(evaluateLimitFunction('x^2 + 2*x + 1', 2)).toBe(9);
            expect(evaluateLimitFunction('(x+1)*(x-1)', 3)).toBe(8);
        });

        test('should evaluate nested functions', () => {
            expect(evaluateLimitFunction('sin(x)^2 + cos(x)^2', 1)).toBeCloseTo(1, 10);
        });
    });
});

describe('Limit Calculations', () => {
    describe('Continuous functions at point', () => {
        test('limit of polynomial at finite point', () => {
            // lim(x→2) x^2 = 4
            const nearPoint = evaluateLimitFunction('x^2', 2 - 1e-8);
            expect(nearPoint).toBeCloseTo(4, 5);
        });

        test('limit of sin(x)/x as x→0 = 1', () => {
            const nearZero = evaluateLimitFunction('sin(x)/x', 0.0001);
            expect(nearZero).toBeCloseTo(1, 3);
        });
    });

    describe('Removable discontinuities', () => {
        test('limit of (x^2-1)/(x-1) as x→1 = 2', () => {
            // (x^2-1)/(x-1) = (x+1)(x-1)/(x-1) = x+1 for x≠1
            const leftLimit = evaluateLimitFunction('(x^2-1)/(x-1)', 1 - 1e-8);
            const rightLimit = evaluateLimitFunction('(x^2-1)/(x-1)', 1 + 1e-8);
            expect(leftLimit).toBeCloseTo(2, 3);
            expect(rightLimit).toBeCloseTo(2, 3);
        });
    });

    describe('Limits at infinity', () => {
        test('limit of 1/x as x→∞ = 0', () => {
            const atLargeX = evaluateLimitFunction('1/x', 1e10);
            expect(atLargeX).toBeCloseTo(0, 5);
        });

        test('polynomial dominates at infinity', () => {
            // lim(x→∞) x^2 = ∞
            const atLargeX = evaluateLimitFunction('x^2', 1e5);
            expect(atLargeX).toBeGreaterThan(1e9);
        });

        test('rational function limit', () => {
            // lim(x→∞) (2x+1)/(x+1) = 2
            const atLargeX = evaluateLimitFunction('(2*x+1)/(x+1)', 1e10);
            expect(atLargeX).toBeCloseTo(2, 5);
        });
    });

    describe('One-sided limits', () => {
        test('limit of 1/x from right as x→0+ = +∞', () => {
            const fromRight = evaluateLimitFunction('1/x', 1e-10);
            expect(fromRight).toBeGreaterThan(1e9);
        });

        test('limit of 1/x from left as x→0- = -∞', () => {
            const fromLeft = evaluateLimitFunction('1/x', -1e-10);
            expect(fromLeft).toBeLessThan(-1e9);
        });
    });
});

describe('Special Limits', () => {
    test('lim(x→0) (1-cos(x))/x^2 = 1/2', () => {
        const nearZero = evaluateLimitFunction('(1-cos(x))/(x^2)', 0.001);
        expect(nearZero).toBeCloseTo(0.5, 2);
    });

    test('lim(x→0) (exp(x)-1)/x = 1', () => {
        const nearZero = evaluateLimitFunction('(exp(x)-1)/x', 0.0001);
        expect(nearZero).toBeCloseTo(1, 2);
    });

    test('lim(x→0) sin(x) = 0', () => {
        const nearZero = evaluateLimitFunction('sin(x)', 0.0001);
        expect(nearZero).toBeCloseTo(0, 3);
    });
});

describe('Error Handling', () => {
    test('should return NaN for invalid expressions', () => {
        expect(evaluateLimitFunction('invalid(x)', 1)).toBeNaN();
    });

    test('should handle division by zero', () => {
        const result = evaluateLimitFunction('1/0', 1);
        expect(!isFinite(result)).toBe(true);
    });

    test('should handle sqrt of negative', () => {
        const result = evaluateLimitFunction('sqrt(x)', -1);
        expect(isNaN(result)).toBe(true);
    });
});
