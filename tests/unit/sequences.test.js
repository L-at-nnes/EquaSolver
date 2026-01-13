/**
 * Tests for Sequence Calculator
 * 
 * This test suite covers:
 * - Arithmetic sequences
 * - Geometric sequences
 * - Fibonacci sequences
 * - Sum formulas
 * - Edge cases
 */

// Mock DOM elements
document.body.innerHTML = `
    <select id="sequenceType">
        <option value="arithmetic">Arithmetic</option>
        <option value="geometric">Geometric</option>
        <option value="fibonacci">Fibonacci</option>
    </select>
    <input type="number" id="seqFirstTerm" value="1">
    <input type="number" id="seqDiff" value="2">
    <input type="number" id="seqRatio" value="2">
    <input type="number" id="seqNumTerms" value="10">
    <div id="seqFirstTermGroup"></div>
    <div id="seqDiffGroup"></div>
    <div id="seqRatioGroup"></div>
    <div id="sequencesSolution"></div>
    <button id="calculateSequence"></button>
    <button id="exportSequencesPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        generalFormula: "General formula",
        sequenceTerms: "Sequence terms",
        nthTermResult: "nth term",
        sumOfTerms: "Sum of terms"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    generateArithmeticSequence,
    generateGeometricSequence,
    generateFibonacciSequence
} = require('../../src/js/script.js');

describe('Arithmetic Sequence', () => {
    describe('Basic sequences', () => {
        test('should generate sequence 1, 3, 5, 7, 9 (a1=1, d=2, n=5)', () => {
            const result = generateArithmeticSequence(1, 2, 5);
            expect(result.terms).toEqual([1, 3, 5, 7, 9]);
        });

        test('should generate sequence 2, 5, 8, 11 (a1=2, d=3, n=4)', () => {
            const result = generateArithmeticSequence(2, 3, 4);
            expect(result.terms).toEqual([2, 5, 8, 11]);
        });

        test('should generate constant sequence when d=0', () => {
            const result = generateArithmeticSequence(5, 0, 4);
            expect(result.terms).toEqual([5, 5, 5, 5]);
        });
    });

    describe('nth term calculation', () => {
        test('should calculate correct nth term', () => {
            // a_n = a_1 + (n-1)*d
            const result = generateArithmeticSequence(1, 2, 10);
            expect(result.nthTerm).toBe(19); // 1 + 9*2 = 19
        });

        test('should calculate nth term for single element', () => {
            const result = generateArithmeticSequence(5, 3, 1);
            expect(result.nthTerm).toBe(5);
        });
    });

    describe('Sum calculation', () => {
        test('should calculate sum using formula S = n/2 * (2a + (n-1)d)', () => {
            // 1+3+5+7+9 = 25
            const result = generateArithmeticSequence(1, 2, 5);
            expect(result.sum).toBe(25);
        });

        test('should calculate sum of first 10 positive integers', () => {
            // 1+2+3+...+10 = 55
            const result = generateArithmeticSequence(1, 1, 10);
            expect(result.sum).toBe(55);
        });

        test('should calculate sum of first 100 positive integers', () => {
            // n(n+1)/2 = 100*101/2 = 5050
            const result = generateArithmeticSequence(1, 1, 100);
            expect(result.sum).toBe(5050);
        });
    });

    describe('Negative common difference', () => {
        test('should generate decreasing sequence', () => {
            const result = generateArithmeticSequence(10, -2, 5);
            expect(result.terms).toEqual([10, 8, 6, 4, 2]);
        });
    });

    describe('Formula generation', () => {
        test('should include correct formula', () => {
            const result = generateArithmeticSequence(3, 5, 10);
            expect(result.formula).toContain('3');
            expect(result.formula).toContain('5');
        });
    });
});

describe('Geometric Sequence', () => {
    describe('Basic sequences', () => {
        test('should generate sequence 2, 4, 8, 16, 32 (a1=2, r=2, n=5)', () => {
            const result = generateGeometricSequence(2, 2, 5);
            expect(result.terms).toEqual([2, 4, 8, 16, 32]);
        });

        test('should generate sequence 3, 9, 27, 81 (a1=3, r=3, n=4)', () => {
            const result = generateGeometricSequence(3, 3, 4);
            expect(result.terms).toEqual([3, 9, 27, 81]);
        });

        test('should generate constant sequence when r=1', () => {
            const result = generateGeometricSequence(5, 1, 4);
            expect(result.terms).toEqual([5, 5, 5, 5]);
        });
    });

    describe('nth term calculation', () => {
        test('should calculate correct nth term', () => {
            // a_n = a_1 * r^(n-1)
            const result = generateGeometricSequence(2, 3, 5);
            expect(result.nthTerm).toBe(162); // 2 * 3^4 = 162
        });
    });

    describe('Sum calculation', () => {
        test('should calculate sum using formula S = a(1-r^n)/(1-r)', () => {
            // 1+2+4+8+16 = 31
            const result = generateGeometricSequence(1, 2, 5);
            expect(result.sum).toBe(31);
        });

        test('should handle r=1 (sum = a*n)', () => {
            const result = generateGeometricSequence(5, 1, 4);
            expect(result.sum).toBe(20);
        });
    });

    describe('Fractional ratio', () => {
        test('should generate sequence with r < 1', () => {
            const result = generateGeometricSequence(16, 0.5, 5);
            expect(result.terms[0]).toBe(16);
            expect(result.terms[1]).toBe(8);
            expect(result.terms[2]).toBe(4);
            expect(result.terms[3]).toBe(2);
            expect(result.terms[4]).toBe(1);
        });
    });

    describe('Negative ratio', () => {
        test('should generate alternating sequence', () => {
            const result = generateGeometricSequence(1, -2, 5);
            expect(result.terms).toEqual([1, -2, 4, -8, 16]);
        });
    });
});

describe('Fibonacci Sequence', () => {
    describe('Basic sequence', () => {
        test('should generate first 10 Fibonacci numbers', () => {
            const result = generateFibonacciSequence(10);
            expect(result.terms).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
        });

        test('should generate first 5 Fibonacci numbers', () => {
            const result = generateFibonacciSequence(5);
            expect(result.terms).toEqual([0, 1, 1, 2, 3]);
        });

        test('should handle n=1', () => {
            const result = generateFibonacciSequence(1);
            expect(result.terms).toEqual([0]);
        });

        test('should handle n=2', () => {
            const result = generateFibonacciSequence(2);
            expect(result.terms).toEqual([0, 1]);
        });
    });

    describe('nth term', () => {
        test('should return correct nth term', () => {
            const result = generateFibonacciSequence(10);
            expect(result.nthTerm).toBe(34); // F(10) = 34 (0-indexed: F(9))
        });

        test('should calculate F(20)', () => {
            const result = generateFibonacciSequence(20);
            expect(result.nthTerm).toBe(4181);
        });
    });

    describe('Sum calculation', () => {
        test('should calculate sum of first 10 Fibonacci numbers', () => {
            const result = generateFibonacciSequence(10);
            // 0+1+1+2+3+5+8+13+21+34 = 88
            expect(result.sum).toBe(88);
        });
    });

    describe('Formula', () => {
        test('should have Fibonacci formula', () => {
            const result = generateFibonacciSequence(10);
            expect(result.formula).toContain('Fₙ');
        });
    });
});

describe('Mathematical Properties', () => {
    test('Arithmetic: difference between consecutive terms is constant', () => {
        const result = generateArithmeticSequence(5, 3, 10);
        for (let i = 1; i < result.terms.length; i++) {
            expect(result.terms[i] - result.terms[i-1]).toBe(3);
        }
    });

    test('Geometric: ratio between consecutive terms is constant', () => {
        const result = generateGeometricSequence(2, 3, 6);
        for (let i = 1; i < result.terms.length; i++) {
            expect(result.terms[i] / result.terms[i-1]).toBeCloseTo(3, 10);
        }
    });

    test('Fibonacci: each term is sum of two preceding terms', () => {
        const result = generateFibonacciSequence(15);
        for (let i = 2; i < result.terms.length; i++) {
            expect(result.terms[i]).toBe(result.terms[i-1] + result.terms[i-2]);
        }
    });
});
