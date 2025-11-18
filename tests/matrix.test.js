/**
 * Tests for Matrix Calculator Operations
 */

describe('Matrix Calculator', () => {
    
    // Matrix Addition Tests
    describe('Matrix Addition', () => {
        test('should add two 2x2 matrices', () => {
            const A = [[1, 2], [3, 4]];
            const B = [[5, 6], [7, 8]];
            const result = addMatrices(A, B);
            
            expect(result[0][0]).toBe(6);
            expect(result[0][1]).toBe(8);
            expect(result[1][0]).toBe(10);
            expect(result[1][1]).toBe(12);
        });
        
        test('should add two 3x3 matrices', () => {
            const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
            const B = [[9, 8, 7], [6, 5, 4], [3, 2, 1]];
            const result = addMatrices(A, B);
            
            expect(result[0][0]).toBe(10);
            expect(result[1][1]).toBe(10);
            expect(result[2][2]).toBe(10);
        });
        
        test('should handle negative numbers in addition', () => {
            const A = [[1, -2], [3, 4]];
            const B = [[-1, 2], [-3, -4]];
            const result = addMatrices(A, B);
            
            expect(result[0][0]).toBe(0);
            expect(result[0][1]).toBe(0);
            expect(result[1][0]).toBe(0);
            expect(result[1][1]).toBe(0);
        });
    });
    
    // Matrix Multiplication Tests
    describe('Matrix Multiplication', () => {
        test('should multiply two 2x2 matrices', () => {
            const A = [[1, 2], [3, 4]];
            const B = [[5, 6], [7, 8]];
            const result = multiplyMatrices(A, B);
            
            expect(result[0][0]).toBe(19);  // 1*5 + 2*7
            expect(result[0][1]).toBe(22);  // 1*6 + 2*8
            expect(result[1][0]).toBe(43);  // 3*5 + 4*7
            expect(result[1][1]).toBe(50);  // 3*6 + 4*8
        });
        
        test('should multiply by identity matrix', () => {
            const A = [[2, 3], [4, 5]];
            const I = [[1, 0], [0, 1]];
            const result = multiplyMatrices(A, I);
            
            expect(result[0][0]).toBe(2);
            expect(result[0][1]).toBe(3);
            expect(result[1][0]).toBe(4);
            expect(result[1][1]).toBe(5);
        });
        
        test('should multiply 3x3 matrices', () => {
            const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
            const B = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            const result = multiplyMatrices(A, B);
            
            // Multiplying by identity should give same matrix
            expect(result[0][0]).toBe(1);
            expect(result[1][1]).toBe(5);
            expect(result[2][2]).toBe(9);
        });
    });
    
    // Determinant Tests
    describe('Determinant Calculation', () => {
        test('should calculate determinant of 2x2 matrix', () => {
            const matrix = [[1, 2], [3, 4]];
            const det = calculateDeterminant(matrix);
            expect(det).toBe(-2);  // 1*4 - 2*3 = -2
        });
        
        test('should calculate determinant of identity matrix', () => {
            const matrix = [[1, 0], [0, 1]];
            const det = calculateDeterminant(matrix);
            expect(det).toBe(1);
        });
        
        test('should calculate determinant of 3x3 matrix', () => {
            const matrix = [[1, 2, 3], [0, 1, 4], [5, 6, 0]];
            const det = calculateDeterminant(matrix);
            expect(det).toBe(1);  // Using cofactor expansion
        });
        
        test('should detect singular matrix (det = 0)', () => {
            const matrix = [[1, 2], [2, 4]];
            const det = calculateDeterminant(matrix);
            expect(det).toBe(0);
        });
        
        test('should calculate determinant of 3x3 identity', () => {
            const matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            const det = calculateDeterminant(matrix);
            expect(det).toBe(1);
        });
    });
    
    // Matrix Inverse Tests
    describe('Matrix Inverse', () => {
        test('should invert 2x2 matrix', () => {
            const matrix = [[1, 2], [3, 4]];
            const inv = invertMatrix(matrix);
            
            expect(inv).not.toBeNull();
            expect(inv[0][0]).toBeCloseTo(-2, 5);
            expect(inv[0][1]).toBeCloseTo(1, 5);
            expect(inv[1][0]).toBeCloseTo(1.5, 5);
            expect(inv[1][1]).toBeCloseTo(-0.5, 5);
        });
        
        test('should invert identity matrix to itself', () => {
            const matrix = [[1, 0], [0, 1]];
            const inv = invertMatrix(matrix);
            
            expect(inv[0][0]).toBeCloseTo(1, 5);
            expect(inv[0][1]).toBeCloseTo(0, 5);
            expect(inv[1][0]).toBeCloseTo(0, 5);
            expect(inv[1][1]).toBeCloseTo(1, 5);
        });
        
        test('should return null for singular matrix', () => {
            const matrix = [[1, 2], [2, 4]];  // det = 0
            const inv = invertMatrix(matrix);
            expect(inv).toBeNull();
        });
        
        test('should invert 3x3 matrix', () => {
            const matrix = [[1, 0, 0], [0, 2, 0], [0, 0, 3]];
            const inv = invertMatrix(matrix);
            
            expect(inv).not.toBeNull();
            expect(inv[0][0]).toBeCloseTo(1, 5);
            expect(inv[1][1]).toBeCloseTo(0.5, 5);
            expect(inv[2][2]).toBeCloseTo(1/3, 5);
        });
        
        test('should verify A * A^(-1) = I for 2x2', () => {
            const A = [[2, 3], [1, 4]];
            const inv = invertMatrix(A);
            const result = multiplyMatrices(A, inv);
            
            expect(result[0][0]).toBeCloseTo(1, 5);
            expect(result[0][1]).toBeCloseTo(0, 5);
            expect(result[1][0]).toBeCloseTo(0, 5);
            expect(result[1][1]).toBeCloseTo(1, 5);
        });
    });
});

// Helper functions (copied from script.js for testing)
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
