// ===================================
// LINEAR REGRESSION
// ===================================

/**
 * Parse "x y" or "x, y" pairs, one per line (semicolons also separate pairs).
 * @param {string} text
 * @returns {{points: {x:number, y:number}[], invalidLines: number[]}}
 *   invalidLines holds the 1-based numbers of lines that are not exactly two numbers.
 */
function parsePairs(text) {
    const points = [];
    const invalidLines = [];
    String(text ?? '').split(/[\n;]+/).forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') return;
        const parts = trimmed.split(/[\s,]+/).filter(Boolean).map(Number);
        if (parts.length === 2 && parts.every(Number.isFinite)) points.push({ x: parts[0], y: parts[1] });
        else invalidLines.push(index + 1);
    });
    return { points, invalidLines };
}

/**
 * Ordinary least squares fit y = slope * x + intercept.
 * @param {{x:number, y:number}[]} points
 * @returns {null | {slope:number, intercept:number, r:number, r2:number, n:number, meanX:number, meanY:number}}
 *   null with fewer than 2 points or when every x is identical (no unique line).
 *   r is NaN when every y is identical (correlation is undefined) and r2 is then 1.
 */
function linearRegression(points) {
    const n = points.length;
    if (n < 2) return null;
    const meanX = points.reduce((s, p) => s + p.x, 0) / n;
    const meanY = points.reduce((s, p) => s + p.y, 0) / n;
    let sxx = 0;
    let syy = 0;
    let sxy = 0;
    points.forEach(p => {
        sxx += (p.x - meanX) ** 2;
        syy += (p.y - meanY) ** 2;
        sxy += (p.x - meanX) * (p.y - meanY);
    });
    if (sxx === 0) return null;

    const slope = sxy / sxx;
    const intercept = meanY - slope * meanX;
    const r = syy === 0 ? NaN : sxy / Math.sqrt(sxx * syy);
    const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
    return { slope, intercept, r, r2, n, meanX, meanY };
}

/** "y = 2x + 1", "y = -0.5x", "y = 3" with noise-free coefficients. */
function formatRegressionLine(fit) {
    const clean = v => parseFloat(v.toPrecision(6));
    const slope = clean(fit.slope);
    const intercept = clean(fit.intercept);
    const slopePart = slope === 0 ? '' : `${slope === 1 ? '' : slope === -1 ? '-' : slope}x`;
    if (slopePart === '') return `y = ${intercept}`;
    if (intercept === 0) return `y = ${slopePart}`;
    return `y = ${slopePart} ${intercept < 0 ? '-' : '+'} ${Math.abs(intercept)}`;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parsePairs, linearRegression, formatRegressionLine };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.parsePairs = parsePairs;
    window.linearRegression = linearRegression;
    window.formatRegressionLine = formatRegressionLine;
}
