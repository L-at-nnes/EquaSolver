// ===================================
// DERIVATIVES & INTEGRALS CALCULATOR UI
// ===================================

/**
 * Setup derivative calculator UI
 */
function setupDerivativeCalculator() {
    const derivTypeSelect = document.getElementById('derivativeType');
    const calculateBtn = document.getElementById('calculateDerivative');
    
    derivTypeSelect?.addEventListener('change', () => {
        const type = derivTypeSelect.value;
        document.getElementById('derivativeSymbolicInputs').style.display = type === 'symbolic' ? 'block' : 'none';
        document.getElementById('derivativeAtPointInputs').style.display = type === 'atPoint' ? 'block' : 'none';
        document.getElementById('derivativeNthInputs').style.display = type === 'nth' ? 'block' : 'none';
        document.getElementById('derivativeCriticalInputs').style.display = type === 'critical' ? 'block' : 'none';
        updateDerivativePreview();
    });
    
    // Add input listeners for preview
    ['derivExpr', 'derivExprPoint', 'derivPointX', 'derivExprNth', 'derivOrder', 'derivExprCritical', 'derivCriticalMin', 'derivCriticalMax'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateDerivativePreview);
    });
    
    calculateBtn?.addEventListener('click', calculateDerivative);
    updateDerivativePreview();
}

/**
 * Update derivative preview based on selected type
 */
function updateDerivativePreview() {
    const type = document.getElementById('derivativeType')?.value || 'symbolic';
    const preview = document.getElementById('derivativePreview');
    if (!preview) return;
    
    if (type === 'symbolic') {
        const expr = document.getElementById('derivExpr')?.value || 'x^2 + 3x + 1';
        preview.textContent = `d/dx(${expr})`;
    } else if (type === 'atPoint') {
        const expr = document.getElementById('derivExprPoint')?.value || 'x^2';
        const x0 = document.getElementById('derivPointX')?.value || '2';
        preview.textContent = `f'(${x0}) where f(x) = ${expr}`;
    } else if (type === 'nth') {
        const expr = document.getElementById('derivExprNth')?.value || 'x^4';
        const n = document.getElementById('derivOrder')?.value || '2';
        preview.textContent = `d${n}/dx${n}(${expr})`;
    } else {
        const expr = document.getElementById('derivExprCritical')?.value || 'x^3 - 3x';
        preview.textContent = `Critical points of f(x) = ${expr}`;
    }
}

/**
 * Calculate derivative and display result
 */
function calculateDerivative() {
    const type = document.getElementById('derivativeType')?.value || 'symbolic';
    const solutionDiv = document.getElementById('derivativeSolution');
    if (!solutionDiv) return;
    
    try {
        let result;
        
        if (type === 'symbolic') {
            const expr = document.getElementById('derivExpr')?.value || 'x^2 + 3x + 1';
            result = differentiate(expr);
            
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.derivative || 'Derivative'}</h4>
                    <p><strong>f(x) =</strong> ${escapeHtml(result.original)}</p>
                    <p><strong>f'(x) =</strong> ${escapeHtml(result.simplified)}</p>
                    <div class="steps">
                        <h5>${translations[window.currentLang]?.steps || 'Steps'}:</h5>
                        ${result.steps.map(s => `<p>${escapeHtml(s)}</p>`).join('')}
                    </div>
                </div>
            `;
        } else if (type === 'atPoint') {
            const expr = document.getElementById('derivExprPoint')?.value || 'x^2';
            const x0 = readNumberInput('derivPointX', 2);
            if (Number.isNaN(x0)) {
                showInvalidInput(solutionDiv);
                return;
            }
            result = evaluateDerivativeAt(expr, x0);
            
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.derivativeAtPoint || 'Derivative at Point'}</h4>
                    <p><strong>f(x) =</strong> ${escapeHtml(result.expression)}</p>
                    <p><strong>f'(x) =</strong> ${escapeHtml(result.symbolicDerivative)}</p>
                    <p><strong>f'(${x0}) =</strong> ${formatNumber(result.numericalValue, 6)}</p>
                    <p class="method-info">${translations[window.currentLang]?.methodUsed || 'Method'}: ${result.method}</p>
                </div>
            `;
        } else if (type === 'nth') {
            const expr = document.getElementById('derivExprNth')?.value || 'x^4';
            const n = readNumberInput('derivOrder', 2);
            result = nthDerivative(expr, n);

            if (result.error) {
                solutionDiv.innerHTML = `<div class="solution-error">${escapeHtml(result.error)}</div>`;
                return;
            }
            
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.nthDerivative || 'Nth Derivative'}</h4>
                    <p><strong>${translations[window.currentLang]?.order || 'Order'}:</strong> ${n}</p>
                    <div class="steps">
                        ${result.steps.map(s => `<p>${escapeHtml(s)}</p>`).join('')}
                    </div>
                </div>
            `;
        } else {
            const expr = document.getElementById('derivExprCritical')?.value || 'x^3 - 3x';
            const xMin = readNumberInput('derivCriticalMin', -10);
            const xMax = readNumberInput('derivCriticalMax', 10);
            if (Number.isNaN(xMin) || Number.isNaN(xMax) || xMin >= xMax) {
                showInvalidInput(solutionDiv);
                return;
            }
            result = findCriticalPoints(expr, xMin, xMax);
            
            let pointsHtml = '';
            if (result.length === 0) {
                pointsHtml = `<p>${translations[window.currentLang]?.noCriticalPoints || 'No critical points found in the given range'}</p>`;
            } else {
                pointsHtml = result.map(p => 
                    `<p><strong>x = ${p.x.toFixed(4)}</strong>, f(x) = ${p.y.toFixed(4)} (${translations[window.currentLang]?.[p.type.replace(' ', '')] || p.type})</p>`
                ).join('');
            }
            
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.criticalPoints || 'Critical Points'}</h4>
                    <p><strong>f(x) =</strong> ${escapeHtml(expr)}</p>
                    <p><strong>${translations[window.currentLang]?.range || 'Range'}:</strong> [${xMin}, ${xMax}]</p>
                    <div class="critical-points">
                        ${pointsHtml}
                    </div>
                </div>
            `;
        }
        
        document.getElementById('exportDerivativePdf').style.display = 'inline-block';
    } catch (e) {
        solutionDiv.innerHTML = `<div class="solution-error">${translations[window.currentLang]?.errorCalculating || 'Error calculating'}: ${escapeHtml(e.message)}</div>`;
    }
}

function showInvalidInput(solutionDiv) {
    const message = translations[window.currentLang]?.invalidInput || 'Invalid input';
    solutionDiv.innerHTML = `<div class="solution-error">${message}</div>`;
}

/**
 * Setup integral calculator UI
 */
function setupIntegralCalculator() {
    const integralTypeSelect = document.getElementById('integralType');
    const calculateBtn = document.getElementById('calculateIntegral');
    
    integralTypeSelect?.addEventListener('change', () => {
        const type = integralTypeSelect.value;
        document.getElementById('integralIndefiniteInputs').style.display = type === 'indefinite' ? 'block' : 'none';
        document.getElementById('integralDefiniteInputs').style.display = type === 'definite' ? 'block' : 'none';
        updateIntegralPreview();
    });
    
    // Add input listeners for preview
    ['integralExpr', 'integralExprDef', 'integralLower', 'integralUpper'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateIntegralPreview);
    });
    
    calculateBtn?.addEventListener('click', calculateIntegral);
    updateIntegralPreview();
}

/**
 * Update integral preview based on selected type
 */
function updateIntegralPreview() {
    const type = document.getElementById('integralType')?.value || 'indefinite';
    const preview = document.getElementById('integralPreview');
    if (!preview) return;
    
    if (type === 'indefinite') {
        const expr = document.getElementById('integralExpr')?.value || 'x^2';
        preview.textContent = `∫ ${expr} dx`;
    } else {
        const expr = document.getElementById('integralExprDef')?.value || 'x^2';
        const a = document.getElementById('integralLower')?.value || '0';
        const b = document.getElementById('integralUpper')?.value || '1';
        preview.textContent = `∫[${a},${b}] ${expr} dx`;
    }
}

/**
 * Calculate integral and display result
 */
function calculateIntegral() {
    const type = document.getElementById('integralType')?.value || 'indefinite';
    const solutionDiv = document.getElementById('integralSolution');
    if (!solutionDiv) return;
    
    try {
        let result;
        
        if (type === 'indefinite') {
            const expr = document.getElementById('integralExpr')?.value || 'x^2';
            result = integrate(expr);
            
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.indefiniteIntegral || 'Indefinite Integral'}</h4>
                    <p><strong>∫ ${escapeHtml(result.original)} dx =</strong></p>
                    <p class="result-large">${escapeHtml(result.simplified)}</p>
                    <div class="steps">
                        <h5>${translations[window.currentLang]?.steps || 'Steps'}:</h5>
                        ${result.steps.map(s => `<p>${escapeHtml(s)}</p>`).join('')}
                    </div>
                </div>
            `;
        } else {
            const expr = document.getElementById('integralExprDef')?.value || 'x^2';
            const a = readNumberInput('integralLower', 0);
            const b = readNumberInput('integralUpper', 1);
            if (Number.isNaN(a) || Number.isNaN(b)) {
                showInvalidInput(solutionDiv);
                return;
            }
            
            // Get both symbolic and numerical results
            const symbolicResult = integrate(expr);
            const numericalResult = definiteIntegral(expr, a, b);
            
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.definiteIntegral || 'Definite Integral'}</h4>
                    <p><strong>∫[${a}, ${b}] ${escapeHtml(expr)} dx =</strong></p>
                    <p class="result-large">${formatNumber(numericalResult.value, 6)}</p>
                    <div class="steps">
                        <h5>${translations[window.currentLang]?.symbolicAntiderivative || 'Antiderivative'}:</h5>
                        <p>F(x) = ${escapeHtml(symbolicResult.simplified)}</p>
                        <p>F(${b}) - F(${a}) ≈ ${formatNumber(numericalResult.value, 6)}</p>
                        <p class="method-info">${translations[window.currentLang]?.methodUsed || 'Method'}: ${numericalResult.method}</p>
                        <p class="method-info">${translations[window.currentLang]?.intervalsUsed || 'Intervals'}: ${numericalResult.intervals}</p>
                    </div>
                </div>
            `;
        }
        
        document.getElementById('exportIntegralPdf').style.display = 'inline-block';
    } catch (e) {
        solutionDiv.innerHTML = `<div class="solution-error">${translations[window.currentLang]?.errorCalculating || 'Error calculating'}: ${e.message}</div>`;
    }
}

// Browser export
if (typeof window !== 'undefined') {
    window.setupDerivativeCalculator = setupDerivativeCalculator;
    window.setupIntegralCalculator = setupIntegralCalculator;
    window.updateDerivativePreview = updateDerivativePreview;
    window.updateIntegralPreview = updateIntegralPreview;
    window.calculateDerivative = calculateDerivative;
    window.calculateIntegral = calculateIntegral;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupDerivativeCalculator,
        setupIntegralCalculator,
        updateDerivativePreview,
        updateIntegralPreview,
        calculateDerivative,
        calculateIntegral
    };
}
