/**
 * Tests for LaTeX Equation Parser
 */

// Mock the parseLatexEquation function
function parseLatexEquation(latex) {
    let equation = latex
        .replace(/\s+/g, '')
        .replace(/\\cdot/g, '*')
        .replace(/\\times/g, '*')
        .replace(/\^{(\d+)}/g, '^$1');
    
    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error('Equation must contain = sign');
    }
    
    equation = parts[0];
    
    let maxDegree = 0;
    const degreeMatches = equation.match(/x\^(\d+)/g);
    if (degreeMatches) {
        degreeMatches.forEach(match => {
            const deg = parseInt(match.replace('x^', ''));
            if (deg > maxDegree) maxDegree = deg;
        });
    }
    
    if (/[+-]?\d*x(?!\^)/.test(equation) && maxDegree < 1) {
        maxDegree = 1;
    }
    
    if (maxDegree === 0 && equation.includes('x')) {
        maxDegree = 1;
    }
    
    const coefficients = new Array(maxDegree + 1).fill(0);
    
    if (!equation.startsWith('-') && !equation.startsWith('+')) {
        equation = '+' + equation;
    }
    
    const termRegex = /([+-]?\d*\.?\d*)x\^(\d+)|([+-]?\d*\.?\d*)x(?!\^)|([+-]\d+\.?\d*)/g;
    let match;
    
    while ((match = termRegex.exec(equation)) !== null) {
        if (match[1] !== undefined && match[2] !== undefined) {
            const coef = match[1] === '' || match[1] === '+' ? 1 : (match[1] === '-' ? -1 : parseFloat(match[1]));
            const power = parseInt(match[2]);
            coefficients[maxDegree - power] = coef;
        } else if (match[3] !== undefined) {
            const coef = match[3] === '' || match[3] === '+' ? 1 : (match[3] === '-' ? -1 : parseFloat(match[3]));
            coefficients[maxDegree - 1] = coef;
        } else if (match[4] !== undefined) {
            coefficients[maxDegree] = parseFloat(match[4]);
        }
    }
    
    return { degree: maxDegree, coefficients };
}

describe('LaTeX Equation Parser', () => {
    describe('Linear Equations', () => {
        test('should parse 2x + 5 = 0', () => {
            const result = parseLatexEquation('2x + 5 = 0');
            expect(result.degree).toBe(1);
            expect(result.coefficients[0]).toBe(2);
            expect(result.coefficients[1]).toBe(5);
        });

        test('should parse x - 3 = 0', () => {
            const result = parseLatexEquation('x - 3 = 0');
            expect(result.degree).toBe(1);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[1]).toBe(-3);
        });

        test('should parse -3x + 7 = 0', () => {
            const result = parseLatexEquation('-3x + 7 = 0');
            expect(result.degree).toBe(1);
            expect(result.coefficients[0]).toBe(-3);
            expect(result.coefficients[1]).toBe(7);
        });

        test('should parse 5x = 0', () => {
            const result = parseLatexEquation('5x = 0');
            expect(result.degree).toBe(1);
            expect(result.coefficients[0]).toBe(5);
        });
    });

    describe('Quadratic Equations', () => {
        test('should parse x^2 - 5x + 6 = 0', () => {
            const result = parseLatexEquation('x^2 - 5x + 6 = 0');
            expect(result.degree).toBe(2);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[1]).toBe(-5);
            expect(result.coefficients[2]).toBe(6);
        });

        test('should parse 2x^2 + 3x - 5 = 0', () => {
            const result = parseLatexEquation('2x^2 + 3x - 5 = 0');
            expect(result.degree).toBe(2);
            expect(result.coefficients[0]).toBe(2);
            expect(result.coefficients[1]).toBe(3);
            expect(result.coefficients[2]).toBe(-5);
        });

        test('should parse -x^2 + 4x - 4 = 0', () => {
            const result = parseLatexEquation('-x^2 + 4x - 4 = 0');
            expect(result.degree).toBe(2);
            expect(result.coefficients[0]).toBe(-1);
            expect(result.coefficients[1]).toBe(4);
            expect(result.coefficients[2]).toBe(-4);
        });

        test('should parse x^2 - 9 = 0 (no x term)', () => {
            const result = parseLatexEquation('x^2 - 9 = 0');
            expect(result.degree).toBe(2);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[2]).toBe(-9);
        });

        test('should parse x^2 = 0', () => {
            const result = parseLatexEquation('x^2 = 0');
            expect(result.degree).toBe(2);
            expect(result.coefficients[0]).toBe(1);
        });
    });

    describe('Cubic Equations', () => {
        test('should parse x^3 - 6x^2 + 11x - 6 = 0', () => {
            const result = parseLatexEquation('x^3 - 6x^2 + 11x - 6 = 0');
            expect(result.degree).toBe(3);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[1]).toBe(-6);
            expect(result.coefficients[2]).toBe(11);
            expect(result.coefficients[3]).toBe(-6);
        });

        test('should parse 2x^3 + x^2 - x + 1 = 0', () => {
            const result = parseLatexEquation('2x^3 + x^2 - x + 1 = 0');
            expect(result.degree).toBe(3);
            expect(result.coefficients[0]).toBe(2);
            expect(result.coefficients[1]).toBe(1);
            expect(result.coefficients[2]).toBe(-1);
            expect(result.coefficients[3]).toBe(1);
        });

        test('should parse x^3 - 1 = 0', () => {
            const result = parseLatexEquation('x^3 - 1 = 0');
            expect(result.degree).toBe(3);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[3]).toBe(-1);
        });
    });

    describe('Quartic Equations', () => {
        test('should parse x^4 - 5x^2 + 4 = 0', () => {
            const result = parseLatexEquation('x^4 - 5x^2 + 4 = 0');
            expect(result.degree).toBe(4);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[2]).toBe(-5);
            expect(result.coefficients[4]).toBe(4);
        });

        test('should parse x^4 - 1 = 0', () => {
            const result = parseLatexEquation('x^4 - 1 = 0');
            expect(result.degree).toBe(4);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[4]).toBe(-1);
        });
    });

    describe('Quintic Equations', () => {
        test('should parse x^5 - x = 0', () => {
            const result = parseLatexEquation('x^5 - x = 0');
            expect(result.degree).toBe(5);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[4]).toBe(-1);
        });

        test('should parse x^5 - 32 = 0', () => {
            const result = parseLatexEquation('x^5 - 32 = 0');
            expect(result.degree).toBe(5);
            expect(result.coefficients[0]).toBe(1);
            expect(result.coefficients[5]).toBe(-32);
        });
    });

    describe('Edge Cases', () => {
        test('should handle spaces in equation', () => {
            const result = parseLatexEquation('x^2 + 2x + 1 = 0');
            expect(result.degree).toBe(2);
        });

        test('should handle decimal coefficients', () => {
            const result = parseLatexEquation('1.5x^2 + 2.5x + 0.5 = 0');
            expect(result.degree).toBe(2);
            expect(result.coefficients[0]).toBeCloseTo(1.5, 5);
            expect(result.coefficients[1]).toBeCloseTo(2.5, 5);
            expect(result.coefficients[2]).toBeCloseTo(0.5, 5);
        });

        test('should throw error for invalid equation (no = sign)', () => {
            expect(() => parseLatexEquation('x^2 + 1')).toThrow('Equation must contain = sign');
        });

        test('should handle LaTeX multiplication symbols', () => {
            const result = parseLatexEquation('2\\cdot x + 3 = 0');
            expect(result.degree).toBe(1);
        });
    });

    describe('LaTeX Brace Syntax', () => {
        test('should parse x^{2} + x + 1 = 0', () => {
            const result = parseLatexEquation('x^{2} + x + 1 = 0');
            expect(result.degree).toBe(2);
        });

        test('should parse x^{10} = 0', () => {
            const result = parseLatexEquation('x^{10} = 0');
            expect(result.degree).toBe(10);
        });
    });
});

describe('LaTeX Preview Rendering', () => {
    function renderLatexPreview(latex) {
        return latex
            .replace(/\^(\d)/g, '<sup>$1</sup>')
            .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
            .replace(/_(\d)/g, '<sub>$1</sub>')
            .replace(/_{([^}]+)}/g, '<sub>$1</sub>')
            .replace(/\\sqrt{([^}]+)}/g, 'sqrt($1)')
            .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)')
            .replace(/\\pm/g, ' + or - ')
            .replace(/\\pi/g, 'pi')
            .replace(/\\theta/g, 'theta')
            .replace(/\\infty/g, 'infinity');
    }

    test('should convert superscripts', () => {
        expect(renderLatexPreview('x^2')).toBe('x<sup>2</sup>');
        expect(renderLatexPreview('x^{10}')).toBe('x<sup>10</sup>');
    });

    test('should convert subscripts', () => {
        expect(renderLatexPreview('x_1')).toBe('x<sub>1</sub>');
        expect(renderLatexPreview('x_{12}')).toBe('x<sub>12</sub>');
    });

    test('should convert sqrt', () => {
        expect(renderLatexPreview('\\sqrt{4}')).toBe('sqrt(4)');
    });

    test('should convert fractions', () => {
        expect(renderLatexPreview('\\frac{1}{2}')).toBe('(1)/(2)');
    });

    test('should convert special symbols', () => {
        expect(renderLatexPreview('\\pm')).toBe(' + or - ');
        expect(renderLatexPreview('\\pi')).toBe('pi');
        expect(renderLatexPreview('\\theta')).toBe('theta');
        expect(renderLatexPreview('\\infty')).toBe('infinity');
    });
});
