// ===================================
// MATRIX OPERATIONS
// ===================================

function addMatrices(A, B) {
    const size = A.length;
    const result = [];
    
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    
    return result;
}

function multiplyMatrices(A, B) {
    const size = A.length;
    const result = [];
    
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            result[i][j] = 0;
            for (let k = 0; k < size; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    return result;
}

function calculateDeterminant(matrix) {
    const size = matrix.length;
    
    if (size === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (size === 3) {
        return (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );
    }
    
    return 0;
}

function invertMatrix(matrix) {
    const size = matrix.length;
    const det = calculateDeterminant(matrix);
    
    if (Math.abs(det) < 1e-10) {
        return null;
    }
    
    if (size === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    } else if (size === 3) {
        const inv = [];
        
        inv[0] = [];
        inv[0][0] = (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) / det;
        inv[0][1] = -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]) / det;
        inv[0][2] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) / det;
        
        inv[1] = [];
        inv[1][0] = -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) / det;
        inv[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) / det;
        inv[1][2] = -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]) / det;
        
        inv[2] = [];
        inv[2][0] = (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) / det;
        inv[2][1] = -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]) / det;
        inv[2][2] = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) / det;
        
        return inv;
    }
    
    return null;
}

function transposeMatrix(matrix) {
    return matrix.map((_, i) => matrix.map(row => row[i]));
}

function matrixTrace(matrix) {
    return matrix.reduce((sum, row, i) => sum + row[i], 0);
}

/**
 * Rank by Gaussian elimination with partial pivoting. The tolerance is relative to
 * the largest entry so scaling a matrix does not change its rank.
 */
function matrixRank(matrix) {
    const rows = matrix.map(row => [...row]);
    const n = rows.length;
    const m = n ? rows[0].length : 0;
    const scale = Math.max(1, ...rows.flat().map(Math.abs));
    const eps = 1e-10 * scale;
    let rank = 0;
    for (let col = 0; col < m && rank < n; col++) {
        let best = rank;
        for (let r = rank + 1; r < n; r++) {
            if (Math.abs(rows[r][col]) > Math.abs(rows[best][col])) best = r;
        }
        if (Math.abs(rows[best][col]) <= eps) continue;
        [rows[rank], rows[best]] = [rows[best], rows[rank]];
        for (let r = rank + 1; r < n; r++) {
            const factor = rows[r][col] / rows[rank][col];
            for (let c = col; c < m; c++) rows[r][c] -= factor * rows[rank][c];
        }
        rank++;
    }
    return rank;
}

/**
 * Eigenvalues of a 2x2 or 3x3 matrix, as complex numbers {re, im}, from the characteristic
 * polynomial. Repeated eigenvalues are listed once per multiplicity. null for other sizes.
 */
function matrixEigenvalues(matrix) {
    const n = matrix.length;
    const complex = typeof solveQuadraticComplex === 'function' ? null : require('./complex.js');
    const quadratic = complex ? complex.solveQuadraticComplex : solveQuadraticComplex;
    const cubic = complex ? complex.solveCubicComplex : solveCubicComplex;

    if (n === 2) {
        const trace = matrixTrace(matrix);
        const det = calculateDeterminant(matrix);
        const roots = quadratic(1, -trace, det);
        return roots.length === 1 ? [roots[0], roots[0]] : roots;
    }
    if (n === 3) {
        const trace = matrixTrace(matrix);
        const det = calculateDeterminant(matrix);
        // sum of the principal 2x2 minors
        const minors =
            (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) +
            (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) +
            (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]);
        // lambda^3 - trace lambda^2 + minors lambda - det
        const roots = cubic(1, -trace, minors, -det);
        if (roots.length === 3) return roots;
        // The cubic solver lists a double or triple root once: restore multiplicities from the trace
        if (roots.length === 1) return [roots[0], roots[0], roots[0]];
        if (roots.length === 2) {
            const [a, b] = roots;
            // whichever of the two is repeated makes the sum equal the trace
            return Math.abs(2 * a.re + b.re - trace) < Math.abs(a.re + 2 * b.re - trace) ? [a, a, b] : [a, b, b];
        }
        return roots;
    }
    return null;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addMatrices,
        multiplyMatrices,
        calculateDeterminant,
        invertMatrix,
        transposeMatrix,
        matrixTrace,
        matrixRank,
        matrixEigenvalues
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.addMatrices = addMatrices;
    window.multiplyMatrices = multiplyMatrices;
    window.calculateDeterminant = calculateDeterminant;
    window.invertMatrix = invertMatrix;
    window.transposeMatrix = transposeMatrix;
    window.matrixTrace = matrixTrace;
    window.matrixRank = matrixRank;
    window.matrixEigenvalues = matrixEigenvalues;
}