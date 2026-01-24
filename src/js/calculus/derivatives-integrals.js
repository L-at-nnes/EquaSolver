// ===================================
// DERIVATIVES AND INTEGRALS CALCULATOR
// ===================================

/**
 * Parse a mathematical expression into tokens for differentiation/integration
 * @param {string} expr - The expression to parse
 * @returns {Object} Parsed expression structure
 */
function parseExpression(expr) {
    // Clean and normalize expression
    expr = expr.replace(/\s+/g, '')
               .replace(/−/g, '-')
               .replace(/×/g, '*')
               .replace(/÷/g, '/')
               .replace(/\*\*/g, '^');
    
    return expr;
}

/**
 * Differentiate a polynomial expression
 * Supports: constants, x^n, sin(x), cos(x), tan(x), e^x, ln(x), sqrt(x)
 * @param {string} expr - The expression to differentiate
 * @param {string} variable - The variable (default: 'x')
 * @returns {Object} Result with derivative, original, and steps
 */
function differentiate(expr, variable = 'x') {
    const original = expr;
    expr = parseExpression(expr);
    const steps = [];
    
    // Handle pure constant (no variable)
    if (!expr.includes(variable)) {
        steps.push(`f(${variable}) = ${original}`);
        steps.push(`The derivative of a constant is 0`);
        return {
            original: original,
            derivative: '0',
            steps: steps,
            simplified: '0'
        };
    }
    
    // Split into terms (respecting parentheses)
    const terms = splitIntoTerms(expr);
    const derivedTerms = [];
    
    steps.push(`f(${variable}) = ${original}`);
    steps.push(`Apply differentiation rules to each term:`);
    
    for (const term of terms) {
        const derived = differentiateTerm(term.term, variable);
        if (derived.derivative !== '0') {
            const sign = term.sign === '-' ? '-' : (derivedTerms.length > 0 ? '+' : '');
            derivedTerms.push({ sign: sign, term: derived.derivative });
        }
        if (derived.step) {
            steps.push(`  d/d${variable}(${term.sign === '-' ? '-' : ''}${term.term}) = ${term.sign === '-' ? '-' : ''}${derived.derivative} ${derived.rule ? `[${derived.rule}]` : ''}`);
        }
    }
    
    // Build result
    let derivative = '';
    for (const t of derivedTerms) {
        if (derivative === '') {
            derivative = t.sign === '-' ? `-${t.term}` : t.term;
        } else {
            derivative += ` ${t.sign === '-' ? '-' : '+'} ${t.term}`;
        }
    }
    
    if (derivative === '') {
        derivative = '0';
    }
    
    // Simplify
    const simplified = simplifyExpression(derivative);
    steps.push(`f'(${variable}) = ${simplified}`);
    
    return {
        original: original,
        derivative: derivative,
        steps: steps,
        simplified: simplified
    };
}

/**
 * Split expression into terms respecting parentheses
 * @param {string} expr - Expression to split
 * @returns {Array} Array of {sign, term} objects
 */
function splitIntoTerms(expr) {
    const terms = [];
    let current = '';
    let depth = 0;
    let sign = '+';
    
    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        
        if (char === '(') depth++;
        if (char === ')') depth--;
        
        if (depth === 0 && (char === '+' || char === '-') && i > 0) {
            if (current.trim()) {
                terms.push({ sign: sign, term: current.trim() });
            }
            sign = char;
            current = '';
        } else {
            current += char;
        }
    }
    
    if (current.trim()) {
        terms.push({ sign: sign, term: current.trim() });
    }
    
    // Handle leading negative
    if (terms.length > 0 && terms[0].term.startsWith('-')) {
        terms[0].sign = '-';
        terms[0].term = terms[0].term.substring(1);
    }
    
    return terms;
}

/**
 * Differentiate a single term
 * @param {string} term - Single term to differentiate
 * @param {string} variable - The variable
 * @returns {Object} {derivative, step, rule}
 */
function differentiateTerm(term, variable) {
    term = term.trim();
    
    // Pure constant (number only)
    if (/^[\d.]+$/.test(term)) {
        return { derivative: '0', step: true, rule: 'constant rule' };
    }
    
    // Just the variable: x -> 1
    if (term === variable) {
        return { derivative: '1', step: true, rule: 'power rule' };
    }
    
    // Coefficient times variable: ax -> a
    const coeffVarMatch = term.match(new RegExp(`^([\\d.]+)\\*?${variable}$`));
    if (coeffVarMatch) {
        return { derivative: coeffVarMatch[1], step: true, rule: 'power rule' };
    }
    
    // Power: x^n -> n*x^(n-1)
    const powerMatch = term.match(new RegExp(`^${variable}\\^([\\d.]+|-?\\d+)$`));
    if (powerMatch) {
        const n = parseFloat(powerMatch[1]);
        if (n === 1) return { derivative: '1', step: true, rule: 'power rule' };
        if (n === 2) return { derivative: `2${variable}`, step: true, rule: 'power rule' };
        const newExp = n - 1;
        return { 
            derivative: newExp === 1 ? `${n}${variable}` : `${n}${variable}^${newExp}`,
            step: true, 
            rule: 'power rule' 
        };
    }
    
    // Coefficient with power: ax^n -> a*n*x^(n-1)
    const coeffPowerMatch = term.match(new RegExp(`^([\\d.]+)\\*?${variable}\\^([\\d.]+|-?\\d+)$`));
    if (coeffPowerMatch) {
        const coef = parseFloat(coeffPowerMatch[1]);
        const n = parseFloat(coeffPowerMatch[2]);
        const newCoef = coef * n;
        const newExp = n - 1;
        if (newExp === 0) return { derivative: `${newCoef}`, step: true, rule: 'power rule' };
        if (newExp === 1) return { derivative: `${newCoef}${variable}`, step: true, rule: 'power rule' };
        return { 
            derivative: `${newCoef}${variable}^${newExp}`,
            step: true, 
            rule: 'power rule' 
        };
    }
    
    // sin(x) -> cos(x)
    if (term === `sin(${variable})`) {
        return { derivative: `cos(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // cos(x) -> -sin(x)
    if (term === `cos(${variable})`) {
        return { derivative: `-sin(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // tan(x) -> sec²(x) = 1/cos²(x)
    if (term === `tan(${variable})`) {
        return { derivative: `sec²(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // e^x -> e^x
    if (term === `e^${variable}` || term === `exp(${variable})`) {
        return { derivative: `e^${variable}`, step: true, rule: 'exponential' };
    }
    
    // a^x -> a^x * ln(a)
    const expBaseMatch = term.match(new RegExp(`^([\\d.]+)\\^${variable}$`));
    if (expBaseMatch) {
        const base = expBaseMatch[1];
        return { derivative: `${base}^${variable}·ln(${base})`, step: true, rule: 'exponential' };
    }
    
    // ln(x) -> 1/x
    if (term === `ln(${variable})`) {
        return { derivative: `1/${variable}`, step: true, rule: 'logarithmic' };
    }
    
    // log(x) or log10(x) -> 1/(x*ln(10))
    if (term === `log(${variable})` || term === `log10(${variable})`) {
        return { derivative: `1/(${variable}·ln(10))`, step: true, rule: 'logarithmic' };
    }
    
    // sqrt(x) -> 1/(2*sqrt(x))
    if (term === `sqrt(${variable})`) {
        return { derivative: `1/(2√${variable})`, step: true, rule: 'power rule (n=1/2)' };
    }
    
    // Coefficient with trig: a*sin(x)
    const coeffSinMatch = term.match(new RegExp(`^([\\d.]+)\\*?sin\\(${variable}\\)$`));
    if (coeffSinMatch) {
        return { derivative: `${coeffSinMatch[1]}cos(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    const coeffCosMatch = term.match(new RegExp(`^([\\d.]+)\\*?cos\\(${variable}\\)$`));
    if (coeffCosMatch) {
        return { derivative: `-${coeffCosMatch[1]}sin(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // Coefficient with e^x: a*e^x
    const coeffExpMatch = term.match(new RegExp(`^([\\d.]+)\\*?e\\^${variable}$`));
    if (coeffExpMatch) {
        return { derivative: `${coeffExpMatch[1]}e^${variable}`, step: true, rule: 'exponential' };
    }
    
    // Coefficient with ln(x): a*ln(x)
    const coeffLnMatch = term.match(new RegExp(`^([\\d.]+)\\*?ln\\(${variable}\\)$`));
    if (coeffLnMatch) {
        return { derivative: `${coeffLnMatch[1]}/${variable}`, step: true, rule: 'logarithmic' };
    }
    
    // Coefficient with sqrt(x): a*sqrt(x)
    const coeffSqrtMatch = term.match(new RegExp(`^([\\d.]+)\\*?sqrt\\(${variable}\\)$`));
    if (coeffSqrtMatch) {
        const coef = parseFloat(coeffSqrtMatch[1]);
        return { derivative: `${coef/2}/√${variable}`, step: true, rule: 'power rule (n=1/2)' };
    }
    
    // If we can't parse, return as-is with warning
    return { derivative: `d/d${variable}(${term})`, step: true, rule: 'complex term' };
}

/**
 * Integrate a polynomial expression (indefinite integral)
 * Supports: constants, x^n, sin(x), cos(x), e^x, 1/x
 * @param {string} expr - The expression to integrate
 * @param {string} variable - The variable (default: 'x')
 * @returns {Object} Result with integral, original, and steps
 */
function integrate(expr, variable = 'x') {
    const original = expr;
    expr = parseExpression(expr);
    const steps = [];
    
    // Handle pure constant
    if (!expr.includes(variable)) {
        const constant = expr;
        steps.push(`∫ ${original} d${variable}`);
        steps.push(`The integral of a constant c is c·${variable}`);
        steps.push(`∫ ${original} d${variable} = ${original}${variable} + C`);
        return {
            original: original,
            integral: `${original}${variable}`,
            steps: steps,
            simplified: `${original}${variable} + C`
        };
    }
    
    // Split into terms
    const terms = splitIntoTerms(expr);
    const integratedTerms = [];
    
    steps.push(`∫ ${original} d${variable}`);
    steps.push(`Apply integration rules to each term:`);
    
    for (const term of terms) {
        const integrated = integrateTerm(term.term, variable);
        if (integrated.integral !== '0') {
            const sign = term.sign === '-' ? '-' : (integratedTerms.length > 0 ? '+' : '');
            integratedTerms.push({ sign: sign, term: integrated.integral });
        }
        if (integrated.step) {
            steps.push(`  ∫ ${term.sign === '-' ? '-' : ''}${term.term} d${variable} = ${term.sign === '-' ? '-' : ''}${integrated.integral} ${integrated.rule ? `[${integrated.rule}]` : ''}`);
        }
    }
    
    // Build result
    let integral = '';
    for (const t of integratedTerms) {
        if (integral === '') {
            integral = t.sign === '-' ? `-${t.term}` : t.term;
        } else {
            integral += ` ${t.sign === '-' ? '-' : '+'} ${t.term}`;
        }
    }
    
    if (integral === '') {
        integral = 'C';
    }
    
    // Simplify and add constant
    const simplified = simplifyExpression(integral);
    steps.push(`∫ ${original} d${variable} = ${simplified} + C`);
    
    return {
        original: original,
        integral: integral,
        steps: steps,
        simplified: `${simplified} + C`
    };
}

/**
 * Integrate a single term
 * @param {string} term - Single term to integrate
 * @param {string} variable - The variable
 * @returns {Object} {integral, step, rule}
 */
function integrateTerm(term, variable) {
    term = term.trim();
    
    // Pure constant: c -> cx
    if (/^[\d.]+$/.test(term)) {
        return { integral: `${term}${variable}`, step: true, rule: 'constant rule' };
    }
    
    // Just the variable: x -> x²/2
    if (term === variable) {
        return { integral: `${variable}²/2`, step: true, rule: 'power rule' };
    }
    
    // Coefficient times variable: ax -> ax²/2
    const coeffVarMatch = term.match(new RegExp(`^([\\d.]+)\\*?${variable}$`));
    if (coeffVarMatch) {
        const coef = parseFloat(coeffVarMatch[1]);
        return { integral: `${coef/2}${variable}²`, step: true, rule: 'power rule' };
    }
    
    // Power: x^n -> x^(n+1)/(n+1)
    const powerMatch = term.match(new RegExp(`^${variable}\\^([\\d.]+|-?\\d+)$`));
    if (powerMatch) {
        const n = parseFloat(powerMatch[1]);
        if (n === -1) {
            return { integral: `ln|${variable}|`, step: true, rule: 'special case n=-1' };
        }
        const newExp = n + 1;
        return { 
            integral: `${variable}^${newExp}/${newExp}`,
            step: true, 
            rule: 'power rule' 
        };
    }
    
    // Coefficient with power: ax^n -> a*x^(n+1)/(n+1)
    const coeffPowerMatch = term.match(new RegExp(`^([\\d.]+)\\*?${variable}\\^([\\d.]+|-?\\d+)$`));
    if (coeffPowerMatch) {
        const coef = parseFloat(coeffPowerMatch[1]);
        const n = parseFloat(coeffPowerMatch[2]);
        if (n === -1) {
            return { integral: `${coef}ln|${variable}|`, step: true, rule: 'special case n=-1' };
        }
        const newExp = n + 1;
        const newCoef = coef / newExp;
        return { 
            integral: `${newCoef}${variable}^${newExp}`,
            step: true, 
            rule: 'power rule' 
        };
    }
    
    // sin(x) -> -cos(x)
    if (term === `sin(${variable})`) {
        return { integral: `-cos(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // cos(x) -> sin(x)
    if (term === `cos(${variable})`) {
        return { integral: `sin(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // e^x -> e^x
    if (term === `e^${variable}` || term === `exp(${variable})`) {
        return { integral: `e^${variable}`, step: true, rule: 'exponential' };
    }
    
    // a^x -> a^x/ln(a)
    const expBaseMatch = term.match(new RegExp(`^([\\d.]+)\\^${variable}$`));
    if (expBaseMatch) {
        const base = expBaseMatch[1];
        return { integral: `${base}^${variable}/ln(${base})`, step: true, rule: 'exponential' };
    }
    
    // 1/x -> ln|x|
    if (term === `1/${variable}`) {
        return { integral: `ln|${variable}|`, step: true, rule: 'logarithmic' };
    }
    
    // Coefficient with trig: a*sin(x)
    const coeffSinMatch = term.match(new RegExp(`^([\\d.]+)\\*?sin\\(${variable}\\)$`));
    if (coeffSinMatch) {
        return { integral: `-${coeffSinMatch[1]}cos(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    const coeffCosMatch = term.match(new RegExp(`^([\\d.]+)\\*?cos\\(${variable}\\)$`));
    if (coeffCosMatch) {
        return { integral: `${coeffCosMatch[1]}sin(${variable})`, step: true, rule: 'trigonometric' };
    }
    
    // Coefficient with e^x: a*e^x
    const coeffExpMatch = term.match(new RegExp(`^([\\d.]+)\\*?e\\^${variable}$`));
    if (coeffExpMatch) {
        return { integral: `${coeffExpMatch[1]}e^${variable}`, step: true, rule: 'exponential' };
    }
    
    // If we can't parse, return as-is with warning
    return { integral: `∫${term}d${variable}`, step: true, rule: 'complex term' };
}

/**
 * Simplify an expression (basic simplifications)
 * @param {string} expr - Expression to simplify
 * @returns {string} Simplified expression
 */
function simplifyExpression(expr) {
    return expr
        .replace(/\s+/g, ' ')
        .replace(/\+ -/g, '- ')
        .replace(/- -/g, '+ ')
        .replace(/\^1(?![0-9])/g, '')
        .replace(/1\*/g, '')
        .replace(/\*1(?![0-9])/g, '')
        .trim();
}

/**
 * Calculate definite integral using numerical methods
 * @param {string} expr - Expression to integrate
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @param {number} n - Number of intervals (default: 1000)
 * @returns {Object} Result with value and method
 */
function definiteIntegral(expr, a, b, n = 1000) {
    // Use Simpson's rule for accuracy
    if (n % 2 !== 0) n++; // Simpson's needs even intervals
    
    const h = (b - a) / n;
    let sum = 0;
    
    const f = createFunction(expr);
    
    // Simpson's 1/3 rule
    sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0) ? 2 * f(x) : 4 * f(x);
    }
    
    const result = (h / 3) * sum;
    
    return {
        value: result,
        expression: expr,
        lowerBound: a,
        upperBound: b,
        intervals: n,
        method: "Simpson's Rule"
    };
}

/**
 * Create an evaluable function from expression string
 * @param {string} expr - Mathematical expression
 * @returns {Function} JavaScript function
 */
function createFunction(expr) {
    let safeExpr = expr
        .replace(/\^/g, '**')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/log10\(/g, 'Math.log10(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/pi/g, 'Math.PI')
        .replace(/(?<![a-zA-Z])e(?![a-zA-Z0-9(])/g, 'Math.E');
    
    try {
        return new Function('x', `return ${safeExpr};`);
    } catch (e) {
        return () => NaN;
    }
}

/**
 * Evaluate derivative at a specific point
 * @param {string} expr - Expression to differentiate
 * @param {number} x0 - Point to evaluate at
 * @param {string} variable - Variable name (default: 'x')
 * @returns {Object} Result with derivative value
 */
function evaluateDerivativeAt(expr, x0, variable = 'x') {
    // Use numerical differentiation: f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
    const h = 0.0001;
    const f = createFunction(expr);
    
    const derivative = (f(x0 + h) - f(x0 - h)) / (2 * h);
    
    // Also get symbolic derivative
    const symbolic = differentiate(expr, variable);
    
    return {
        expression: expr,
        point: x0,
        numericalValue: derivative,
        symbolicDerivative: symbolic.simplified,
        method: 'Central difference'
    };
}

/**
 * Calculate nth derivative
 * @param {string} expr - Expression to differentiate
 * @param {number} n - Order of derivative
 * @param {string} variable - Variable name (default: 'x')
 * @returns {Object} Result with nth derivative
 */
function nthDerivative(expr, n, variable = 'x') {
    if (n < 1) {
        return { error: 'Order must be at least 1' };
    }
    
    let current = expr;
    const steps = [`f(${variable}) = ${expr}`];
    
    for (let i = 1; i <= n; i++) {
        const result = differentiate(current, variable);
        current = result.simplified;
        steps.push(`f${"'".repeat(i)}(${variable}) = ${current}`);
    }
    
    return {
        original: expr,
        order: n,
        derivative: current,
        steps: steps
    };
}

/**
 * Find critical points (where derivative = 0)
 * @param {string} expr - Expression
 * @param {number} xMin - Minimum x value to search
 * @param {number} xMax - Maximum x value to search
 * @param {number} step - Step size for search
 * @returns {Array} Array of critical points
 */
function findCriticalPoints(expr, xMin = -10, xMax = 10, step = 0.1) {
    const f = createFunction(expr);
    const criticalPoints = [];
    const h = 0.0001;
    
    // Numerical search for sign changes in derivative
    let prevDerivative = (f(xMin + h) - f(xMin - h)) / (2 * h);
    
    for (let x = xMin + step; x <= xMax; x += step) {
        const derivative = (f(x + h) - f(x - h)) / (2 * h);
        
        // Check for sign change (critical point)
        if (prevDerivative * derivative < 0) {
            // Refine using bisection
            let a = x - step, b = x;
            for (let i = 0; i < 50; i++) {
                const mid = (a + b) / 2;
                const midDeriv = (f(mid + h) - f(mid - h)) / (2 * h);
                if (Math.abs(midDeriv) < 1e-10) {
                    a = b = mid;
                    break;
                }
                if (prevDerivative * midDeriv < 0) {
                    b = mid;
                } else {
                    a = mid;
                    prevDerivative = midDeriv;
                }
            }
            
            const criticalX = (a + b) / 2;
            const criticalY = f(criticalX);
            
            // Determine type (min/max/inflection)
            const secondDeriv = (f(criticalX + h) - 2*f(criticalX) + f(criticalX - h)) / (h * h);
            let type = 'unknown';
            if (secondDeriv > 0.001) type = 'local minimum';
            else if (secondDeriv < -0.001) type = 'local maximum';
            else type = 'inflection point';
            
            criticalPoints.push({
                x: criticalX,
                y: criticalY,
                type: type
            });
        }
        
        prevDerivative = derivative;
    }
    
    return criticalPoints;
}

// Browser export
if (typeof window !== 'undefined') {
    window.differentiate = differentiate;
    window.integrate = integrate;
    window.definiteIntegral = definiteIntegral;
    window.evaluateDerivativeAt = evaluateDerivativeAt;
    window.nthDerivative = nthDerivative;
    window.findCriticalPoints = findCriticalPoints;
    window.createFunction = createFunction;
    window.parseExpression = parseExpression;
    window.splitIntoTerms = splitIntoTerms;
    window.differentiateTerm = differentiateTerm;
    window.integrateTerm = integrateTerm;
    window.simplifyExpression = simplifyExpression;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        differentiate,
        integrate,
        definiteIntegral,
        evaluateDerivativeAt,
        nthDerivative,
        findCriticalPoints,
        createFunction,
        parseExpression,
        splitIntoTerms,
        differentiateTerm,
        integrateTerm,
        simplifyExpression
    };
}
