// ===================================
// NUMERIC ROOT FINDING
// ===================================

// Turns "x^3 - x = 2" into the single expression "(x^3 - x)-(2)". Returns null for more than one "=".
function toRootExpression(text) {
    if (typeof text !== 'string') return null;
    const sides = text.split('=');
    if (sides.length > 2) return null;
    if (sides.length === 1) return sides[0].trim() || null;
    const [left, right] = sides.map(s => s.trim());
    return left && right ? `(${left})-(${right})` : null;
}

// Bisection on [a, b]. Returns null when f(a) and f(b) have the same sign (or are not finite).
function bisection(f, a, b, tolerance = 1e-10, maxIterations = 100) {
    if (!(a < b)) [a, b] = [b, a];
    let fa = f(a);
    const fb = f(b);
    if (!Number.isFinite(fa) || !Number.isFinite(fb)) return null;
    if (fa === 0) return { root: a, converged: true, steps: [] };
    if (fb === 0) return { root: b, converged: true, steps: [] };
    if (fa * fb > 0) return null;

    const steps = [];
    let mid = a;
    for (let n = 1; n <= maxIterations; n++) {
        mid = (a + b) / 2;
        const fm = f(mid);
        steps.push({ n, a, b, x: mid, fx: fm });
        if (fm === 0 || (b - a) / 2 < tolerance) return { root: mid, converged: true, steps };
        if (fa * fm < 0) b = mid;
        else { a = mid; fa = fm; }
    }
    return { root: mid, converged: false, steps };
}

// Central difference with a step scaled to x.
function numericDerivative(f, x) {
    const h = 1e-6 * Math.max(1, Math.abs(x));
    return (f(x + h) - f(x - h)) / (2 * h);
}

// Newton's method with a numeric derivative. Returns null for a non finite start.
function newton(f, x0, tolerance = 1e-12, maxIterations = 50) {
    let x = x0;
    if (!Number.isFinite(f(x))) return null;
    const steps = [];
    for (let n = 1; n <= maxIterations; n++) {
        const fx = f(x);
        const dfx = numericDerivative(f, x);
        if (!Number.isFinite(fx) || !Number.isFinite(dfx) || Math.abs(dfx) < 1e-14) {
            steps.push({ n, x, fx, dfx });
            return { root: x, converged: false, steps };
        }
        const next = x - fx / dfx;
        steps.push({ n, x, fx, dfx });
        if (Math.abs(next - x) <= tolerance * Math.max(1, Math.abs(next))) {
            return { root: next, converged: true, steps };
        }
        x = next;
    }
    return { root: x, converged: false, steps };
}

// Finds every sign change of f on [lo, hi] on a regular grid and refines each by bisection.
function scanRoots(f, lo, hi, samples = 2000) {
    if (!(lo < hi) || !Number.isFinite(lo) || !Number.isFinite(hi)) return [];
    const roots = [];
    const dx = (hi - lo) / samples;
    let x0 = lo;
    let f0 = f(x0);
    for (let i = 1; i <= samples; i++) {
        const x1 = i === samples ? hi : lo + i * dx;
        const f1 = f(x1);
        if (f0 === 0) {
            roots.push(x0);
        } else if (Number.isFinite(f0) && Number.isFinite(f1) && f0 * f1 < 0) {
            const found = bisection(f, x0, x1, 1e-13, 200);
            // A sign change across a pole of 1/x is not a root.
            if (found && Math.abs(f(found.root)) < 1e-6 * Math.max(1, Math.abs(f0), Math.abs(f1))) roots.push(found.root);
        }
        x0 = x1;
        f0 = f1;
    }
    if (f0 === 0) roots.push(x0);
    return roots;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { toRootExpression, bisection, numericDerivative, newton, scanRoots };
}

if (typeof window !== 'undefined') {
    window.toRootExpression = toRootExpression;
    window.bisection = bisection;
    window.numericDerivative = numericDerivative;
    window.newton = newton;
    window.scanRoots = scanRoots;
}
