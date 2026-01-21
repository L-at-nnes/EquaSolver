// ===================================
// EXPRESSION EVALUATOR
// ===================================

function evaluateExpression(expr, varName, value) {
    let processed = expr
        .replace(new RegExp(varName, 'g'), `(${value})`)
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/pi/g, 'Math.PI')
        .replace(/pow/g, 'Math.pow');
    
    try {
        return eval(processed);
    } catch (e) {
        return NaN;
    }
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        evaluateExpression
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.evaluateExpression = evaluateExpression;
}

