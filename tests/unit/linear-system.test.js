const { solveLinearSystem, formatSystemNumber } = require('../../src/js/math/linear-system.js');

const closeAll = (actual, expected) => {
    expect(actual).toHaveLength(expected.length);
    expected.forEach((value, i) => expect(actual[i]).toBeCloseTo(value, 8));
};

describe('solveLinearSystem', () => {
    test('2x2 system', () => {
        const r = solveLinearSystem([[1, 1], [1, -1]], [3, 1]);
        expect(r.status).toBe('unique');
        closeAll(r.solution, [2, 1]);
    });

    test('3x3 system', () => {
        const r = solveLinearSystem([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], [8, -11, -3]);
        expect(r.status).toBe('unique');
        closeAll(r.solution, [2, 3, -1]);
    });

    test('5x5 system matches a known solution', () => {
        const x = [1, -2, 3, -4, 5];
        const A = [
            [4, 1, 0, 2, 1],
            [1, 5, 2, 0, 1],
            [0, 2, 6, 1, 0],
            [2, 0, 1, 7, 3],
            [1, 1, 0, 3, 8]
        ];
        const b = A.map(row => row.reduce((sum, value, i) => sum + value * x[i], 0));
        const r = solveLinearSystem(A, b);
        expect(r.status).toBe('unique');
        closeAll(r.solution, x);
    });

    test('needs row swaps when the first pivot is zero', () => {
        const r = solveLinearSystem([[0, 2], [3, 1]], [4, 5]);
        expect(r.status).toBe('unique');
        closeAll(r.solution, [1, 2]);
        expect(r.steps.some(step => step.description.includes('↔'))).toBe(true);
    });

    test('pivoting keeps a badly scaled system accurate', () => {
        const r = solveLinearSystem([[1e-12, 1], [1, 1]], [1, 2]);
        expect(r.status).toBe('unique');
        closeAll(r.solution, [1, 1]);
    });

    test('dependent equations give infinitely many solutions', () => {
        const r = solveLinearSystem([[1, 2], [2, 4]], [3, 6]);
        expect(r.status).toBe('infinite');
        expect(r.rank).toBe(1);
        expect(r.solution).toBeNull();
    });

    test('contradictory equations have no solution', () => {
        const r = solveLinearSystem([[1, 2], [2, 4]], [3, 7]);
        expect(r.status).toBe('none');
    });

    test('scaling the whole system does not change the verdict', () => {
        expect(solveLinearSystem([[1e-6, 2e-6], [2e-6, 4e-6]], [3e-6, 6e-6]).status).toBe('infinite');
        expect(solveLinearSystem([[1e6, 2e6], [2e6, 4e6]], [3e6, 6e6]).status).toBe('infinite');
    });

    test('a 3x3 with a free variable', () => {
        const r = solveLinearSystem([[1, 1, 1], [1, 2, 3], [2, 3, 4]], [6, 14, 20]);
        expect(r.status).toBe('infinite');
        expect(r.rank).toBe(2);
    });

    test('records the augmented matrix after each operation', () => {
        const r = solveLinearSystem([[2, 1], [4, 3]], [5, 11]);
        expect(r.steps[0]).toEqual({ description: 'start', matrix: [['2', '1', '5'], ['4', '3', '11']] });
        // partial pivoting brings the larger 4 to the top first, then eliminates with factor 0.5
        expect(r.steps[1]).toEqual({ description: 'R1 ↔ R2', matrix: [['4', '3', '11'], ['2', '1', '5']] });
        const eliminate = r.steps.find(step => step.description.startsWith('R2 ←'));
        expect(eliminate.description).toBe('R2 ← R2 − 0.5·R1');
        expect(eliminate.matrix).toEqual([['4', '3', '11'], ['0', '-0.5', '-0.5']]);
    });

    test('step matrices use fewer digits than the answer', () => {
        const r = solveLinearSystem([[3, 1], [1, 2]], [1, 1]);
        const longest = Math.max(...r.steps.flatMap(step => step.matrix.flat()).map(cell => cell.length));
        expect(longest).toBeLessThanOrEqual(8);
    });

    test('rejects malformed input', () => {
        expect(solveLinearSystem([], []).status).toBe('invalid');
        expect(solveLinearSystem([[1, 2], [3]], [1, 2]).status).toBe('invalid');
        expect(solveLinearSystem([[1, 2], [3, 4]], [1]).status).toBe('invalid');
        expect(solveLinearSystem([[1, NaN], [3, 4]], [1, 2]).status).toBe('invalid');
    });

    test('does not mutate its inputs', () => {
        const A = [[2, 1], [4, 3]];
        const b = [5, 11];
        solveLinearSystem(A, b);
        expect(A).toEqual([[2, 1], [4, 3]]);
        expect(b).toEqual([5, 11]);
    });
});

describe('formatSystemNumber', () => {
    test('trims noise', () => {
        expect(formatSystemNumber(0.1 + 0.2)).toBe('0.3');
        expect(formatSystemNumber(1e-15)).toBe('0');
        expect(formatSystemNumber(-2.5)).toBe('-2.5');
    });
});
