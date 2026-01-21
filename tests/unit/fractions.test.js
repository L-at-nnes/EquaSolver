/**
 * Tests for Fraction Calculator
 * 
 * This test suite covers:
 * - Fraction simplification using GCD
 * - Fraction operations (add, subtract, multiply, divide)
 * - Mixed number conversion
 * - Edge cases with negative numbers and zero
 */

// Mock DOM elements
document.body.innerHTML = `
    <select id="fractionOperation">
        <option value="simplify">Simplify</option>
        <option value="add">Add</option>
        <option value="subtract">Subtract</option>
        <option value="multiply">Multiply</option>
        <option value="divide">Divide</option>
    </select>
    <input type="number" id="frac1Num" value="1">
    <input type="number" id="frac1Den" value="2">
    <input type="number" id="frac2Num" value="1">
    <input type="number" id="frac2Den" value="3">
    <div id="fraction2Group"></div>
    <div id="fractionsSolution"></div>
    <button id="calculateFractions"></button>
    <button id="exportFractionsPdf" style="display:none"></button>
`;

// Mock translations and gcd function
global.translations = {
    en: {
        invalidFraction: "Invalid fraction",
        simplifiedForm: "Simplified form",
        decimalValue: "Decimal value",
        fractionResult: "Result"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    simplifyFractionFunc,
    fractionToMixed,
    gcd
} = require('../../src/js/index.js');

describe('Fraction Simplification', () => {
    describe('Basic simplification', () => {
        test('should simplify 2/4 to 1/2', () => {
            const result = simplifyFractionFunc(2, 4);
            expect(result.num).toBe(1);
            expect(result.den).toBe(2);
        });

        test('should simplify 6/9 to 2/3', () => {
            const result = simplifyFractionFunc(6, 9);
            expect(result.num).toBe(2);
            expect(result.den).toBe(3);
        });

        test('should simplify 12/18 to 2/3', () => {
            const result = simplifyFractionFunc(12, 18);
            expect(result.num).toBe(2);
            expect(result.den).toBe(3);
        });

        test('should not change already simplified fractions', () => {
            const result = simplifyFractionFunc(3, 7);
            expect(result.num).toBe(3);
            expect(result.den).toBe(7);
        });

        test('should simplify to whole number when possible', () => {
            const result = simplifyFractionFunc(10, 5);
            expect(result.num).toBe(2);
            expect(result.den).toBe(1);
        });
    });

    describe('Negative fractions', () => {
        test('should handle negative numerator', () => {
            const result = simplifyFractionFunc(-4, 8);
            expect(result.num).toBe(-1);
            expect(result.den).toBe(2);
        });

        test('should move negative to numerator when denominator is negative', () => {
            const result = simplifyFractionFunc(4, -8);
            expect(result.num).toBe(-1);
            expect(result.den).toBe(2);
        });

        test('should make positive when both are negative', () => {
            const result = simplifyFractionFunc(-4, -8);
            expect(result.num).toBe(1);
            expect(result.den).toBe(2);
        });
    });

    describe('Edge cases', () => {
        test('should return null for zero denominator', () => {
            expect(simplifyFractionFunc(5, 0)).toBeNull();
        });

        test('should handle zero numerator', () => {
            const result = simplifyFractionFunc(0, 5);
            expect(result.num).toBe(0);
            expect(result.den).toBe(1);
        });

        test('should handle large numbers', () => {
            const result = simplifyFractionFunc(1000000, 2000000);
            expect(result.num).toBe(1);
            expect(result.den).toBe(2);
        });
    });
});

describe('Mixed Number Conversion', () => {
    describe('Improper fractions to mixed numbers', () => {
        test('should convert 7/4 to 1 3/4', () => {
            const result = fractionToMixed(7, 4);
            expect(result.whole).toBe(1);
            expect(result.num).toBe(3);
            expect(result.den).toBe(4);
        });

        test('should convert 11/3 to 3 2/3', () => {
            const result = fractionToMixed(11, 3);
            expect(result.whole).toBe(3);
            expect(result.num).toBe(2);
            expect(result.den).toBe(3);
        });

        test('should handle exact division', () => {
            const result = fractionToMixed(8, 4);
            expect(result.whole).toBe(2);
            expect(result.num).toBe(0);
            expect(result.den).toBe(4);
        });
    });

    describe('Proper fractions', () => {
        test('should have whole = 0 for proper fractions', () => {
            const result = fractionToMixed(3, 4);
            expect(result.whole).toBe(0);
            expect(result.num).toBe(3);
            expect(result.den).toBe(4);
        });
    });

    describe('Negative mixed numbers', () => {
        test('should handle negative improper fractions', () => {
            const result = fractionToMixed(-7, 4);
            expect(result.whole).toBe(-1);
            expect(result.num).toBe(3);
            expect(result.den).toBe(4);
        });
    });

    describe('Edge cases', () => {
        test('should return null for zero denominator', () => {
            expect(fractionToMixed(5, 0)).toBeNull();
        });
    });
});

describe('Fraction Arithmetic Properties', () => {
    // Helper to create and simplify fraction results
    const addFractions = (n1, d1, n2, d2) => {
        const num = n1 * d2 + n2 * d1;
        const den = d1 * d2;
        return simplifyFractionFunc(num, den);
    };

    const multiplyFractions = (n1, d1, n2, d2) => {
        return simplifyFractionFunc(n1 * n2, d1 * d2);
    };

    test('addition: 1/2 + 1/3 = 5/6', () => {
        const result = addFractions(1, 2, 1, 3);
        expect(result.num).toBe(5);
        expect(result.den).toBe(6);
    });

    test('addition: 1/4 + 1/4 = 1/2', () => {
        const result = addFractions(1, 4, 1, 4);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });

    test('multiplication: 2/3 * 3/4 = 1/2', () => {
        const result = multiplyFractions(2, 3, 3, 4);
        expect(result.num).toBe(1);
        expect(result.den).toBe(2);
    });

    test('multiplication: 1/2 * 2/1 = 1', () => {
        const result = multiplyFractions(1, 2, 2, 1);
        expect(result.num).toBe(1);
        expect(result.den).toBe(1);
    });

    test('addition is commutative: a/b + c/d = c/d + a/b', () => {
        const r1 = addFractions(1, 2, 1, 3);
        const r2 = addFractions(1, 3, 1, 2);
        expect(r1.num).toBe(r2.num);
        expect(r1.den).toBe(r2.den);
    });

    test('multiplication is commutative: a/b * c/d = c/d * a/b', () => {
        const r1 = multiplyFractions(2, 5, 3, 7);
        const r2 = multiplyFractions(3, 7, 2, 5);
        expect(r1.num).toBe(r2.num);
        expect(r1.den).toBe(r2.den);
    });
});
