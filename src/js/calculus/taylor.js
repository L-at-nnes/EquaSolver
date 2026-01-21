// ===================================
// TAYLOR SERIES
// ===================================

// Local factorialBig function for module independence
function factorialBig(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function taylorSin(x, a, n) {
    let result = 0;
    for (let k = 0; k < n; k++) {
        const term = Math.pow(-1, k) * Math.pow(x - a, 2*k + 1) / factorialBig(2*k + 1);
        result += term;
    }
    return result;
}

function taylorCos(x, a, n) {
    let result = 0;
    for (let k = 0; k < n; k++) {
        const term = Math.pow(-1, k) * Math.pow(x - a, 2*k) / factorialBig(2*k);
        result += term;
    }
    return result;
}

function taylorExp(x, a, n) {
    let result = 0;
    const ea = Math.exp(a);
    for (let k = 0; k < n; k++) {
        result += ea * Math.pow(x - a, k) / factorialBig(k);
    }
    return result;
}

function taylorLn(x, a, n) {
    if (a !== 0) return NaN;
    let result = 0;
    for (let k = 1; k <= n; k++) {
        result += Math.pow(-1, k + 1) * Math.pow(x, k) / k;
    }
    return result;
}

function taylorAtan(x, a, n) {
    if (a !== 0) return NaN;
    let result = 0;
    for (let k = 0; k < n; k++) {
        result += Math.pow(-1, k) * Math.pow(x, 2*k + 1) / (2*k + 1);
    }
    return result;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        taylorSin,
        taylorCos,
        taylorExp,
        taylorLn,
        taylorAtan,
        factorialBig
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.taylorSin = taylorSin;
    window.taylorCos = taylorCos;
    window.taylorExp = taylorExp;
    window.taylorLn = taylorLn;
    window.taylorAtan = taylorAtan;
    window.factorialBig = factorialBig;
}