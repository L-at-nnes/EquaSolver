// ===================================
// COMPLEX NUMBER OPERATIONS
// ===================================

function complexAdd(a, b) {
    return { re: a.re + b.re, im: a.im + b.im };
}

function complexSub(a, b) {
    return { re: a.re - b.re, im: a.im - b.im };
}

function complexMul(a, b) {
    return {
        re: a.re * b.re - a.im * b.im,
        im: a.re * b.im + a.im * b.re
    };
}

function complexDiv(a, b) {
    const denom = b.re * b.re + b.im * b.im;
    if (denom === 0) return { re: NaN, im: NaN };
    return {
        re: (a.re * b.re + a.im * b.im) / denom,
        im: (a.im * b.re - a.re * b.im) / denom
    };
}

function complexScale(z, scalar) {
    return { re: z.re * scalar, im: z.im * scalar };
}

function complexPow(z, n) {
    if (n === 0) return { re: 1, im: 0 };
    if (n === 1) return z;
    
    // Use polar form for all exponents (including negative and fractional)
    const r = complexAbs(z);
    if (r === 0) return { re: 0, im: 0 };
    
    const theta = Math.atan2(z.im, z.re);
    const newR = Math.pow(r, n);
    const newTheta = n * theta;
    
    return {
        re: newR * Math.cos(newTheta),
        im: newR * Math.sin(newTheta)
    };
}

function complexSqrt(z) {
    const r = Math.sqrt(z.re * z.re + z.im * z.im);
    const theta = Math.atan2(z.im, z.re);
    return {
        re: Math.sqrt(r) * Math.cos(theta / 2),
        im: Math.sqrt(r) * Math.sin(theta / 2)
    };
}

function complexAbs(z) {
    return Math.sqrt(z.re * z.re + z.im * z.im);
}

function complexConjugate(z) {
    return { re: z.re, im: -z.im };
}

function isEssentiallyReal(z, tolerance = 1e-10) {
    return Math.abs(z.im) < tolerance;
}

function isEssentiallyZero(z, tolerance = 1e-10) {
    return Math.abs(z.re) < tolerance && Math.abs(z.im) < tolerance;
}

function formatComplex(z, decimals = 4) {
    const re = z.re;
    const im = z.im;
    const tolerance = Math.pow(10, -decimals);
    
    if (Math.abs(re) < tolerance && Math.abs(im) < tolerance) {
        return '0';
    }
    
    if (Math.abs(im) < tolerance) {
        return re.toFixed(decimals);
    }
    
    if (Math.abs(re) < tolerance) {
        if (Math.abs(im - 1) < tolerance) return 'i';
        if (Math.abs(im + 1) < tolerance) return '-i';
        return `${im.toFixed(decimals)}i`;
    }
    
    const sign = im >= 0 ? '+' : '-';
    const absIm = Math.abs(im);
    if (Math.abs(absIm - 1) < tolerance) {
        return `${re.toFixed(decimals)} ${sign} i`;
    }
    return `${re.toFixed(decimals)} ${sign} ${absIm.toFixed(decimals)}i`;
}

function complexFromReal(x) {
    return { re: x, im: 0 };
}

function evalPoly(coeffs, z) {
    let result = { re: 0, im: 0 };
    for (let i = 0; i < coeffs.length; i++) {
        const power = complexPow(z, coeffs.length - 1 - i);
        const term = complexScale(power, coeffs[i]);
        result = complexAdd(result, term);
    }
    return result;
}

function solveQuadraticComplex(a, b, c) {
    if (a === 0) {
        if (b === 0) {
            return c === 0 ? [{ re: 0, im: 0 }] : [];
        }
        return [complexFromReal(-c / b)];
    }
    
    const delta = b * b - 4 * a * c;
    
    if (delta >= 0) {
        const sqrtDelta = Math.sqrt(delta);
        return [
            complexFromReal((-b + sqrtDelta) / (2 * a)),
            complexFromReal((-b - sqrtDelta) / (2 * a))
        ];
    } else {
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-delta) / (2 * a);
        return [
            { re: realPart, im: imagPart },
            { re: realPart, im: -imagPart }
        ];
    }
}

function solveCubicComplex(a, b, c, d) {
    if (a === 0) {
        return solveQuadraticComplex(b, c, d);
    }
    
    const p = b / a;
    const q = c / a;
    const r = d / a;
    
    const p1 = q - p * p / 3;
    const q1 = r - p * q / 3 + 2 * p * p * p / 27;
    
    const discriminant = q1 * q1 / 4 + p1 * p1 * p1 / 27;
    
    const shift = -p / 3;
    let roots = [];
    
    if (Math.abs(discriminant) < 1e-10) {
        if (Math.abs(q1) < 1e-10) {
            roots = [complexFromReal(shift)];
        } else {
            const u = Math.cbrt(-q1 / 2);
            roots = [
                complexFromReal(2 * u + shift),
                complexFromReal(-u + shift)
            ];
        }
    } else if (discriminant > 0) {
        const sqrtD = Math.sqrt(discriminant);
        const u = Math.cbrt(-q1 / 2 + sqrtD);
        const v = Math.cbrt(-q1 / 2 - sqrtD);
        
        const realRoot = u + v + shift;
        const realPart = -(u + v) / 2 + shift;
        const imagPart = Math.sqrt(3) * (u - v) / 2;
        
        roots = [
            complexFromReal(realRoot),
            { re: realPart, im: imagPart },
            { re: realPart, im: -imagPart }
        ];
    } else {
        const m = 2 * Math.sqrt(-p1 / 3);
        const theta = Math.acos(3 * q1 / (p1 * m)) / 3;
        
        roots = [
            complexFromReal(m * Math.cos(theta) + shift),
            complexFromReal(m * Math.cos(theta - 2 * Math.PI / 3) + shift),
            complexFromReal(m * Math.cos(theta - 4 * Math.PI / 3) + shift)
        ];
    }
    
    return roots;
}

function findPolynomialRoots(coeffs) {
    const degree = coeffs.length - 1;
    if (degree < 1) return [];
    
    const normalized = coeffs.map(c => c / coeffs[0]);
    
    const roots = [];
    for (let i = 0; i < degree; i++) {
        const angle = (2 * Math.PI * i) / degree;
        roots.push({ re: Math.cos(angle), im: Math.sin(angle) });
    }
    
    const maxIter = 100;
    const tolerance = 1e-6;
    
    for (let iter = 0; iter < maxIter; iter++) {
        let maxChange = 0;
        
        for (let i = 0; i < degree; i++) {
            const z = roots[i];
            const pz = evalPoly(normalized, z);
            
            let prod = { re: 1, im: 0 };
            for (let j = 0; j < degree; j++) {
                if (i !== j) {
                    const diff = complexSub(z, roots[j]);
                    prod = complexMul(prod, diff);
                }
            }
            
            const delta = complexDiv(pz, prod);
            roots[i] = complexSub(z, delta);
            
            const change = Math.sqrt(delta.re * delta.re + delta.im * delta.im);
            maxChange = Math.max(maxChange, change);
        }
        
        if (maxChange < tolerance) break;
    }
    
    return roots
        .filter(z => Math.abs(z.im) < 0.01)
        .map(z => z.re)
        .sort((a, b) => a - b);
}

function findPolynomialRootsComplex(coeffs) {
    const degree = coeffs.length - 1;
    if (degree < 1) return [];
    
    if (degree === 1) {
        return [complexFromReal(-coeffs[1] / coeffs[0])];
    }
    if (degree === 2) {
        return solveQuadraticComplex(coeffs[0], coeffs[1], coeffs[2]);
    }
    if (degree === 3) {
        return solveCubicComplex(coeffs[0], coeffs[1], coeffs[2], coeffs[3]);
    }
    
    const normalized = coeffs.map(c => c / coeffs[0]);
    
    const roots = [];
    for (let i = 0; i < degree; i++) {
        const angle = (2 * Math.PI * i) / degree + 0.1;
        const r = 1 + 0.1 * i / degree;
        roots.push({ re: r * Math.cos(angle), im: r * Math.sin(angle) });
    }
    
    const maxIter = 200;
    const tolerance = 1e-12;
    
    for (let iter = 0; iter < maxIter; iter++) {
        let maxChange = 0;
        
        for (let i = 0; i < degree; i++) {
            const z = roots[i];
            const pz = evalPoly(normalized, z);
            
            let prod = { re: 1, im: 0 };
            for (let j = 0; j < degree; j++) {
                if (i !== j) {
                    const diff = complexSub(z, roots[j]);
                    prod = complexMul(prod, diff);
                }
            }
            
            if (complexAbs(prod) > 1e-15) {
                const delta = complexDiv(pz, prod);
                roots[i] = complexSub(z, delta);
                maxChange = Math.max(maxChange, complexAbs(delta));
            }
        }
        
        if (maxChange < tolerance) break;
    }
    
    return roots.map(z => ({
        re: Math.abs(z.re) < 1e-10 ? 0 : z.re,
        im: Math.abs(z.im) < 1e-10 ? 0 : z.im
    }));
}

function separateRoots(roots, tolerance = 1e-6) {
    const realRoots = [];
    const complexRoots = [];
    
    for (const root of roots) {
        if (Math.abs(root.im) < tolerance) {
            realRoots.push(root.re);
        } else if (root.im > 0) {
            complexRoots.push(root);
        }
    }
    
    // Sort real roots in ascending order
    realRoots.sort((a, b) => a - b);
    
    return { realRoots, complexRoots };
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        complexAdd,
        complexSub,
        complexMul,
        complexDiv,
        complexScale,
        complexPow,
        complexSqrt,
        complexAbs,
        complexConjugate,
        isEssentiallyReal,
        isEssentiallyZero,
        formatComplex,
        complexFromReal,
        evalPoly,
        solveQuadraticComplex,
        solveCubicComplex,
        findPolynomialRoots,
        findPolynomialRootsComplex,
        separateRoots
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.complexAdd = complexAdd;
    window.complexSub = complexSub;
    window.complexMul = complexMul;
    window.complexDiv = complexDiv;
    window.complexScale = complexScale;
    window.complexPow = complexPow;
    window.complexSqrt = complexSqrt;
    window.complexAbs = complexAbs;
    window.complexConjugate = complexConjugate;
    window.isEssentiallyReal = isEssentiallyReal;
    window.isEssentiallyZero = isEssentiallyZero;
    window.formatComplex = formatComplex;
    window.complexFromReal = complexFromReal;
    window.evalPoly = evalPoly;
    window.solveQuadraticComplex = solveQuadraticComplex;
    window.solveCubicComplex = solveCubicComplex;
    window.findPolynomialRoots = findPolynomialRoots;
    window.findPolynomialRootsComplex = findPolynomialRootsComplex;
    window.separateRoots = separateRoots;
}