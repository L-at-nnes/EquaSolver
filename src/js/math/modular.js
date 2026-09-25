// ===================================
// MODULAR ARITHMETIC
// ===================================

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function modularInverse(a, n) {
    let [oldR, r] = [a, n];
    let [oldS, s] = [1, 0];
    
    while (r !== 0) {
        const quotient = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - quotient * r];
        [oldS, s] = [s, oldS - quotient * s];
    }
    
    if (oldR !== 1) return null;
    return modulo(oldS, n);
}

// Uses BigInt for the intermediate products: result * base overflows 2^53 for
// moduli above ~9.4e7 and silently returns wrong answers with plain numbers.
function modularPower(base, exp, mod) {
    if (mod === 1) return 0;
    if (exp < 0) {
        const inverse = modularInverse(base, mod);
        if (inverse === null) return null;
        base = inverse;
        exp = -exp;
    }
    const m = BigInt(mod);
    let result = 1n;
    let b = BigInt(modulo(base, mod));
    let e = BigInt(Math.floor(exp));
    while (e > 0n) {
        if (e % 2n === 1n) {
            result = (result * b) % m;
        }
        e = e / 2n;
        b = (b * b) % m;
    }
    return Number(result);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        modulo,
        modularInverse,
        modularPower
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.modulo = modulo;
    window.modularInverse = modularInverse;
    window.modularPower = modularPower;
}