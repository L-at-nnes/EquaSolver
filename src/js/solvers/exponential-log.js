// ===================================
// EXPONENTIAL AND LOGARITHMIC EQUATION SOLVERS
// ===================================

/**
 * Solve exponential equation: a^x = b
 * Solution: x = log(b) / log(a)
 * @param {number} base - The base 'a' (must be > 0 and != 1)
 * @param {number} result - The result 'b' (must be > 0)
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveExponentialSimple(base, result) {
    // Validation
    if (base <= 0) {
        return { error: 'Base must be positive' };
    }
    if (base === 1) {
        return { error: 'Base cannot be 1' };
    }
    if (result <= 0) {
        return { error: 'Result must be positive' };
    }
    
    const x = Math.log(result) / Math.log(base);
    
    return {
        x: x,
        equation: `${base}^x = ${result}`,
        steps: [
            `Starting equation: ${base}^x = ${result}`,
            `Apply logarithm to both sides: x · log(${base}) = log(${result})`,
            `Solve for x: x = log(${result}) / log(${base})`,
            `x = ${Math.log(result).toFixed(6)} / ${Math.log(base).toFixed(6)}`,
            `x = ${x.toFixed(6)}`
        ],
        verification: Math.pow(base, x)
    };
}

/**
 * Solve exponential equation with coefficient: a * b^x = c
 * Solution: x = log(c/a) / log(b)
 * @param {number} coefficient - The coefficient 'a'
 * @param {number} base - The base 'b' (must be > 0 and != 1)
 * @param {number} result - The result 'c'
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveExponentialWithCoefficient(coefficient, base, result) {
    if (coefficient === 0) {
        return { error: 'Coefficient cannot be zero' };
    }
    if (base <= 0) {
        return { error: 'Base must be positive' };
    }
    if (base === 1) {
        return { error: 'Base cannot be 1' };
    }
    
    const quotient = result / coefficient;
    if (quotient <= 0) {
        return { error: 'No real solution (c/a must be positive)' };
    }
    
    const x = Math.log(quotient) / Math.log(base);
    
    return {
        x: x,
        equation: `${coefficient} · ${base}^x = ${result}`,
        steps: [
            `Starting equation: ${coefficient} · ${base}^x = ${result}`,
            `Divide both sides by ${coefficient}: ${base}^x = ${result}/${coefficient}`,
            `Simplify: ${base}^x = ${quotient}`,
            `Apply logarithm: x = log(${quotient}) / log(${base})`,
            `x = ${x.toFixed(6)}`
        ],
        verification: coefficient * Math.pow(base, x)
    };
}

/**
 * Solve logarithmic equation: log_a(x) = b
 * Solution: x = a^b
 * @param {number} base - The logarithm base 'a' (must be > 0 and != 1)
 * @param {number} result - The result 'b'
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveLogarithmicSimple(base, result) {
    if (base <= 0) {
        return { error: 'Base must be positive' };
    }
    if (base === 1) {
        return { error: 'Base cannot be 1' };
    }
    
    const x = Math.pow(base, result);
    const subscript = String(base).split('').map(c => {
        const subs = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','.':'.', '-':'₋'};
        return subs[c] || c;
    }).join('');
    
    return {
        x: x,
        equation: `log${subscript}(x) = ${result}`,
        steps: [
            `Starting equation: log_${base}(x) = ${result}`,
            `Convert to exponential form: x = ${base}^${result}`,
            `Calculate: x = ${x.toFixed(6)}`
        ],
        verification: Math.log(x) / Math.log(base)
    };
}

/**
 * Solve logarithmic equation with argument: log_a(bx + c) = d
 * Solution: x = (a^d - c) / b
 * @param {number} logBase - The logarithm base 'a' (must be > 0 and != 1)
 * @param {number} coefX - Coefficient of x 'b' (must not be 0)
 * @param {number} constant - Constant term 'c'
 * @param {number} result - The result 'd'
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveLogarithmicWithArgument(logBase, coefX, constant, result) {
    if (logBase <= 0) {
        return { error: 'Base must be positive' };
    }
    if (logBase === 1) {
        return { error: 'Base cannot be 1' };
    }
    if (coefX === 0) {
        return { error: 'Coefficient of x cannot be zero' };
    }
    
    const signC = constant >= 0 ? '+' : '';
    const expValue = Math.pow(logBase, result);
    const x = (expValue - constant) / coefX;
    
    // Verify domain: bx + c > 0
    const argumentValue = coefX * x + constant;
    if (argumentValue <= 0) {
        return { error: 'No real solution (argument must be positive)' };
    }
    
    const subscript = String(logBase).split('').map(c => {
        const subs = {'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','.':'.', '-':'₋'};
        return subs[c] || c;
    }).join('');
    
    return {
        x: x,
        equation: `log${subscript}(${coefX}x ${signC} ${constant}) = ${result}`,
        steps: [
            `Starting equation: log_${logBase}(${coefX}x ${signC} ${constant}) = ${result}`,
            `Convert to exponential form: ${coefX}x ${signC} ${constant} = ${logBase}^${result}`,
            `Calculate: ${coefX}x ${signC} ${constant} = ${expValue.toFixed(6)}`,
            `Isolate x: ${coefX}x = ${expValue.toFixed(6)} - ${constant}`,
            `Simplify: ${coefX}x = ${(expValue - constant).toFixed(6)}`,
            `Solve: x = ${(expValue - constant).toFixed(6)} / ${coefX}`,
            `x = ${x.toFixed(6)}`
        ],
        verification: Math.log(argumentValue) / Math.log(logBase)
    };
}

/**
 * Solve natural logarithm equation: ln(x) = a
 * Solution: x = e^a
 * @param {number} result - The result 'a'
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveNaturalLog(result) {
    const x = Math.exp(result);
    
    return {
        x: x,
        equation: `ln(x) = ${result}`,
        steps: [
            `Starting equation: ln(x) = ${result}`,
            `Convert to exponential form: x = e^${result}`,
            `Calculate: x = ${x.toFixed(6)}`
        ],
        verification: Math.log(x)
    };
}

/**
 * Solve common logarithm equation: log(x) = a (base 10)
 * Solution: x = 10^a
 * @param {number} result - The result 'a'
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveCommonLog(result) {
    const x = Math.pow(10, result);
    
    return {
        x: x,
        equation: `log₁₀(x) = ${result}`,
        steps: [
            `Starting equation: log₁₀(x) = ${result}`,
            `Convert to exponential form: x = 10^${result}`,
            `Calculate: x = ${x.toFixed(6)}`
        ],
        verification: Math.log10(x)
    };
}

/**
 * Solve natural exponential equation: e^x = a
 * Solution: x = ln(a)
 * @param {number} result - The result 'a' (must be > 0)
 * @returns {Object} Solution with x value, equation, and steps
 */
function solveNaturalExponential(result) {
    if (result <= 0) {
        return { error: 'Result must be positive' };
    }
    
    const x = Math.log(result);
    
    return {
        x: x,
        equation: `e^x = ${result}`,
        steps: [
            `Starting equation: e^x = ${result}`,
            `Apply natural logarithm: x = ln(${result})`,
            `Calculate: x = ${x.toFixed(6)}`
        ],
        verification: Math.exp(x)
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.solveExponentialSimple = solveExponentialSimple;
    window.solveExponentialWithCoefficient = solveExponentialWithCoefficient;
    window.solveLogarithmicSimple = solveLogarithmicSimple;
    window.solveLogarithmicWithArgument = solveLogarithmicWithArgument;
    window.solveNaturalLog = solveNaturalLog;
    window.solveCommonLog = solveCommonLog;
    window.solveNaturalExponential = solveNaturalExponential;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveExponentialSimple,
        solveExponentialWithCoefficient,
        solveLogarithmicSimple,
        solveLogarithmicWithArgument,
        solveNaturalLog,
        solveCommonLog,
        solveNaturalExponential
    };
}
