// ===================================
// TRIGONOMETRIC EQUATION SOLVER
// ===================================

function normalizeAndSortUnique(values, epsilon = 1e-8) {
    const sorted = [...values].sort((a, b) => a - b);
    const unique = [];
    for (const v of sorted) {
        if (unique.length === 0 || Math.abs(v - unique[unique.length - 1]) > epsilon) {
            unique.push(v);
        }
    }
    return unique;
}

/**
 * Solve trigonometric equations of form sin(x)=k, cos(x)=k, tan(x)=k on [domainStart, domainEnd]
 */
function solveTrigonometricEquation(func, k, domainStart = -2 * Math.PI, domainEnd = 2 * Math.PI) {
    const PI = Math.PI;
    const solutions = [];
    const period = 2 * PI;

    if (!Number.isFinite(k) || !Number.isFinite(domainStart) || !Number.isFinite(domainEnd) || domainStart > domainEnd) {
        return { solutions: [], error: 'Invalid input or domain' };
    }

    if (func === 'sin') {
        if (Math.abs(k) > 1) {
            return { solutions: [], error: 'sin(x) = k has no real solution for |k| > 1' };
        }

        const alpha = Math.asin(k);
        const base1 = alpha;
        const base2 = PI - alpha;

        const nStart1 = Math.ceil((domainStart - base1) / period);
        const nEnd1 = Math.floor((domainEnd - base1) / period);
        for (let n = nStart1; n <= nEnd1; n++) {
            solutions.push(base1 + n * period);
        }

        const nStart2 = Math.ceil((domainStart - base2) / period);
        const nEnd2 = Math.floor((domainEnd - base2) / period);
        for (let n = nStart2; n <= nEnd2; n++) {
            solutions.push(base2 + n * period);
        }
    } else if (func === 'cos') {
        if (Math.abs(k) > 1) {
            return { solutions: [], error: 'cos(x) = k has no real solution for |k| > 1' };
        }

        const alpha = Math.acos(k);
        const base1 = alpha;
        const base2 = -alpha;

        const nStart1 = Math.ceil((domainStart - base1) / period);
        const nEnd1 = Math.floor((domainEnd - base1) / period);
        for (let n = nStart1; n <= nEnd1; n++) {
            solutions.push(base1 + n * period);
        }

        const nStart2 = Math.ceil((domainStart - base2) / period);
        const nEnd2 = Math.floor((domainEnd - base2) / period);
        for (let n = nStart2; n <= nEnd2; n++) {
            solutions.push(base2 + n * period);
        }
    } else if (func === 'tan') {
        const alpha = Math.atan(k);
        const nStart = Math.ceil((domainStart - alpha) / PI);
        const nEnd = Math.floor((domainEnd - alpha) / PI);
        for (let n = nStart; n <= nEnd; n++) {
            solutions.push(alpha + n * PI);
        }
    } else {
        return { solutions: [], error: 'Unsupported trigonometric function' };
    }

    return {
        solutions: normalizeAndSortUnique(solutions),
        error: null
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { solveTrigonometricEquation, normalizeAndSortUnique };
}

if (typeof window !== 'undefined') {
    window.solveTrigonometricEquation = solveTrigonometricEquation;
}
