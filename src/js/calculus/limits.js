// ===================================
// LIMITS
// ===================================

function evaluateLimitFunction(expr, x) {
    const evaluate = typeof evaluateExpression === 'function'
        ? evaluateExpression
        : require('../parsers/expression.js').evaluateExpression;
    return evaluate(expr, 'x', x, { log: 'log10' });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        evaluateLimitFunction
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.evaluateLimitFunction = evaluateLimitFunction;
}