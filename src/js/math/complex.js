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
        // Avoid subtracting two nearly equal numbers (b >> 4ac): compute the
        // larger-magnitude root directly and derive the other one from c / (a * root)
        const q = -(b + (b < 0 ? -sqrtDelta : sqrtDelta)) / 2;
        if (q === 0) {
            return [complexFromReal(0), complexFromReal(0)];
        }
        const big = q / a;
        const small = c / q;
        const plusRoot = b < 0 ? big : small;
        const minusRoot = b < 0 ? small : big;
        return [complexFromReal(plusRoot), complexFromReal(minusRoot)];
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
    
    // Tolerances relative to the size of the roots, so that tiny but genuine
    // roots (x^3 = 1e-12) are not mistaken for a triple root at 0
    const rootScale = Math.max(Math.abs(p), Math.sqrt(Math.abs(q)), Math.cbrt(Math.abs(r)));
    const scale3 = rootScale * rootScale * rootScale;
    
    if (rootScale === 0 || Math.abs(discriminant) <= 1e-10 * scale3 * scale3) {
        if (rootScale === 0 || Math.abs(q1) <= 1e-10 * scale3) {
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

// Drop leading zero coefficients (0x^3 + x^2 - 1 is really a quadratic)
function trimLeadingZeros(coeffs) {
    let start = 0;
    while (start < coeffs.length - 1 && coeffs[start] === 0) start++;
    return coeffs.slice(start);
}

function findPolynomialRoots(coeffs) {
    coeffs = trimLeadingZeros(coeffs);
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
            
            if (complexAbs(prod) < 1e-15) continue;
            
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
    coeffs = trimLeadingZeros(coeffs);
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
    
    return mergeRootClusters(roots).map(z => ({
        re: Math.abs(z.re) < 1e-10 ? 0 : z.re,
        im: Math.abs(z.im) < 1e-10 ? 0 : z.im
    }));
}

// Durand-Kerner converges slowly on multiple roots (a 4-fold root comes back as
// four points ~1e-5 apart, a 5-fold one ~1e-2), which then look like complex
// roots. Average each tight cluster: the centroid of a multiple root is accurate,
// and a cluster sitting on the real axis is a real multiple root.
function mergeRootClusters(roots, relativeRadius = 1e-2) {
    const used = new Array(roots.length).fill(false);
    const merged = [];
    
    for (let i = 0; i < roots.length; i++) {
        if (used[i]) continue;
        const radius = relativeRadius * Math.max(1, complexAbs(roots[i]));
        const members = [i];
        used[i] = true;
        for (let j = i + 1; j < roots.length; j++) {
            if (!used[j] && complexAbs(complexSub(roots[i], roots[j])) < radius) {
                members.push(j);
                used[j] = true;
            }
        }
        
        if (members.length === 1) {
            merged.push(roots[i]);
            continue;
        }
        
        const centroid = members.reduce((sum, k) => complexAdd(sum, roots[k]), { re: 0, im: 0 });
        centroid.re /= members.length;
        centroid.im /= members.length;
        if (Math.abs(centroid.im) < radius) centroid.im = 0;
        members.forEach(() => merged.push({ re: centroid.re, im: centroid.im }));
    }
    return merged;
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