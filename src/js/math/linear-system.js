// ===================================
// LINEAR SYSTEMS (GAUSSIAN ELIMINATION)
// ===================================

function formatSystemNumber(value, digits = 8) {
    if (Math.abs(value) < 1e-12) return '0';
    return String(parseFloat(value.toPrecision(digits)));
}

// Steps are meant to be read, so they use fewer digits than the final answer
function snapshotMatrix(rows) {
    return rows.map(row => row.map(value => formatSystemNumber(value, 5)));
}

/**
 * Solve A x = b by Gaussian elimination with partial pivoting.
 * @param {number[][]} A n x n coefficient matrix
 * @param {number[]} b right hand side
 * @returns {{status:'unique'|'infinite'|'none'|'invalid', solution:number[]|null, rank:number,
 *   steps:{description:string, matrix:string[][]}[]}}
 *   steps hold a snapshot of the augmented matrix after each row operation.
 */
function solveLinearSystem(A, b) {
    const n = A.length;
    const invalid = { status: 'invalid', solution: null, rank: 0, steps: [] };
    if (n === 0 || b.length !== n || A.some(row => row.length !== n)) return invalid;
    if (![...A.flat(), ...b].every(Number.isFinite)) return invalid;

    const rows = A.map((row, i) => [...row, b[i]]);
    const steps = [{ description: 'start', matrix: snapshotMatrix(rows) }];

    // Tolerance relative to the largest coefficient, so scaling a system does not change its verdict
    const scale = Math.max(1, ...A.flat().map(Math.abs));
    const eps = 1e-10 * scale;

    let rank = 0;
    const pivotColumns = [];
    for (let col = 0; col < n && rank < n; col++) {
        // Partial pivoting: the largest entry in the column keeps rounding errors small
        let best = rank;
        for (let r = rank + 1; r < n; r++) {
            if (Math.abs(rows[r][col]) > Math.abs(rows[best][col])) best = r;
        }
        if (Math.abs(rows[best][col]) <= eps) continue;

        if (best !== rank) {
            [rows[rank], rows[best]] = [rows[best], rows[rank]];
            steps.push({ description: `R${rank + 1} ↔ R${best + 1}`, matrix: snapshotMatrix(rows) });
        }

        for (let r = rank + 1; r < n; r++) {
            const factor = rows[r][col] / rows[rank][col];
            if (factor === 0) continue;
            for (let c = col; c <= n; c++) rows[r][c] -= factor * rows[rank][c];
            rows[r][col] = 0;
            const sign = factor < 0 ? '+' : '−';
            steps.push({
                description: `R${r + 1} ← R${r + 1} ${sign} ${formatSystemNumber(Math.abs(factor), 5)}·R${rank + 1}`,
                matrix: snapshotMatrix(rows)
            });
        }
        pivotColumns.push(col);
        rank++;
    }

    // A zero row with a non-zero right hand side is a contradiction
    for (let r = rank; r < n; r++) {
        if (Math.abs(rows[r][n]) > eps) {
            return { status: 'none', solution: null, rank, steps };
        }
    }
    if (rank < n) {
        return { status: 'infinite', solution: null, rank, steps };
    }

    const solution = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) {
        let sum = rows[r][n];
        for (let c = r + 1; c < n; c++) sum -= rows[r][c] * solution[c];
        solution[r] = sum / rows[r][r];
    }
    return { status: 'unique', solution, rank, steps };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { solveLinearSystem, formatSystemNumber };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.solveLinearSystem = solveLinearSystem;
    window.formatSystemNumber = formatSystemNumber;
}
