/**
 * Tests for Inequality Solver (Linear and Quadratic)
 */

const {
    solveLinearInequality,
    solveQuadraticInequality,
    flipOperator,
    evaluateComparison,
    formatOperator
} = require('../../src/js/index.js');

describe('Helper Functions', () => {
    describe('flipOperator', () => {
        test('should flip < to >', () => {
            expect(flipOperator('<')).toBe('>');
        });

        test('should flip > to <', () => {
            expect(flipOperator('>')).toBe('<');
        });

        test('should flip <= to >=', () => {
            expect(flipOperator('<=')).toBe('>=');
        });

        test('should flip >= to <=', () => {
            expect(flipOperator('>=')).toBe('<=');
        });
    });

    describe('evaluateComparison', () => {
        test('should evaluate < correctly', () => {
            expect(evaluateComparison(3, 5, '<')).toBe(true);
            expect(evaluateComparison(5, 3, '<')).toBe(false);
            expect(evaluateComparison(3, 3, '<')).toBe(false);
        });

        test('should evaluate > correctly', () => {
            expect(evaluateComparison(5, 3, '>')).toBe(true);
            expect(evaluateComparison(3, 5, '>')).toBe(false);
            expect(evaluateComparison(3, 3, '>')).toBe(false);
        });

        test('should evaluate <= correctly', () => {
            expect(evaluateComparison(3, 5, '<=')).toBe(true);
            expect(evaluateComparison(3, 3, '<=')).toBe(true);
            expect(evaluateComparison(5, 3, '<=')).toBe(false);
        });

        test('should evaluate >= correctly', () => {
            expect(evaluateComparison(5, 3, '>=')).toBe(true);
            expect(evaluateComparison(3, 3, '>=')).toBe(true);
            expect(evaluateComparison(3, 5, '>=')).toBe(false);
        });
    });

    describe('formatOperator', () => {
        test('should format < correctly', () => {
            expect(formatOperator('<')).toBe('<');
        });

        test('should format > correctly', () => {
            expect(formatOperator('>')).toBe('>');
        });

        test('should format <= to ≤', () => {
            expect(formatOperator('<=')).toBe('≤');
        });

        test('should format >= to ≥', () => {
            expect(formatOperator('>=')).toBe('≥');
        });
    });
});

describe('Linear Inequality Solver', () => {
    describe('Basic cases with positive coefficient', () => {
        test('should solve 2x - 4 < 0 (x < 2)', () => {
            const result = solveLinearInequality(2, -4, '<');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x < 2');
        });

        test('should solve 2x - 4 > 0 (x > 2)', () => {
            const result = solveLinearInequality(2, -4, '>');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x > 2');
        });

        test('should solve 3x + 6 <= 0 (x <= -2)', () => {
            const result = solveLinearInequality(3, 6, '<=');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x ≤ -2');
        });

        test('should solve 3x + 6 >= 0 (x >= -2)', () => {
            const result = solveLinearInequality(3, 6, '>=');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x ≥ -2');
        });
    });

    describe('Cases with negative coefficient (inequality flips)', () => {
        test('should solve -2x + 4 < 0 (x > 2)', () => {
            const result = solveLinearInequality(-2, 4, '<');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x > 2');
        });

        test('should solve -2x + 4 > 0 (x < 2)', () => {
            const result = solveLinearInequality(-2, 4, '>');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x < 2');
        });

        test('should solve -x - 3 <= 0 (x >= -3)', () => {
            const result = solveLinearInequality(-1, -3, '<=');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x ≥ -3');
        });
    });

    describe('Degenerate cases (a = 0)', () => {
        test('should return all real numbers when 0x + (-3) < 0 is always true', () => {
            const result = solveLinearInequality(0, -3, '<');
            expect(result.type).toBe('all');
            expect(result.solution).toContain('ℝ');
        });

        test('should return no solution when 0x + 3 < 0 is always false', () => {
            const result = solveLinearInequality(0, 3, '<');
            expect(result.type).toBe('none');
            expect(result.solution).toContain('∅');
        });

        test('should return all real numbers when 0x + 5 > 0 is always true', () => {
            const result = solveLinearInequality(0, 5, '>');
            expect(result.type).toBe('all');
        });

        test('should return no solution when 0x + (-5) > 0 is always false', () => {
            const result = solveLinearInequality(0, -5, '>');
            expect(result.type).toBe('none');
        });
    });

    describe('Interval notation', () => {
        test('should have correct notation for x < 2', () => {
            const result = solveLinearInequality(1, -2, '<');
            expect(result.notation).toContain('-∞');
            expect(result.notation).toContain('2');
        });

        test('should have correct notation for x >= -3', () => {
            const result = solveLinearInequality(1, 3, '>=');
            expect(result.notation).toContain('-3');
            expect(result.notation).toContain('+∞');
        });
    });
});

describe('Quadratic Inequality Solver', () => {
    describe('Two distinct roots (Δ > 0), parabola opens upward', () => {
        // x² - 5x + 6 = (x-2)(x-3), roots at 2 and 3
        test('should solve x² - 5x + 6 > 0 (x < 2 or x > 3)', () => {
            const result = solveQuadraticInequality(1, -5, 6, '>');
            expect(result.type).toBe('union');
            expect(result.solution).toContain('x < 2');
            expect(result.solution).toContain('x > 3');
        });

        test('should solve x² - 5x + 6 >= 0 (x ≤ 2 or x ≥ 3)', () => {
            const result = solveQuadraticInequality(1, -5, 6, '>=');
            expect(result.type).toBe('union');
            expect(result.solution).toContain('x ≤ 2');
            expect(result.solution).toContain('x ≥ 3');
        });

        test('should solve x² - 5x + 6 < 0 (2 < x < 3)', () => {
            const result = solveQuadraticInequality(1, -5, 6, '<');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('2');
            expect(result.solution).toContain('3');
        });

        test('should solve x² - 5x + 6 <= 0 (2 ≤ x ≤ 3)', () => {
            const result = solveQuadraticInequality(1, -5, 6, '<=');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('2');
            expect(result.solution).toContain('3');
        });
    });

    describe('Two distinct roots (Δ > 0), parabola opens downward', () => {
        // -x² + 5x - 6 = -(x-2)(x-3), roots at 2 and 3
        test('should solve -x² + 5x - 6 > 0 (2 < x < 3)', () => {
            const result = solveQuadraticInequality(-1, 5, -6, '>');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('2');
            expect(result.solution).toContain('3');
        });

        test('should solve -x² + 5x - 6 < 0 (x < 2 or x > 3)', () => {
            const result = solveQuadraticInequality(-1, 5, -6, '<');
            expect(result.type).toBe('union');
            expect(result.solution).toContain('x < 2');
            expect(result.solution).toContain('x > 3');
        });
    });

    describe('One root (Δ = 0), double root', () => {
        // x² - 4x + 4 = (x-2)², double root at 2
        test('should solve x² - 4x + 4 > 0 (x ≠ 2)', () => {
            const result = solveQuadraticInequality(1, -4, 4, '>');
            expect(result.solution).toContain('≠');
        });

        test('should solve x² - 4x + 4 >= 0 (all real numbers)', () => {
            const result = solveQuadraticInequality(1, -4, 4, '>=');
            expect(result.type).toBe('all');
        });

        test('should solve x² - 4x + 4 < 0 (no solution)', () => {
            const result = solveQuadraticInequality(1, -4, 4, '<');
            expect(result.type).toBe('none');
        });

        test('should solve x² - 4x + 4 <= 0 (x = 2 only)', () => {
            const result = solveQuadraticInequality(1, -4, 4, '<=');
            expect(result.type).toBe('point');
            expect(result.solution).toContain('2');
        });
    });

    describe('No real roots (Δ < 0)', () => {
        // x² + 1 > 0, always positive
        test('should solve x² + 1 > 0 (all real numbers)', () => {
            const result = solveQuadraticInequality(1, 0, 1, '>');
            expect(result.type).toBe('all');
        });

        test('should solve x² + 1 >= 0 (all real numbers)', () => {
            const result = solveQuadraticInequality(1, 0, 1, '>=');
            expect(result.type).toBe('all');
        });

        test('should solve x² + 1 < 0 (no solution)', () => {
            const result = solveQuadraticInequality(1, 0, 1, '<');
            expect(result.type).toBe('none');
        });

        test('should solve x² + 1 <= 0 (no solution)', () => {
            const result = solveQuadraticInequality(1, 0, 1, '<=');
            expect(result.type).toBe('none');
        });

        // -x² - 1 < 0, always negative
        test('should solve -x² - 1 < 0 (all real numbers)', () => {
            const result = solveQuadraticInequality(-1, 0, -1, '<');
            expect(result.type).toBe('all');
        });

        test('should solve -x² - 1 > 0 (no solution)', () => {
            const result = solveQuadraticInequality(-1, 0, -1, '>');
            expect(result.type).toBe('none');
        });
    });

    describe('Degenerate case (a = 0, becomes linear)', () => {
        test('should solve 0x² + 2x - 4 > 0 as linear (x > 2)', () => {
            const result = solveQuadraticInequality(0, 2, -4, '>');
            expect(result.type).toBe('interval');
            expect(result.solution).toContain('x > 2');
        });
    });

    describe('Interval notation', () => {
        test('should have union notation for x < 2 or x > 3', () => {
            const result = solveQuadraticInequality(1, -5, 6, '>');
            expect(result.notation).toContain('∪');
            expect(result.notation).toContain('-∞');
            expect(result.notation).toContain('+∞');
        });

        test('should have interval notation for 2 < x < 3', () => {
            const result = solveQuadraticInequality(1, -5, 6, '<');
            expect(result.notation).toContain(']');
            expect(result.notation).toContain('[');
        });
    });

    describe('Edge cases', () => {
        test('should handle x² > 0 (x ≠ 0)', () => {
            const result = solveQuadraticInequality(1, 0, 0, '>');
            expect(result.solution).toContain('≠');
        });

        test('should handle x² >= 0 (all real numbers)', () => {
            const result = solveQuadraticInequality(1, 0, 0, '>=');
            expect(result.type).toBe('all');
        });

        test('should handle x² < 0 (no solution)', () => {
            const result = solveQuadraticInequality(1, 0, 0, '<');
            expect(result.type).toBe('none');
        });

        test('should handle x² <= 0 (x = 0 only)', () => {
            const result = solveQuadraticInequality(1, 0, 0, '<=');
            expect(result.type).toBe('point');
        });

        test('should handle -x² < 0 (x ≠ 0)', () => {
            const result = solveQuadraticInequality(-1, 0, 0, '<');
            expect(result.solution).toContain('≠');
        });

        test('should handle -x² >= 0 (x = 0 only)', () => {
            const result = solveQuadraticInequality(-1, 0, 0, '>=');
            expect(result.type).toBe('point');
        });
    });
});

describe('Real-world test cases', () => {
    test('should solve x² - 9 < 0 (-3 < x < 3)', () => {
        const result = solveQuadraticInequality(1, 0, -9, '<');
        expect(result.type).toBe('interval');
        const x1 = parseFloat(result.interval[0]);
        const x2 = parseFloat(result.interval[1]);
        expect(x1).toBeCloseTo(-3, 4);
        expect(x2).toBeCloseTo(3, 4);
    });

    test('should solve 2x² - 8 >= 0 (x <= -2 or x >= 2)', () => {
        const result = solveQuadraticInequality(2, 0, -8, '>=');
        expect(result.type).toBe('union');
    });

    test('should solve x + 5 > 0 (x > -5)', () => {
        const result = solveLinearInequality(1, 5, '>');
        expect(result.type).toBe('interval');
        expect(result.solution).toContain('-5');
    });
});
