const { isPrime, nextPrime, previousPrime, primesUpTo } = require('../../src/js/math/primes.js');

describe('isPrime', () => {
    test('small numbers', () => {
        expect([0, 1, 4, 6, 8, 9, 15, 21, 25, 27, 49].some(isPrime)).toBe(false);
        expect([2, 3, 5, 7, 11, 13, 97, 101].every(isPrime)).toBe(true);
    });

    test('negative numbers and non integers are not prime', () => {
        expect(isPrime(-7)).toBe(false);
        expect(isPrime(7.5)).toBe(false);
        expect(isPrime(NaN)).toBe(false);
        expect(isPrime(Infinity)).toBe(false);
        expect(isPrime(2 ** 60)).toBe(false);
    });

    test('agrees with a sieve up to 10000', () => {
        const primes = new Set(primesUpTo(10000));
        for (let n = 0; n <= 10000; n++) expect(isPrime(n)).toBe(primes.has(n));
    });

    test('known large primes and composites', () => {
        expect(isPrime(1000000007)).toBe(true);
        expect(isPrime(998244353)).toBe(true);
        expect(isPrime(2147483647)).toBe(true); // 2^31 - 1
        expect(isPrime(9007199254740881)).toBe(true); // largest prime below 2^53
        expect(isPrime(1000000007 * 3)).toBe(false);
    });

    test('strong pseudoprimes and Carmichael numbers are rejected', () => {
        [561, 1105, 1729, 2465, 2821, 6601, 3215031751].forEach(n => expect(isPrime(n)).toBe(false));
    });

    test('a 15 digit semiprime is rejected quickly', () => {
        const start = Date.now();
        expect(isPrime(94906249 * 94906247)).toBe(false); // ~9.0e15, close to the safe integer limit
        expect(Date.now() - start).toBeLessThan(500);
    });
});

describe('nextPrime and previousPrime', () => {
    test('next', () => {
        expect(nextPrime(-5)).toBe(2);
        expect(nextPrime(0)).toBe(2);
        expect(nextPrime(1)).toBe(2);
        expect(nextPrime(2)).toBe(3);
        expect(nextPrime(13)).toBe(17);
        expect(nextPrime(14)).toBe(17);
        expect(nextPrime(1000000000)).toBe(1000000007);
    });

    test('previous', () => {
        expect(previousPrime(2)).toBeNull();
        expect(previousPrime(3)).toBe(2);
        expect(previousPrime(4)).toBe(3);
        expect(previousPrime(20)).toBe(19);
        expect(previousPrime(1000000007)).toBe(999999937);
        expect(previousPrime(-3)).toBeNull();
    });

    test('they are inverses around a prime', () => {
        expect(previousPrime(nextPrime(100))).toBe(97);
    });
});

describe('primesUpTo', () => {
    test('small limits', () => {
        expect(primesUpTo(0)).toEqual([]);
        expect(primesUpTo(1)).toEqual([]);
        expect(primesUpTo(2)).toEqual([2]);
        expect(primesUpTo(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    });

    test('counts match known values', () => {
        expect(primesUpTo(100)).toHaveLength(25);
        expect(primesUpTo(10000)).toHaveLength(1229);
        expect(primesUpTo(100000)).toHaveLength(9592);
    });

    test('rejects invalid or huge limits', () => {
        expect(primesUpTo(-1)).toBeNull();
        expect(primesUpTo(2.5)).toBeNull();
        expect(primesUpTo(5000001)).toBeNull();
        expect(primesUpTo(NaN)).toBeNull();
    });

    test('the largest allowed limit finishes in reasonable time', () => {
        const start = Date.now();
        expect(primesUpTo(5000000)).toHaveLength(348513);
        expect(Date.now() - start).toBeLessThan(3000);
    });
});
