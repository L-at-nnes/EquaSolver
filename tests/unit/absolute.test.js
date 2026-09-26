const {
    solveAbsoluteEquation,
    solveAbsoluteInequality
} = require('../../src/js/solvers/absolute.js');

describe('Absolute Value Solver', () => {
    test('|x| = 3 has two solutions', () => {
        const result = solveAbsoluteEquation(1, 0, 3);
        expect(result.error).toBeNull();
        expect(result.solutions).toEqual([-3, 3]);
    });

    test('|2x - 4| = 0 has one solution x=2', () => {
        const result = solveAbsoluteEquation(2, -4, 0);
        expect(result.error).toBeNull();
        expect(result.solutions).toEqual([2]);
    });

    test('|ax+b|=c with c<0 has no solution', () => {
        const result = solveAbsoluteEquation(1, 2, -1);
        expect(result.error).not.toBeNull();
        expect(result.solutions).toEqual([]);
    });

    test('|x| < 2 returns bounded interval', () => {
        const result = solveAbsoluteInequality(1, 0, '<', 2);
        expect(result.error).toBeNull();
        expect(result.interval).toBe('(-2, 2)');
    });

    test('|x| >= 2 returns exterior intervals', () => {
        const result = solveAbsoluteInequality(1, 0, '>=', 2);
        expect(result.error).toBeNull();
        expect(result.interval).toBe('(-∞, -2] ∪ [2, +∞)');
    });
});

describe('solveAbsoluteInequality - zero right-hand side', () => {
    test('|x| < 0 has no solution', () => {
        const r = solveAbsoluteInequality(1, 0, '<', 0);
        expect(r.interval).toBe('∅');
    });

    test('|x| >= 0 holds for every real number', () => {
        const r = solveAbsoluteInequality(2, 3, '>=', 0);
        expect(r.interval).toBe('(-∞, +∞)');
    });

    test('|x - 2| <= 0 is the single point 2', () => {
        const r = solveAbsoluteInequality(1, -2, '<=', 0);
        expect(r.interval).toBe('[2, 2]');
    });
});
