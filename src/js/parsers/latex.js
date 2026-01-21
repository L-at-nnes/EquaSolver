// ===================================
// LATEX PARSER
// ===================================

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
    
    const type = ['constant', 'linear', 'quadratic', 'cubic', 'quartic', 'quintic'][maxDegree] || 'polynomial';
    
    return { type, coefficients };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseLatexEquation
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.parseLatexEquation = parseLatexEquation;
}

