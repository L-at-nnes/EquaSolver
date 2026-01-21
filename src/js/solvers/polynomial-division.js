// ===================================
// POLYNOMIAL LONG DIVISION
// ===================================

function parsePolynomial(polyStr) {
    if (!polyStr || polyStr.trim() === '') {
        return null;
    }
    
    polyStr = polyStr.toLowerCase().replace(/\s/g, '');
    
    if (!polyStr.includes('x')) {
        const num = parseFloat(polyStr);
        return isNaN(num) ? null : [num];
    }
    
    const degreeMatches = polyStr.match(/x\^?(\d*)/g) || [];
    let maxDegree = 0;
    degreeMatches.forEach(match => {
        const degMatch = match.match(/\^(\d+)/);
        const deg = degMatch ? parseInt(degMatch[1]) : (match === 'x' ? 1 : 0);
        maxDegree = Math.max(maxDegree, deg);
    });
    
    const coeffs = new Array(maxDegree + 1).fill(0);
    
    polyStr = polyStr.replace(/-/g, '+-');
    const terms = polyStr.split('+').filter(t => t.length > 0);
    
    for (let term of terms) {
        term = term.trim();
        
        if (!term.includes('x')) {
            coeffs[maxDegree] = parseFloat(term);
            continue;
        }
        
        let coeff = 1;
        let degree = 1;
        
        const coeffMatch = term.match(/^([+-]?\d*\.?\d*)x/);
        if (coeffMatch) {
            const coeffStr = coeffMatch[1];
            if (coeffStr === '' || coeffStr === '+') coeff = 1;
            else if (coeffStr === '-') coeff = -1;
            else coeff = parseFloat(coeffStr);
        }
        
        const degreeMatch = term.match(/x\^(\d+)/);
        if (degreeMatch) {
            degree = parseInt(degreeMatch[1]);
        } else if (term.includes('x')) {
            degree = 1;
        }
        
        coeffs[maxDegree - degree] = coeff;
    }
    
    while (coeffs.length > 1 && coeffs[0] === 0) {
        coeffs.shift();
    }
    
    return coeffs.length > 0 ? coeffs : [0];
}

function dividePolynomials(dividend, divisor) {
    if (!dividend || !divisor || dividend.length === 0 || divisor.length === 0) {
        return null;
    }
    
    if (divisor.every(c => c === 0)) {
        return null;
    }
    
    let remainder = [...dividend];
    const quotient = [];
    
    divisor = [...divisor];
    while (divisor.length > 1 && divisor[0] === 0) {
        divisor.shift();
    }
    
    while (remainder.length >= divisor.length && !remainder.every(c => Math.abs(c) < 1e-10)) {
        const q = remainder[0] / divisor[0];
        quotient.push(q);
        
        for (let i = 0; i < divisor.length; i++) {
            remainder[i] -= q * divisor[i];
        }
        
        remainder.shift();
    }
    
    if (quotient.length === 0) {
        quotient.push(0);
    }
    
    for (let i = 0; i < quotient.length; i++) {
        if (Math.abs(quotient[i]) < 1e-10) quotient[i] = 0;
    }
    for (let i = 0; i < remainder.length; i++) {
        if (Math.abs(remainder[i]) < 1e-10) remainder[i] = 0;
    }
    
    while (remainder.length > 1 && Math.abs(remainder[0]) < 1e-10) {
        remainder.shift();
    }
    
    if (remainder.length === 0 || remainder.every(c => Math.abs(c) < 1e-10)) {
        remainder = [0];
    }
    
    return { quotient, remainder };
}

function formatPolynomial(coeffs) {
    if (!coeffs || coeffs.length === 0) return '0';
    
    const degree = coeffs.length - 1;
    const terms = [];
    
    for (let i = 0; i < coeffs.length; i++) {
        const coeff = coeffs[i];
        const deg = degree - i;
        
        if (Math.abs(coeff) < 1e-10) continue;
        
        let term = '';
        const absCoeff = Math.abs(coeff);
        const sign = coeff > 0 ? '+' : '-';
        
        if (deg === 0) {
            term = absCoeff.toString();
        } else if (Math.abs(absCoeff - 1) < 1e-10) {
            term = '';
        } else {
            term = absCoeff.toString();
        }
        
        if (deg === 1) {
            term += 'x';
        } else if (deg > 1) {
            term += `x^${deg}`;
        }
        
        terms.push(sign + ' ' + term);
    }
    
    if (terms.length === 0) return '0';
    
    let result = terms.join(' ');
    if (result.startsWith('+ ')) result = result.substring(2);
    
    return result;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parsePolynomial,
        dividePolynomials,
        formatPolynomial
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.parsePolynomial = parsePolynomial;
    window.dividePolynomials = dividePolynomials;
    window.formatPolynomial = formatPolynomial;
}