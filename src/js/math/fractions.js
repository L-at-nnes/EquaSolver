// ===================================
// FRACTIONS
// ===================================

// GCD function (duplicated for module independence, or use require)
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

function simplifyFraction(num, den) {
    if (den === 0) return null;
    const g = gcd(Math.abs(num), Math.abs(den));
    let simpNum = num / g;
    let simpDen = den / g;
    if (simpDen < 0) {
        simpNum = -simpNum;
        simpDen = -simpDen;
    }
    return { num: simpNum, den: simpDen };
}

// Alias for backwards compatibility
const simplifyFractionFunc = simplifyFraction;

function addFractions(num1, den1, num2, den2) {
    if (den1 === 0 || den2 === 0) return null;
    const resultNum = num1 * den2 + num2 * den1;
    const resultDen = den1 * den2;
    return simplifyFraction(resultNum, resultDen);
}

function subtractFractions(num1, den1, num2, den2) {
    if (den1 === 0 || den2 === 0) return null;
    const resultNum = num1 * den2 - num2 * den1;
    const resultDen = den1 * den2;
    return simplifyFraction(resultNum, resultDen);
}

function multiplyFractions(num1, den1, num2, den2) {
    if (den1 === 0 || den2 === 0) return null;
    const resultNum = num1 * num2;
    const resultDen = den1 * den2;
    return simplifyFraction(resultNum, resultDen);
}

function divideFractions(num1, den1, num2, den2) {
    if (den1 === 0 || den2 === 0 || num2 === 0) return null;
    const resultNum = num1 * den2;
    const resultDen = den1 * num2;
    return simplifyFraction(resultNum, resultDen);
}

function fractionToDecimal(num, den) {
    if (den === 0) return null;
    return num / den;
}

function decimalToFraction(decimal, maxDenominator = 10000) {
    if (Number.isInteger(decimal)) {
        return { num: decimal, den: 1 };
    }
    
    let bestNum = 1;
    let bestDen = 1;
    let bestError = Math.abs(decimal - bestNum / bestDen);
    
    for (let den = 1; den <= maxDenominator; den++) {
        const num = Math.round(decimal * den);
        const error = Math.abs(decimal - num / den);
        if (error < bestError) {
            bestError = error;
            bestNum = num;
            bestDen = den;
        }
        if (bestError < 1e-10) break;
    }
    
    return simplifyFraction(bestNum, bestDen);
}

function fractionToMixed(num, den) {
    if (den === 0) return null;
    const whole = Math.floor(Math.abs(num) / Math.abs(den));
    const remainder = Math.abs(num) % Math.abs(den);
    const sign = (num < 0) !== (den < 0) ? -1 : 1;
    return { whole: sign * whole, num: remainder, den: Math.abs(den) };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gcd,
        simplifyFraction,
        simplifyFractionFunc,
        addFractions,
        subtractFractions,
        multiplyFractions,
        divideFractions,
        fractionToDecimal,
        decimalToFraction,
        fractionToMixed
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.gcd = gcd;
    window.simplifyFraction = simplifyFraction;
    window.simplifyFractionFunc = simplifyFractionFunc;
    window.addFractions = addFractions;
    window.subtractFractions = subtractFractions;
    window.multiplyFractions = multiplyFractions;
    window.divideFractions = divideFractions;
    window.fractionToDecimal = fractionToDecimal;
    window.decimalToFraction = decimalToFraction;
    window.fractionToMixed = fractionToMixed;
}