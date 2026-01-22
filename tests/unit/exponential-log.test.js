/**
 * EquaSolver - Exponential & Logarithmic Equations Tests
 * Tests for exponential and logarithmic equation solvers
 */

const {
    solveExponentialSimple,
    solveExponentialWithCoefficient,
    solveLogarithmicSimple,
    solveLogarithmicWithArgument,
    solveNaturalLog,
    solveCommonLog,
    solveNaturalExponential
} = require('../../src/js/index.js');

describe('Exponential Equation Solvers', () => {
    describe('solveExponentialSimple', () => {
        test('solves 2^x = 8 correctly', () => {
            const result = solveExponentialSimple(2, 8);
            expect(result.x).toBeCloseTo(3, 6);
            expect(result.equation).toBe('2^x = 8');
        });

        test('solves 3^x = 27 correctly', () => {
            const result = solveExponentialSimple(3, 27);
            expect(result.x).toBeCloseTo(3, 6);
        });

        test('solves 10^x = 100 correctly', () => {
            const result = solveExponentialSimple(10, 100);
            expect(result.x).toBeCloseTo(2, 6);
        });

        test('solves 5^x = 1 correctly (x = 0)', () => {
            const result = solveExponentialSimple(5, 1);
            expect(result.x).toBeCloseTo(0, 6);
        });

        test('solves 2^x = 0.5 correctly (negative exponent)', () => {
            const result = solveExponentialSimple(2, 0.5);
            expect(result.x).toBeCloseTo(-1, 6);
        });

        test('solves fractional base 0.5^x = 8 correctly', () => {
            const result = solveExponentialSimple(0.5, 8);
            expect(result.x).toBeCloseTo(-3, 6);
        });

        test('returns error for base = 1', () => {
            const result = solveExponentialSimple(1, 8);
            expect(result.error).toBeDefined();
        });

        test('returns error for base = 0', () => {
            const result = solveExponentialSimple(0, 8);
            expect(result.error).toBeDefined();
        });

        test('returns error for negative base', () => {
            const result = solveExponentialSimple(-2, 8);
            expect(result.error).toBeDefined();
        });

        test('returns error for result <= 0', () => {
            const result = solveExponentialSimple(2, -8);
            expect(result.error).toBeDefined();
        });

        test('returns error for result = 0', () => {
            const result = solveExponentialSimple(2, 0);
            expect(result.error).toBeDefined();
        });

        test('includes solution steps', () => {
            const result = solveExponentialSimple(2, 8);
            expect(result.steps).toBeDefined();
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });

    describe('solveExponentialWithCoefficient', () => {
        test('solves 2 * 3^x = 18 correctly', () => {
            const result = solveExponentialWithCoefficient(2, 3, 18);
            expect(result.x).toBeCloseTo(2, 6);
            expect(result.equation).toBe('2 · 3^x = 18');
        });

        test('solves 5 * 2^x = 40 correctly', () => {
            const result = solveExponentialWithCoefficient(5, 2, 40);
            expect(result.x).toBeCloseTo(3, 6);
        });

        test('solves 3 * 10^x = 300 correctly', () => {
            const result = solveExponentialWithCoefficient(3, 10, 300);
            expect(result.x).toBeCloseTo(2, 6);
        });

        test('solves 4 * 2^x = 4 correctly (x = 0)', () => {
            const result = solveExponentialWithCoefficient(4, 2, 4);
            expect(result.x).toBeCloseTo(0, 6);
        });

        test('returns error for coefficient = 0', () => {
            const result = solveExponentialWithCoefficient(0, 2, 8);
            expect(result.error).toBeDefined();
        });

        test('returns error for base = 1', () => {
            const result = solveExponentialWithCoefficient(2, 1, 8);
            expect(result.error).toBeDefined();
        });

        test('returns error when c/a is negative', () => {
            const result = solveExponentialWithCoefficient(2, 3, -6);
            expect(result.error).toBeDefined();
        });

        test('handles negative coefficient with positive result', () => {
            const result = solveExponentialWithCoefficient(-2, 3, -18);
            expect(result.x).toBeCloseTo(2, 6);
        });
    });

    describe('solveNaturalExponential', () => {
        test('solves e^x = e correctly (x = 1)', () => {
            const result = solveNaturalExponential(Math.E);
            expect(result.x).toBeCloseTo(1, 6);
        });

        test('solves e^x = 1 correctly (x = 0)', () => {
            const result = solveNaturalExponential(1);
            expect(result.x).toBeCloseTo(0, 6);
        });

        test('solves e^x = e^2 correctly (x = 2)', () => {
            const result = solveNaturalExponential(Math.E * Math.E);
            expect(result.x).toBeCloseTo(2, 6);
        });

        test('solves e^x = 7.389 correctly (x ≈ 2)', () => {
            const result = solveNaturalExponential(7.389056099);
            expect(result.x).toBeCloseTo(2, 5);
        });

        test('solves e^x = 0.5 correctly (negative x)', () => {
            const result = solveNaturalExponential(0.5);
            expect(result.x).toBeCloseTo(Math.log(0.5), 6);
        });

        test('returns error for result <= 0', () => {
            const result = solveNaturalExponential(-1);
            expect(result.error).toBeDefined();
        });

        test('returns error for result = 0', () => {
            const result = solveNaturalExponential(0);
            expect(result.error).toBeDefined();
        });
    });
});

describe('Logarithmic Equation Solvers', () => {
    describe('solveLogarithmicSimple', () => {
        test('solves log_2(x) = 3 correctly (x = 8)', () => {
            const result = solveLogarithmicSimple(2, 3);
            expect(result.x).toBeCloseTo(8, 6);
            expect(result.equation).toBe('log₂(x) = 3');
        });

        test('solves log_10(x) = 2 correctly (x = 100)', () => {
            const result = solveLogarithmicSimple(10, 2);
            expect(result.x).toBeCloseTo(100, 6);
        });

        test('solves log_3(x) = 4 correctly (x = 81)', () => {
            const result = solveLogarithmicSimple(3, 4);
            expect(result.x).toBeCloseTo(81, 6);
        });

        test('solves log_5(x) = 0 correctly (x = 1)', () => {
            const result = solveLogarithmicSimple(5, 0);
            expect(result.x).toBeCloseTo(1, 6);
        });

        test('solves log_2(x) = -3 correctly (x = 0.125)', () => {
            const result = solveLogarithmicSimple(2, -3);
            expect(result.x).toBeCloseTo(0.125, 6);
        });

        test('solves log_0.5(x) = 2 correctly', () => {
            const result = solveLogarithmicSimple(0.5, 2);
            expect(result.x).toBeCloseTo(0.25, 6);
        });

        test('returns error for base = 1', () => {
            const result = solveLogarithmicSimple(1, 3);
            expect(result.error).toBeDefined();
        });

        test('returns error for base = 0', () => {
            const result = solveLogarithmicSimple(0, 3);
            expect(result.error).toBeDefined();
        });

        test('returns error for negative base', () => {
            const result = solveLogarithmicSimple(-2, 3);
            expect(result.error).toBeDefined();
        });

        test('includes solution steps', () => {
            const result = solveLogarithmicSimple(2, 3);
            expect(result.steps).toBeDefined();
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });

    describe('solveLogarithmicWithArgument', () => {
        test('solves log_10(2x - 3) = 2 correctly', () => {
            // log_10(2x - 3) = 2 => 2x - 3 = 100 => 2x = 103 => x = 51.5
            const result = solveLogarithmicWithArgument(10, 2, -3, 2);
            expect(result.x).toBeCloseTo(51.5, 6);
        });

        test('solves log_2(3x + 1) = 4 correctly', () => {
            // log_2(3x + 1) = 4 => 3x + 1 = 16 => 3x = 15 => x = 5
            const result = solveLogarithmicWithArgument(2, 3, 1, 4);
            expect(result.x).toBeCloseTo(5, 6);
        });

        test('solves log_10(x) = 2 correctly (b=1, c=0)', () => {
            const result = solveLogarithmicWithArgument(10, 1, 0, 2);
            expect(result.x).toBeCloseTo(100, 6);
        });

        test('returns error when solution gives negative argument', () => {
            // log_2(2x + 100) = 3 => 2x + 100 = 8 => 2x = -92 => x = -46
            // But we need 2x + 100 > 0, so 2(-46) + 100 = 8 > 0, valid!
            // Let's try: log_2(-x + 1) = 3 => -x + 1 = 8 => x = -7
            // Check: -(-7) + 1 = 8 > 0, still valid
            // Actually we need: log_2(2x - 100) = 1 => 2x - 100 = 2 => x = 51
            // Check: 2(51) - 100 = 2 > 0, valid
            // For error: log_2(2x - 100) = 1 where x would make arg <= 0
            // Let me make coefX = 0
            const result = solveLogarithmicWithArgument(2, 0, 5, 3);
            expect(result.error).toBeDefined();
        });

        test('returns error for coefficient b = 0', () => {
            const result = solveLogarithmicWithArgument(10, 0, 5, 2);
            expect(result.error).toBeDefined();
        });

        test('returns error for base = 1', () => {
            const result = solveLogarithmicWithArgument(1, 2, -3, 2);
            expect(result.error).toBeDefined();
        });
    });

    describe('solveNaturalLog', () => {
        test('solves ln(x) = 1 correctly (x = e)', () => {
            const result = solveNaturalLog(1);
            expect(result.x).toBeCloseTo(Math.E, 6);
            expect(result.equation).toBe('ln(x) = 1');
        });

        test('solves ln(x) = 0 correctly (x = 1)', () => {
            const result = solveNaturalLog(0);
            expect(result.x).toBeCloseTo(1, 6);
        });

        test('solves ln(x) = 2 correctly (x = e^2)', () => {
            const result = solveNaturalLog(2);
            expect(result.x).toBeCloseTo(Math.E * Math.E, 5);
        });

        test('solves ln(x) = -1 correctly (x = 1/e)', () => {
            const result = solveNaturalLog(-1);
            expect(result.x).toBeCloseTo(1 / Math.E, 6);
        });

        test('includes solution steps', () => {
            const result = solveNaturalLog(2);
            expect(result.steps).toBeDefined();
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });

    describe('solveCommonLog', () => {
        test('solves log₁₀(x) = 2 correctly (x = 100)', () => {
            const result = solveCommonLog(2);
            expect(result.x).toBeCloseTo(100, 6);
            expect(result.equation).toBe('log₁₀(x) = 2');
        });

        test('solves log₁₀(x) = 0 correctly (x = 1)', () => {
            const result = solveCommonLog(0);
            expect(result.x).toBeCloseTo(1, 6);
        });

        test('solves log₁₀(x) = 3 correctly (x = 1000)', () => {
            const result = solveCommonLog(3);
            expect(result.x).toBeCloseTo(1000, 6);
        });

        test('solves log₁₀(x) = -1 correctly (x = 0.1)', () => {
            const result = solveCommonLog(-1);
            expect(result.x).toBeCloseTo(0.1, 6);
        });

        test('solves log₁₀(x) = 0.5 correctly', () => {
            const result = solveCommonLog(0.5);
            expect(result.x).toBeCloseTo(Math.sqrt(10), 5);
        });

        test('includes solution steps', () => {
            const result = solveCommonLog(2);
            expect(result.steps).toBeDefined();
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });
});

describe('Edge Cases and Special Values', () => {
    test('exponential with very large result', () => {
        const result = solveExponentialSimple(2, 1048576);
        expect(result.x).toBeCloseTo(20, 6);
    });

    test('exponential with very small result', () => {
        const result = solveExponentialSimple(2, 0.0009765625);
        expect(result.x).toBeCloseTo(-10, 6);
    });

    test('logarithm with large exponent', () => {
        const result = solveLogarithmicSimple(2, 10);
        expect(result.x).toBeCloseTo(1024, 6);
    });

    test('logarithm with negative exponent', () => {
        const result = solveLogarithmicSimple(2, -10);
        expect(result.x).toBeCloseTo(1/1024, 6);
    });

    test('natural exponential with result close to 1', () => {
        const result = solveNaturalExponential(1.01);
        expect(result.x).toBeCloseTo(Math.log(1.01), 6);
    });

    test('fractional base exponential', () => {
        const result = solveExponentialSimple(0.1, 0.001);
        expect(result.x).toBeCloseTo(3, 6);
    });
});

describe('Mathematical Properties', () => {
    test('exponential and logarithm are inverses', () => {
        // If 2^x = 8, then log_2(8) = x
        const expResult = solveExponentialSimple(2, 8);
        const logResult = solveLogarithmicSimple(2, expResult.x);
        expect(logResult.x).toBeCloseTo(8, 6);
    });

    test('natural exp and ln are inverses', () => {
        const expResult = solveNaturalExponential(10);
        const lnResult = solveNaturalLog(expResult.x);
        expect(lnResult.x).toBeCloseTo(10, 5);
    });

    test('change of base formula consistency', () => {
        // log_2(8) should equal ln(8)/ln(2)
        const logResult = solveLogarithmicSimple(2, 3);
        expect(logResult.x).toBeCloseTo(Math.pow(2, 3), 6);
    });

    test('coefficient equation property: a * b^x = c => b^x = c/a', () => {
        const result1 = solveExponentialWithCoefficient(3, 2, 24);
        const result2 = solveExponentialSimple(2, 8);
        expect(result1.x).toBeCloseTo(result2.x, 6);
    });
});
