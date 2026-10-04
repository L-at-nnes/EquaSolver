const { parsePairs, linearRegression, formatRegressionLine } = require('../../src/js/math/regression.js');

describe('parsePairs', () => {
    test('accepts commas, spaces, semicolons and blank lines', () => {
        const { points, invalidLines } = parsePairs('1, 2\n3 4\n\n5,6;7 8');
        expect(points).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 7, y: 8 }]);
        expect(invalidLines).toEqual([]);
    });

    test('reports malformed lines by number', () => {
        const { points, invalidLines } = parsePairs('1 2\nabc\n3 4 5\n6 7');
        expect(points).toEqual([{ x: 1, y: 2 }, { x: 6, y: 7 }]);
        expect(invalidLines).toEqual([2, 3]);
    });

    test('handles empty and missing input', () => {
        expect(parsePairs('')).toEqual({ points: [], invalidLines: [] });
        expect(parsePairs(undefined)).toEqual({ points: [], invalidLines: [] });
    });

    test('accepts negative and scientific numbers', () => {
        expect(parsePairs('-1.5 2e3').points).toEqual([{ x: -1.5, y: 2000 }]);
    });
});

describe('linearRegression', () => {
    test('recovers an exact line', () => {
        const fit = linearRegression([{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }]);
        expect(fit.slope).toBeCloseTo(2, 12);
        expect(fit.intercept).toBeCloseTo(1, 12);
        expect(fit.r).toBeCloseTo(1, 12);
        expect(fit.r2).toBeCloseTo(1, 12);
        expect(fit.n).toBe(4);
    });

    test('matches a textbook example', () => {
        // x = 1..5, y = 2, 4, 5, 4, 5  ->  slope 0.6, intercept 2.2, r = 0.7746
        const fit = linearRegression([[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]].map(([x, y]) => ({ x, y })));
        expect(fit.slope).toBeCloseTo(0.6, 12);
        expect(fit.intercept).toBeCloseTo(2.2, 12);
        expect(fit.r).toBeCloseTo(0.7745966692, 9);
        expect(fit.r2).toBeCloseTo(0.6, 12);
    });

    test('negative correlation', () => {
        const fit = linearRegression([{ x: 1, y: 5 }, { x: 2, y: 3 }, { x: 3, y: 1 }]);
        expect(fit.slope).toBeCloseTo(-2, 12);
        expect(fit.r).toBeCloseTo(-1, 12);
    });

    test('a flat cloud has slope zero, undefined r and R2 of 1', () => {
        const fit = linearRegression([{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }]);
        expect(fit.slope).toBe(0);
        expect(fit.intercept).toBe(4);
        expect(Number.isNaN(fit.r)).toBe(true);
        expect(fit.r2).toBe(1);
    });

    test('no unique line for a single point or a vertical set', () => {
        expect(linearRegression([{ x: 1, y: 1 }])).toBeNull();
        expect(linearRegression([])).toBeNull();
        expect(linearRegression([{ x: 2, y: 1 }, { x: 2, y: 5 }])).toBeNull();
    });

    test('is not thrown off by a large common offset', () => {
        const fit = linearRegression([0, 1, 2, 3].map(i => ({ x: 1e9 + i, y: 2 * i + 1 })));
        expect(fit.slope).toBeCloseTo(2, 6);
    });
});

describe('formatRegressionLine', () => {
    const line = (slope, intercept) => formatRegressionLine({ slope, intercept });

    test('formats signs and unit coefficients', () => {
        expect(line(2, 1)).toBe('y = 2x + 1');
        expect(line(2, -3)).toBe('y = 2x - 3');
        expect(line(1, 0)).toBe('y = x');
        expect(line(-1, 5)).toBe('y = -x + 5');
        expect(line(0.5, 0)).toBe('y = 0.5x');
        expect(line(0, 3)).toBe('y = 3');
    });

    test('removes floating point noise', () => {
        expect(line(0.30000000000000004, 2.0000000000000004)).toBe('y = 0.3x + 2');
    });
});
