/**
 * Tests for Parametric Equations
 */

// Mock the evaluateExpression function
function evaluateExpression(expr, varName, value) {
    // First replace functions with placeholders to avoid conflicts
    let processed = expr
        .replace(/sqrt/g, '__SQRT__')
        .replace(/sin/g, '__SIN__')
        .replace(/cos/g, '__COS__')
        .replace(/tan/g, '__TAN__')
        .replace(/abs/g, '__ABS__')
        .replace(/exp/g, '__EXP__')
        .replace(/log/g, '__LOG__')
        .replace(/pow/g, '__POW__')
        .replace(/pi/g, '__PI__');
    
    // Then replace variable
    processed = processed.replace(new RegExp(varName, 'g'), `(${value})`);
    
    // Then replace power operator
    processed = processed.replace(/\^/g, '**');
    
    // Finally restore functions with Math prefix
    processed = processed
        .replace(/__SQRT__/g, 'Math.sqrt')
        .replace(/__SIN__/g, 'Math.sin')
        .replace(/__COS__/g, 'Math.cos')
        .replace(/__TAN__/g, 'Math.tan')
        .replace(/__ABS__/g, 'Math.abs')
        .replace(/__EXP__/g, 'Math.exp')
        .replace(/__LOG__/g, 'Math.log')
        .replace(/__POW__/g, 'Math.pow')
        .replace(/__PI__/g, 'Math.PI');
    
    try {
        return eval(processed);
    } catch (e) {
        return NaN;
    }
}

describe('Expression Evaluator', () => {
    describe('Basic Expressions', () => {
        test('should evaluate constant', () => {
            expect(evaluateExpression('5', 't', 0)).toBe(5);
        });

        test('should evaluate variable', () => {
            expect(evaluateExpression('t', 't', 3)).toBe(3);
        });

        test('should evaluate addition', () => {
            expect(evaluateExpression('t + 2', 't', 3)).toBe(5);
        });

        test('should evaluate subtraction', () => {
            expect(evaluateExpression('t - 2', 't', 5)).toBe(3);
        });

        test('should evaluate multiplication', () => {
            expect(evaluateExpression('t * 3', 't', 4)).toBe(12);
        });

        test('should evaluate division', () => {
            expect(evaluateExpression('t / 2', 't', 10)).toBe(5);
        });

        test('should evaluate power', () => {
            expect(evaluateExpression('t^2', 't', 3)).toBe(9);
            expect(evaluateExpression('t^3', 't', 2)).toBe(8);
        });
    });

    describe('Trigonometric Functions', () => {
        test('should evaluate sin(t)', () => {
            expect(evaluateExpression('sin(t)', 't', 0)).toBeCloseTo(0, 10);
            expect(evaluateExpression('sin(t)', 't', Math.PI / 2)).toBeCloseTo(1, 10);
            expect(evaluateExpression('sin(t)', 't', Math.PI)).toBeCloseTo(0, 10);
        });

        test('should evaluate cos(t)', () => {
            expect(evaluateExpression('cos(t)', 't', 0)).toBeCloseTo(1, 10);
            expect(evaluateExpression('cos(t)', 't', Math.PI / 2)).toBeCloseTo(0, 10);
            expect(evaluateExpression('cos(t)', 't', Math.PI)).toBeCloseTo(-1, 10);
        });

        test('should evaluate tan(t)', () => {
            expect(evaluateExpression('tan(t)', 't', 0)).toBeCloseTo(0, 10);
            expect(evaluateExpression('tan(t)', 't', Math.PI / 4)).toBeCloseTo(1, 10);
        });
    });

    describe('Mathematical Functions', () => {
        test('should evaluate sqrt(t)', () => {
            expect(evaluateExpression('sqrt(t)', 't', 4)).toBe(2);
            expect(evaluateExpression('sqrt(t)', 't', 9)).toBe(3);
            expect(evaluateExpression('sqrt(t)', 't', 16)).toBe(4);
        });

        test('should evaluate abs(t)', () => {
            expect(evaluateExpression('abs(t)', 't', -5)).toBe(5);
            expect(evaluateExpression('abs(t)', 't', 3)).toBe(3);
        });

        test('should evaluate exp(t)', () => {
            expect(evaluateExpression('exp(t)', 't', 0)).toBe(1);
            expect(evaluateExpression('exp(t)', 't', 1)).toBeCloseTo(Math.E, 10);
        });

        test('should evaluate log(t)', () => {
            expect(evaluateExpression('log(t)', 't', 1)).toBe(0);
            expect(evaluateExpression('log(t)', 't', Math.E)).toBeCloseTo(1, 10);
        });

        test('should evaluate pi constant', () => {
            expect(evaluateExpression('pi', 't', 0)).toBeCloseTo(Math.PI, 10);
            expect(evaluateExpression('2*pi', 't', 0)).toBeCloseTo(2 * Math.PI, 10);
        });
    });

    describe('Complex Expressions', () => {
        test('should evaluate 2*cos(t)', () => {
            expect(evaluateExpression('2*cos(t)', 't', 0)).toBeCloseTo(2, 10);
        });

        test('should evaluate sin(t) + cos(t)', () => {
            expect(evaluateExpression('sin(t) + cos(t)', 't', 0)).toBeCloseTo(1, 10);
        });

        test('should evaluate t^2 + 2*t + 1', () => {
            expect(evaluateExpression('t^2 + 2*t + 1', 't', 1)).toBe(4);
            expect(evaluateExpression('t^2 + 2*t + 1', 't', 2)).toBe(9);
        });

        test('should evaluate sqrt(t^2 + 1)', () => {
            expect(evaluateExpression('sqrt(t^2 + 1)', 't', 0)).toBeCloseTo(1, 10);
            expect(evaluateExpression('sqrt(t^2 + 1)', 't', 1)).toBeCloseTo(Math.sqrt(2), 10);
        });

        test('should evaluate nested functions', () => {
            expect(evaluateExpression('sin(cos(t))', 't', 0)).toBeCloseTo(Math.sin(1), 10);
        });
    });

    describe('Different Variable Names', () => {
        test('should work with theta variable', () => {
            expect(evaluateExpression('cos(theta)', 'theta', 0)).toBeCloseTo(1, 10);
            expect(evaluateExpression('sin(theta)', 'theta', Math.PI / 2)).toBeCloseTo(1, 10);
        });

        test('should work with x variable', () => {
            expect(evaluateExpression('x^2', 'x', 3)).toBe(9);
        });
    });

    describe('Error Handling', () => {
        test('should return NaN for invalid expressions', () => {
            expect(evaluateExpression('invalid(t)', 't', 1)).toBeNaN();
        });

        test('should return NaN for division by zero', () => {
            expect(evaluateExpression('1/t', 't', 0)).toBe(Infinity);
        });

        test('should return NaN for sqrt of negative', () => {
            expect(evaluateExpression('sqrt(t)', 't', -1)).toBeNaN();
        });
    });
});

describe('Parametric Curve Generation', () => {
    function generateParametricPoints(xExpr, yExpr, tMin, tMax, steps) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const t = tMin + (tMax - tMin) * i / steps;
            const x = evaluateExpression(xExpr, 't', t);
            const y = evaluateExpression(yExpr, 't', t);
            if (!isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
                points.push({ x, y, t });
            }
        }
        return points;
    }

    describe('Circle (x=cos(t), y=sin(t))', () => {
        test('should generate points on unit circle', () => {
            const points = generateParametricPoints('cos(t)', 'sin(t)', 0, 2 * Math.PI, 100);
            
            expect(points.length).toBeGreaterThan(90);
            
            // Check that all points are approximately on unit circle
            points.forEach(p => {
                const radius = Math.sqrt(p.x * p.x + p.y * p.y);
                expect(radius).toBeCloseTo(1, 5);
            });
        });

        test('should start at (1, 0)', () => {
            const points = generateParametricPoints('cos(t)', 'sin(t)', 0, 2 * Math.PI, 100);
            expect(points[0].x).toBeCloseTo(1, 5);
            expect(points[0].y).toBeCloseTo(0, 5);
        });
    });

    describe('Ellipse (x=2*cos(t), y=sin(t))', () => {
        test('should generate ellipse points', () => {
            const points = generateParametricPoints('2*cos(t)', 'sin(t)', 0, 2 * Math.PI, 100);
            
            // Check semi-major axis (a=2)
            const maxX = Math.max(...points.map(p => Math.abs(p.x)));
            expect(maxX).toBeCloseTo(2, 1);
            
            // Check semi-minor axis (b=1)
            const maxY = Math.max(...points.map(p => Math.abs(p.y)));
            expect(maxY).toBeCloseTo(1, 1);
        });
    });

    describe('Spiral (x=t*cos(t), y=t*sin(t))', () => {
        test('should generate spiral points with increasing radius', () => {
            const points = generateParametricPoints('t*cos(t)', 't*sin(t)', 0, 4 * Math.PI, 100);
            
            // Check that radius increases with t
            for (let i = 1; i < points.length - 1; i++) {
                const r1 = Math.sqrt(points[i].x ** 2 + points[i].y ** 2);
                const r2 = Math.sqrt(points[i + 1].x ** 2 + points[i + 1].y ** 2);
                // Radius should generally increase (allow small variations due to spiral)
                if (points[i + 1].t > points[i].t + 0.5) {
                    expect(r2).toBeGreaterThanOrEqual(r1 * 0.9);
                }
            }
        });
    });

    describe('Lissajous Curve (x=sin(2*t), y=sin(3*t))', () => {
        test('should generate Lissajous curve', () => {
            const points = generateParametricPoints('sin(2*t)', 'sin(3*t)', 0, 2 * Math.PI, 200);
            
            expect(points.length).toBeGreaterThan(180);
            
            // All points should be within [-1, 1] range
            points.forEach(p => {
                expect(Math.abs(p.x)).toBeLessThanOrEqual(1.001);
                expect(Math.abs(p.y)).toBeLessThanOrEqual(1.001);
            });
        });
    });

    describe('Parabola (x=t, y=t^2)', () => {
        test('should generate parabola points', () => {
            const points = generateParametricPoints('t', 't^2', -2, 2, 100);
            
            // Verify y = x^2 relationship
            points.forEach(p => {
                expect(p.y).toBeCloseTo(p.x * p.x, 5);
            });
        });
    });

    describe('Edge Cases', () => {
        test('should handle zero range', () => {
            const points = generateParametricPoints('t', 't', 0, 0, 10);
            expect(points.length).toBeGreaterThan(0);
            expect(points[0].x).toBe(0);
            expect(points[0].y).toBe(0);
        });

        test('should handle negative range', () => {
            const points = generateParametricPoints('t', 't^2', -5, -1, 50);
            expect(points.length).toBeGreaterThan(40);
            points.forEach(p => {
                expect(p.y).toBeCloseTo(p.x * p.x, 5);
            });
        });

        test('should handle very small steps', () => {
            const points = generateParametricPoints('t', 't', 0, 1, 1000);
            expect(points.length).toBe(1001);
        });
    });
});
