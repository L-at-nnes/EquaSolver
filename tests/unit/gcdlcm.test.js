/**
 * Tests for GCD and LCM Calculator
 */

// Mock DOM elements
document.body.innerHTML = `
    <input type="text" id="gcdlcmInput">
    <div id="gcdlcmSolution"></div>
    <button id="calculateGcdLcm"></button>
    <button id="exportGcdLcmPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        enterNumbers: "Enter numbers",
        gcdlcmError: "Please enter at least 2 positive integers",
        numbers: "Numbers",
        gcdResult: "GCD",
        lcmResult: "LCM",
        primeFactorizations: "Prime Factorizations"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    gcd,
    lcm,
    gcdMultiple,
    lcmMultiple,
    primeFactorization,
    formatFactorization
} = require('../../src/js/index.js');

describe('GCD (Greatest Common Divisor)', () => {
    test('should calculate GCD of two numbers', () => {
        expect(gcd(12, 18)).toBe(6);
    });

    test('should calculate GCD of coprime numbers', () => {
        expect(gcd(7, 13)).toBe(1);
    });

    test('should calculate GCD when one number is multiple of other', () => {
        expect(gcd(15, 5)).toBe(5);
    });

    test('should calculate GCD of equal numbers', () => {
        expect(gcd(8, 8)).toBe(8);
    });

    test('should handle GCD with 1', () => {
        expect(gcd(1, 10)).toBe(1);
    });

    test('should handle GCD with 0', () => {
        expect(gcd(5, 0)).toBe(5);
        expect(gcd(0, 5)).toBe(5);
    });

    test('should handle negative numbers', () => {
        expect(gcd(-12, 18)).toBe(6);
        expect(gcd(12, -18)).toBe(6);
        expect(gcd(-12, -18)).toBe(6);
    });

    test('should calculate GCD of large numbers', () => {
        expect(gcd(48, 180)).toBe(12);
        expect(gcd(1071, 462)).toBe(21);
    });
});

describe('LCM (Least Common Multiple)', () => {
    test('should calculate LCM of two numbers', () => {
        expect(lcm(4, 6)).toBe(12);
    });

    test('should calculate LCM of coprime numbers', () => {
        expect(lcm(7, 13)).toBe(91);
    });

    test('should calculate LCM when one number is multiple of other', () => {
        expect(lcm(5, 15)).toBe(15);
    });

    test('should calculate LCM of equal numbers', () => {
        expect(lcm(8, 8)).toBe(8);
    });

    test('should handle LCM with 1', () => {
        expect(lcm(1, 10)).toBe(10);
    });

    test('should handle LCM with 0', () => {
        expect(lcm(5, 0)).toBe(0);
        expect(lcm(0, 5)).toBe(0);
    });

    test('should calculate LCM of large numbers', () => {
        expect(lcm(12, 18)).toBe(36);
        expect(lcm(21, 6)).toBe(42);
    });
});

describe('GCD of multiple numbers', () => {
    test('should calculate GCD of three numbers', () => {
        expect(gcdMultiple([12, 18, 24])).toBe(6);
    });

    test('should calculate GCD of four numbers', () => {
        expect(gcdMultiple([8, 12, 16, 20])).toBe(4);
    });

    test('should handle single number', () => {
        expect(gcdMultiple([15])).toBe(15);
    });

    test('should handle empty array', () => {
        expect(gcdMultiple([])).toBe(0);
    });

    test('should calculate GCD with coprime set', () => {
        expect(gcdMultiple([7, 11, 13])).toBe(1);
    });
});

describe('LCM of multiple numbers', () => {
    test('should calculate LCM of three numbers', () => {
        expect(lcmMultiple([4, 6, 8])).toBe(24);
    });

    test('should calculate LCM of four numbers', () => {
        expect(lcmMultiple([2, 3, 4, 5])).toBe(60);
    });

    test('should handle single number', () => {
        expect(lcmMultiple([15])).toBe(15);
    });

    test('should handle empty array', () => {
        expect(lcmMultiple([])).toBe(0);
    });
});

describe('Prime Factorization', () => {
    test('should factorize a prime number', () => {
        expect(primeFactorization(7)).toEqual({ 7: 1 });
    });

    test('should factorize a composite number', () => {
        expect(primeFactorization(12)).toEqual({ 2: 2, 3: 1 });
    });

    test('should factorize a perfect square', () => {
        expect(primeFactorization(36)).toEqual({ 2: 2, 3: 2 });
    });

    test('should factorize a power of 2', () => {
        expect(primeFactorization(32)).toEqual({ 2: 5 });
    });

    test('should factorize 1', () => {
        expect(primeFactorization(1)).toEqual({});
    });

    test('should factorize 0', () => {
        expect(primeFactorization(0)).toEqual({});
    });

    test('should handle negative numbers', () => {
        expect(primeFactorization(-12)).toEqual({ 2: 2, 3: 1 });
    });

    test('should factorize large numbers', () => {
        expect(primeFactorization(100)).toEqual({ 2: 2, 5: 2 });
        expect(primeFactorization(360)).toEqual({ 2: 3, 3: 2, 5: 1 });
    });
});

describe('Format Factorization', () => {
    test('should format single prime', () => {
        expect(formatFactorization({ 7: 1 })).toBe('7');
    });

    test('should format multiple primes', () => {
        expect(formatFactorization({ 2: 2, 3: 1 })).toBe('2^2 x 3');
    });

    test('should format with exponents', () => {
        expect(formatFactorization({ 2: 3, 3: 2, 5: 1 })).toBe('2^3 x 3^2 x 5');
    });

    test('should format empty factorization', () => {
        expect(formatFactorization({})).toBe('1');
    });
});

describe('GCD/LCM relationship', () => {
    test('GCD * LCM = product of two numbers', () => {
        const a = 12, b = 18;
        expect(gcd(a, b) * lcm(a, b)).toBe(a * b);
    });

    test('GCD divides both numbers', () => {
        const a = 48, b = 36;
        const g = gcd(a, b);
        expect(a % g).toBe(0);
        expect(b % g).toBe(0);
    });

    test('Both numbers divide LCM', () => {
        const a = 12, b = 15;
        const l = lcm(a, b);
        expect(l % a).toBe(0);
        expect(l % b).toBe(0);
    });
});

describe('Edge cases', () => {
    test('should handle floating point numbers by flooring', () => {
        expect(gcd(12.7, 18.9)).toBe(6);
        expect(lcm(4.5, 6.8)).toBe(12);
    });

    test('should calculate GCD of consecutive numbers', () => {
        expect(gcd(100, 101)).toBe(1);
    });

    test('should calculate LCM of consecutive numbers', () => {
        expect(lcm(100, 101)).toBe(10100);
    });
});

describe('Real-world examples', () => {
    test('should find GCD for simplifying fractions', () => {
        // To simplify 24/36, find GCD(24, 36) = 12
        // Result: 24/12 = 2, 36/12 = 3, so 24/36 = 2/3
        expect(gcd(24, 36)).toBe(12);
    });

    test('should find LCM for adding fractions', () => {
        // To add 1/4 + 1/6, find LCM(4, 6) = 12
        expect(lcm(4, 6)).toBe(12);
    });

    test('should find LCM for scheduling problems', () => {
        // If event A happens every 3 days and B every 5 days
        // They coincide every LCM(3, 5) = 15 days
        expect(lcm(3, 5)).toBe(15);
    });

    test('should factorize common numbers correctly', () => {
        expect(primeFactorization(60)).toEqual({ 2: 2, 3: 1, 5: 1 });
        expect(primeFactorization(84)).toEqual({ 2: 2, 3: 1, 7: 1 });
        expect(primeFactorization(120)).toEqual({ 2: 3, 3: 1, 5: 1 });
    });
});

describe('Large number handling', () => {
    test('should handle moderately large numbers', () => {
        expect(gcd(1000, 1500)).toBe(500);
        expect(lcm(1000, 1500)).toBe(3000);
    });

    test('should calculate GCD of multiple large numbers', () => {
        expect(gcdMultiple([100, 200, 300, 400])).toBe(100);
    });

    test('should calculate LCM of multiple numbers', () => {
        expect(lcmMultiple([3, 4, 5, 6])).toBe(60);
    });
});

describe('Special mathematical properties', () => {
    test('GCD is commutative', () => {
        expect(gcd(12, 18)).toBe(gcd(18, 12));
    });

    test('LCM is commutative', () => {
        expect(lcm(12, 18)).toBe(lcm(18, 12));
    });

    test('GCD is associative', () => {
        const a = 12, b = 18, c = 24;
        expect(gcd(gcd(a, b), c)).toBe(gcd(a, gcd(b, c)));
    });

    test('LCM is associative', () => {
        const a = 4, b = 6, c = 8;
        expect(lcm(lcm(a, b), c)).toBe(lcm(a, lcm(b, c)));
    });

    test('GCD of a number with itself is the number', () => {
        expect(gcd(42, 42)).toBe(42);
    });

    test('LCM of a number with itself is the number', () => {
        expect(lcm(42, 42)).toBe(42);
    });
});
