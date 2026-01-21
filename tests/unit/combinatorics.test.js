/**
 * Tests for Combinatorics Calculator
 * 
 * This test suite covers:
 * - Factorial calculations
 * - Permutations P(n,r)
 * - Combinations C(n,r)
 * - Edge cases and mathematical properties
 */

// Mock DOM elements
document.body.innerHTML = `
    <select id="combinatoricsOperation">
        <option value="factorial">Factorial</option>
        <option value="permutation">Permutation</option>
        <option value="combination">Combination</option>
    </select>
    <input type="number" id="combValueN" value="5">
    <input type="number" id="combValueR" value="3">
    <div id="combValueRGroup"></div>
    <div id="combinatoricsSolution"></div>
    <button id="calculateCombinatorics"></button>
    <button id="exportCombinatoricsPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        invalidNR: "n must be ≥ r and both must be non-negative",
        factorialResult: "n!",
        permutationResult: "P(n,r)",
        combinationResult: "C(n,r)"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    factorialBig,
    permutation,
    combination
} = require('../../src/js/index.js');

describe('Factorial', () => {
    describe('Basic factorial calculations', () => {
        test('should calculate 0! = 1', () => {
            expect(factorialBig(0)).toBe(1);
        });

        test('should calculate 1! = 1', () => {
            expect(factorialBig(1)).toBe(1);
        });

        test('should calculate small factorials correctly', () => {
            expect(factorialBig(2)).toBe(2);
            expect(factorialBig(3)).toBe(6);
            expect(factorialBig(4)).toBe(24);
            expect(factorialBig(5)).toBe(120);
        });

        test('should calculate medium factorials correctly', () => {
            expect(factorialBig(10)).toBe(3628800);
            expect(factorialBig(12)).toBe(479001600);
        });

        test('should calculate larger factorials', () => {
            expect(factorialBig(15)).toBe(1307674368000);
            expect(factorialBig(20)).toBe(2432902008176640000);
        });
    });

    describe('Edge cases', () => {
        test('should return null for negative numbers', () => {
            expect(factorialBig(-1)).toBeNull();
            expect(factorialBig(-5)).toBeNull();
        });
    });
});

describe('Permutation P(n,r)', () => {
    describe('Basic permutation calculations', () => {
        test('should calculate P(5,3) = 60', () => {
            // 5!/(5-3)! = 120/2 = 60
            expect(permutation(5, 3)).toBe(60);
        });

        test('should calculate P(n,0) = 1', () => {
            expect(permutation(5, 0)).toBe(1);
            expect(permutation(10, 0)).toBe(1);
        });

        test('should calculate P(n,1) = n', () => {
            expect(permutation(5, 1)).toBe(5);
            expect(permutation(10, 1)).toBe(10);
        });

        test('should calculate P(n,n) = n!', () => {
            expect(permutation(5, 5)).toBe(factorialBig(5));
            expect(permutation(7, 7)).toBe(factorialBig(7));
        });

        test('should calculate various permutations', () => {
            expect(permutation(10, 2)).toBe(90);  // 10*9
            expect(permutation(10, 3)).toBe(720); // 10*9*8
            expect(permutation(8, 4)).toBe(1680); // 8*7*6*5
        });
    });

    describe('Edge cases', () => {
        test('should return null when r > n', () => {
            expect(permutation(3, 5)).toBeNull();
            expect(permutation(5, 10)).toBeNull();
        });

        test('should return null for negative values', () => {
            expect(permutation(-1, 2)).toBeNull();
            expect(permutation(5, -1)).toBeNull();
        });

        test('should handle P(0,0) = 1', () => {
            expect(permutation(0, 0)).toBe(1);
        });
    });
});

describe('Combination C(n,r)', () => {
    describe('Basic combination calculations', () => {
        test('should calculate C(5,3) = 10', () => {
            // 5!/(3!*2!) = 120/(6*2) = 10
            expect(combination(5, 3)).toBe(10);
        });

        test('should calculate C(n,0) = 1', () => {
            expect(combination(5, 0)).toBe(1);
            expect(combination(100, 0)).toBe(1);
        });

        test('should calculate C(n,1) = n', () => {
            expect(combination(5, 1)).toBe(5);
            expect(combination(10, 1)).toBe(10);
        });

        test('should calculate C(n,n) = 1', () => {
            expect(combination(5, 5)).toBe(1);
            expect(combination(10, 10)).toBe(1);
        });

        test('should calculate various combinations', () => {
            expect(combination(10, 2)).toBe(45);
            expect(combination(10, 5)).toBe(252);
            expect(combination(52, 5)).toBe(2598960); // Poker hands
        });
    });

    describe('Symmetry property: C(n,r) = C(n,n-r)', () => {
        test('should satisfy symmetry for various values', () => {
            expect(combination(10, 3)).toBe(combination(10, 7));
            expect(combination(20, 5)).toBe(combination(20, 15));
            expect(combination(8, 2)).toBe(combination(8, 6));
        });
    });

    describe("Pascal's Triangle Identity: C(n,r) = C(n-1,r-1) + C(n-1,r)", () => {
        test("should satisfy Pascal's identity", () => {
            // C(5,3) = C(4,2) + C(4,3)
            expect(combination(5, 3)).toBe(combination(4, 2) + combination(4, 3));
            
            // C(10,4) = C(9,3) + C(9,4)
            expect(combination(10, 4)).toBe(combination(9, 3) + combination(9, 4));
        });
    });

    describe('Edge cases', () => {
        test('should return null when r > n', () => {
            expect(combination(3, 5)).toBeNull();
        });

        test('should return null for negative values', () => {
            expect(combination(-1, 2)).toBeNull();
            expect(combination(5, -1)).toBeNull();
        });

        test('should handle C(0,0) = 1', () => {
            expect(combination(0, 0)).toBe(1);
        });
    });
});

describe('Relationship between P and C', () => {
    test('P(n,r) = C(n,r) * r!', () => {
        expect(permutation(10, 3)).toBe(combination(10, 3) * factorialBig(3));
        expect(permutation(8, 4)).toBe(combination(8, 4) * factorialBig(4));
    });

    test('C(n,r) = P(n,r) / r!', () => {
        expect(combination(10, 3)).toBe(permutation(10, 3) / factorialBig(3));
    });
});

describe('Binomial Theorem: Sum of C(n,k) from k=0 to n equals 2^n', () => {
    test('sum of row in Pascal triangle equals power of 2', () => {
        for (let n = 0; n <= 10; n++) {
            let sum = 0;
            for (let k = 0; k <= n; k++) {
                sum += combination(n, k);
            }
            expect(sum).toBe(Math.pow(2, n));
        }
    });
});
