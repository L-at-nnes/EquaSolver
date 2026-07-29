// ===================================
// EXPRESSION EVALUATOR
// ===================================

const EXPRESSION_FUNCTIONS = {
    sin: 'Math.sin',
    cos: 'Math.cos',
    tan: 'Math.tan',
    sqrt: 'Math.sqrt',
    abs: 'Math.abs',
    exp: 'Math.exp',
    log: 'Math.log',
    pow: 'Math.pow',
    pi: 'Math.PI'
};

// Marker char that can't realistically appear in user-typed math input,
// used to tag function-name placeholders so they can't collide with
// numbers/text produced by the variable substitution step below.
const PLACEHOLDER_MARK = String.fromCharCode(1);

function evaluateExpression(expr, varName, value) {
    const funcNames = Object.keys(EXPRESSION_FUNCTIONS);
    const escapedVar = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const placeholder = i => `${PLACEHOLDER_MARK}${i}${PLACEHOLDER_MARK}`;

    // Strip any pre-existing marker chars from the input, then replace known
    // function/constant names with placeholders first so the variable
    // substitution below can't corrupt them (e.g. "exp(x)" when varName is "x").
    let processed = expr.split(PLACEHOLDER_MARK).join('');
    funcNames.forEach((name, i) => {
        processed = processed.replace(new RegExp(`\\b${name}\\b`, 'g'), placeholder(i));
    });

    processed = processed.replace(new RegExp(`\\b${escapedVar}\\b`, 'g'), `(${value})`);
    processed = processed.replace(/\^/g, '**');

    funcNames.forEach((name, i) => {
        processed = processed.split(placeholder(i)).join(EXPRESSION_FUNCTIONS[name]);
    });

    // Reject anything outside a safe numeric/operator/Math-call character set
    // before evaluating, so user input can never run arbitrary JavaScript.
    const leftover = processed
        .replace(/Math\.(sin|cos|tan|sqrt|abs|exp|log|pow|PI)/g, '')
        .replace(/[0-9+\-*/%.,()\s]/g, '');
    if (leftover.length > 0) {
        return NaN;
    }

    try {
        return Function(`"use strict"; return (${processed});`)();
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
