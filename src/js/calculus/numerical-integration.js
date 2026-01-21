// ===================================
// NUMERICAL INTEGRATION
// ===================================

function trapezoidalRule(f, a, b, n) {
    const h = (b - a) / n;
    let sum = (f(a) + f(b)) / 2;
    
    for (let i = 1; i < n; i++) {
        sum += f(a + i * h);
    }
    
    return h * sum;
}

function simpsonsRule(f, a, b, n) {
    if (n % 2 !== 0) n++;
    
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    
    return (h / 3) * sum;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trapezoidalRule,
        simpsonsRule
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.trapezoidalRule = trapezoidalRule;
    window.simpsonsRule = simpsonsRule;
}