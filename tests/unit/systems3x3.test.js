/**
 * Tests for 3x3 Systems of Linear Equations (Cramer's Rule)
 * a1*x + b1*y + c1*z = d1
 * a2*x + b2*y + c2*z = d2
 * a3*x + b3*y + c3*z = d3
 */

describe('3x3 System of Equations Solver', () => {
    // Helper function to calculate 3x3 determinant
    const det3x3 = (a1, b1, c1, a2, b2, c2, a3, b3, c3) => {
        return a1 * (b2 * c3 - b3 * c2) - 
               b1 * (a2 * c3 - a3 * c2) + 
               c1 * (a2 * b3 - a3 * b2);
    };

    test('should solve simple system: x + y = 6, 2x + y + z = 11, x + 2y + z = 11', () => {
        // x + y + 0z = 6
        // 2x + y + z = 11
        // x + 2y + z = 11
        // Expected solution: x = 3, y = 3, z = 2
        const a1 = 1, b1 = 1, c1 = 0, d1 = 6;
        const a2 = 2, b2 = 1, c2 = 1, d2 = 11;
        const a3 = 1, b3 = 2, c3 = 1, d3 = 11;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
        const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
        const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
        
        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;
        
        // Verify by substitution
        expect(a1 * x + b1 * y + c1 * z).toBeCloseTo(d1, 2);
        expect(a2 * x + b2 * y + c2 * z).toBeCloseTo(d2, 2);
        expect(a3 * x + b3 * y + c3 * z).toBeCloseTo(d3, 2);
    });

    test('should solve system: 2x + y - z = 1, x + 3y + z = 5, 3x - y + 2z = 3', () => {
        // Expected solution: x = 0.56, y = 1.24, z = 1.12 (approximately)
        const a1 = 2, b1 = 1, c1 = -1, d1 = 1;
        const a2 = 1, b2 = 3, c2 = 1, d2 = 5;
        const a3 = 3, b3 = -1, c3 = 2, d3 = 3;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
        const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
        const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
        
        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;
        
        // Verify by substitution
        expect(a1 * x + b1 * y + c1 * z).toBeCloseTo(d1, 2);
        expect(a2 * x + b2 * y + c2 * z).toBeCloseTo(d2, 2);
        expect(a3 * x + b3 * y + c3 * z).toBeCloseTo(d3, 2);
    });

    test('should solve system with negative results: x + 2y + 3z = 14, 2x - y + z = 3, 3x + y - z = -2', () => {
        // Expected solution: x = 0.2, y = 3.6, z = 2.8 (approximately)
        const a1 = 1, b1 = 2, c1 = 3, d1 = 14;
        const a2 = 2, b2 = -1, c2 = 1, d2 = 3;
        const a3 = 3, b3 = 1, c3 = -1, d3 = -2;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
        const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
        const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
        
        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;
        
        // Verify by substitution
        expect(a1 * x + b1 * y + c1 * z).toBeCloseTo(d1, 2);
        expect(a2 * x + b2 * y + c2 * z).toBeCloseTo(d2, 2);
        expect(a3 * x + b3 * y + c3 * z).toBeCloseTo(d3, 2);
    });

    test('should detect singular system (det = 0): dependent equations', () => {
        // x + y + z = 3
        // 2x + 2y + 2z = 6  (same as first equation * 2)
        // 3x + 3y + 3z = 9  (same as first equation * 3)
        const a1 = 1, b1 = 1, c1 = 1;
        const a2 = 2, b2 = 2, c2 = 2;
        const a3 = 3, b3 = 3, c3 = 3;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        expect(Math.abs(det)).toBeLessThan(1e-10);
    });

    test('should detect inconsistent system (det = 0): no solution', () => {
        // x + y + z = 1
        // x + y + z = 2  (parallel, different constant)
        // 2x + 2y + 2z = 5
        const a1 = 1, b1 = 1, c1 = 1;
        const a2 = 1, b2 = 1, c2 = 1;
        const a3 = 2, b3 = 2, c3 = 2;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        expect(Math.abs(det)).toBeLessThan(1e-10);
    });

    test('should solve system with fractional coefficients', () => {
        const a1 = 0.5, b1 = 1, c1 = 1.5, d1 = 5;
        const a2 = 1, b2 = 0.5, c2 = 2, d2 = 6;
        const a3 = 2, b3 = 1, c3 = 0.5, d3 = 7;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        
        if (Math.abs(det) > 1e-10) {
            const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
            const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
            const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
            
            const x = detX / det;
            const y = detY / det;
            const z = detZ / det;
            
            // Verify solution by substitution
            expect(a1 * x + b1 * y + c1 * z).toBeCloseTo(d1, 3);
            expect(a2 * x + b2 * y + c2 * z).toBeCloseTo(d2, 3);
            expect(a3 * x + b3 * y + c3 * z).toBeCloseTo(d3, 3);
        }
    });

    test('should solve identity system: x = 1, y = 2, z = 3', () => {
        // x + 0y + 0z = 1
        // 0x + y + 0z = 2
        // 0x + 0y + z = 3
        const a1 = 1, b1 = 0, c1 = 0, d1 = 1;
        const a2 = 0, b2 = 1, c2 = 0, d2 = 2;
        const a3 = 0, b3 = 0, c3 = 1, d3 = 3;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
        const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
        const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
        
        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;
        
        expect(x).toBeCloseTo(1, 4);
        expect(y).toBeCloseTo(2, 4);
        expect(z).toBeCloseTo(3, 4);
    });

    test('should handle system with zeros in various positions', () => {
        // 2x + 0y + z = 5
        // 0x + 3y + z = 8
        // x + y + 0z = 4
        // Expected solution: x = 1.8, y = 2.2, z = 1.4
        const a1 = 2, b1 = 0, c1 = 1, d1 = 5;
        const a2 = 0, b2 = 3, c2 = 1, d2 = 8;
        const a3 = 1, b3 = 1, c3 = 0, d3 = 4;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
        const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
        const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
        
        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;
        
        // Verify by substitution
        expect(a1 * x + b1 * y + c1 * z).toBeCloseTo(d1, 2);
        expect(a2 * x + b2 * y + c2 * z).toBeCloseTo(d2, 2);
        expect(a3 * x + b3 * y + c3 * z).toBeCloseTo(d3, 2);
    });

    test('should handle large coefficient values', () => {
        const a1 = 100, b1 = 200, c1 = 300, d1 = 1400;
        const a2 = 50, b2 = 150, c2 = 100, d2 = 600;
        const a3 = 75, b3 = 125, c3 = 175, d3 = 875;
        
        const det = det3x3(a1, b1, c1, a2, b2, c2, a3, b3, c3);
        
        if (Math.abs(det) > 1e-10) {
            const detX = det3x3(d1, b1, c1, d2, b2, c2, d3, b3, c3);
            const detY = det3x3(a1, d1, c1, a2, d2, c2, a3, d3, c3);
            const detZ = det3x3(a1, b1, d1, a2, b2, d2, a3, b3, d3);
            
            const x = detX / det;
            const y = detY / det;
            const z = detZ / det;
            
            // Verify solution
            expect(a1 * x + b1 * y + c1 * z).toBeCloseTo(d1, 2);
            expect(a2 * x + b2 * y + c2 * z).toBeCloseTo(d2, 2);
            expect(a3 * x + b3 * y + c3 * z).toBeCloseTo(d3, 2);
        }
    });
});
