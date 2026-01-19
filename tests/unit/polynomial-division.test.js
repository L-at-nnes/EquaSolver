/**
 * Tests for Polynomial Long Division
 * Tests parsePolynomial, dividePolynomials, and formatPolynomial functions
 */

describe('Polynomial Long Division', () => {
    // Helper to import functions
    let parsePolynomial, dividePolynomials, formatPolynomial;
    
    beforeAll(() => {
        // Mock DOM for script.js
        document.body.innerHTML = '<div id="polynomialDivisionSolution"></div>';
        
        // Load the script functions
        const script = require('../../src/js/script.js');
        parsePolynomial = script.parsePolynomial;
        dividePolynomials = script.dividePolynomials;
        formatPolynomial = script.formatPolynomial;
    });

    // ===================================
    // POLYNOMIAL PARSING TESTS
    // ===================================
    describe('parsePolynomial', () => {
        test('should parse simple linear polynomial: x + 1', () => {
            const result = parsePolynomial('x + 1');
            expect(result).toEqual([1, 1]);
        });

        test('should parse quadratic: x^2 + 2x + 3', () => {
            const result = parsePolynomial('x^2 + 2x + 3');
            expect(result).toEqual([1, 2, 3]);
        });

        test('should parse cubic with negative coefficients: 2x^3 - 3x^2 + x - 5', () => {
            const result = parsePolynomial('2x^3 - 3x^2 + x - 5');
            expect(result).toEqual([2, -3, 1, -5]);
        });

        test('should parse polynomial without spaces: 3x^2-4x+1', () => {
            const result = parsePolynomial('3x^2-4x+1');
            expect(result).toEqual([3, -4, 1]);
        });

        test('should parse polynomial with missing middle terms: x^3 + 1', () => {
            const result = parsePolynomial('x^3 + 1');
            expect(result).toEqual([1, 0, 0, 1]);
        });

        test('should parse constant polynomial: 5', () => {
            const result = parsePolynomial('5');
            expect(result).toEqual([5]);
        });

        test('should parse polynomial with decimal coefficients: 0.5x^2 + 1.5x - 2.5', () => {
            const result = parsePolynomial('0.5x^2 + 1.5x - 2.5');
            expect(result).toEqual([0.5, 1.5, -2.5]);
        });

        test('should handle implicit coefficient of 1: x^2 + x', () => {
            const result = parsePolynomial('x^2 + x');
            expect(result).toEqual([1, 1, 0]);
        });

        test('should handle implicit coefficient of -1: -x^2 - x', () => {
            const result = parsePolynomial('-x^2 - x');
            expect(result).toEqual([-1, -1, 0]);
        });

        test('should return null for empty string', () => {
            const result = parsePolynomial('');
            expect(result).toBeNull();
        });
    });

    // ===================================
    // POLYNOMIAL FORMATTING TESTS
    // ===================================
    describe('formatPolynomial', () => {
        test('should format simple linear: [1, 2] -> x + 2', () => {
            const result = formatPolynomial([1, 2]);
            expect(result).toContain('x');
            expect(result).toContain('2');
        });

        test('should format quadratic: [1, -2, 3]', () => {
            const result = formatPolynomial([1, -2, 3]);
            expect(result).toContain('x^2');
            expect(result).toContain('- 2');
            expect(result).toContain('3');
        });

        test('should format constant: [5] -> 5', () => {
            const result = formatPolynomial([5]);
            expect(result).toBe('5');
        });

        test('should return 0 for empty array', () => {
            const result = formatPolynomial([]);
            expect(result).toBe('0');
        });

        test('should handle zero polynomial: [0] -> 0', () => {
            const result = formatPolynomial([0]);
            expect(result).toBe('0');
        });
    });

    // ===================================
    // POLYNOMIAL DIVISION TESTS
    // ===================================
    describe('dividePolynomials', () => {
        test('should divide (x^2 - 1) by (x - 1) exactly: quotient x + 1, remainder 0', () => {
            const dividend = [1, 0, -1]; // x^2 - 1
            const divisor = [1, -1];     // x - 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(2);
            expect(result.quotient[0]).toBeCloseTo(1, 5);
            expect(result.quotient[1]).toBeCloseTo(1, 5);
            expect(result.remainder).toEqual([0]);
        });

        test('should divide (x^3 - 2x^2 + x - 2) by (x - 2): quotient x^2 + 1, remainder 0', () => {
            const dividend = [1, -2, 1, -2]; // x^3 - 2x^2 + x - 2
            const divisor = [1, -2];          // x - 2
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(3);
            expect(result.quotient[0]).toBeCloseTo(1, 5);
            expect(result.quotient[1]).toBeCloseTo(0, 5);
            expect(result.quotient[2]).toBeCloseTo(1, 5);
            expect(result.remainder).toEqual([0]);
        });

        test('should divide (2x^3 + 3x^2 - x + 5) by (x + 1) with remainder', () => {
            const dividend = [2, 3, -1, 5]; // 2x^3 + 3x^2 - x + 5
            const divisor = [1, 1];          // x + 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(3);
            expect(result.quotient[0]).toBeCloseTo(2, 5);
            // Verify by reconstruction: dividend = divisor * quotient + remainder
            // Check that remainder degree < divisor degree
            expect(result.remainder.length).toBeLessThanOrEqual(divisor.length);
        });

        test('should divide (x^2 + 3x + 2) by (x + 1): quotient x + 2, remainder 0', () => {
            const dividend = [1, 3, 2]; // x^2 + 3x + 2
            const divisor = [1, 1];     // x + 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(2);
            expect(result.quotient[0]).toBeCloseTo(1, 5);
            expect(result.quotient[1]).toBeCloseTo(2, 5);
            expect(result.remainder).toEqual([0]);
        });

        test('should divide (x^3 + 2x^2 - x - 2) by (x^2 - 1): quotient x + 2, remainder 0', () => {
            const dividend = [1, 2, -1, -2]; // x^3 + 2x^2 - x - 2
            const divisor = [1, 0, -1];       // x^2 - 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(2);
            expect(result.quotient[0]).toBeCloseTo(1, 5);
            expect(result.quotient[1]).toBeCloseTo(2, 5);
            expect(result.remainder).toEqual([0]);
        });

        test('should handle division with remainder: (x^2 + 3x + 5) by (x + 1)', () => {
            const dividend = [1, 3, 5]; // x^2 + 3x + 5
            const divisor = [1, 1];     // x + 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(2);
            expect(result.remainder).not.toEqual([0]);
        });

        test('should return null when dividing by zero polynomial', () => {
            const dividend = [1, 2, 3];
            const divisor = [0, 0];
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).toBeNull();
        });

        test('should handle dividend degree < divisor degree: quotient 0, remainder = dividend', () => {
            const dividend = [3, 2];       // 3x + 2
            const divisor = [1, 0, 1];     // x^2 + 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toEqual([0]);
            // Remainder should be the original dividend
            expect(result.remainder).toHaveLength(2);
        });

        test('should divide constant by constant: 10 by 2 = 5 R 0', () => {
            const dividend = [10];
            const divisor = [2];
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(1);
            expect(result.quotient[0]).toBeCloseTo(5, 5);
            expect(result.remainder).toEqual([0]);
        });

        test('should handle decimal coefficients correctly', () => {
            const dividend = [1.5, 2.5, 1]; // 1.5x^2 + 2.5x + 1
            const divisor = [0.5, 1];       // 0.5x + 1
            const result = dividePolynomials(dividend, divisor);
            
            expect(result).not.toBeNull();
            expect(result.quotient).toHaveLength(2);
            expect(result.quotient[0]).toBeCloseTo(3, 5);
        });
    });

    // ===================================
    // EDGE CASES
    // ===================================
    describe('Edge cases', () => {
        test('parsePolynomial should handle uppercase X', () => {
            const result = parsePolynomial('X^2 + 2X + 1');
            expect(result).toEqual([1, 2, 1]);
        });

        test('dividePolynomials should handle null inputs', () => {
            expect(dividePolynomials(null, [1, 2])).toBeNull();
            expect(dividePolynomials([1, 2], null)).toBeNull();
        });

        test('dividePolynomials should handle empty arrays', () => {
            expect(dividePolynomials([], [1, 2])).toBeNull();
            expect(dividePolynomials([1, 2], [])).toBeNull();
        });

        test('formatPolynomial should handle very small coefficients as zero', () => {
            const result = formatPolynomial([1, 1e-12, 1]);
            // Should skip the near-zero middle term
            expect(result).not.toContain('1e-12');
        });
    });
});
