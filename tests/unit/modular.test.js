/**
 * Tests for Modular Arithmetic Calculator
 * 
 * This test suite covers:
 * - Modulo operation with positive and negative numbers
 * - Modular inverse calculation using Extended Euclidean Algorithm
 * - Modular exponentiation (fast power algorithm)
 * - Edge cases and error handling
 */

// Mock DOM elements
document.body.innerHTML = `
    <select id="modularOperation">
        <option value="modulo">Modulo</option>
        <option value="inverse">Inverse</option>
        <option value="power">Power</option>
    </select>
    <input type="number" id="modValueA" value="7">
    <input type="number" id="modValueB" value="3">
    <input type="number" id="modValueN" value="11">
    <div id="modValueBGroup"></div>
    <div id="modularSolution"></div>
    <button id="calculateModular"></button>
    <button id="exportModularPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        noModInverse: "No modular inverse exists",
        moduloResult: "a mod n",
        modInverseResult: "Modular Inverse",
        modPowerResult: "a^b mod n",
        verification: "Verification"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    modulo,
    modularInverse,
    modularPower
} = require('../../src/js/script.js');

describe('Modulo Operation', () => {
    describe('Basic modulo', () => {
        test('should calculate modulo of positive numbers', () => {
            expect(modulo(17, 5)).toBe(2);
            expect(modulo(25, 7)).toBe(4);
            expect(modulo(100, 10)).toBe(0);
        });

        test('should handle when dividend is smaller than divisor', () => {
            expect(modulo(3, 7)).toBe(3);
            expect(modulo(1, 100)).toBe(1);
        });

        test('should handle negative dividends correctly', () => {
            // Python-style modulo: result always has same sign as divisor
            expect(modulo(-17, 5)).toBe(3);
            expect(modulo(-1, 7)).toBe(6);
            expect(modulo(-10, 3)).toBe(2);
        });

        test('should handle zero dividend', () => {
            expect(modulo(0, 5)).toBe(0);
            expect(modulo(0, 100)).toBe(0);
        });

        test('should handle large numbers', () => {
            expect(modulo(1000000007, 1000000)).toBe(7);
            expect(modulo(123456789, 1000)).toBe(789);
        });
    });

    describe('Edge cases', () => {
        test('should return 0 when dividend equals divisor', () => {
            expect(modulo(5, 5)).toBe(0);
            expect(modulo(100, 100)).toBe(0);
        });

        test('should handle modulo 1', () => {
            expect(modulo(17, 1)).toBe(0);
            expect(modulo(0, 1)).toBe(0);
        });
    });
});

describe('Modular Inverse', () => {
    describe('Basic inverse calculations', () => {
        test('should find modular inverse when it exists', () => {
            // 3 * 4 ≡ 1 (mod 11)
            expect(modularInverse(3, 11)).toBe(4);
            // Verify: 3 * 4 mod 11 = 12 mod 11 = 1
            expect(modulo(3 * 4, 11)).toBe(1);
        });

        test('should find inverse for coprime numbers', () => {
            // 7 * 8 ≡ 1 (mod 11)
            expect(modularInverse(7, 11)).toBe(8);
            expect(modulo(7 * modularInverse(7, 11), 11)).toBe(1);
        });

        test('should find inverse for larger primes', () => {
            const inv = modularInverse(17, 43);
            expect(modulo(17 * inv, 43)).toBe(1);
        });
    });

    describe('Non-existent inverses', () => {
        test('should return null when gcd(a, n) != 1', () => {
            expect(modularInverse(6, 9)).toBeNull(); // gcd(6,9) = 3
            expect(modularInverse(4, 8)).toBeNull(); // gcd(4,8) = 4
            expect(modularInverse(10, 15)).toBeNull(); // gcd(10,15) = 5
        });

        test('should return null for zero', () => {
            expect(modularInverse(0, 11)).toBeNull();
        });
    });

    describe('Special cases', () => {
        test('should find inverse of 1 (always 1)', () => {
            expect(modularInverse(1, 7)).toBe(1);
            expect(modularInverse(1, 100)).toBe(1);
        });

        test('should handle negative numbers', () => {
            const inv = modularInverse(-3, 11);
            expect(modulo(-3 * inv, 11)).toBe(1);
        });
    });
});

describe('Modular Exponentiation', () => {
    describe('Basic power calculations', () => {
        test('should calculate simple powers', () => {
            expect(modularPower(2, 3, 5)).toBe(3); // 8 mod 5 = 3
            expect(modularPower(3, 4, 7)).toBe(4); // 81 mod 7 = 4
        });

        test('should handle power of 0', () => {
            expect(modularPower(5, 0, 7)).toBe(1);
            expect(modularPower(100, 0, 13)).toBe(1);
        });

        test('should handle power of 1', () => {
            expect(modularPower(7, 1, 11)).toBe(7);
            expect(modularPower(15, 1, 8)).toBe(7); // 15 mod 8 = 7
        });

        test('should handle base of 0', () => {
            expect(modularPower(0, 5, 7)).toBe(0);
        });

        test('should handle base of 1', () => {
            expect(modularPower(1, 1000, 7)).toBe(1);
        });
    });

    describe('Large exponents (tests fast exponentiation)', () => {
        test('should handle large exponents efficiently', () => {
            // Fermat little theorem: a^(p-1) ≡ 1 (mod p) for prime p
            expect(modularPower(2, 10, 11)).toBe(1); // 2^10 mod 11
            expect(modularPower(3, 100, 7)).toBe(4);
        });

        test('should handle very large exponents', () => {
            // 2^1000 mod 13
            const result = modularPower(2, 1000, 13);
            expect(result).toBeGreaterThanOrEqual(0);
            expect(result).toBeLessThan(13);
        });

        test('should calculate RSA-style operations', () => {
            // Small RSA example: n = 33, e = 7
            expect(modularPower(2, 7, 33)).toBe(29);
        });
    });

    describe('Edge cases', () => {
        test('should return 0 when modulus is 1', () => {
            expect(modularPower(5, 3, 1)).toBe(0);
        });

        test('should handle large bases', () => {
            expect(modularPower(1000000, 2, 7)).toBe(modulo(1000000 * 1000000, 7));
        });
    });
});

describe('Mathematical Properties', () => {
    test('inverse of inverse equals original', () => {
        const a = 7;
        const n = 11;
        const inv = modularInverse(a, n);
        const invInv = modularInverse(inv, n);
        expect(invInv).toBe(a);
    });

    test('(a * b) mod n = ((a mod n) * (b mod n)) mod n', () => {
        const a = 123;
        const b = 456;
        const n = 17;
        expect(modulo(a * b, n)).toBe(modulo(modulo(a, n) * modulo(b, n), n));
    });

    test('a^(p-1) ≡ 1 (mod p) for prime p (Fermat)', () => {
        const primes = [7, 11, 13, 17, 19];
        const a = 3;
        primes.forEach(p => {
            expect(modularPower(a, p - 1, p)).toBe(1);
        });
    });
});
