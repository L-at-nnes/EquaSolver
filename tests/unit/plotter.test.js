const {
    findRoots,
    findAllRoots,
    findExtrema,
    findIntersections,
    formatPlotNumber,
    createPlotterState,
    zoomView,
    panView
} = require('../../src/js/graphing/plotter.js');

const close = (value, expected, digits = 6) => expect(value).toBeCloseTo(expected, digits);

describe('findRoots', () => {
    test('finds the roots of a polynomial in order', () => {
        const roots = findRoots(x => (x - 1) * (x + 2) * (x - 3), -10, 10);
        expect(roots).toHaveLength(3);
        close(roots[0], -2);
        close(roots[1], 1);
        close(roots[2], 3);
    });

    test('finds periodic roots', () => {
        const roots = findRoots(Math.sin, 0.5, 10);
        expect(roots).toHaveLength(3);
        close(roots[0], Math.PI);
        close(roots[2], 3 * Math.PI);
    });

    test('rejects poles instead of reporting them as roots', () => {
        expect(findRoots(x => 1 / x, -5, 5)).toEqual([]);
        expect(findRoots(Math.tan, 1, 2)).toEqual([]);
    });

    test('ignores undefined regions', () => {
        const roots = findRoots(x => Math.sqrt(x) - 2, -5, 10);
        expect(roots).toHaveLength(1);
        close(roots[0], 4);
    });

    test('reports an exact zero on the sampling grid once', () => {
        const roots = findRoots(x => x, -10, 10, 800);
        expect(roots).toHaveLength(1);
        close(roots[0], 0);
    });
});

describe('findExtrema', () => {
    test('classifies a parabola minimum', () => {
        const [min] = findExtrema(x => (x - 2) ** 2 + 1, -10, 10);
        expect(min.type).toBe('min');
        close(min.x, 2, 4);
        close(min.y, 1, 6);
    });

    test('finds alternating extrema of sin', () => {
        const extrema = findExtrema(Math.sin, 0, 10);
        expect(extrema.map(p => p.type)).toEqual(['max', 'min', 'max']);
        close(extrema[0].x, Math.PI / 2, 4);
    });

    test('finds the corner of |x|', () => {
        const [min] = findExtrema(Math.abs, -5, 5);
        expect(min.type).toBe('min');
        close(min.x, 0, 4);
    });

    test('does not report poles as extrema', () => {
        expect(findExtrema(x => 1 / (x * x), -5, 5)).toEqual([]);
        expect(findExtrema(x => 1 / x, -5, 5)).toEqual([]);
    });

    test('a monotonic function has none', () => {
        expect(findExtrema(x => x ** 3, -5, 5)).toEqual([]);
    });
});

describe('findAllRoots', () => {
    test('includes tangent roots that never change sign', () => {
        const roots = findAllRoots(x => x * x, -5, 5);
        expect(roots).toHaveLength(1);
        close(roots[0], 0, 4);
    });

    test('merges sign-change and tangent roots', () => {
        const roots = findAllRoots(x => x * x * (x - 3), -5, 5);
        expect(roots).toHaveLength(2);
    });
});

describe('findIntersections', () => {
    test('line and parabola', () => {
        const points = findIntersections(x => x * x, x => x + 2, -10, 10);
        expect(points).toHaveLength(2);
        close(points[0].x, -1);
        close(points[0].y, 1);
        close(points[1].x, 2);
        close(points[1].y, 4);
    });

    test('identical curves do not flood the result', () => {
        expect(findIntersections(Math.sin, Math.sin, -10, 10)).toEqual([]);
    });

    test('parallel lines never meet', () => {
        expect(findIntersections(x => x, x => x + 1, -10, 10)).toEqual([]);
    });
});

describe('view model', () => {
    test('initial view keeps equal scale on both axes', () => {
        const { view } = createPlotterState(800, 400);
        expect(view.xMax - view.xMin).toBe(20);
        expect(view.yMax - view.yMin).toBe(10);
    });

    test('zooming keeps the point under the cursor fixed', () => {
        const view = { xMin: -10, xMax: 10, yMin: -5, yMax: 5 };
        const zoomed = zoomView(view, 0.5, 5, 2);
        expect(zoomed.xMax - zoomed.xMin).toBe(10);
        // the cursor sat 75% of the way across before and still does
        close((5 - zoomed.xMin) / (zoomed.xMax - zoomed.xMin), 0.75, 10);
        close((2 - zoomed.yMin) / (zoomed.yMax - zoomed.yMin), 0.7, 10);
    });

    test('zoom is bounded', () => {
        let view = { xMin: -1, xMax: 1, yMin: -1, yMax: 1 };
        for (let i = 0; i < 100; i++) view = zoomView(view, 0.1, 0, 0);
        expect(view.xMax - view.xMin).toBeGreaterThanOrEqual(1e-9);
        for (let i = 0; i < 100; i++) view = zoomView(view, 10, 0, 0);
        expect(view.xMax - view.xMin).toBeLessThanOrEqual(1e9);
    });

    test('panning shifts the window without changing its size', () => {
        const panned = panView({ xMin: 0, xMax: 10, yMin: 0, yMax: 5 }, 3, -1);
        expect(panned).toEqual({ xMin: 3, xMax: 13, yMin: -1, yMax: 4 });
    });
});

describe('formatPlotNumber', () => {
    test('rounds noise and handles non finite values', () => {
        expect(formatPlotNumber(1.0000000001)).toBe('1');
        expect(formatPlotNumber(-3.14159265)).toBe('-3.1416');
        expect(formatPlotNumber(1e-12)).toBe('0');
        expect(formatPlotNumber(NaN)).toBe('—');
        expect(formatPlotNumber(Infinity)).toBe('—');
    });
});
