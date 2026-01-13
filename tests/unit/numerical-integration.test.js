/**
 * Tests for Numerical Integration Calculator
 * 
 * This test suite covers:
 * - Trapezoidal rule
 * - Simpson's rule
 * - Accuracy comparison
 * - Known integral values
 */

// Mock DOM elements
document.body.innerHTML = `
    <input type="text" id="integrationFunction" value="x^2">
    <input type="number" id="integrationLower" value="0">
    <input type="number" id="integrationUpper" value="1">
    <input type="number" id="integrationIntervals" value="100">
    <select id="integrationMethod">
        <option value="trapezoidal">Trapezoidal</option>
        <option value="simpsons">Simpson's</option>
    </select>
    <div id="integrationSolution"></div>
    <button id="calculateIntegration"></button>
    <button id="exportIntegrationPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        integrationResult: "Integration Result",
        methodUsed: "Method",
        intervalsUsed: "Intervals",
        estimatedError: "Estimated error",
        trapezoidalRule: "Trapezoidal Rule",
        simpsonsRule: "Simpson's Rule"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    trapezoidalRule,
    simpsonsRule
} = require('../../src/js/script.js');

describe('Trapezoidal Rule', () => {
    describe('Polynomial integrals', () => {
        test('should integrate x from 0 to 1 = 0.5', () => {
            const f = x => x;
            const result = trapezoidalRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(0.5, 5);
        });

        test('should integrate x^2 from 0 to 1 = 1/3', () => {
            const f = x => x * x;
            const result = trapezoidalRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(1/3, 3);
        });

        test('should integrate x^3 from 0 to 1 = 1/4', () => {
            const f = x => x * x * x;
            const result = trapezoidalRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(0.25, 3);
        });

        test('should integrate constant function', () => {
            const f = x => 5;
            const result = trapezoidalRule(f, 0, 2, 10);
            expect(result).toBeCloseTo(10, 10);
        });
    });

    describe('Trigonometric integrals', () => {
        test('should integrate sin(x) from 0 to π = 2', () => {
            const f = x => Math.sin(x);
            const result = trapezoidalRule(f, 0, Math.PI, 100);
            expect(result).toBeCloseTo(2, 3);
        });

        test('should integrate cos(x) from 0 to π/2 = 1', () => {
            const f = x => Math.cos(x);
            const result = trapezoidalRule(f, 0, Math.PI/2, 100);
            expect(result).toBeCloseTo(1, 3);
        });
    });

    describe('Exponential integrals', () => {
        test('should integrate e^x from 0 to 1 = e - 1', () => {
            const f = x => Math.exp(x);
            const result = trapezoidalRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(Math.E - 1, 3);
        });
    });

    describe('Interval effects', () => {
        test('more intervals should give better accuracy', () => {
            const f = x => x * x;
            const exact = 1/3;
            
            const error10 = Math.abs(trapezoidalRule(f, 0, 1, 10) - exact);
            const error100 = Math.abs(trapezoidalRule(f, 0, 1, 100) - exact);
            const error1000 = Math.abs(trapezoidalRule(f, 0, 1, 1000) - exact);
            
            expect(error100).toBeLessThan(error10);
            expect(error1000).toBeLessThan(error100);
        });
    });
});

describe("Simpson's Rule", () => {
    describe('Polynomial integrals', () => {
        test('should integrate x from 0 to 1 = 0.5', () => {
            const f = x => x;
            const result = simpsonsRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(0.5, 10);
        });

        test('should integrate x^2 from 0 to 1 = 1/3', () => {
            const f = x => x * x;
            const result = simpsonsRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(1/3, 8);
        });

        test('should integrate x^3 from 0 to 1 = 1/4', () => {
            const f = x => x * x * x;
            const result = simpsonsRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(0.25, 8);
        });

        test('should be exact for polynomials up to degree 3', () => {
            // Simpson's rule is exact for polynomials up to degree 3
            const f = x => x * x * x; // x^3
            const result = simpsonsRule(f, 0, 1, 4);
            expect(result).toBeCloseTo(0.25, 10);
        });
    });

    describe('Trigonometric integrals', () => {
        test('should integrate sin(x) from 0 to π = 2', () => {
            const f = x => Math.sin(x);
            const result = simpsonsRule(f, 0, Math.PI, 100);
            expect(result).toBeCloseTo(2, 6);
        });

        test('should integrate cos(x) from 0 to π/2 = 1', () => {
            const f = x => Math.cos(x);
            const result = simpsonsRule(f, 0, Math.PI/2, 100);
            expect(result).toBeCloseTo(1, 6);
        });
    });

    describe('Exponential integrals', () => {
        test('should integrate e^x from 0 to 1 = e - 1', () => {
            const f = x => Math.exp(x);
            const result = simpsonsRule(f, 0, 1, 100);
            expect(result).toBeCloseTo(Math.E - 1, 6);
        });
    });

    describe('Even interval requirement', () => {
        test('should work with odd intervals (auto-corrects to even)', () => {
            const f = x => x * x;
            // Should not throw, will auto-correct odd to even
            const result = simpsonsRule(f, 0, 1, 101);
            expect(result).toBeCloseTo(1/3, 5);
        });
    });
});

describe('Method Comparison', () => {
    test("Simpson's should be more accurate than Trapezoidal for same intervals", () => {
        const f = x => Math.sin(x);
        const exact = 2;
        const n = 20;
        
        const trapError = Math.abs(trapezoidalRule(f, 0, Math.PI, n) - exact);
        const simpError = Math.abs(simpsonsRule(f, 0, Math.PI, n) - exact);
        
        expect(simpError).toBeLessThan(trapError);
    });

    test('both methods should converge to same value', () => {
        const f = x => Math.exp(-x * x);
        const a = 0;
        const b = 1;
        const n = 1000;
        
        const trap = trapezoidalRule(f, a, b, n);
        const simp = simpsonsRule(f, a, b, n);
        
        expect(trap).toBeCloseTo(simp, 4);
    });
});

describe('Special Integrals', () => {
    test('∫(0 to 1) 1/(1+x^2) dx = π/4 ≈ 0.785', () => {
        const f = x => 1 / (1 + x * x);
        const trap = trapezoidalRule(f, 0, 1, 1000);
        const simp = simpsonsRule(f, 0, 1, 1000);
        
        expect(trap).toBeCloseTo(Math.PI/4, 3);
        expect(simp).toBeCloseTo(Math.PI/4, 5);
    });

    test('∫(0 to 1) e^(-x^2) dx ≈ 0.7468 (error function related)', () => {
        const f = x => Math.exp(-x * x);
        const result = simpsonsRule(f, 0, 1, 100);
        expect(result).toBeCloseTo(0.7468, 3);
    });

    test('∫(-1 to 1) sqrt(1-x^2) dx = π/2 (semicircle area)', () => {
        const f = x => Math.sqrt(1 - x * x);
        const result = simpsonsRule(f, -1, 1, 1000);
        expect(result).toBeCloseTo(Math.PI/2, 2);
    });
});

describe('Edge Cases', () => {
    test('should handle negative bounds', () => {
        const f = x => x * x;
        const result = trapezoidalRule(f, -1, 1, 100);
        // ∫(-1 to 1) x^2 dx = 2/3
        expect(result).toBeCloseTo(2/3, 3);
    });

    test('should handle reversed bounds', () => {
        const f = x => x;
        // Note: with a > b, result should be negative
        const result = trapezoidalRule(f, 1, 0, 100);
        expect(result).toBeCloseTo(-0.5, 5);
    });

    test('should handle single interval', () => {
        const f = x => x;
        const result = trapezoidalRule(f, 0, 1, 1);
        // With n=1: (f(0) + f(1))/2 * 1 = 0.5
        expect(result).toBeCloseTo(0.5, 10);
    });

    test('should handle zero-width interval', () => {
        const f = x => x * x;
        const result = trapezoidalRule(f, 1, 1, 10);
        expect(result).toBeCloseTo(0, 10);
    });
});

describe('Convergence Order', () => {
    test('trapezoidal error should decrease by ~4x when doubling intervals', () => {
        const f = x => x * x;
        const exact = 1/3;
        
        const e1 = Math.abs(trapezoidalRule(f, 0, 1, 10) - exact);
        const e2 = Math.abs(trapezoidalRule(f, 0, 1, 20) - exact);
        
        // For trapezoidal, error ∝ 1/n^2, so ratio should be ~4
        expect(e1 / e2).toBeGreaterThan(3);
        expect(e1 / e2).toBeLessThan(5);
    });

    test("Simpson's error should decrease by ~16x when doubling intervals", () => {
        const f = x => Math.sin(x);
        const exact = 2;
        
        const e1 = Math.abs(simpsonsRule(f, 0, Math.PI, 10) - exact);
        const e2 = Math.abs(simpsonsRule(f, 0, Math.PI, 20) - exact);
        
        // For Simpson's, error ∝ 1/n^4, so ratio should be ~16
        expect(e1 / e2).toBeGreaterThan(10);
    });
});
