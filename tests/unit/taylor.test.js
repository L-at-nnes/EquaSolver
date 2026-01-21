/**
 * Tests for Taylor Series Calculator
 * 
 * This test suite covers:
 * - Taylor/Maclaurin series for sin, cos, exp, ln, atan
 * - Convergence accuracy with different numbers of terms
 * - Mathematical properties
 */

// Mock DOM elements
document.body.innerHTML = `
    <select id="taylorFunction">
        <option value="sin">sin(x)</option>
        <option value="cos">cos(x)</option>
        <option value="exp">e^x</option>
        <option value="ln">ln(1+x)</option>
        <option value="atan">arctan(x)</option>
    </select>
    <input type="number" id="taylorPoint" value="0">
    <input type="number" id="taylorTerms" value="10">
    <div id="taylorSolution"></div>
    <button id="calculateTaylor"></button>
    <button id="exportTaylorPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        taylorResult: "Taylor Series",
        maclaurinNote: "Maclaurin series (a=0)",
        polynomialApprox: "Polynomial approximation",
        estimatedError: "Error"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    taylorSin,
    taylorCos,
    taylorExp,
    taylorLn,
    taylorAtan,
    factorialBig
} = require('../../src/js/index.js');

describe('Taylor Series for sin(x)', () => {
    describe('Maclaurin series (a=0)', () => {
        test('should approximate sin(0) = 0', () => {
            expect(taylorSin(0, 0, 5)).toBeCloseTo(0, 10);
        });

        test('should approximate sin(π/6) ≈ 0.5', () => {
            const approx = taylorSin(Math.PI/6, 0, 10);
            expect(approx).toBeCloseTo(0.5, 5);
        });

        test('should approximate sin(π/2) ≈ 1', () => {
            const approx = taylorSin(Math.PI/2, 0, 10);
            expect(approx).toBeCloseTo(1, 5);
        });

        test('should approximate sin(π) ≈ 0', () => {
            const approx = taylorSin(Math.PI, 0, 15);
            expect(approx).toBeCloseTo(0, 3);
        });
    });

    describe('Accuracy vs number of terms', () => {
        test('more terms should give better accuracy', () => {
            const x = 1;
            const exact = Math.sin(x);
            
            const error5 = Math.abs(taylorSin(x, 0, 5) - exact);
            const error10 = Math.abs(taylorSin(x, 0, 10) - exact);
            
            expect(error10).toBeLessThan(error5);
        });

        test('should converge to exact value', () => {
            const x = 0.5;
            const exact = Math.sin(x);
            const approx = taylorSin(x, 0, 15);
            
            expect(approx).toBeCloseTo(exact, 10);
        });
    });
});

describe('Taylor Series for cos(x)', () => {
    describe('Maclaurin series (a=0)', () => {
        test('should approximate cos(0) = 1', () => {
            expect(taylorCos(0, 0, 5)).toBeCloseTo(1, 10);
        });

        test('should approximate cos(π/3) ≈ 0.5', () => {
            const approx = taylorCos(Math.PI/3, 0, 10);
            expect(approx).toBeCloseTo(0.5, 5);
        });

        test('should approximate cos(π/2) ≈ 0', () => {
            const approx = taylorCos(Math.PI/2, 0, 15);
            expect(approx).toBeCloseTo(0, 5);
        });

        test('should approximate cos(π) ≈ -1', () => {
            const approx = taylorCos(Math.PI, 0, 15);
            expect(approx).toBeCloseTo(-1, 3);
        });
    });

    describe('Accuracy', () => {
        test('should converge to exact value', () => {
            const x = 0.7;
            const exact = Math.cos(x);
            const approx = taylorCos(x, 0, 15);
            
            expect(approx).toBeCloseTo(exact, 10);
        });
    });
});

describe('Taylor Series for exp(x)', () => {
    describe('Maclaurin series (a=0)', () => {
        test('should approximate e^0 = 1', () => {
            expect(taylorExp(0, 0, 5)).toBeCloseTo(1, 10);
        });

        test('should approximate e^1 ≈ 2.718', () => {
            const approx = taylorExp(1, 0, 15);
            expect(approx).toBeCloseTo(Math.E, 8);
        });

        test('should approximate e^(-1) ≈ 0.368', () => {
            const approx = taylorExp(-1, 0, 15);
            expect(approx).toBeCloseTo(1/Math.E, 8);
        });

        test('should approximate e^2', () => {
            const approx = taylorExp(2, 0, 15);
            expect(approx).toBeCloseTo(Math.exp(2), 5);
        });
    });

    describe('Expansion around different points', () => {
        test('should work for expansion around a=1', () => {
            const approx = taylorExp(1.5, 1, 10);
            expect(approx).toBeCloseTo(Math.exp(1.5), 5);
        });
    });
});

describe('Taylor Series for ln(1+x)', () => {
    describe('Maclaurin series (a=0)', () => {
        test('should approximate ln(1) = 0', () => {
            expect(taylorLn(0, 0, 5)).toBeCloseTo(0, 10);
        });

        test('should approximate ln(1.5) ≈ 0.405', () => {
            const approx = taylorLn(0.5, 0, 20);
            expect(approx).toBeCloseTo(Math.log(1.5), 3);
        });

        test('should approximate ln(2)', () => {
            // x = 1 for ln(1+1) = ln(2)
            const approx = taylorLn(1, 0, 50);
            expect(approx).toBeCloseTo(Math.log(2), 1);
        });
    });

    describe('Convergence radius |x| < 1', () => {
        test('should be accurate for small x', () => {
            const x = 0.1;
            const approx = taylorLn(x, 0, 10);
            expect(approx).toBeCloseTo(Math.log(1+x), 8);
        });
    });
});

describe('Taylor Series for arctan(x)', () => {
    describe('Maclaurin series (a=0)', () => {
        test('should approximate arctan(0) = 0', () => {
            expect(taylorAtan(0, 0, 5)).toBeCloseTo(0, 10);
        });

        test('should approximate arctan(1) = π/4', () => {
            // Converges slowly at x=1
            const approx = taylorAtan(1, 0, 100);
            expect(approx).toBeCloseTo(Math.PI/4, 1);
        });

        test('should approximate arctan(0.5)', () => {
            const approx = taylorAtan(0.5, 0, 20);
            expect(approx).toBeCloseTo(Math.atan(0.5), 8);
        });
    });

    describe('Convergence', () => {
        test('should be accurate for |x| < 1', () => {
            const x = 0.3;
            const approx = taylorAtan(x, 0, 15);
            expect(approx).toBeCloseTo(Math.atan(x), 10);
        });
    });
});

describe('Mathematical Properties', () => {
    test('sin^2(x) + cos^2(x) = 1 (approximated)', () => {
        const x = 0.7;
        const sinApprox = taylorSin(x, 0, 15);
        const cosApprox = taylorCos(x, 0, 15);
        
        expect(sinApprox*sinApprox + cosApprox*cosApprox).toBeCloseTo(1, 8);
    });

    test('exp(a)*exp(b) = exp(a+b)', () => {
        const a = 0.5;
        const b = 0.3;
        
        const expA = taylorExp(a, 0, 15);
        const expB = taylorExp(b, 0, 15);
        const expAB = taylorExp(a+b, 0, 15);
        
        expect(expA * expB).toBeCloseTo(expAB, 8);
    });

    test('cos(x) = sin(x + π/2) approximately', () => {
        const x = 0.5;
        const cosX = taylorCos(x, 0, 15);
        const sinXPlusHalfPi = taylorSin(x + Math.PI/2, 0, 15);
        
        expect(cosX).toBeCloseTo(sinXPlusHalfPi, 5);
    });

    test('derivative of sin approximation gives cos approximation', () => {
        // Numerical derivative of sin Taylor series should approximate cos
        const x = 0.5;
        const h = 0.0001;
        const sinDerivative = (taylorSin(x+h, 0, 15) - taylorSin(x, 0, 15)) / h;
        const cosAtX = taylorCos(x, 0, 15);
        
        expect(sinDerivative).toBeCloseTo(cosAtX, 3);
    });
});

describe('Term Count Effects', () => {
    test('single term of exp should give 1', () => {
        expect(taylorExp(1, 0, 1)).toBe(1); // First term is e^0 * (x-0)^0/0! = 1
    });

    test('single term of sin should give x', () => {
        expect(taylorSin(0.5, 0, 1)).toBeCloseTo(0.5, 10);
    });

    test('single term of cos should give 1', () => {
        expect(taylorCos(0.5, 0, 1)).toBeCloseTo(1, 10);
    });
});
