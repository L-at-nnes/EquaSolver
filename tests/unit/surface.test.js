const { compileExpression } = require('../../src/js/parsers/expression.js');
const { sampleSurface, projectPoint, buildQuads, heightColor, SURFACE_DEFAULT_VIEW } = require('../../src/js/graphing/surface.js');

const fnOf = expr => compileExpression(expr, ['x', 'y']);

describe('sampleSurface', () => {
    test('builds an (n+1) x (n+1) grid covering the range', () => {
        const s = sampleSurface(fnOf('x + y'), -2, 2, -1, 1, 8);
        expect(s.z).toHaveLength(9);
        expect(s.z[0]).toHaveLength(9);
        expect(s.xs[0]).toBe(-2);
        expect(s.xs[8]).toBe(2);
        expect(s.ys[0]).toBe(-1);
        expect(s.ys[8]).toBe(1);
    });

    test('normalises heights to about [-1, 1]', () => {
        const s = sampleSurface(fnOf('x^2 + y^2'), -3, 3, -3, 3, 24);
        const flat = s.z.flat();
        expect(Math.max(...flat)).toBeLessThanOrEqual(1.5);
        expect(Math.min(...flat)).toBeGreaterThanOrEqual(-1.5);
        expect(s.zMax).toBeGreaterThan(s.zMin);
    });

    test('keeps the raw values', () => {
        const s = sampleSurface(fnOf('x * y'), 0, 2, 0, 2, 2);
        expect(s.zRaw[2][2]).toBe(4);
        expect(s.zRaw[1][1]).toBe(1);
    });

    test('a spike does not flatten the rest of the surface', () => {
        const s = sampleSurface(fnOf('1 / (x * x + y * y)'), -2, 2, -2, 2, 30);
        const middle = s.z.flat().filter(v => Number.isFinite(v) && Math.abs(v) < 1);
        expect(middle.length).toBeGreaterThan(s.z.flat().length / 2);
    });

    test('non finite samples become NaN and are reported as holes', () => {
        const s = sampleSurface(fnOf('sqrt(x)'), -1, 1, -1, 1, 4);
        expect(Number.isNaN(s.z[0][0])).toBe(true);
        expect(Number.isFinite(s.z[0][4])).toBe(true);
    });

    test('a constant surface still gets a usable range', () => {
        const s = sampleSurface(fnOf('5'), -1, 1, -1, 1, 4);
        expect(s.zMax - s.zMin).toBeGreaterThan(0);
        expect(s.z.flat().every(Number.isFinite)).toBe(true);
    });

    test('a totally undefined surface does not throw', () => {
        const s = sampleSurface(fnOf('sqrt(-1 - x * x)'), -1, 1, -1, 1, 4);
        expect(s.z.flat().every(Number.isNaN)).toBe(true);
    });
});

describe('projectPoint', () => {
    const flat = { yaw: 0, pitch: 0, zoom: 1 };

    test('the origin projects to the centre', () => {
        const p = projectPoint(0, 0, 0, SURFACE_DEFAULT_VIEW);
        expect(p.px).toBeCloseTo(0, 10);
        expect(p.py).toBeCloseTo(0, 10);
    });

    test('with no rotation x maps to the horizontal axis and z to the vertical one', () => {
        const p = projectPoint(0.5, 0, 0.5, flat);
        expect(p.px).toBeCloseTo(0.5, 10);
        expect(p.py).toBeCloseTo(-0.5, 10);
    });

    test('looking straight down all but hides the height', () => {
        const down = { yaw: 0, pitch: Math.PI / 2, zoom: 1 };
        const low = projectPoint(0.3, 0.2, -0.5, down);
        const high = projectPoint(0.3, 0.2, 0.5, down);
        expect(Math.abs(low.py - high.py)).toBeLessThan(0.1); // only the perspective shift remains
        expect(Math.sign(low.px)).toBe(Math.sign(high.px));
    });

    test('yaw of a quarter turn swaps the horizontal axes', () => {
        const turned = projectPoint(1, 0, 0, { yaw: Math.PI / 2, pitch: 0, zoom: 1 });
        expect(turned.px).toBeCloseTo(0, 10);
        expect(turned.depth).toBeCloseTo(1, 10);
    });

    test('zoom scales the picture and nearer points look larger', () => {
        const a = projectPoint(0.5, 0, 0, { ...flat, zoom: 2 });
        expect(a.px).toBeCloseTo(1, 10);
        const near = projectPoint(0.5, -1, 0, flat);
        const far = projectPoint(0.5, 1, 0, flat);
        expect(Math.abs(near.px)).toBeGreaterThan(Math.abs(far.px));
    });
});

describe('buildQuads', () => {
    test('produces n*n quads sorted far to near', () => {
        const s = sampleSurface(fnOf('x * y'), -1, 1, -1, 1, 6);
        const quads = buildQuads(s, SURFACE_DEFAULT_VIEW);
        expect(quads).toHaveLength(36);
        for (let i = 1; i < quads.length; i++) {
            expect(quads[i - 1].depth).toBeGreaterThanOrEqual(quads[i].depth);
        }
    });

    test('quads touching undefined samples are skipped', () => {
        const s = sampleSurface(fnOf('sqrt(x)'), -1, 1, -1, 1, 4);
        const quads = buildQuads(s, SURFACE_DEFAULT_VIEW);
        expect(quads.length).toBeLessThan(16);
        expect(quads.length).toBeGreaterThan(0);
    });

    test('reveal 0 flattens the surface into the floor plane', () => {
        const s = sampleSurface(fnOf('x * x'), -1, 1, -1, 1, 4);
        const flat = buildQuads(s, { yaw: 0, pitch: Math.PI / 2, zoom: 1 }, 0);
        const heights = flat.flatMap(q => q.corners.map(c => c.py));
        // looking down at a flat sheet: the vertical spread is just the sheet depth under perspective
        const full = buildQuads(s, { yaw: 0, pitch: 0, zoom: 1 }, 1).flatMap(q => q.corners.map(c => c.py));
        expect(Math.max(...full) - Math.min(...full)).toBeGreaterThan(0.5);
        expect(Math.max(...heights) - Math.min(...heights)).toBeGreaterThan(0);
    });

    test('every quad carries a normalised average height', () => {
        const s = sampleSurface(fnOf('x'), -1, 1, -1, 1, 4);
        buildQuads(s, SURFACE_DEFAULT_VIEW).forEach(q => {
            expect(q.height).toBeGreaterThanOrEqual(-1.5);
            expect(q.height).toBeLessThanOrEqual(1.5);
        });
    });
});

describe('heightColor', () => {
    test('returns an oklch colour and clamps the input', () => {
        expect(heightColor(0)).toMatch(/^oklch\(45\.0% 0\.150 262/);
        expect(heightColor(1)).toMatch(/^oklch\(74\.0% 0\.160 40/);
        expect(heightColor(-5)).toBe(heightColor(0));
        expect(heightColor(9)).toBe(heightColor(1));
    });

    test('lightness rises with height', () => {
        const lightness = t => parseFloat(heightColor(t).match(/oklch\(([\d.]+)%/)[1]);
        expect(lightness(0.25)).toBeLessThan(lightness(0.75));
    });
});
