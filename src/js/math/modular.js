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

function modularPower(base, exp, mod) {
    if (mod === 1) return 0;
    let result = 1;
    base = modulo(base, mod);
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = modulo(result * base, mod);
        }
        exp = Math.floor(exp / 2);
        base = modulo(base * base, mod);
    }
    return result;
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