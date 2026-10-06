const { toRootExpression, bisection, numericDerivative, newton, scanRoots } = require('../../src/js/solvers/root-finding.js');
const { compileExpression } = require('../../src/js/parsers/expression.js');

const fn = expr => compileExpression(expr, 'x');

describe('toRootExpression', () => {
    test('moves the right side over', () => {
        expect(toRootExpression('x^3 - x = 2')).toBe('(x^3 - x)-(2)');
        expect(toRootExpression('  sin(x) ')).toBe('sin(x)');
    });

    test('rejects malformed equations', () => {
        ['', ' ', 'x = ', '= 3', 'x = 1 = 2', null, 7].forEach(v => expect(toRootExpression(v)).toBeNull());
    });
});

describe('bisection', () => {
    test('square root of 2', () => {
        const r = bisection(fn('x^2 - 2'), 0, 2);
        expect(r.converged).toBe(true);
        expect(r.root).toBeCloseTo(Math.SQRT2, 9);
        expect(r.steps.length).toBeGreaterThan(10);
    });

    test('the bracket halves at every step', () => {
        const { steps } = bisection(fn('x - 1.3'), 0, 4);
        for (let i = 1; i < steps.length; i++) {
            expect(steps[i].b - steps[i].a).toBeCloseTo((steps[i - 1].b - steps[i - 1].a) / 2, 12);
        }
    });

    test('swapped bounds and endpoint roots', () => {
        expect(bisection(fn('x - 1'), 3, 0).root).toBeCloseTo(1, 9);
        expect(bisection(fn('x - 1'), 1, 3)).toEqual({ root: 1, converged: true, steps: [] });
        expect(bisection(fn('x - 3'), 1, 3).root).toBe(3);
    });

    test('no sign change or non finite endpoint', () => {
        expect(bisection(fn('x^2 + 1'), -1, 1)).toBeNull();
        expect(bisection(fn('1/x'), 0, 1)).toBeNull();
    });

    test('reports non convergence when iterations run out', () => {
        expect(bisection(fn('x - 0.3'), 0, 1, 1e-30, 5).converged).toBe(false);
    });
});

describe('newton', () => {
    test('converges quadratically on x^2 - 2', () => {
        const r = newton(fn('x^2 - 2'), 1);
        expect(r.converged).toBe(true);
        expect(r.root).toBeCloseTo(Math.SQRT2, 10);
        expect(r.steps.length).toBeLessThan(8);
    });

    test('transcendental equation cos(x) = x', () => {
        const r = newton(fn('cos(x) - x'), 1);
        expect(r.root).toBeCloseTo(0.7390851332151607, 9);
    });

    test('zero derivative stops without converging', () => {
        const r = newton(fn('x^2 + 1'), 0);
        expect(r.converged).toBe(false);
        expect(r.steps).toHaveLength(1);
    });

    test('non finite start', () => {
        expect(newton(fn('1/x'), 0)).toBeNull();
    });

    test('numericDerivative', () => {
        expect(numericDerivative(fn('x^3'), 2)).toBeCloseTo(12, 5);
        expect(numericDerivative(fn('sin(x)'), 0)).toBeCloseTo(1, 8);
    });
});

describe('scanRoots', () => {
    test('finds all three roots of a cubic', () => {
        const roots = scanRoots(fn('(x-1)*(x+2)*(x-3)'), -5, 5);
        expect(roots).toHaveLength(3);
        [-2, 1, 3].forEach((expected, i) => expect(roots[i]).toBeCloseTo(expected, 8));
    });

    test('periodic function', () => {
        const roots = scanRoots(fn('sin(x)'), 1, 10);
        expect(roots).toHaveLength(3);
        expect(roots[0]).toBeCloseTo(Math.PI, 8);
    });

    test('a pole is not reported as a root', () => {
        expect(scanRoots(fn('1/x'), -1, 1)).toEqual([]);
    });

    test('exact grid hit is reported once', () => {
        expect(scanRoots(fn('x'), -1, 1, 2)).toEqual([0]);
    });

    test('invalid range', () => {
        expect(scanRoots(fn('x'), 2, 1)).toEqual([]);
        expect(scanRoots(fn('x'), -Infinity, 1)).toEqual([]);
    });
});
