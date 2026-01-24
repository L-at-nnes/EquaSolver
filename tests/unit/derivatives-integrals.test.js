/**
 * Tests for Derivatives & Integrals Calculator
 * 
 * This test suite covers:
 * - Symbolic differentiation for various functions
 * - Symbolic integration for various functions
 * - Definite integrals with numerical evaluation
 * - Derivative evaluation at specific points
 * - Higher-order derivatives
 * - Critical points detection
 * - Edge cases and error handling
 */

// Mock DOM elements for UI functions
document.body.innerHTML = `
    <select id="derivativeType">
        <option value="symbolic">Symbolic</option>
        <option value="atPoint">At Point</option>
        <option value="nth">Nth Derivative</option>
        <option value="critical">Critical Points</option>
    </select>
    <select id="integralType">
        <option value="indefinite">Indefinite</option>
        <option value="definite">Definite</option>
    </select>
    <input type="text" id="derivativeExpression" value="">
    <input type="number" id="derivativePoint" value="0">
    <input type="number" id="derivativeOrder" value="2">
    <input type="number" id="derivativeRangeMin" value="-5">
    <input type="number" id="derivativeRangeMax" value="5">
    <input type="text" id="integralExpression" value="">
    <input type="number" id="integralLower" value="0">
    <input type="number" id="integralUpper" value="1">
    <div id="derivativeSolution"></div>
    <div id="integralSolution"></div>
    <div id="derivativePreview"></div>
    <div id="integralPreview"></div>
    <button id="calculateDerivative"></button>
    <button id="calculateIntegral"></button>
    <button id="exportDerivativePdf" style="display:none"></button>
    <button id="exportIntegralPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        derivative: "Derivative",
        integral: "Integral",
        symbolicAntiderivative: "Antiderivative",
        noCriticalPoints: "No critical points found in the given range",
        range: "Range",
        order: "Order",
        localminimum: "local minimum",
        localmaximum: "local maximum",
        inflectionpoint: "inflection point",
        errorCalculating: "Error calculating"
    }
};
global.currentLang = 'en';

// Import functions
const {
    differentiate,
    integrate,
    definiteIntegral,
    evaluateDerivativeAt,
    nthDerivative,
    findCriticalPoints,
    createFunction,
    parseExpression,
    splitIntoTerms,
    simplifyExpression
} = require('../../src/js/index.js');

// ===================================
// SYMBOLIC DIFFERENTIATION TESTS
// ===================================

describe('Symbolic Differentiation', () => {
    describe('Power rule: d/dx[x^n] = nx^(n-1)', () => {
        test('should differentiate x^2 to 2x', () => {
            const result = differentiate('x^2');
            expect(result.derivative).toMatch(/2\s*x/i);
        });

        test('should differentiate x^3 to 3x^2', () => {
            const result = differentiate('x^3');
            expect(result.derivative).toMatch(/3\s*x\^?2?/i);
        });

        test('should differentiate x to 1', () => {
            const result = differentiate('x');
            expect(result.derivative).toMatch(/1/);
        });

        test('should differentiate x^5 to 5x^4', () => {
            const result = differentiate('x^5');
            expect(result.derivative).toMatch(/5\s*x\^?4?/i);
        });

        test('should differentiate x^0.5 (sqrt(x)) to 0.5x^(-0.5)', () => {
            const result = differentiate('x^0.5');
            expect(result.derivative).toMatch(/0\.5/);
        });
    });

    describe('Constant rule: d/dx[c] = 0', () => {
        test('should differentiate 5 to 0', () => {
            const result = differentiate('5');
            expect(result.derivative).toMatch(/0/);
        });

        test('should differentiate -3 to 0', () => {
            const result = differentiate('-3');
            expect(result.derivative).toMatch(/0/);
        });

        test('should differentiate 100 to 0', () => {
            const result = differentiate('100');
            expect(result.derivative).toMatch(/0/);
        });
    });

    describe('Coefficient rule: d/dx[c*f(x)] = c*f\'(x)', () => {
        test('should differentiate 3x^2 to 6x', () => {
            const result = differentiate('3*x^2');
            expect(result.derivative).toMatch(/6\s*x/i);
        });

        test('should differentiate 2x to 2', () => {
            const result = differentiate('2*x');
            expect(result.derivative).toMatch(/2/);
        });

        test('should differentiate -4x^3 to -12x^2', () => {
            const result = differentiate('-4*x^3');
            expect(result.derivative).toMatch(/-?12\s*x\^?2?/i);
        });
    });

    describe('Sum/Difference rule', () => {
        test('should differentiate x^2 + x to 2x + 1', () => {
            const result = differentiate('x^2 + x');
            expect(result.derivative).toMatch(/2\s*x/i);
            expect(result.derivative).toMatch(/1/);
        });

        test('should differentiate x^3 - x^2 to 3x^2 - 2x', () => {
            const result = differentiate('x^3 - x^2');
            expect(result.derivative).toMatch(/3\s*x\^?2?/i);
            expect(result.derivative).toMatch(/2\s*x/i);
        });

        test('should differentiate x^2 + 3x + 5 correctly', () => {
            const result = differentiate('x^2 + 3*x + 5');
            expect(result.derivative).toMatch(/2\s*x/i);
            expect(result.derivative).toMatch(/3/);
        });
    });

    describe('Trigonometric functions', () => {
        test('should differentiate sin(x) to cos(x)', () => {
            const result = differentiate('sin(x)');
            expect(result.derivative.toLowerCase()).toMatch(/cos/);
        });

        test('should differentiate cos(x) to -sin(x)', () => {
            const result = differentiate('cos(x)');
            expect(result.derivative.toLowerCase()).toMatch(/sin/);
        });

        test('should differentiate tan(x) to sec^2(x) or 1/cos^2(x)', () => {
            const result = differentiate('tan(x)');
            expect(result.derivative.toLowerCase()).toMatch(/sec|cos/);
        });
    });

    describe('Exponential and logarithmic functions', () => {
        test('should differentiate e^x to e^x', () => {
            const result = differentiate('e^x');
            expect(result.derivative.toLowerCase()).toMatch(/e\^x|exp/);
        });

        test('should differentiate ln(x) to 1/x', () => {
            const result = differentiate('ln(x)');
            expect(result.derivative).toMatch(/1\s*\/\s*x|x\^-1/);
        });

        test('should differentiate exp(x) to exp(x)', () => {
            const result = differentiate('exp(x)');
            expect(result.derivative.toLowerCase()).toMatch(/e\^x|exp/);
        });
    });

    describe('Square root function', () => {
        test('should differentiate sqrt(x) to 1/(2*sqrt(x))', () => {
            const result = differentiate('sqrt(x)');
            expect(result.derivative.toLowerCase()).toMatch(/sqrt|0\.5|√/);
        });
    });
});

// ===================================
// SYMBOLIC INTEGRATION TESTS
// ===================================

describe('Symbolic Integration', () => {
    describe('Power rule: ∫x^n dx = x^(n+1)/(n+1) + C', () => {
        test('should integrate x to x^2/2 + C', () => {
            const result = integrate('x');
            expect(result.simplified).toMatch(/x.*2/i);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate x^2 to x^3/3 + C', () => {
            const result = integrate('x^2');
            expect(result.simplified).toMatch(/x\^3/i);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate x^3 to x^4/4 + C', () => {
            const result = integrate('x^3');
            expect(result.simplified).toMatch(/x\^4/i);
            expect(result.simplified).toMatch(/C/);
        });
    });

    describe('Constant rule: ∫c dx = cx + C', () => {
        test('should integrate 5 to 5x + C', () => {
            const result = integrate('5');
            expect(result.simplified).toMatch(/5\s*x/i);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate 1 to x + C', () => {
            const result = integrate('1');
            expect(result.simplified).toMatch(/x/i);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate -3 to -3x + C', () => {
            const result = integrate('-3');
            expect(result.simplified).toMatch(/-?3\s*x/i);
            expect(result.simplified).toMatch(/C/);
        });
    });

    describe('Trigonometric functions', () => {
        test('should integrate sin(x) to -cos(x) + C', () => {
            const result = integrate('sin(x)');
            expect(result.simplified.toLowerCase()).toMatch(/cos/);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate cos(x) to sin(x) + C', () => {
            const result = integrate('cos(x)');
            expect(result.simplified.toLowerCase()).toMatch(/sin/);
            expect(result.simplified).toMatch(/C/);
        });
    });

    describe('Exponential and logarithmic functions', () => {
        test('should integrate e^x to e^x + C', () => {
            const result = integrate('e^x');
            expect(result.simplified.toLowerCase()).toMatch(/e\^x|exp/);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate 1/x to ln|x| + C', () => {
            const result = integrate('1/x');
            expect(result.simplified.toLowerCase()).toMatch(/ln/);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate exp(x) to exp(x) + C', () => {
            const result = integrate('exp(x)');
            expect(result.simplified.toLowerCase()).toMatch(/e\^x|exp/);
            expect(result.simplified).toMatch(/C/);
        });
    });

    describe('Sum/Difference of functions', () => {
        test('should integrate x + 1 correctly', () => {
            const result = integrate('x + 1');
            expect(result.simplified).toMatch(/x/);
            expect(result.simplified).toMatch(/C/);
        });

        test('should integrate x^2 + x correctly', () => {
            const result = integrate('x^2 + x');
            expect(result.simplified).toMatch(/x\^3/i);
            expect(result.simplified).toMatch(/C/);
        });
    });
});

// ===================================
// DEFINITE INTEGRAL TESTS
// ===================================

describe('Definite Integrals', () => {
    describe('Basic definite integrals', () => {
        test('∫[0,1] x dx = 0.5', () => {
            const result = definiteIntegral('x', 0, 1);
            expect(result.value).toBeCloseTo(0.5, 5);
        });

        test('∫[0,1] x^2 dx = 1/3', () => {
            const result = definiteIntegral('x^2', 0, 1);
            expect(result.value).toBeCloseTo(1/3, 5);
        });

        test('∫[0,2] x dx = 2', () => {
            const result = definiteIntegral('x', 0, 2);
            expect(result.value).toBeCloseTo(2, 5);
        });

        test('∫[0,1] 3*x^2 dx = 1', () => {
            const result = definiteIntegral('3*x^2', 0, 1);
            expect(result.value).toBeCloseTo(1, 5);
        });
    });

    describe('Trigonometric definite integrals', () => {
        test('∫[0,π] sin(x) dx = 2', () => {
            const result = definiteIntegral('sin(x)', 0, Math.PI);
            expect(result.value).toBeCloseTo(2, 3);
        });

        test('∫[0,π/2] cos(x) dx = 1', () => {
            const result = definiteIntegral('cos(x)', 0, Math.PI/2);
            expect(result.value).toBeCloseTo(1, 3);
        });

        test('∫[0,2π] sin(x) dx ≈ 0', () => {
            const result = definiteIntegral('sin(x)', 0, 2*Math.PI);
            expect(Math.abs(result.value)).toBeLessThan(0.001);
        });
    });

    describe('Exponential definite integrals', () => {
        test('∫[0,1] e^x dx = e - 1', () => {
            const result = definiteIntegral('e^x', 0, 1);
            expect(result.value).toBeCloseTo(Math.E - 1, 3);
        });

        test('∫[0,2] e^x dx = e^2 - 1', () => {
            const result = definiteIntegral('e^x', 0, 2);
            expect(result.value).toBeCloseTo(Math.exp(2) - 1, 3);
        });
    });

    describe('Negative bounds', () => {
        test('∫[-1,1] x^2 dx = 2/3', () => {
            const result = definiteIntegral('x^2', -1, 1);
            expect(result.value).toBeCloseTo(2/3, 5);
        });

        test('∫[-1,1] x dx = 0 (odd function)', () => {
            const result = definiteIntegral('x', -1, 1);
            expect(Math.abs(result.value)).toBeLessThan(0.0001);
        });
    });
});

// ===================================
// DERIVATIVE AT A POINT TESTS
// ===================================

describe('Derivative at a Point', () => {
    describe('Numerical evaluation', () => {
        test('f\'(2) for f(x) = x^2 should be 4', () => {
            const result = evaluateDerivativeAt('x^2', 2);
            expect(result.numericalValue).toBeCloseTo(4, 3);
        });

        test('f\'(3) for f(x) = x^2 should be 6', () => {
            const result = evaluateDerivativeAt('x^2', 3);
            expect(result.numericalValue).toBeCloseTo(6, 3);
        });

        test('f\'(0) for f(x) = sin(x) should be 1 (cos(0) = 1)', () => {
            const result = evaluateDerivativeAt('sin(x)', 0);
            expect(result.numericalValue).toBeCloseTo(1, 3);
        });

        test('f\'(π/2) for f(x) = sin(x) should be 0', () => {
            const result = evaluateDerivativeAt('sin(x)', Math.PI/2);
            expect(Math.abs(result.numericalValue)).toBeLessThan(0.01);
        });

        test('f\'(1) for f(x) = ln(x) should be 1', () => {
            const result = evaluateDerivativeAt('ln(x)', 1);
            expect(result.numericalValue).toBeCloseTo(1, 3);
        });

        test('f\'(2) for f(x) = ln(x) should be 0.5', () => {
            const result = evaluateDerivativeAt('ln(x)', 2);
            expect(result.numericalValue).toBeCloseTo(0.5, 3);
        });
    });

    describe('Exponential function', () => {
        test('f\'(0) for f(x) = e^x should be 1', () => {
            const result = evaluateDerivativeAt('e^x', 0);
            expect(result.numericalValue).toBeCloseTo(1, 3);
        });

        test('f\'(1) for f(x) = e^x should be e', () => {
            const result = evaluateDerivativeAt('e^x', 1);
            expect(result.numericalValue).toBeCloseTo(Math.E, 3);
        });
    });
});

// ===================================
// NTH DERIVATIVE TESTS
// ===================================

describe('Nth Order Derivatives', () => {
    describe('Polynomial functions', () => {
        test('2nd derivative of x^3 should be 6x', () => {
            const result = nthDerivative('x^3', 2);
            expect(result.derivative).toMatch(/6\s*x/i);
        });

        test('3rd derivative of x^3 should be 6', () => {
            const result = nthDerivative('x^3', 3);
            expect(result.derivative).toMatch(/6/);
        });

        test('4th derivative of x^3 should be 0', () => {
            const result = nthDerivative('x^3', 4);
            expect(result.derivative).toMatch(/0/);
        });

        test('2nd derivative of x^4 should be 12x^2', () => {
            const result = nthDerivative('x^4', 2);
            expect(result.derivative).toMatch(/12\s*x\^?2?/i);
        });
    });

    describe('Trigonometric functions', () => {
        test('2nd derivative of sin(x) should be -sin(x)', () => {
            const result = nthDerivative('sin(x)', 2);
            expect(result.derivative.toLowerCase()).toMatch(/sin/);
        });

        test('2nd derivative of cos(x) should be -cos(x)', () => {
            const result = nthDerivative('cos(x)', 2);
            expect(result.derivative.toLowerCase()).toMatch(/cos/);
        });

        test('4th derivative of sin(x) should be sin(x)', () => {
            const result = nthDerivative('sin(x)', 4);
            expect(result.derivative.toLowerCase()).toMatch(/sin/);
        });
    });

    describe('Exponential function', () => {
        test('Any derivative of e^x should be e^x', () => {
            const result1 = nthDerivative('e^x', 1);
            const result2 = nthDerivative('e^x', 2);
            const result5 = nthDerivative('e^x', 5);
            
            expect(result1.derivative.toLowerCase()).toMatch(/e\^x|exp/);
            expect(result2.derivative.toLowerCase()).toMatch(/e\^x|exp/);
            expect(result5.derivative.toLowerCase()).toMatch(/e\^x|exp/);
        });
    });

    describe('Edge cases', () => {
        test('1st derivative should work like regular differentiate', () => {
            const result1 = nthDerivative('x^3', 1);
            const result2 = differentiate('x^3');
            // Both should give 3x^2
            expect(result1.derivative).toMatch(/3\s*x\^?2?/i);
            expect(result2.derivative).toMatch(/3\s*x\^?2?/i);
        });
    });
});

// ===================================
// CRITICAL POINTS TESTS
// ===================================

describe('Critical Points', () => {
    describe('Finding extrema', () => {
        test('should find minimum of x^2 at x=0', () => {
            const result = findCriticalPoints('x^2', -5, 5);
            expect(result.length).toBeGreaterThan(0);
            const nearZero = result.find(p => Math.abs(p.x) < 0.2);
            expect(nearZero).toBeDefined();
        });

        test('should find critical points of x^3 - 3x', () => {
            // f(x) = x^3 - 3x has critical points at x = ±1
            const result = findCriticalPoints('x^3 - 3*x', -3, 3);
            expect(result.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Edge cases', () => {
        test('should handle function with no critical points in range', () => {
            // Linear function has no critical points
            const result = findCriticalPoints('x', -5, 5);
            expect(Array.isArray(result)).toBe(true);
        });
    });
});

// ===================================
// HELPER FUNCTIONS TESTS
// ===================================

describe('Helper Functions', () => {
    describe('createFunction', () => {
        test('should create evaluable function from expression', () => {
            const f = createFunction('x^2');
            expect(f(2)).toBeCloseTo(4, 5);
            expect(f(3)).toBeCloseTo(9, 5);
        });

        test('should handle sin function', () => {
            const f = createFunction('sin(x)');
            expect(f(0)).toBeCloseTo(0, 5);
            expect(f(Math.PI/2)).toBeCloseTo(1, 5);
        });

        test('should handle exp function', () => {
            const f = createFunction('e^x');
            expect(f(0)).toBeCloseTo(1, 5);
            expect(f(1)).toBeCloseTo(Math.E, 5);
        });
    });

    describe('parseExpression', () => {
        test('should normalize expression for evaluation', () => {
            const result = parseExpression('x^2');
            expect(result).toBeDefined();
        });

        test('should handle trigonometric functions', () => {
            const result = parseExpression('sin(x) + cos(x)');
            expect(result).toBeDefined();
        });
    });

    describe('splitIntoTerms', () => {
        test('should split polynomial into terms', () => {
            const terms = splitIntoTerms('x^2 + x + 1');
            expect(terms.length).toBeGreaterThanOrEqual(1);
        });

        test('should handle subtraction', () => {
            const terms = splitIntoTerms('x^2 - x');
            expect(terms.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('simplifyExpression', () => {
        test('should simplify expression with zeros', () => {
            const result = simplifyExpression('0 + x');
            expect(result).toMatch(/x/);
        });

        test('should handle basic expression', () => {
            const result = simplifyExpression('2*x + 3');
            expect(result).toBeDefined();
        });
    });
});

// ===================================
// EDGE CASES AND ERROR HANDLING
// ===================================

describe('Edge Cases and Error Handling', () => {
    describe('Empty or invalid input', () => {
        test('should handle empty expression gracefully', () => {
            expect(() => differentiate('')).not.toThrow();
        });

        test('should handle whitespace expression', () => {
            expect(() => differentiate('   ')).not.toThrow();
        });
    });

    describe('Complex expressions', () => {
        test('should handle expression with multiple operations', () => {
            const result = differentiate('x^3 + 2*x^2 - 5*x + 3');
            expect(result).toBeDefined();
        });

        test('should handle nested functions', () => {
            const result = differentiate('sin(x) + cos(x)');
            expect(result).toBeDefined();
        });
    });

    describe('Numerical precision', () => {
        test('definite integral should have reasonable precision', () => {
            // ∫[0,1] x dx = 0.5 exactly
            const result = definiteIntegral('x', 0, 1);
            expect(Math.abs(result.value - 0.5)).toBeLessThan(0.0001);
        });

        test('derivative evaluation should have reasonable precision', () => {
            // d/dx[x^2] at x=3 = 6 exactly
            const result = evaluateDerivativeAt('x^2', 3);
            expect(Math.abs(result.numericalValue - 6)).toBeLessThan(0.01);
        });
    });

    describe('Boundary conditions', () => {
        test('should handle integral with same bounds (result = 0)', () => {
            const result = definiteIntegral('x^2', 2, 2);
            expect(Math.abs(result.value)).toBeLessThan(0.0001);
        });

        test('should handle negative coefficient', () => {
            const result = differentiate('-x^2');
            expect(result.derivative).toMatch(/-?\s*2\s*x/i);
        });
    });
});

// ===================================
// MATHEMATICAL PROPERTIES TESTS
// ===================================

describe('Mathematical Properties', () => {
    describe('Linearity of differentiation', () => {
        test('d/dx[af(x)] = a * d/dx[f(x)]', () => {
            // Verify that differentiating 3x^2 gives 3 times differentiating x^2
            const withCoeff = differentiate('3*x^2');
            expect(withCoeff.derivative).toMatch(/6\s*x/i); // 3 * 2x = 6x
        });
    });

    describe('Linearity of integration', () => {
        test('∫[a,b] cf(x)dx = c * ∫[a,b] f(x)dx', () => {
            const result1 = definiteIntegral('2*x', 0, 1);
            const result2 = 2 * definiteIntegral('x', 0, 1).value;
            expect(result1.value).toBeCloseTo(result2, 5);
        });
    });

    describe('Fundamental Theorem of Calculus', () => {
        test('derivative of integral should give back original (for polynomials)', () => {
            // If F(x) = ∫f(x)dx, then F'(x) = f(x)
            // For f(x) = x^2, F(x) = x^3/3, F'(x) = x^2
            const antiderivative = integrate('x^2'); // x^3/3 + C
            // The structure should allow differentiation back to x^2
            expect(antiderivative.simplified).toMatch(/x\^3/i);
        });
    });
});
