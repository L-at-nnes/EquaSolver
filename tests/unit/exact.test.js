const { exactQuadraticRoots, extractSquare, toIntegerCoefficients } = require('../../src/js/math/exact.js');

describe('extractSquare', () => {
    test('splits out the square factor', () => {
        expect(extractSquare(8)).toEqual({ k: 2, m: 2 });
        expect(extractSquare(12)).toEqual({ k: 2, m: 3 });
        expect(extractSquare(72)).toEqual({ k: 6, m: 2 });
        expect(extractSquare(5)).toEqual({ k: 1, m: 5 });
        expect(extractSquare(49)).toEqual({ k: 7, m: 1 });
    });
});

describe('toIntegerCoefficients', () => {
    test('scales decimals up', () => {
        expect(toIntegerCoefficients([0.5, 1.5, -2])).toEqual([5, 15, -20]);
        expect(toIntegerCoefficients([1, 0.1, 0.2])).toEqual([10, 1, 2]);
    });

    test('rejects values that are not finite or not short decimals', () => {
        expect(toIntegerCoefficients([Math.PI, 1, 1])).toBeNull();
        expect(toIntegerCoefficients([NaN, 1, 1])).toBeNull();
    });
});

describe('exactQuadraticRoots', () => {
    test('rational roots come out as reduced fractions', () => {
        expect(exactQuadraticRoots(1, -5, 6)).toEqual({ kind: 'rational', roots: ['3', '2'], combined: null });
        expect(exactQuadraticRoots(2, -3, 1).roots).toEqual(['1', '1/2']);
        expect(exactQuadraticRoots(6, 5, 1).roots).toEqual(['-1/3', '-1/2']);
    });

    test('a double root is a single value', () => {
        expect(exactQuadraticRoots(1, -4, 4)).toEqual({ kind: 'rational', roots: ['2'], combined: null });
        expect(exactQuadraticRoots(4, 4, 1).roots).toEqual(['-1/2']);
    });

    test('irrational roots keep the square root', () => {
        const r = exactQuadraticRoots(1, -3, 1);
        expect(r.kind).toBe('radical');
        expect(r.roots).toEqual(['(3 + √5) / 2', '(3 - √5) / 2']);
        expect(r.combined).toBe('(3 ± √5) / 2');
    });

    test('square factors are pulled out and the fraction is reduced', () => {
        // x^2 - 2x - 2 = 0 -> 1 +/- sqrt(3)
        expect(exactQuadraticRoots(1, -2, -2).combined).toBe('1 ± √3');
        // x^2 - 8 = 0 -> +/- 2 sqrt(2)
        expect(exactQuadraticRoots(1, 0, -8).combined).toBe('±2√2');
        // x^2 - 2 = 0
        expect(exactQuadraticRoots(1, 0, -2).roots).toEqual(['√2', '-√2']);
        // 2x^2 - 1 = 0 -> +/- sqrt(2)/2
        expect(exactQuadraticRoots(2, 0, -1).combined).toBe('±√2/2');
    });

    test('negative leading coefficient gives the same roots', () => {
        expect(exactQuadraticRoots(-1, 3, -1).combined).toBe('(3 ± √5) / 2');
    });

    test('complex roots use i', () => {
        const r = exactQuadraticRoots(1, 2, 5);
        expect(r.kind).toBe('complex');
        expect(r.roots).toEqual(['-1 + 2i', '-1 - 2i']);
        expect(r.combined).toBe('-1 ± 2i');
    });

    test('complex roots with a non perfect square discriminant', () => {
        // x^2 + x + 1 = 0 -> (-1 +/- i sqrt(3)) / 2
        const r = exactQuadraticRoots(1, 1, 1);
        expect(r.roots).toEqual(['(-1 + i√3) / 2', '(-1 - i√3) / 2']);
        // x^2 + 4 = 0 -> +/- 2i
        expect(exactQuadraticRoots(1, 0, 4).roots).toEqual(['2i', '-2i']);
    });

    test('works with decimal coefficients', () => {
        expect(exactQuadraticRoots(0.5, -1.5, 1).roots).toEqual(['2', '1']);
    });

    test('returns null when no exact form applies', () => {
        expect(exactQuadraticRoots(0, 1, 1)).toBeNull();
        expect(exactQuadraticRoots(Math.PI, 1, 1)).toBeNull();
        expect(exactQuadraticRoots(1e9, 1e9, 1)).toBeNull();
    });
});
