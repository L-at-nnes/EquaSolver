// ===================================
// PRIME NUMBERS
// ===================================

const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

function modPowBig(base, exponent, modulus) {
    let result = 1n;
    base %= modulus;
    while (exponent > 0n) {
        if (exponent & 1n) result = (result * base) % modulus;
        exponent >>= 1n;
        base = (base * base) % modulus;
    }
    return result;
}

/**
 * Deterministic Miller-Rabin: the first twelve primes as witnesses are exact for every
 * n below 3.3e24, which covers all safe integers. Fast even for 15 digit numbers where
 * trial division would take far too long.
 * @param {number} n
 * @returns {boolean} true for primes; false for composites, 0, 1, negatives and non integers
 */
function isPrime(n) {
    if (!Number.isSafeInteger(n) || n < 2) return false;
    for (const p of SMALL_PRIMES) {
        if (n === p) return true;
        if (n % p === 0) return false;
    }
    const big = BigInt(n);
    let d = big - 1n;
    let r = 0;
    while ((d & 1n) === 0n) {
        d >>= 1n;
        r++;
    }
    witness: for (const a of SMALL_PRIMES) {
        let x = modPowBig(BigInt(a), d, big);
        if (x === 1n || x === big - 1n) continue;
        for (let i = 1; i < r; i++) {
            x = (x * x) % big;
            if (x === big - 1n) continue witness;
        }
        return false;
    }
    return true;
}

/** Smallest prime strictly greater than n, or null past the largest safe integer. */
function nextPrime(n) {
    let candidate = Math.floor(n) + 1;
    if (candidate <= 2) return 2;
    if (candidate % 2 === 0) candidate++;
    while (Number.isSafeInteger(candidate)) {
        if (isPrime(candidate)) return candidate;
        candidate += 2;
    }
    return null;
}

/** Largest prime strictly less than n, or null when there is none (n <= 2). */
function previousPrime(n) {
    let candidate = Math.ceil(n) - 1;
    if (candidate < 2) return null;
    if (candidate === 2) return 2;
    if (candidate % 2 === 0) candidate--;
    while (candidate >= 3) {
        if (isPrime(candidate)) return candidate;
        candidate -= 2;
    }
    return 2;
}

/**
 * All primes up to and including limit (sieve of Eratosthenes).
 * @param {number} limit integer between 0 and 5,000,000
 * @returns {number[]|null} null when the limit is out of range
 */
function primesUpTo(limit) {
    if (!Number.isInteger(limit) || limit < 0 || limit > 5000000) return null;
    if (limit < 2) return [];
    const composite = new Uint8Array(limit + 1);
    const primes = [];
    for (let i = 2; i <= limit; i++) {
        if (composite[i]) continue;
        primes.push(i);
        if (i * i <= limit) {
            for (let j = i * i; j <= limit; j += i) composite[j] = 1;
        }
    }
    return primes;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isPrime, nextPrime, previousPrime, primesUpTo };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.isPrime = isPrime;
    window.nextPrime = nextPrime;
    window.previousPrime = previousPrime;
    window.primesUpTo = primesUpTo;
}
