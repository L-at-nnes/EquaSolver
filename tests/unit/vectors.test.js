const {
    parseVector, vectorAdd, vectorSub, dotProduct, crossProduct, vectorNorm, vectorAngle, vectorProjection, formatVector
} = require('../../src/js/math/vectors.js');

describe('parseVector', () => {
    test('accepts commas, spaces, semicolons and brackets', () => {
        expect(parseVector('1, 2, 3')).toEqual([1, 2, 3]);
        expect(parseVector('1 2 3')).toEqual([1, 2, 3]);
        expect(parseVector('(1;2;-3)')).toEqual([1, 2, -3]);
        expect(parseVector('[0.5, 1e2]')).toEqual([0.5, 100]);
    });

    test('decimal comma between digits', () => {
        expect(parseVector('1,5 2,5')).toEqual([1.5, 2.5]);
    });

    test('rejects bad input', () => {
        ['', '5', 'a b', '1 2 x', '1 2 3 4 5 6 7', '1..2 3', null, 4].forEach(v => expect(parseVector(v)).toBeNull());
    });
});

describe('basic operations', () => {
    test('add and subtract', () => {
        expect(vectorAdd([1, 2], [3, 4])).toEqual([4, 6]);
        expect(vectorSub([1, 2], [3, 4])).toEqual([-2, -2]);
        expect(vectorAdd([1, 2], [1, 2, 3])).toBeNull();
    });

    test('dot product', () => {
        expect(dotProduct([1, 2, 3], [4, -5, 6])).toBe(12);
        expect(dotProduct([1, 0], [0, 1])).toBe(0);
        expect(dotProduct([1, 2], [1, 2, 3])).toBeNull();
    });

    test('norm', () => {
        expect(vectorNorm([3, 4])).toBe(5);
        expect(vectorNorm([1, 2, 2])).toBe(3);
    });
});

describe('crossProduct', () => {
    test('3D', () => {
        expect(crossProduct([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
        expect(crossProduct([2, 3, 4], [5, 6, 7])).toEqual([-3, 6, -3]);
    });

    test('is anti-commutative and orthogonal to both inputs', () => {
        const a = [1, 2, 3];
        const b = [-2, 0, 5];
        const c = crossProduct(a, b);
        expect(crossProduct(b, a)).toEqual(c.map(x => -x));
        expect(dotProduct(c, a)).toBe(0);
        expect(dotProduct(c, b)).toBe(0);
    });

    test('2D returns the scalar z component', () => {
        expect(crossProduct([1, 2], [3, 4])).toBe(-2);
    });

    test('unsupported sizes', () => {
        expect(crossProduct([1, 2, 3, 4], [1, 2, 3, 4])).toBeNull();
        expect(crossProduct([1, 2], [1, 2, 3])).toBeNull();
    });
});

describe('vectorAngle', () => {
    test('known angles', () => {
        expect(vectorAngle([1, 0], [0, 1])).toBeCloseTo(Math.PI / 2, 12);
        expect(vectorAngle([1, 0], [-1, 0])).toBeCloseTo(Math.PI, 12);
        expect(vectorAngle([1, 1], [2, 2])).toBeCloseTo(0, 6);
    });

    test('parallel vectors do not produce NaN from rounding', () => {
        expect(Number.isNaN(vectorAngle([0.1, 0.2, 0.3], [0.2, 0.4, 0.6]))).toBe(false);
    });

    test('zero vector and mismatched sizes', () => {
        expect(vectorAngle([0, 0], [1, 1])).toBeNull();
        expect(vectorAngle([1, 1], [1, 1, 1])).toBeNull();
    });
});

describe('vectorProjection', () => {
    test('projects onto an axis', () => {
        expect(vectorProjection([3, 4], [1, 0])).toEqual([3, 0]);
    });

    test('onto the zero vector is undefined', () => {
        expect(vectorProjection([3, 4], [0, 0])).toBeNull();
    });
});

describe('formatVector', () => {
    test('trims trailing zeros and rounding noise', () => {
        expect(formatVector([1, 2.5, 0.1 + 0.2])).toBe('(1, 2.5, 0.3)');
    });
});
