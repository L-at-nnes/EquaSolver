const { SHAPE_DIMENSIONS, computeShape, parseDimensions } = require('../../src/js/math/geometry.js');

describe('2D shapes', () => {
    test('circle', () => {
        const c = computeShape('circle', [2]);
        expect(c.area).toBeCloseTo(4 * Math.PI, 12);
        expect(c.perimeter).toBeCloseTo(4 * Math.PI, 12);
    });

    test('rectangle', () => {
        expect(computeShape('rectangle', [3, 5])).toEqual({ area: 15, perimeter: 16 });
    });

    test('triangle uses Heron and checks the triangle inequality', () => {
        expect(computeShape('triangle', [3, 4, 5])).toEqual({ area: 6, perimeter: 12 });
        expect(computeShape('triangle', [1, 2, 3])).toBeNull();
        expect(computeShape('triangle', [1, 1, 5])).toBeNull();
    });
});

describe('3D shapes', () => {
    test('sphere', () => {
        const s = computeShape('sphere', [3]);
        expect(s.volume).toBeCloseTo(36 * Math.PI, 10);
        expect(s.surface).toBeCloseTo(36 * Math.PI, 10);
    });

    test('cylinder', () => {
        const c = computeShape('cylinder', [1, 2]);
        expect(c.volume).toBeCloseTo(2 * Math.PI, 12);
        expect(c.surface).toBeCloseTo(6 * Math.PI, 12);
    });

    test('cone includes the slant height', () => {
        const c = computeShape('cone', [3, 4]);
        expect(c.slant).toBe(5);
        expect(c.volume).toBeCloseTo(12 * Math.PI, 12);
        expect(c.surface).toBeCloseTo(24 * Math.PI, 12);
    });

    test('box', () => {
        expect(computeShape('box', [2, 3, 4])).toEqual({ volume: 24, surface: 52 });
    });
});

describe('validation', () => {
    test('wrong number of dimensions', () => {
        expect(computeShape('circle', [1, 2])).toBeNull();
        expect(computeShape('box', [1, 2])).toBeNull();
    });

    test('non positive, non finite and unknown input', () => {
        expect(computeShape('circle', [0])).toBeNull();
        expect(computeShape('circle', [-1])).toBeNull();
        expect(computeShape('rectangle', [NaN, 2])).toBeNull();
        expect(computeShape('hexagon', [1])).toBeNull();
        expect(computeShape('circle', 'x')).toBeNull();
    });

    test('every shape declares its dimension count', () => {
        Object.entries(SHAPE_DIMENSIONS).forEach(([shape, n]) => {
            const dims = Array(n).fill(3);
            expect(computeShape(shape, dims)).not.toBeNull();
        });
    });
});

describe('parseDimensions', () => {
    test('separators and decimal comma', () => {
        expect(parseDimensions('3, 4')).toEqual([3, 4]);
        expect(parseDimensions('3 4 5')).toEqual([3, 4, 5]);
        expect(parseDimensions('2,5')).toEqual([2.5]);
        expect(parseDimensions('7')).toEqual([7]);
    });

    test('bad input', () => {
        ['', ' ', 'x', '3, y', null, 3].forEach(v => expect(parseDimensions(v)).toBeNull());
    });
});
