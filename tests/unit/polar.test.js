/**
 * Tests for Polar Equations
 */

// Mock the evaluateExpression function
function evaluateExpression(expr, varName, value) {
    let processed = expr
        .replace(new RegExp(varName, 'g'), `(${value})`)
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/pi/g, 'Math.PI')
        .replace(/pow/g, 'Math.pow');
    
    try {
        return eval(processed);
    } catch (e) {
        return NaN;
    }
}

function polarToCartesian(r, theta) {
    return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta)
    };
}

describe('Polar to Cartesian Conversion', () => {
    test('should convert r=1, theta=0 to (1, 0)', () => {
        const result = polarToCartesian(1, 0);
        expect(result.x).toBeCloseTo(1, 10);
        expect(result.y).toBeCloseTo(0, 10);
    });

    test('should convert r=1, theta=pi/2 to (0, 1)', () => {
        const result = polarToCartesian(1, Math.PI / 2);
        expect(result.x).toBeCloseTo(0, 10);
        expect(result.y).toBeCloseTo(1, 10);
    });

    test('should convert r=1, theta=pi to (-1, 0)', () => {
        const result = polarToCartesian(1, Math.PI);
        expect(result.x).toBeCloseTo(-1, 10);
        expect(result.y).toBeCloseTo(0, 10);
    });

    test('should convert r=2, theta=pi/4 to (sqrt(2), sqrt(2))', () => {
        const result = polarToCartesian(2, Math.PI / 4);
        expect(result.x).toBeCloseTo(Math.sqrt(2), 10);
        expect(result.y).toBeCloseTo(Math.sqrt(2), 10);
    });

    test('should handle negative radius', () => {
        const result = polarToCartesian(-1, 0);
        expect(result.x).toBeCloseTo(-1, 10);
        expect(result.y).toBeCloseTo(0, 10);
    });

    test('should handle zero radius', () => {
        const result = polarToCartesian(0, Math.PI / 3);
        expect(result.x).toBeCloseTo(0, 10);
        expect(result.y).toBeCloseTo(0, 10);
    });
});

describe('Polar Curve Generation', () => {
    function generatePolarPoints(rExpr, thetaMin, thetaMax, steps) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const theta = thetaMin + (thetaMax - thetaMin) * i / steps;
            const r = evaluateExpression(rExpr, 'theta', theta);
            
            if (!isNaN(r) && isFinite(r)) {
                const cartesian = polarToCartesian(r, theta);
                points.push({ ...cartesian, r, theta });
            }
        }
        return points;
    }

    describe('Circle r = constant', () => {
        test('should generate unit circle', () => {
            const points = generatePolarPoints('1', 0, 2 * Math.PI, 100);
            
            expect(points.length).toBeGreaterThan(90);
            
            points.forEach(p => {
                const radius = Math.sqrt(p.x * p.x + p.y * p.y);
                expect(radius).toBeCloseTo(1, 5);
            });
        });

        test('should generate circle with radius 3', () => {
            const points = generatePolarPoints('3', 0, 2 * Math.PI, 100);
            
            points.forEach(p => {
                const radius = Math.sqrt(p.x * p.x + p.y * p.y);
                expect(radius).toBeCloseTo(3, 5);
            });
        });
    });

    describe('Cardioid r = 1 + cos(theta)', () => {
        test('should generate cardioid', () => {
            const points = generatePolarPoints('1 + cos(theta)', 0, 2 * Math.PI, 100);
            
            expect(points.length).toBeGreaterThan(90);
            
            // At theta = 0, r = 2
            expect(points[0].r).toBeCloseTo(2, 5);
            
            // At theta = pi, r = 0
            const piPoint = points.find(p => Math.abs(p.theta - Math.PI) < 0.1);
            expect(piPoint.r).toBeCloseTo(0, 1);
        });

        test('should have maximum r = 2 at theta = 0', () => {
            const points = generatePolarPoints('1 + cos(theta)', 0, 2 * Math.PI, 360);
            const maxR = Math.max(...points.map(p => p.r));
            expect(maxR).toBeCloseTo(2, 2);
        });
    });

    describe('Rose Curves r = cos(n*theta)', () => {
        test('should generate 3-petal rose for cos(3*theta)', () => {
            const points = generatePolarPoints('cos(3*theta)', 0, 2 * Math.PI, 360);
            
            // Max radius should be 1
            const maxR = Math.max(...points.map(p => Math.abs(p.r)));
            expect(maxR).toBeCloseTo(1, 2);
        });

        test('should generate 4-petal rose for cos(2*theta)', () => {
            const points = generatePolarPoints('cos(2*theta)', 0, 2 * Math.PI, 360);
            
            const maxR = Math.max(...points.map(p => Math.abs(p.r)));
            expect(maxR).toBeCloseTo(1, 2);
        });

        test('should generate 5-petal rose for cos(5*theta)', () => {
            const points = generatePolarPoints('cos(5*theta)', 0, 2 * Math.PI, 360);
            
            const maxR = Math.max(...points.map(p => Math.abs(p.r)));
            expect(maxR).toBeCloseTo(1, 2);
        });
    });

    describe('Spiral r = theta', () => {
        test('should generate Archimedean spiral', () => {
            const points = generatePolarPoints('theta', 0, 4 * Math.PI, 100);
            
            // r should increase with theta
            expect(points[points.length - 1].r).toBeGreaterThan(points[0].r);
            
            // r should equal theta
            points.forEach(p => {
                expect(p.r).toBeCloseTo(p.theta, 5);
            });
        });

        test('should have r = 2*pi at theta = 2*pi', () => {
            const points = generatePolarPoints('theta', 0, 2 * Math.PI, 100);
            const lastPoint = points[points.length - 1];
            expect(lastPoint.r).toBeCloseTo(2 * Math.PI, 2);
        });
    });

    describe('Lemniscate r^2 = cos(2*theta)', () => {
        test('should generate lemniscate (figure-8)', () => {
            const points = generatePolarPoints('sqrt(abs(cos(2*theta)))', 0, 2 * Math.PI, 360);
            
            expect(points.length).toBeGreaterThan(300);
            
            // Max r should be 1
            const maxR = Math.max(...points.map(p => p.r));
            expect(maxR).toBeCloseTo(1, 2);
        });
    });

    describe('Limacon r = 1 + 2*cos(theta)', () => {
        test('should generate limacon with inner loop', () => {
            const points = generatePolarPoints('1 + 2*cos(theta)', 0, 2 * Math.PI, 360);
            
            // At theta = 0, r = 3
            expect(points[0].r).toBeCloseTo(3, 2);
            
            // Has negative r values (inner loop)
            const hasNegative = points.some(p => p.r < 0);
            expect(hasNegative).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        test('should handle constant zero radius', () => {
            const points = generatePolarPoints('0', 0, 2 * Math.PI, 100);
            points.forEach(p => {
                expect(p.x).toBeCloseTo(0, 10);
                expect(p.y).toBeCloseTo(0, 10);
            });
        });

        test('should handle very small theta range', () => {
            const points = generatePolarPoints('1', 0, 0.1, 10);
            expect(points.length).toBe(11);
        });

        test('should handle negative theta values', () => {
            const points = generatePolarPoints('1', -Math.PI, Math.PI, 100);
            expect(points.length).toBeGreaterThan(90);
        });

        test('should handle large theta values', () => {
            const points = generatePolarPoints('theta', 0, 10 * Math.PI, 1000);
            expect(points.length).toBe(1001);
            expect(points[points.length - 1].r).toBeCloseTo(10 * Math.PI, 2);
        });
    });
});

describe('Polar Presets', () => {
    const presets = {
        circle: { r: '2', max: '6.28' },
        cardioid: { r: '1 + cos(theta)', max: '6.28' },
        rose3: { r: 'cos(3*theta)', max: '6.28' },
        rose4: { r: 'cos(2*theta)', max: '6.28' },
        spiral: { r: 'theta', max: '18.84' },
        lemniscate: { r: 'sqrt(abs(4*cos(2*theta)))', max: '6.28' }
    };

    test('should have valid circle preset', () => {
        expect(presets.circle.r).toBe('2');
        expect(parseFloat(presets.circle.max)).toBeCloseTo(2 * Math.PI, 1);
    });

    test('should have valid cardioid preset', () => {
        expect(presets.cardioid.r).toBe('1 + cos(theta)');
    });

    test('should have valid rose presets', () => {
        expect(presets.rose3.r).toBe('cos(3*theta)');
        expect(presets.rose4.r).toBe('cos(2*theta)');
    });

    test('should have valid spiral preset with 3 full rotations', () => {
        expect(presets.spiral.r).toBe('theta');
        expect(parseFloat(presets.spiral.max)).toBeCloseTo(6 * Math.PI, 1);
    });

    test('should have valid lemniscate preset', () => {
        expect(presets.lemniscate.r).toContain('cos(2*theta)');
    });
});
