const { solveTrigonometricEquation } = require('../../src/js/solvers/trigonometric.js');

describe('Trigonometric Equation Solver', () => {
    const PI = Math.PI;

    test('sin(x)=0 in [-π, π] returns -π,0,π', () => {
        const result = solveTrigonometricEquation('sin', 0, -PI, PI);
        expect(result.error).toBeNull();
        expect(result.solutions.length).toBe(3);
        expect(result.solutions[0]).toBeCloseTo(-PI, 6);
        expect(result.solutions[1]).toBeCloseTo(0, 6);
        expect(result.solutions[2]).toBeCloseTo(PI, 6);
    });

    test('cos(x)=1 in [0,4π] returns 0,2π,4π', () => {
        const result = solveTrigonometricEquation('cos', 1, 0, 4 * PI);
        expect(result.error).toBeNull();
        expect(result.solutions.length).toBe(3);
        expect(result.solutions[0]).toBeCloseTo(0, 6);
        expect(result.solutions[1]).toBeCloseTo(2 * PI, 6);
        expect(result.solutions[2]).toBeCloseTo(4 * PI, 6);
    });

    test('tan(x)=1 in [0,2π] returns π/4 and 5π/4', () => {
        const result = solveTrigonometricEquation('tan', 1, 0, 2 * PI);
        expect(result.error).toBeNull();
        expect(result.solutions.length).toBe(2);
        expect(result.solutions[0]).toBeCloseTo(PI / 4, 6);
        expect(result.solutions[1]).toBeCloseTo(5 * PI / 4, 6);
    });

    test('sin(x)=2 returns domain error', () => {
        const result = solveTrigonometricEquation('sin', 2, -PI, PI);
        expect(result.error).not.toBeNull();
        expect(result.solutions.length).toBe(0);
    });

    test('unsupported function returns error', () => {
        const result = solveTrigonometricEquation('sec', 0.5, -PI, PI);
        expect(result.error).not.toBeNull();
        expect(result.solutions.length).toBe(0);
    });
});
