// ===================================
// LIMITS
// ===================================

function evaluateLimitFunction(expr, x) {
    let safeExpr = expr
        .replace(/\^/g, '**')
        // Replace functions - order matters!
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/exp\(/g, 'Math.exp(')
        // Handle log10 first (avoiding conflict with ln -> log)
        .replace(/log10\(/g, 'Math.log10(')
        .replace(/log\(/g, 'Math.log10(')
        // Handle natural log (ln)
        .replace(/ln\(/g, 'Math.log(')
        // Constants
        .replace(/pi/g, 'Math.PI')
        .replace(/(?<![a-zA-Z])e(?![a-zA-Z0-9])/g, 'Math.E');
    
    try {
        const func = new Function('x', `return ${safeExpr};`);
        return func(x);
    } catch (e) {
        return NaN;
    }
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