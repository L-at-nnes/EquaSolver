const { parseComplex, complexArg, toPolar, fromPolar, complexRoots, complexIntPow, formatPolar } = require('../../src/js/math/complex-tools.js');

describe('parseComplex', () => {
    test('rectangular forms', () => {
        expect(parseComplex('3+4i')).toEqual({ re: 3, im: 4 });
        expect(parseComplex('3 - 4i')).toEqual({ re: 3, im: -4 });
        expect(parseComplex('-2.5i')).toEqual({ re: 0, im: -2.5 });
        expect(parseComplex('7')).toEqual({ re: 7, im: 0 });
    });

    test('bare i, j and decimal comma', () => {
        expect(parseComplex('i')).toEqual({ re: 0, im: 1 });
        expect(parseComplex('-i')).toEqual({ re: 0, im: -1 });
        expect(parseComplex('1+j')).toEqual({ re: 1, im: 1 });
        expect(parseComplex('1,5+2,5i')).toEqual({ re: 1.5, im: 2.5 });
    });

    test('exponent notation and imaginary part first', () => {
        expect(parseComplex('1e2-3e-1i')).toEqual({ re: 100, im: -0.3 });
        expect(parseComplex('2i+1')).toEqual({ re: 1, im: 2 });
    });

    test('rejects garbage', () => {
        ['', '  ', 'abc', '3+', '+-2', '3x+4i', '1..2', null, undefined, 5].forEach(v => expect(parseComplex(v)).toBeNull());
    });
});

describe('polar form', () => {
    test('toPolar and fromPolar round trip', () => {
        const { r, theta } = toPolar({ re: 3, im: 4 });
        expect(r).toBeCloseTo(5, 12);
        expect(theta).toBeCloseTo(Math.atan2(4, 3), 12);
        const z = fromPolar(r, theta);
        expect(z.re).toBeCloseTo(3, 12);
        expect(z.im).toBeCloseTo(4, 12);
    });

    test('argument quadrants', () => {
        expect(complexArg({ re: -1, im: 0 })).toBeCloseTo(Math.PI, 12);
        expect(complexArg({ re: 0, im: -1 })).toBeCloseTo(-Math.PI / 2, 12);
    });

    test('formatPolar shows modulus and degrees', () => {
        expect(formatPolar({ re: 0, im: 2 })).toContain('2.0000');
        expect(formatPolar({ re: 0, im: 2 })).toContain('90.00°');
    });
});

describe('complexRoots', () => {
    test('square roots of -1 are +i and -i', () => {
        const roots = complexRoots({ re: -1, im: 0 }, 2);
        expect(roots).toHaveLength(2);
        expect(roots[0].re).toBeCloseTo(0, 12);
        expect(roots[0].im).toBeCloseTo(1, 12);
        expect(roots[1].im).toBeCloseTo(-1, 12);
    });

    test('cube roots of unity sum to zero and cube back to 1', () => {
        const roots = complexRoots({ re: 1, im: 0 }, 3);
        expect(roots.reduce((s, z) => s + z.re, 0)).toBeCloseTo(0, 12);
        expect(roots.reduce((s, z) => s + z.im, 0)).toBeCloseTo(0, 12);
        roots.forEach(z => {
            const cube = complexIntPow(z, 3);
            expect(cube.re).toBeCloseTo(1, 10);
            expect(cube.im).toBeCloseTo(0, 10);
        });
    });

    test('invalid degree and zero', () => {
        expect(complexRoots({ re: 1, im: 0 }, 0)).toEqual([]);
        expect(complexRoots({ re: 1, im: 0 }, 2.5)).toEqual([]);
        expect(complexRoots({ re: 0, im: 0 }, 4)).toEqual([{ re: 0, im: 0 }]);
    });
});

describe('complexIntPow', () => {
    test('is exact for Gaussian integers', () => {
        expect(complexIntPow({ re: 1, im: 1 }, 4)).toEqual({ re: -4, im: 0 });
        expect(complexIntPow({ re: 0, im: 1 }, 2)).toEqual({ re: -1, im: 0 });
        expect(complexIntPow({ re: 3, im: 4 }, 0)).toEqual({ re: 1, im: 0 });
    });

    test('negative exponents invert', () => {
        const z = complexIntPow({ re: 0, im: 2 }, -1);
        expect(z.re).toBeCloseTo(0, 12);
        expect(z.im).toBeCloseTo(-0.5, 12);
    });

    test('non integer exponent is rejected', () => {
        expect(complexIntPow({ re: 1, im: 1 }, 0.5)).toBeNull();
    });
});
