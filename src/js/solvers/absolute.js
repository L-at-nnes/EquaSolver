// ===================================
// ABSOLUTE VALUE EQUATION / INEQUALITY SOLVER
// ===================================

function sortUniqueNumeric(values, epsilon = 1e-9) {
    const sorted = [...values].sort((a, b) => a - b);
    const out = [];
    for (const v of sorted) {
        if (out.length === 0 || Math.abs(v - out[out.length - 1]) > epsilon) {
            out.push(v);
        }
    }
    return out;
}

/**
 * Solve |ax + b| = c
 */
function solveAbsoluteEquation(a, b, c) {
    if (![a, b, c].every(Number.isFinite)) {
        return { type: 'equation', error: 'Invalid numeric input', solutions: [] };
    }

    if (a === 0) {
        const lhs = Math.abs(b);
        if (lhs === c) return { type: 'equation', error: null, special: 'all_real', solutions: [] };
        return { type: 'equation', error: null, special: 'no_solution', solutions: [] };
    }

    if (c < 0) {
        return { type: 'equation', error: 'No real solution: absolute value cannot be negative', solutions: [] };
    }

    const s1 = (c - b) / a;
    const s2 = (-c - b) / a;

    return { type: 'equation', error: null, special: null, solutions: sortUniqueNumeric([s1, s2]) };
}

/**
 * Solve |ax + b| < c, <= c, > c, >= c
 */
function solveAbsoluteInequality(a, b, op, c) {
    if (![a, b, c].every(Number.isFinite)) {
        return { type: 'inequality', error: 'Invalid numeric input', interval: null, solutionText: null };
    }
    if (!['<', '<=', '>', '>='].includes(op)) {
        return { type: 'inequality', error: 'Invalid operator', interval: null, solutionText: null };
    }

    if (a === 0) {
        const val = Math.abs(b);
        const isTrue =
            (op === '<' && val < c) ||
            (op === '<=' && val <= c) ||
            (op === '>' && val > c) ||
            (op === '>=' && val >= c);

        return {
            type: 'inequality',
            error: null,
            interval: isTrue ? '(-∞, +∞)' : '∅',
            solutionText: isTrue ? 'All real numbers' : 'No solution'
        };
    }

    if (c < 0) {
        const isAlwaysTrue = op === '>' || op === '>=';
        return {
            type: 'inequality',
            error: null,
            interval: isAlwaysTrue ? '(-∞, +∞)' : '∅',
            solutionText: isAlwaysTrue ? 'All real numbers' : 'No solution'
        };
    }

    const left = (-c - b) / a;
    const right = (c - b) / a;
    const lo = Math.min(left, right);
    const hi = Math.max(left, right);

    if (op === '<') {
        return { type: 'inequality', error: null, interval: `(${lo}, ${hi})`, solutionText: `${lo} < x < ${hi}` };
    }
    if (op === '<=') {
        return { type: 'inequality', error: null, interval: `[${lo}, ${hi}]`, solutionText: `${lo} ≤ x ≤ ${hi}` };
    }
    if (op === '>') {
        return { type: 'inequality', error: null, interval: `(-∞, ${lo}) ∪ (${hi}, +∞)`, solutionText: `x < ${lo} or x > ${hi}` };
    }
    return { type: 'inequality', error: null, interval: `(-∞, ${lo}] ∪ [${hi}, +∞)`, solutionText: `x ≤ ${lo} or x ≥ ${hi}` };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        solveAbsoluteEquation,
        solveAbsoluteInequality,
        sortUniqueNumeric
    };
}

if (typeof window !== 'undefined') {
    window.solveAbsoluteEquation = solveAbsoluteEquation;
    window.solveAbsoluteInequality = solveAbsoluteInequality;
}
