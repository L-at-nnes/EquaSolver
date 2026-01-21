// ===================================
// GCD AND LCM CALCULATOR
// ===================================

function gcd(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.floor(a) * Math.floor(b)) / gcd(a, b);
}

function gcdMultiple(numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.length === 1) return Math.abs(Math.floor(numbers[0]));
    return numbers.reduce((acc, num) => gcd(acc, num));
}

function lcmMultiple(numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.length === 1) return Math.abs(Math.floor(numbers[0]));
    return numbers.reduce((acc, num) => lcm(acc, num));
}

function primeFactorization(n) {
    n = Math.abs(Math.floor(n));
    if (n <= 1) return {};
    
    const factors = {};
    let divisor = 2;
    
    while (n >= 2) {
        if (n % divisor === 0) {
            factors[divisor] = (factors[divisor] || 0) + 1;
            n = n / divisor;
        } else {
            divisor++;
        }
    }
    
    return factors;
}

function formatFactorization(factors) {
    if (Object.keys(factors).length === 0) return '1';
    return Object.entries(factors)
        .map(([prime, exp]) => exp > 1 ? `${prime}^${exp}` : prime)
        .join(' x ');
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gcd,
        lcm,
        gcdMultiple,
        lcmMultiple,
        primeFactorization,
        formatFactorization
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.gcd = gcd;
    window.lcm = lcm;
    window.gcdMultiple = gcdMultiple;
    window.lcmMultiple = lcmMultiple;
    window.primeFactorization = primeFactorization;
    window.formatFactorization = formatFactorization;
}