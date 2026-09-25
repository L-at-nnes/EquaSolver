// ===================================
// LIMITS
// ===================================

function evaluateLimitFunction(expr, x) {
    const evaluate = typeof evaluateExpression === 'function'
        ? evaluateExpression
        : require('../parsers/expression.js').evaluateExpression;
    return evaluate(expr, 'x', x, { log: 'log10' });
}

/**
 * Estimate lim f(x) as x -> point by sampling the function ever closer to the point.
 * @param {string} expr expression in x
 * @param {number} point finite number or +/-Infinity
 * @param {'both'|'left'|'right'} direction ignored when point is infinite
 * @returns {{value:number, exists:boolean, left:number, right:number}}
 *   value may be +/-Infinity when the function diverges; NaN when the limit does not exist.
 */
function evaluateLimit(expr, point, direction = 'both') {
    const compile = typeof compileExpression === 'function'
        ? compileExpression
        : require('../parsers/expression.js').compileExpression;
    const f = compile(expr, 'x', { log: 'log10' });
    if (!f || Number.isNaN(point)) return { value: NaN, exists: false, left: NaN, right: NaN };

    // Estimate the one-sided limit approaching from side (+1 right / -1 left)
    const sideLimit = side => {
        const steps = [];
        if (Number.isFinite(point)) {
            for (let k = 2; k <= 6; k++) steps.push(point + side * Math.pow(10, -k));
        } else {
            for (let k = 2; k <= 12; k += 2) steps.push(Math.sign(point) * Math.pow(10, k));
        }
        const values = steps.map(x => f(x));
        const last = values[values.length - 1];
        const prev = values[values.length - 2];
        const before = values[values.length - 3];
        if (!Number.isFinite(last) && !Number.isNaN(last) && Math.abs(last) === Infinity) return last;
        if (values.some(v => Number.isNaN(v))) return NaN;

        // Divergence: magnitude keeps growing past a large threshold
        if (Math.abs(last) > 1e5 && Math.abs(last) > Math.abs(prev) && Math.abs(prev) > Math.abs(before)
            && Math.sign(last) === Math.sign(prev)) {
            return last > 0 ? Infinity : -Infinity;
        }

        if (!Number.isFinite(point)) {
            const scale = Math.max(1, Math.abs(last));
            if (Math.abs(last - prev) > 1e-3 * scale) return NaN;
            return Math.abs(last) < 1e-9 ? 0 : parseFloat(last.toPrecision(8));
        }

        // Richardson extrapolation (h and h/10) removes the leading O(h) error of each estimate;
        // keep the estimate that agrees best with its neighbour (very small h suffers cancellation).
        const estimates = [];
        for (let i = 1; i < values.length; i++) estimates.push((10 * values[i] - values[i - 1]) / 9);
        let best = estimates[estimates.length - 1];
        let bestGap = Infinity;
        for (let i = 1; i < estimates.length; i++) {
            const gap = Math.abs(estimates[i] - estimates[i - 1]);
            if (gap <= bestGap) {
                bestGap = gap;
                best = estimates[i];
            }
        }
        if (bestGap > 1e-4 * Math.max(1, Math.abs(best))) return NaN;
        return Math.abs(best) < 1e-9 ? 0 : parseFloat(best.toPrecision(8));
    };

    const left = Number.isFinite(point) ? sideLimit(-1) : NaN;
    const right = sideLimit(point === -Infinity ? -1 : 1);
    if (!Number.isFinite(point)) {
        const value = right;
        return { value, exists: !Number.isNaN(value), left: value, right: value };
    }

    let value;
    if (direction === 'left') value = left;
    else if (direction === 'right') value = right;
    else if (left === right || (Number.isFinite(left) && Number.isFinite(right)
        && Math.abs(left - right) <= 1e-6 * Math.max(1, Math.abs(left)))) value = left;
    else value = NaN;

    return { value, exists: !Number.isNaN(value), left, right };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        evaluateLimitFunction,
        evaluateLimit
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.evaluateLimitFunction = evaluateLimitFunction;
    window.evaluateLimit = evaluateLimit;
}