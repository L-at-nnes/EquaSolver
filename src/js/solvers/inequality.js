// ===================================
// INEQUALITY SOLVER
// ===================================

function solveLinearInequality(a, b, operator) {
    if (a === 0) {
        const holds = evaluateComparison(b, 0, operator);
        if (holds) {
            return { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'] };
        } else {
            return { type: 'none', solution: '∅ (no solution)', interval: [] };
        }
    }
    
    const x = -b / a;
    let effectiveOp = operator;
    if (a < 0) {
        effectiveOp = flipOperator(operator);
    }
    
    switch (effectiveOp) {
        case '<':
            return { type: 'interval', solution: `x < ${x.toFixed(4)}`, interval: ['-∞', x], notation: `]-∞, ${x.toFixed(4)}[` };
        case '>':
            return { type: 'interval', solution: `x > ${x.toFixed(4)}`, interval: [x, '+∞'], notation: `]${x.toFixed(4)}, +∞[` };
        case '<=':
            return { type: 'interval', solution: `x ≤ ${x.toFixed(4)}`, interval: ['-∞', x], notation: `]-∞, ${x.toFixed(4)}]` };
        case '>=':
            return { type: 'interval', solution: `x ≥ ${x.toFixed(4)}`, interval: [x, '+∞'], notation: `[${x.toFixed(4)}, +∞[` };
        default:
            return { type: 'none', solution: 'Invalid operator', interval: [] };
    }
}

function solveQuadraticInequality(a, b, c, operator) {
    if (a === 0) {
        return solveLinearInequality(b, c, operator);
    }
    
    const delta = b * b - 4 * a * c;
    const opensUp = a > 0;
    
    if (delta < 0) {
        const alwaysPositive = opensUp;
        
        if (operator === '>' || operator === '>=') {
            return alwaysPositive 
                ? { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' }
                : { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' };
        } else {
            return alwaysPositive
                ? { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' }
                : { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' };
        }
    }
    
    if (delta === 0) {
        const x0 = -b / (2 * a);
        
        if (operator === '>' || operator === '<') {
            if (opensUp) {
                return operator === '>'
                    ? { type: 'interval', solution: `x ≠ ${x0.toFixed(4)}`, interval: [['-∞', x0], [x0, '+∞']], notation: `]-∞, ${x0.toFixed(4)}[ ∪ ]${x0.toFixed(4)}, +∞[` }
                    : { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' };
            } else {
                return operator === '<'
                    ? { type: 'interval', solution: `x ≠ ${x0.toFixed(4)}`, interval: [['-∞', x0], [x0, '+∞']], notation: `]-∞, ${x0.toFixed(4)}[ ∪ ]${x0.toFixed(4)}, +∞[` }
                    : { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' };
            }
        } else {
            if (opensUp) {
                return operator === '>='
                    ? { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' }
                    : { type: 'point', solution: `x = ${x0.toFixed(4)}`, interval: [x0], notation: `{${x0.toFixed(4)}}` };
            } else {
                return operator === '<='
                    ? { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' }
                    : { type: 'point', solution: `x = ${x0.toFixed(4)}`, interval: [x0], notation: `{${x0.toFixed(4)}}` };
            }
        }
    }
    
    const sqrtDelta = Math.sqrt(delta);
    let x1 = (-b - sqrtDelta) / (2 * a);
    let x2 = (-b + sqrtDelta) / (2 * a);
    if (x1 > x2) [x1, x2] = [x2, x1];
    
    if (opensUp) {
        switch (operator) {
            case '>':
                return { type: 'union', solution: `x < ${x1.toFixed(4)} or x > ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}[ ∪ ]${x2.toFixed(4)}, +∞[` };
            case '>=':
                return { type: 'union', solution: `x ≤ ${x1.toFixed(4)} or x ≥ ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}] ∪ [${x2.toFixed(4)}, +∞[` };
            case '<':
                return { type: 'interval', solution: `${x1.toFixed(4)} < x < ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `]${x1.toFixed(4)}, ${x2.toFixed(4)}[` };
            case '<=':
                return { type: 'interval', solution: `${x1.toFixed(4)} ≤ x ≤ ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `[${x1.toFixed(4)}, ${x2.toFixed(4)}]` };
        }
    } else {
        switch (operator) {
            case '<':
                return { type: 'union', solution: `x < ${x1.toFixed(4)} or x > ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}[ ∪ ]${x2.toFixed(4)}, +∞[` };
            case '<=':
                return { type: 'union', solution: `x ≤ ${x1.toFixed(4)} or x ≥ ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}] ∪ [${x2.toFixed(4)}, +∞[` };
            case '>':
                return { type: 'interval', solution: `${x1.toFixed(4)} < x < ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `]${x1.toFixed(4)}, ${x2.toFixed(4)}[` };
            case '>=':
                return { type: 'interval', solution: `${x1.toFixed(4)} ≤ x ≤ ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `[${x1.toFixed(4)}, ${x2.toFixed(4)}]` };
        }
    }
    
    return { type: 'none', solution: 'Error', interval: [] };
}

function flipOperator(op) {
    switch (op) {
        case '<': return '>';
        case '>': return '<';
        case '<=': return '>=';
        case '>=': return '<=';
        default: return op;
    }
}

function evaluateComparison(a, b, operator) {
    switch (operator) {
        case '<': return a < b;
        case '>': return a > b;
        case '<=': return a <= b;
        case '>=': return a >= b;
        default: return false;
    }
}

function formatOperator(op) {
    switch (op) {
        case '<': return '<';
        case '>': return '>';
        case '<=': return '≤';
        case '>=': return '≥';
        default: return op;
    }
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveLinearInequality,
        solveQuadraticInequality,
        flipOperator,
        evaluateComparison,
        formatOperator
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.solveLinearInequality = solveLinearInequality;
    window.solveQuadraticInequality = solveQuadraticInequality;
    window.flipOperator = flipOperator;
    window.evaluateComparison = evaluateComparison;
    window.formatOperator = formatOperator;
}