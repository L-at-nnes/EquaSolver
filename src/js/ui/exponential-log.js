// ===================================
// EXPONENTIAL & LOGARITHMIC SOLVER UI
// ===================================

/**
 * Setup exponential equation solver UI
 */
function setupExponentialSolver() {
    const expTypeSelect = document.getElementById('expType');
    const solveBtn = document.getElementById('solveExponential');
    
    expTypeSelect?.addEventListener('change', () => {
        const type = expTypeSelect.value;
        document.getElementById('expSimpleInputs').style.display = type === 'simple' ? 'block' : 'none';
        document.getElementById('expWithCoefInputs').style.display = type === 'withCoef' ? 'block' : 'none';
        document.getElementById('expNaturalInputs').style.display = type === 'natural' ? 'block' : 'none';
        updateExponentialPreview();
    });
    
    // Add input listeners for preview
    ['expBaseA', 'expResultB', 'expCoefA', 'expCoefBase', 'expCoefResult', 'expNaturalResult'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateExponentialPreview);
    });
    
    solveBtn?.addEventListener('click', solveExponentialEquation);
    updateExponentialPreview();
}

/**
 * Update exponential equation preview based on selected type
 */
function updateExponentialPreview() {
    const type = document.getElementById('expType')?.value || 'simple';
    const preview = document.getElementById('exponentialPreview');
    if (!preview) return;
    
    if (type === 'simple') {
        const a = document.getElementById('expBaseA')?.value || '2';
        const b = document.getElementById('expResultB')?.value || '8';
        preview.textContent = `${a}ˣ = ${b}`;
    } else if (type === 'withCoef') {
        const a = document.getElementById('expCoefA')?.value || '2';
        const base = document.getElementById('expCoefBase')?.value || '3';
        const c = document.getElementById('expCoefResult')?.value || '18';
        preview.textContent = `${a} · ${base}ˣ = ${c}`;
    } else {
        const a = document.getElementById('expNaturalResult')?.value || '7.389';
        preview.textContent = `eˣ = ${a}`;
    }
}

/**
 * Solve exponential equation and display result
 */
function solveExponentialEquation() {
    const type = document.getElementById('expType')?.value || 'simple';
    const solutionDiv = document.getElementById('exponentialSolution');
    if (!solutionDiv) return;
    
    let result;
    try {
        if (type === 'simple') {
            const base = parseFloat(document.getElementById('expBaseA')?.value) || 2;
            const resultVal = parseFloat(document.getElementById('expResultB')?.value) || 8;
            result = solveExponentialSimple(base, resultVal);
        } else if (type === 'withCoef') {
            const coef = parseFloat(document.getElementById('expCoefA')?.value) || 2;
            const base = parseFloat(document.getElementById('expCoefBase')?.value) || 3;
            const resultVal = parseFloat(document.getElementById('expCoefResult')?.value) || 18;
            result = solveExponentialWithCoefficient(coef, base, resultVal);
        } else {
            const resultVal = parseFloat(document.getElementById('expNaturalResult')?.value) || 7.389;
            result = solveNaturalExponential(resultVal);
        }
        
        if (result.error) {
            solutionDiv.innerHTML = `<div class="solution-error">${result.error}</div>`;
        } else {
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.solution || 'Solution'}</h4>
                    <p><strong>${translations[window.currentLang]?.equation || 'Equation'}:</strong> ${result.equation}</p>
                    <p><strong>x =</strong> ${result.x.toFixed(6)}</p>
                    ${result.steps ? `<div class="steps">${result.steps.map(s => `<p>${s}</p>`).join('')}</div>` : ''}
                </div>
            `;
            document.getElementById('exportExponentialPdf').style.display = 'inline-block';
        }
    } catch (e) {
        solutionDiv.innerHTML = `<div class="solution-error">${translations[window.currentLang]?.errorSolving || 'Error solving equation'}: ${e.message}</div>`;
    }
}

/**
 * Setup logarithmic equation solver UI
 */
function setupLogarithmicSolver() {
    const logTypeSelect = document.getElementById('logType');
    const solveBtn = document.getElementById('solveLogarithmic');
    
    logTypeSelect?.addEventListener('change', () => {
        const type = logTypeSelect.value;
        document.getElementById('logSimpleInputs').style.display = type === 'simple' ? 'block' : 'none';
        document.getElementById('logWithArgInputs').style.display = type === 'withArg' ? 'block' : 'none';
        document.getElementById('logNaturalInputs').style.display = type === 'natural' ? 'block' : 'none';
        document.getElementById('logCommonInputs').style.display = type === 'common' ? 'block' : 'none';
        updateLogarithmicPreview();
    });
    
    // Add input listeners for preview
    ['logBaseA', 'logResultB', 'logArgBase', 'logArgCoef', 'logArgConst', 'logArgResult', 'logNaturalResult', 'logCommonResult'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateLogarithmicPreview);
    });
    
    solveBtn?.addEventListener('click', solveLogarithmicEquation);
    updateLogarithmicPreview();
}

/**
 * Update logarithmic equation preview based on selected type
 */
function updateLogarithmicPreview() {
    const type = document.getElementById('logType')?.value || 'simple';
    const preview = document.getElementById('logarithmicPreview');
    if (!preview) return;
    
    if (type === 'simple') {
        const a = document.getElementById('logBaseA')?.value || '2';
        const b = document.getElementById('logResultB')?.value || '3';
        preview.textContent = `log${subscriptNum(a)}(x) = ${b}`;
    } else if (type === 'withArg') {
        const a = document.getElementById('logArgBase')?.value || '10';
        const b = document.getElementById('logArgCoef')?.value || '2';
        const c = document.getElementById('logArgConst')?.value || '-3';
        const d = document.getElementById('logArgResult')?.value || '2';
        const sign = parseFloat(c) >= 0 ? '+' : '';
        preview.textContent = `log${subscriptNum(a)}(${b}x ${sign} ${c}) = ${d}`;
    } else if (type === 'natural') {
        const a = document.getElementById('logNaturalResult')?.value || '2';
        preview.textContent = `ln(x) = ${a}`;
    } else {
        const a = document.getElementById('logCommonResult')?.value || '2';
        preview.textContent = `log₁₀(x) = ${a}`;
    }
}

/**
 * Convert number to subscript characters
 * @param {string|number} num - Number to convert
 * @returns {string} Subscript representation
 */
function subscriptNum(num) {
    const subscripts = {'0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '.': '.', '-': '₋'};
    return String(num).split('').map(c => subscripts[c] || c).join('');
}

/**
 * Solve logarithmic equation and display result
 */
function solveLogarithmicEquation() {
    const type = document.getElementById('logType')?.value || 'simple';
    const solutionDiv = document.getElementById('logarithmicSolution');
    if (!solutionDiv) return;
    
    let result;
    try {
        if (type === 'simple') {
            const base = parseFloat(document.getElementById('logBaseA')?.value) || 2;
            const resultVal = parseFloat(document.getElementById('logResultB')?.value) || 3;
            result = solveLogarithmicSimple(base, resultVal);
        } else if (type === 'withArg') {
            const base = parseFloat(document.getElementById('logArgBase')?.value) || 10;
            const coef = parseFloat(document.getElementById('logArgCoef')?.value) || 2;
            const constant = parseFloat(document.getElementById('logArgConst')?.value) || -3;
            const resultVal = parseFloat(document.getElementById('logArgResult')?.value) || 2;
            result = solveLogarithmicWithArgument(base, coef, constant, resultVal);
        } else if (type === 'natural') {
            const resultVal = parseFloat(document.getElementById('logNaturalResult')?.value) || 2;
            result = solveNaturalLog(resultVal);
        } else {
            const resultVal = parseFloat(document.getElementById('logCommonResult')?.value) || 2;
            result = solveCommonLog(resultVal);
        }
        
        if (result.error) {
            solutionDiv.innerHTML = `<div class="solution-error">${result.error}</div>`;
        } else {
            solutionDiv.innerHTML = `
                <div class="solution-success">
                    <h4>${translations[window.currentLang]?.solution || 'Solution'}</h4>
                    <p><strong>${translations[window.currentLang]?.equation || 'Equation'}:</strong> ${result.equation}</p>
                    <p><strong>x =</strong> ${result.x.toFixed(6)}</p>
                    ${result.steps ? `<div class="steps">${result.steps.map(s => `<p>${s}</p>`).join('')}</div>` : ''}
                </div>
            `;
            document.getElementById('exportLogarithmicPdf').style.display = 'inline-block';
        }
    } catch (e) {
        solutionDiv.innerHTML = `<div class="solution-error">${translations[window.currentLang]?.errorSolving || 'Error solving equation'}: ${e.message}</div>`;
    }
}

// Browser export
if (typeof window !== 'undefined') {
    window.setupExponentialSolver = setupExponentialSolver;
    window.setupLogarithmicSolver = setupLogarithmicSolver;
    window.updateExponentialPreview = updateExponentialPreview;
    window.updateLogarithmicPreview = updateLogarithmicPreview;
    window.solveExponentialEquation = solveExponentialEquation;
    window.solveLogarithmicEquation = solveLogarithmicEquation;
    window.subscriptNum = subscriptNum;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupExponentialSolver,
        setupLogarithmicSolver,
        updateExponentialPreview,
        updateLogarithmicPreview,
        solveExponentialEquation,
        solveLogarithmicEquation,
        subscriptNum
    };
}
