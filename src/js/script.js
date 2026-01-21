// ===================================
// EQUASOLVER - MAIN APPLICATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    document.body.className = 'theme-matrix';
    
    const savedSettings = JSON.parse(localStorage.getItem('equasolver_settings') || '{}');
    
    initParticles();
    initEventListeners();
    loadFlags();
    
    window.currentTheme = savedSettings.theme || 'matrix';
    window.currentLang = savedSettings.lang || 'en';
    window.currentMode = savedSettings.mode || 'dark';
    
    changeTheme(window.currentTheme);
    changeLanguage(window.currentLang);
    changeMode(window.currentMode);
    
    updateTranslations();
    updateHistoryDisplay();
    
    setupGraphVisualization();
    setupParametricGraph();
    setupPolarGraph();
    setupCustomThemeBuilder();
    setupMatrixCalculator();
    setupGcdLcmCalculator();
    setupModularCalculator();
    setupCombinatoricsCalculator();
    setupFractionCalculator();
    setupStatisticsCalculator();
    setupSequenceCalculator();
    setupLimitCalculator();
    setupTaylorCalculator();
    setupIntegrationCalculator();
    setupLatexInput();
    setupBaseConverter();
    setupUnitConverter();
    setupPolynomialDivision();
});

function loadFlags() {
    document.querySelectorAll('[data-lang-flag]').forEach(img => {
        const lang = img.dataset.langFlag;
        if (FLAGS[lang]) {
            img.src = FLAGS[lang];
        }
    });
}

function isMobileDevice() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getParticleConfig() {
    const isMobile = isMobileDevice();
    return {
        particles: {
            number: { 
                value: isMobile ? 30 : 80, 
                density: { enable: true, value_area: isMobile ? 600 : 800 } 
            },
            color: { value: '#ff0080' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: isMobile ? 2 : 3, random: true },
            line_linked: {
                enable: !isMobile,
                distance: 150,
                color: '#00ffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: isMobile ? 1 : 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'bounce',
                bounce: true
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: !isMobile, mode: 'repulse' },
                onclick: { enable: !isMobile, mode: 'push' },
                resize: true
            }
        },
        retina_detect: !isMobile
    };
}

function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    particlesJS('particles-js', getParticleConfig());
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(() => {
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        const config = getParticleConfig();
        pJSDom[0].pJS.particles.number.value = config.particles.number.value;
        pJSDom[0].pJS.particles.line_linked.enable = config.particles.line_linked.enable;
        pJSDom[0].pJS.interactivity.events.onhover.enable = config.interactivity.events.onhover.enable;
        pJSDom[0].pJS.fn.particlesRefresh();
    }
}, 250));

function updateParticlesColor() {
    const themeColors = {
        cyberpunk: { particle: '#ff0080', line: '#00ffff' },
        neon: { particle: '#00ff9f', line: '#ff006e' },
        matrix: { particle: '#00ff41', line: '#008f11' },
        sunset: { particle: '#ff6b35', line: '#ffd23f' },
        ocean: { particle: '#00b4d8', line: '#90e0ef' },
        galaxy: { particle: '#b537f2', line: '#f72585' }
    };
    
    if (typeof pJSDom !== 'undefined' && pJSDom[0] && themeColors[window.currentTheme]) {
        pJSDom[0].pJS.particles.color.value = themeColors[window.currentTheme].particle;
        pJSDom[0].pJS.particles.line_linked.color = themeColors[window.currentTheme].line;
        pJSDom[0].pJS.fn.particlesRefresh();
    }
}

// ===================================
// EVENT LISTENERS SETUP
// ===================================
function initEventListeners() {
    // Settings panel
    document.getElementById('settingsBtn')?.addEventListener('click', toggleSettings);
    document.getElementById('closeSettings')?.addEventListener('click', toggleSettings);
    
    // Theme selection
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.currentTheme = btn.dataset.theme;
            changeTheme(window.currentTheme);
            updateParticlesColor();
        });
    });
    
    // Mode selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.currentMode = btn.dataset.mode;
            changeMode(window.currentMode);
        });
    });
    
    // Language selection
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.currentLang = btn.dataset.lang;
            changeLanguage(window.currentLang);
        });
    });
    
    // Calculator tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Standard calculator buttons
    document.querySelectorAll('#standard .btn').forEach(btn => {
        btn.addEventListener('click', handleCalculatorButton);
    });
    
    // Scientific calculator buttons
    document.querySelectorAll('#scientific .btn').forEach(btn => {
        btn.addEventListener('click', handleScientificButton);
    });
    
    // Equation solver buttons
    document.getElementById('solveLinear')?.addEventListener('click', solveLinearEquation);
    document.getElementById('solveQuadratic')?.addEventListener('click', solveQuadraticEquation);
    document.getElementById('solveCubic')?.addEventListener('click', solveCubicEquation);
    document.getElementById('solveQuartic')?.addEventListener('click', solveQuarticEquation);
    document.getElementById('solveQuintic')?.addEventListener('click', solveQuinticEquation);
    document.getElementById('solveSystems')?.addEventListener('click', solveSystemEquations);
    document.getElementById('solveSystem3x3')?.addEventListener('click', solve3x3System);
    document.getElementById('calculateMatrix')?.addEventListener('click', calculateMatrix);
    
    // Inequality solver buttons
    document.getElementById('solveInequalityLinear')?.addEventListener('click', solveLinearInequalityUI);
    document.getElementById('solveInequalityQuadratic')?.addEventListener('click', solveQuadraticInequalityUI);
    
    // Polynomial division
    document.getElementById('performPolynomialDivision')?.addEventListener('click', performPolynomialDivision);
    
    // PDF Export buttons
    setupExportButtons();
    
    // Slider updates for equations
    setupSliderListeners();
    
    // History management
    document.getElementById('clearHistory')?.addEventListener('click', clearHistory);
    
    // Navigation cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => handleToolSelection(card.dataset.tool));
    });
    document.querySelectorAll('.submenu-btn').forEach(btn => {
        btn.addEventListener('click', event => {
            event.stopPropagation();
            handleToolSelection(btn.dataset.subtool);
        });
    });
    
    // Back to home button
    document.getElementById('backBtn')?.addEventListener('click', showHomeScreen);
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

function setupExportButtons() {
    const exportMappings = {
        'exportLinearPdf': 'linear',
        'exportQuadraticPdf': 'quadratic',
        'exportCubicPdf': 'cubic',
        'exportQuarticPdf': 'quartic',
        'exportQuinticPdf': 'quintic',
        'exportSystemsPdf': 'systems',
        'exportMatrixPdf': 'matrix',
        'exportInequalityLinearPdf': 'inequalityLinear',
        'exportInequalityQuadraticPdf': 'inequalityQuadratic',
        'exportPolynomialDivisionPdf': 'polynomialDivision',
        'exportBaseConverterPdf': 'baseConverter',
        'exportUnitConverterPdf': 'unitConverter'
    };
    
    Object.entries(exportMappings).forEach(([id, type]) => {
        document.getElementById(id)?.addEventListener('click', () => exportToPDF(type));
    });
    
    document.getElementById('exportGraphPdf')?.addEventListener('click', () => exportGraphToPDF(graphState));
}

// ===================================
// SCREEN NAVIGATION
// ===================================
function toggleSettings() {
    document.getElementById('settingsPanel')?.classList.toggle('active');
}

function showHomeScreen() {
    document.getElementById('homeScreen')?.classList.add('active');
    document.getElementById('calculatorScreen')?.classList.remove('active');
}

function showCalculatorScreen(tool) {
    document.getElementById('homeScreen')?.classList.remove('active');
    document.getElementById('calculatorScreen')?.classList.add('active');
    
    const wrapper = document.querySelector('.calculator-wrapper');
    const historyPanel = document.querySelector('.history-panel');
    if (wrapper) wrapper.style.display = 'block';
    if (historyPanel) historyPanel.style.display = 'none';
    
    switchTab(tool);
}

function showHistoryScreen() {
    document.getElementById('homeScreen')?.classList.remove('active');
    document.getElementById('calculatorScreen')?.classList.add('active');
    
    const wrapper = document.querySelector('.calculator-wrapper');
    const historyPanel = document.querySelector('.history-panel');
    if (wrapper) wrapper.style.display = 'none';
    if (historyPanel) historyPanel.style.display = 'block';
}

function handleToolSelection(tool) {
    const polynomialTools = ['linear', 'quadratic', 'cubic', 'quartic', 'quintic'];

    if (!tool) return;
    if (tool === 'history') {
        showHistoryScreen();
        return;
    }

    if (tool === 'multi-degree') {
        showCalculatorScreen('linear');
        return;
    }

    if (polynomialTools.includes(tool)) {
        showCalculatorScreen(tool);
        return;
    }

    showCalculatorScreen(tool);
}

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    
    document.querySelectorAll('.calculator-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tab);
    });
}

// ===================================
// CALCULATOR BUTTON HANDLERS
// ===================================
function handleCalculatorButton(e) {
    const btn = e.target;
    const action = btn.dataset.action;
    const value = btn.dataset.value || btn.textContent;
    
    if (btn.classList.contains('number')) {
        handleValue(value);
    } else if (btn.classList.contains('operator')) {
        handleOperator(value);
    } else if (action === 'equals') {
        calculate();
    } else if (action === 'clear') {
        clearCalculator();
    } else if (action === 'delete') {
        deleteLastDigit();
    } else if (action === 'percent') {
        handlePercent();
    } else if (action === 'power') {
        handlePower();
    } else if (btn.classList.contains('scientific')) {
        handleScientificFunction(action);
    }
}

function handleScientificButton(e) {
    const btn = e.target;
    const action = btn.dataset.action;
    const value = btn.dataset.value || btn.textContent;
    
    if (btn.classList.contains('number')) {
        handleSciValue(value);
    } else if (btn.classList.contains('operator')) {
        handleSciOperator(value);
    } else if (action === 'equals') {
        calculateScientific();
    } else if (action === 'clear') {
        clearScientific();
    } else if (action === 'delete') {
        sciState.display = sciState.display.slice(0, -1) || '0';
        updateSciDisplay();
    } else if (action === 'ans') {
        sciState.display = String(sciState.lastAnswer);
        sciState.waitingForOperand = false;
        updateSciDisplay();
    } else if (btn.classList.contains('scientific')) {
        handleScientificFunction(action);
    }
}

function handlePercent() {
    const current = parseFloat(state.display);
    state.display = String(current / 100);
    updateDisplay();
}

function handlePower() {
    const current = parseFloat(state.display);
    state.display = String(current * current);
    state.waitingForOperand = true;
    updateDisplay();
    addToHistory(`${current}² = ${state.display}`);
}

// ===================================
// KEYBOARD SUPPORT
// ===================================
function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    if (e.key >= '0' && e.key <= '9') {
        handleValue(e.key);
    } else if (e.key === '.') {
        handleValue('.');
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        const opMap = { '+': '+', '-': '-', '*': '×', '/': '÷' };
        handleOperator(opMap[e.key]);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Escape') {
        clearCalculator();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLastDigit();
    }
}

// ===================================
// EQUATION SOLVERS
// ===================================
function solveLinearEquation() {
    const a = parseFloat(document.getElementById('linearA').value);
    const b = parseFloat(document.getElementById('linearB').value);
    const resultDiv = document.getElementById('linearSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    let html = `<h3>${trans.solution}</h3>`;
    
    if (a === 0) {
        if (b === 0) {
            html += `<p class="solution">${trans.infiniteSolutions}</p>`;
        } else {
            html += `<p class="solution">${trans.noSolution}</p>`;
        }
    } else {
        const x = -b / a;
        const steps = [
            { explanation: trans.startEquation || 'Starting equation', equation: `${a}x + ${b} = 0` },
            { explanation: trans.moveConstant || 'Move constant to the right side', equation: `${a}x = ${-b}` },
            { explanation: trans.divideByCoef || 'Divide by coefficient', equation: `x = ${-b} / ${a}` },
            { explanation: trans.simplify || 'Simplify', equation: `x = ${x.toFixed(4)}` }
        ];
        
        html += generateAnimatedSteps(steps, '#linearSolution');
        html += `<div class="final-result">
            <h4>${trans.result || 'Result'}</h4>
            <div class="result-value">x = ${x.toFixed(4)}</div>
        </div>`;
        
        addToHistory(`${a}x + ${b} = 0 -> x = ${x.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('linear');
}

function solveQuadraticEquation() {
    const a = parseFloat(document.getElementById('quadA').value);
    const b = parseFloat(document.getElementById('quadB').value);
    const c = parseFloat(document.getElementById('quadC').value);
    const resultDiv = document.getElementById('quadraticSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const delta = b * b - 4 * a * c;
    let html = `<h3>${trans.solution}</h3>`;
    html += `<p><strong>${trans.discriminant} (Δ):</strong> ${delta.toFixed(4)}</p>`;
    
    if (delta < 0) {
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-delta) / (2 * a);
        const z1 = { re: realPart, im: imagPart };
        const z2 = { re: realPart, im: -imagPart };
        
        html += `<div class="solution">
            <p>${trans.twoComplexSolutions || 'Two complex conjugate solutions'}</p>
            <p>x₁ = ${formatComplex(z1)}</p>
            <p>x₂ = ${formatComplex(z2)}</p>
        </div>`;
        addToHistory(`${a}x² + ${b}x + ${c} = 0 → x₁ = ${formatComplex(z1)}, x₂ = ${formatComplex(z2)}`);
    } else if (delta === 0) {
        const x = -b / (2 * a);
        html += `<div class="solution">
            <p>${trans.oneSolution}</p>
            <p>x = ${x.toFixed(4)}</p>
        </div>`;
        addToHistory(`${a}x² + ${b}x + ${c} = 0 → x = ${x.toFixed(4)}`);
    } else {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        html += `<div class="solution">
            <p>${trans.twoSolutions}</p>
            <p>x₁ = ${x1.toFixed(4)}</p>
            <p>x₂ = ${x2.toFixed(4)}</p>
        </div>`;
        addToHistory(`${a}x² + ${b}x + ${c} = 0 → x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('quadratic');
}

function solveCubicEquation() {
    const a = parseFloat(document.getElementById('cubicA').value);
    const b = parseFloat(document.getElementById('cubicB').value);
    const c = parseFloat(document.getElementById('cubicC').value);
    const d = parseFloat(document.getElementById('cubicD').value);
    const resultDiv = document.getElementById('cubicSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const roots = solveCubicComplex(a, b, c, d);
    const { realRoots, complexRoots } = separateRoots(roots);
    
    let html = `<h3>${trans.solution}</h3>`;
    
    if (realRoots.length === 3) {
        html += `<div class="solution">
            <p>${trans.threeSolutions || '3 solutions found'}</p>
            <p>x₁ = ${realRoots[0].toFixed(4)}</p>
            <p>x₂ = ${realRoots[1].toFixed(4)}</p>
            <p>x₃ = ${realRoots[2].toFixed(4)}</p>
        </div>`;
        addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → ${realRoots.map(r => r.toFixed(4)).join(', ')}`);
    } else if (realRoots.length === 1 && complexRoots.length === 1) {
        const z = complexRoots[0];
        const zConj = { re: z.re, im: -z.im };
        html += `<div class="solution">
            <p>${trans.oneRealTwoComplex || 'One real solution and two complex conjugates'}</p>
            <p>x₁ = ${realRoots[0].toFixed(4)} <span class="real-badge">${trans.realSolution || 'real'}</span></p>
            <p>x₂ = ${formatComplex(z)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>
            <p>x₃ = ${formatComplex(zConj)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>
        </div>`;
        addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → x₁ = ${realRoots[0].toFixed(4)}, x₂ = ${formatComplex(z)}, x₃ = ${formatComplex(zConj)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('cubic');
}

function solveQuarticEquation() {
    const a = parseFloat(document.getElementById('quartA').value);
    const b = parseFloat(document.getElementById('quartB').value);
    const c = parseFloat(document.getElementById('quartC').value);
    const d = parseFloat(document.getElementById('quartD').value);
    const e = parseFloat(document.getElementById('quartE').value);
    const resultDiv = document.getElementById('quarticSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const allRoots = findPolynomialRootsComplex([a, b, c, d, e]);
    const { realRoots, complexRoots } = separateRoots(allRoots);
    
    let html = `<h3>${trans.solution}</h3><div class="solution">`;
    
    let rootIndex = 1;
    realRoots.forEach(root => {
        html += `<p>x${rootIndex++} = ${root.toFixed(4)} <span class="real-badge">${trans.realSolution || 'real'}</span></p>`;
    });
    
    complexRoots.forEach(z => {
        const zConj = { re: z.re, im: -z.im };
        html += `<p>x${rootIndex++} = ${formatComplex(z)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
        html += `<p>x${rootIndex++} = ${formatComplex(zConj)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
    });
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    showExportButton('quartic');
}

function solveQuinticEquation() {
    const a = parseFloat(document.getElementById('quintA').value);
    const b = parseFloat(document.getElementById('quintB').value);
    const c = parseFloat(document.getElementById('quintC').value);
    const d = parseFloat(document.getElementById('quintD').value);
    const e = parseFloat(document.getElementById('quintE').value);
    const f = parseFloat(document.getElementById('quintF').value);
    const resultDiv = document.getElementById('quinticSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f) || a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const allRoots = findPolynomialRootsComplex([a, b, c, d, e, f]);
    const { realRoots, complexRoots } = separateRoots(allRoots);
    
    let html = `<h3>${trans.solution}</h3><div class="solution">`;
    
    let rootIndex = 1;
    realRoots.forEach(root => {
        html += `<p>x${rootIndex++} = ${root.toFixed(4)} <span class="real-badge">${trans.realSolution || 'real'}</span></p>`;
    });
    
    complexRoots.forEach(z => {
        const zConj = { re: z.re, im: -z.im };
        html += `<p>x${rootIndex++} = ${formatComplex(z)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
        html += `<p>x${rootIndex++} = ${formatComplex(zConj)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
    });
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    showExportButton('quintic');
}

// ===================================
// SYSTEM OF EQUATIONS SOLVERS
// ===================================
function solveSystemEquations() {
    const a = parseFloat(document.getElementById('sysA').value);
    const b = parseFloat(document.getElementById('sysB').value);
    const e = parseFloat(document.getElementById('sysE').value);
    const c = parseFloat(document.getElementById('sysC').value);
    const d = parseFloat(document.getElementById('sysD').value);
    const f = parseFloat(document.getElementById('sysF').value);
    const resultDiv = document.getElementById('systemsSolution');
    const trans = translations[window.currentLang];
    
    if ([a, b, c, d, e, f].some(isNaN)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const det = a * d - b * c;
    let html = `<h3>${trans.solution}</h3>`;
    
    if (Math.abs(det) < 1e-10) {
        html += `<p class="solution">${trans.noUniqueSolution || 'No unique solution (determinant = 0)'}</p>`;
    } else {
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        html += `<div class="solution">
            <p>x = ${x.toFixed(4)}</p>
            <p>y = ${y.toFixed(4)}</p>
        </div>`;
        
        addToHistory(`System: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('systems');
}

function solve3x3System() {
    const getValue = id => parseFloat(document.getElementById(id)?.value);
    
    const a1 = getValue('sys3A1'), b1 = getValue('sys3B1'), c1 = getValue('sys3C1'), d1 = getValue('sys3D1');
    const a2 = getValue('sys3A2'), b2 = getValue('sys3B2'), c2 = getValue('sys3C2'), d2 = getValue('sys3D2');
    const a3 = getValue('sys3A3'), b3 = getValue('sys3B3'), c3 = getValue('sys3C3'), d3 = getValue('sys3D3');
    
    const resultDiv = document.getElementById('system3x3Solution');
    const trans = translations[window.currentLang];
    
    if ([a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3].some(isNaN)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const matrix = [[a1, b1, c1], [a2, b2, c2], [a3, b3, c3]];
    const det = calculateDeterminant(matrix);
    
    let html = `<h3>${trans.solution}</h3>`;
    
    if (Math.abs(det) < 1e-10) {
        html += `<p class="solution">${trans.noUniqueSolution || 'No unique solution (determinant = 0)'}</p>`;
    } else {
        // Cramer's rule
        const matrixX = [[d1, b1, c1], [d2, b2, c2], [d3, b3, c3]];
        const matrixY = [[a1, d1, c1], [a2, d2, c2], [a3, d3, c3]];
        const matrixZ = [[a1, b1, d1], [a2, b2, d2], [a3, b3, d3]];
        
        const x = calculateDeterminant(matrixX) / det;
        const y = calculateDeterminant(matrixY) / det;
        const z = calculateDeterminant(matrixZ) / det;
        
        html += `<div class="solution">
            <p>x = ${x.toFixed(4)}</p>
            <p>y = ${y.toFixed(4)}</p>
            <p>z = ${z.toFixed(4)}</p>
        </div>`;
        
        addToHistory(`3x3 System: x = ${x.toFixed(4)}, y = ${y.toFixed(4)}, z = ${z.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('system3x3');
}

// ===================================
// INEQUALITY SOLVER UI
// ===================================
function solveLinearInequalityUI() {
    const a = parseFloat(document.getElementById('ineqLinearA').value);
    const b = parseFloat(document.getElementById('ineqLinearB').value);
    const op = document.getElementById('ineqLinearOp').value;
    const resultDiv = document.getElementById('inequalityLinearSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const result = solveLinearInequality(a, b, op);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<div class="solution">
        <p>${trans.inequalitySolution || 'Solution'}: <span class="highlight">${result.solution}</span></p>
        ${result.notation ? `<p>${trans.intervalNotation || 'Interval notation'}: <span class="highlight">${result.notation}</span></p>` : ''}
    </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${a}x + ${b} ${formatOperator(op)} 0 → ${result.solution}`);
    showExportButton('inequalityLinear');
}

function solveQuadraticInequalityUI() {
    const a = parseFloat(document.getElementById('ineqQuadA').value);
    const b = parseFloat(document.getElementById('ineqQuadB').value);
    const c = parseFloat(document.getElementById('ineqQuadC').value);
    const op = document.getElementById('ineqQuadOp').value;
    const resultDiv = document.getElementById('inequalityQuadraticSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const result = solveQuadraticInequality(a, b, c, op);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<div class="solution">
        <p>${trans.inequalitySolution || 'Solution'}: <span class="highlight">${result.solution}</span></p>
        ${result.notation ? `<p>${trans.intervalNotation || 'Interval notation'}: <span class="highlight">${result.notation}</span></p>` : ''}
    </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${a}x² + ${b}x + ${c} ${formatOperator(op)} 0 → ${result.solution}`);
    showExportButton('inequalityQuadratic');
}

function updateLinearInequalityPreview() {
    const a = document.getElementById('ineqLinearA')?.value || '1';
    const b = document.getElementById('ineqLinearB')?.value || '0';
    const op = document.getElementById('ineqLinearOp')?.value || '<';
    const preview = document.getElementById('linearInequalityPreview');
    if (preview) {
        preview.textContent = `${a}x + ${b} ${formatOperator(op)} 0`;
    }
}

function updateQuadraticInequalityPreview() {
    const a = document.getElementById('ineqQuadA')?.value || '1';
    const b = document.getElementById('ineqQuadB')?.value || '0';
    const c = document.getElementById('ineqQuadC')?.value || '0';
    const op = document.getElementById('ineqQuadOp')?.value || '<';
    const preview = document.getElementById('quadraticInequalityPreview');
    if (preview) {
        preview.textContent = `${a}x² + ${b}x + ${c} ${formatOperator(op)} 0`;
    }
}

// ===================================
// POLYNOMIAL DIVISION UI
// ===================================
function performPolynomialDivision() {
    const dividendStr = document.getElementById('polyDividend')?.value.trim();
    const divisorStr = document.getElementById('polyDivisor')?.value.trim();
    const resultDiv = document.getElementById('polynomialDivisionSolution');
    const trans = translations[window.currentLang];
    
    if (!dividendStr || !divisorStr) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput || 'Please enter both dividend and divisor'}</p>`;
        return;
    }
    
    const dividend = parsePolynomial(dividendStr);
    const divisor = parsePolynomial(divisorStr);
    
    if (!dividend || !divisor) {
        resultDiv.innerHTML = `<p class="error">${trans.polyParseError || 'Error parsing polynomials'}</p>`;
        return;
    }
    
    const result = dividePolynomials(dividend, divisor);
    
    if (!result) {
        resultDiv.innerHTML = `<p class="error">${trans.polyDivisionError || 'Cannot divide by zero polynomial'}</p>`;
        return;
    }
    
    const quotientStr = formatPolynomial(result.quotient);
    const remainderStr = formatPolynomial(result.remainder);
    
    let html = `<h3>${trans.solution || 'Solution'}</h3>`;
    html += `<div class="result-group">
        <div class="result-label">${trans.quotient || 'Quotient'}:</div>
        <div class="result-value"><span class="highlight">${quotientStr}</span></div>
    </div>`;
    html += `<div class="result-group">
        <div class="result-label">${trans.remainder || 'Remainder'}:</div>
        <div class="result-value"><span class="highlight">${remainderStr}</span></div>
    </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`(${dividendStr}) ÷ (${divisorStr}) = ${quotientStr} R ${remainderStr}`);
    showExportButton('polynomialDivision');
}

function setupPolynomialDivision() {
    document.getElementById('performPolynomialDivision')?.addEventListener('click', performPolynomialDivision);
}

// ===================================
// SLIDER LISTENERS FOR PREVIEWS
// ===================================
function setupSliderListeners() {
    // Linear
    ['linearA', 'linearB'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateLinearPreview);
    });
    updateLinearPreview();
    
    // Quadratic
    ['quadA', 'quadB', 'quadC'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateQuadraticPreview);
    });
    updateQuadraticPreview();
    
    // Cubic
    ['cubicA', 'cubicB', 'cubicC', 'cubicD'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateCubicPreview);
    });
    updateCubicPreview();
    
    // Quartic
    ['quartA', 'quartB', 'quartC', 'quartD', 'quartE'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateQuarticPreview);
    });
    updateQuarticPreview();
    
    // Quintic
    ['quintA', 'quintB', 'quintC', 'quintD', 'quintE', 'quintF'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateQuinticPreview);
    });
    updateQuinticPreview();
    
    // Systems
    ['sysA', 'sysB', 'sysC', 'sysD', 'sysE', 'sysF'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateSystemsPreview);
    });
    updateSystemsPreview();
    
    // Inequality
    ['ineqLinearA', 'ineqLinearB', 'ineqLinearOp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateLinearInequalityPreview);
            el.addEventListener('change', updateLinearInequalityPreview);
        }
    });
    ['ineqQuadA', 'ineqQuadB', 'ineqQuadC', 'ineqQuadOp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateQuadraticInequalityPreview);
            el.addEventListener('change', updateQuadraticInequalityPreview);
        }
    });
}

function updateLinearPreview() {
    const a = document.getElementById('linearA')?.value || '1';
    const b = document.getElementById('linearB')?.value || '0';
    const preview = document.getElementById('linearPreview');
    if (preview) preview.textContent = `${a}x + ${b} = 0`;
}

function updateQuadraticPreview() {
    const a = document.getElementById('quadA')?.value || '1';
    const b = document.getElementById('quadB')?.value || '0';
    const c = document.getElementById('quadC')?.value || '0';
    const preview = document.getElementById('quadraticPreview');
    if (preview) preview.textContent = `${a}x² + ${b}x + ${c} = 0`;
}

function updateCubicPreview() {
    const a = document.getElementById('cubicA')?.value || '1';
    const b = document.getElementById('cubicB')?.value || '0';
    const c = document.getElementById('cubicC')?.value || '0';
    const d = document.getElementById('cubicD')?.value || '0';
    const preview = document.getElementById('cubicPreview');
    if (preview) preview.textContent = `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;
}

function updateQuarticPreview() {
    const a = document.getElementById('quartA')?.value || '1';
    const b = document.getElementById('quartB')?.value || '0';
    const c = document.getElementById('quartC')?.value || '0';
    const d = document.getElementById('quartD')?.value || '0';
    const e = document.getElementById('quartE')?.value || '0';
    const preview = document.getElementById('quarticPreview');
    if (preview) preview.textContent = `${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0`;
}

function updateQuinticPreview() {
    const a = document.getElementById('quintA')?.value || '1';
    const b = document.getElementById('quintB')?.value || '0';
    const c = document.getElementById('quintC')?.value || '0';
    const d = document.getElementById('quintD')?.value || '0';
    const e = document.getElementById('quintE')?.value || '0';
    const f = document.getElementById('quintF')?.value || '0';
    const preview = document.getElementById('quinticPreview');
    if (preview) preview.textContent = `${a}x⁵ + ${b}x⁴ + ${c}x³ + ${d}x² + ${e}x + ${f} = 0`;
}

function updateSystemsPreview() {
    const a = document.getElementById('sysA')?.value || '1';
    const b = document.getElementById('sysB')?.value || '0';
    const e = document.getElementById('sysE')?.value || '0';
    const c = document.getElementById('sysC')?.value || '0';
    const d = document.getElementById('sysD')?.value || '1';
    const f = document.getElementById('sysF')?.value || '0';
    
    const preview = document.getElementById('systemsPreview');
    if (preview) {
        preview.innerHTML = `<div>${a}x + ${b}y = ${e}</div><div>${c}x + ${d}y = ${f}</div>`;
    }
}

// ===================================
// STUB FUNCTIONS FOR ADDITIONAL FEATURES
// These will be implemented in their respective modules
// ===================================
function setupMatrixCalculator() {
    document.getElementById('calculateMatrix')?.addEventListener('click', calculateMatrix);
}

function calculateMatrix() {
    const trans = translations[window.currentLang];
    const resultDiv = document.getElementById('matrixSolution');
    if (resultDiv) {
        resultDiv.innerHTML = `<p>${trans.featureComingSoon || 'Feature coming soon'}</p>`;
    }
}

function setupGcdLcmCalculator() {
    document.getElementById('calculateGcdLcm')?.addEventListener('click', calculateGcdLcm);
}

function calculateGcdLcm() {
    const input = document.getElementById('gcdlcmInput')?.value.trim();
    const resultDiv = document.getElementById('gcdlcmSolution');
    const trans = translations[window.currentLang];
    
    if (!input || !resultDiv) return;
    
    const numbers = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n) && n !== 0);
    
    if (numbers.length < 2) {
        resultDiv.innerHTML = `<p class="error">${trans.enterAtLeastTwoNumbers || 'Enter at least 2 numbers'}</p>`;
        return;
    }
    
    const gcdResult = gcdMultiple(numbers);
    const lcmResult = lcmMultiple(numbers);
    
    let html = `<h3>${trans.solution || 'Solution'}</h3>`;
    html += `<div class="result-group">
        <div class="result-label">GCD:</div>
        <div class="result-value"><span class="highlight">${gcdResult}</span></div>
    </div>`;
    html += `<div class="result-group">
        <div class="result-label">LCM:</div>
        <div class="result-value"><span class="highlight">${lcmResult}</span></div>
    </div>`;
    
    // Prime factorizations
    html += `<div class="steps"><h4>${trans.primeFactorizations || 'Prime Factorizations'}:</h4>`;
    numbers.forEach(n => {
        html += `<p>${n} = ${formatFactorization(primeFactorization(n))}</p>`;
    });
    html += `</div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`GCD(${numbers.join(', ')}) = ${gcdResult}, LCM = ${lcmResult}`);
}

function setupModularCalculator() {
    document.getElementById('calculateModular')?.addEventListener('click', () => {
        const a = parseInt(document.getElementById('modA')?.value);
        const n = parseInt(document.getElementById('modN')?.value);
        const operation = document.getElementById('modOperation')?.value;
        const resultDiv = document.getElementById('modularSolution');
        const trans = translations[window.currentLang];
        
        if (isNaN(a) || isNaN(n) || n <= 0) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        let result;
        switch (operation) {
            case 'mod':
                result = modulo(a, n);
                break;
            case 'inverse':
                result = modularInverse(a, n);
                if (result === null) {
                    resultDiv.innerHTML = `<p class="error">${trans.noInverse || 'No modular inverse exists'}</p>`;
                    return;
                }
                break;
            default:
                result = modulo(a, n);
        }
        
        resultDiv.innerHTML = `<h3>${trans.solution}</h3>
            <div class="result-value"><span class="highlight">${result}</span></div>`;
    });
}

function setupCombinatoricsCalculator() {
    document.getElementById('calculateCombinatorics')?.addEventListener('click', () => {
        const n = parseInt(document.getElementById('combN')?.value);
        const r = parseInt(document.getElementById('combR')?.value);
        const operation = document.getElementById('combOperation')?.value;
        const resultDiv = document.getElementById('combinatoricsSolution');
        const trans = translations[window.currentLang];
        
        if (isNaN(n) || n < 0 || (operation !== 'factorial' && (isNaN(r) || r < 0 || r > n))) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        let result;
        switch (operation) {
            case 'factorial':
                result = factorial(n);
                break;
            case 'permutation':
                result = permutation(n, r);
                break;
            case 'combination':
                result = combination(n, r);
                break;
        }
        
        resultDiv.innerHTML = `<h3>${trans.solution}</h3>
            <div class="result-value"><span class="highlight">${result}</span></div>`;
    });
}

function setupFractionCalculator() {
    document.getElementById('simplifyFraction')?.addEventListener('click', () => {
        const num = parseInt(document.getElementById('fracNum')?.value);
        const den = parseInt(document.getElementById('fracDen')?.value);
        const resultDiv = document.getElementById('fractionSolution');
        const trans = translations[window.currentLang];
        
        if (isNaN(num) || isNaN(den) || den === 0) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        const simplified = simplifyFractionFunc(num, den);
        const mixed = fractionToMixed(simplified.num, simplified.den);
        
        let html = `<h3>${trans.solution}</h3>`;
        html += `<div class="result-group">
            <div class="result-label">${trans.simplified || 'Simplified'}:</div>
            <div class="result-value"><span class="highlight">${simplified.num}/${simplified.den}</span></div>
        </div>`;
        if (mixed.whole !== 0) {
            html += `<div class="result-group">
                <div class="result-label">${trans.mixedNumber || 'Mixed number'}:</div>
                <div class="result-value"><span class="highlight">${mixed.whole} ${mixed.num}/${mixed.den}</span></div>
            </div>`;
        }
        
        resultDiv.innerHTML = html;
    });
}

function setupStatisticsCalculator() {
    document.getElementById('calculateStatistics')?.addEventListener('click', () => {
        const input = document.getElementById('statsInput')?.value.trim();
        const resultDiv = document.getElementById('statisticsSolution');
        const trans = translations[window.currentLang];
        
        if (!input) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        const numbers = input.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        
        if (numbers.length === 0) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        const mean = calculateMean(numbers);
        const median = calculateMedian(numbers);
        const mode = calculateMode(numbers);
        const variance = calculateVariance(numbers);
        const stdDev = calculateStdDev(numbers);
        
        let html = `<h3>${trans.solution}</h3>`;
        html += `<div class="result-group"><div class="result-label">${trans.mean || 'Mean'}:</div><div class="result-value">${mean.toFixed(4)}</div></div>`;
        html += `<div class="result-group"><div class="result-label">${trans.median || 'Median'}:</div><div class="result-value">${median.toFixed(4)}</div></div>`;
        html += `<div class="result-group"><div class="result-label">${trans.mode || 'Mode'}:</div><div class="result-value">${mode.join(', ')}</div></div>`;
        html += `<div class="result-group"><div class="result-label">${trans.variance || 'Variance'}:</div><div class="result-value">${variance.toFixed(4)}</div></div>`;
        html += `<div class="result-group"><div class="result-label">${trans.stdDev || 'Std Dev'}:</div><div class="result-value">${stdDev.toFixed(4)}</div></div>`;
        
        resultDiv.innerHTML = html;
    });
}

function setupSequenceCalculator() {
    document.getElementById('generateSequence')?.addEventListener('click', () => {
        const type = document.getElementById('seqType')?.value;
        const first = parseFloat(document.getElementById('seqFirst')?.value);
        const ratio = parseFloat(document.getElementById('seqRatio')?.value);
        const count = parseInt(document.getElementById('seqCount')?.value);
        const resultDiv = document.getElementById('sequenceSolution');
        const trans = translations[window.currentLang];
        
        if (isNaN(first) || isNaN(count) || count <= 0) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        let sequence;
        switch (type) {
            case 'arithmetic':
                sequence = generateArithmeticSequence(first, ratio || 1, count);
                break;
            case 'geometric':
                sequence = generateGeometricSequence(first, ratio || 2, count);
                break;
            case 'fibonacci':
                sequence = generateFibonacciSequence(count);
                break;
        }
        
        resultDiv.innerHTML = `<h3>${trans.solution}</h3>
            <div class="result-value">${sequence.join(', ')}</div>`;
    });
}

function setupLimitCalculator() {
    document.getElementById('calculateLimit')?.addEventListener('click', () => {
        const expr = document.getElementById('limitExpr')?.value;
        const point = document.getElementById('limitPoint')?.value;
        const resultDiv = document.getElementById('limitSolution');
        const trans = translations[window.currentLang];
        
        if (!expr) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        const result = evaluateLimitFunction(expr, parseFloat(point) || 0);
        resultDiv.innerHTML = `<h3>${trans.solution}</h3>
            <div class="result-value"><span class="highlight">${result}</span></div>`;
    });
}

function setupTaylorCalculator() {
    document.getElementById('calculateTaylor')?.addEventListener('click', () => {
        const func = document.getElementById('taylorFunc')?.value;
        const x = parseFloat(document.getElementById('taylorX')?.value);
        const terms = parseInt(document.getElementById('taylorTerms')?.value) || 10;
        const resultDiv = document.getElementById('taylorSolution');
        const trans = translations[window.currentLang];
        
        if (isNaN(x)) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        let result;
        switch (func) {
            case 'sin': result = taylorSin(x, terms); break;
            case 'cos': result = taylorCos(x, terms); break;
            case 'exp': result = taylorExp(x, terms); break;
            case 'ln': result = taylorLn(x, terms); break;
            case 'atan': result = taylorAtan(x, terms); break;
            default: result = NaN;
        }
        
        resultDiv.innerHTML = `<h3>${trans.solution}</h3>
            <div class="result-value">${func}(${x}) ≈ <span class="highlight">${result.toFixed(10)}</span></div>`;
    });
}

function setupIntegrationCalculator() {
    document.getElementById('calculateIntegral')?.addEventListener('click', () => {
        const expr = document.getElementById('integralExpr')?.value;
        const a = parseFloat(document.getElementById('integralA')?.value);
        const b = parseFloat(document.getElementById('integralB')?.value);
        const method = document.getElementById('integralMethod')?.value || 'simpson';
        const resultDiv = document.getElementById('integralSolution');
        const trans = translations[window.currentLang];
        
        if (!expr || isNaN(a) || isNaN(b)) {
            resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
            return;
        }
        
        const f = x => evaluateExpression(expr, 'x', x);
        const result = method === 'trapezoidal' 
            ? trapezoidalRule(f, a, b, 1000)
            : simpsonsRule(f, a, b, 1000);
        
        resultDiv.innerHTML = `<h3>${trans.solution}</h3>
            <div class="result-value">∫ from ${a} to ${b} ≈ <span class="highlight">${result.toFixed(10)}</span></div>`;
    });
}

function setupLatexInput() {
    const latexInput = document.getElementById('latexInput');
    const solveBtn = document.getElementById('solveLatex');
    
    if (latexInput) {
        latexInput.addEventListener('input', updateLatexPreview);
    }
    
    if (solveBtn) {
        solveBtn.addEventListener('click', solveLatexEquation);
    }
}

function updateLatexPreview() {
    const input = document.getElementById('latexInput');
    const preview = document.getElementById('latexRendered');
    if (!input || !preview) return;
    
    let latex = input.value;
    let display = latex
        .replace(/\^(\d)/g, '<sup>$1</sup>')
        .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
        .replace(/_(\d)/g, '<sub>$1</sub>')
        .replace(/_{([^}]+)}/g, '<sub>$1</sub>');
    
    preview.innerHTML = display;
}

function solveLatexEquation() {
    const latex = document.getElementById('latexInput')?.value;
    const resultDiv = document.getElementById('latexSolution');
    const trans = translations[window.currentLang];
    
    if (!latex || !resultDiv) return;
    
    try {
        const parsed = parseLatexEquation(latex);
        const { degree, coefficients } = parsed;
        
        let html = `<h3>${trans.solution}</h3>`;
        html += `<p>Detected: Degree ${degree} polynomial</p>`;
        
        let solutions = [];
        
        if (degree === 1) {
            solutions = [-coefficients[1] / coefficients[0]];
        } else if (degree === 2) {
            const [a, b, c] = coefficients;
            const delta = b * b - 4 * a * c;
            if (delta >= 0) {
                solutions = [(-b + Math.sqrt(delta)) / (2 * a), (-b - Math.sqrt(delta)) / (2 * a)];
                if (delta === 0) solutions = [solutions[0]];
            }
        } else {
            solutions = findPolynomialRoots(coefficients);
        }
        
        if (solutions.length === 0) {
            html += `<p>${trans.noRealSolutions || 'No real solutions'}</p>`;
        } else {
            html += `<div class="solution">`;
            solutions.forEach((sol, i) => {
                html += `<p>x${i + 1} = ${sol.toFixed(6)}</p>`;
            });
            html += `</div>`;
        }
        
        resultDiv.innerHTML = html;
        showExportButton('latex');
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function setupBaseConverter() {
    document.getElementById('convertBase')?.addEventListener('click', convertBase);
}

function convertBase() {
    const input = document.getElementById('baseInput')?.value.trim().toUpperCase();
    const fromBase = parseInt(document.getElementById('fromBase')?.value);
    const resultDiv = document.getElementById('baseConverterSolution');
    const trans = translations[window.currentLang];
    
    if (!input || !resultDiv) return;
    
    const validChars = '0123456789ABCDEF'.substring(0, fromBase);
    const isNegative = input.startsWith('-');
    const cleanInput = isNegative ? input.substring(1) : input;
    
    if (!cleanInput.split('').every(c => validChars.includes(c))) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidBaseNumber || 'Invalid number'}</p>`;
        return;
    }
    
    const decimal = parseInt(cleanInput, fromBase);
    const sign = isNegative ? '-' : '';
    
    const html = `
        <div class="result-group">
            <div class="result-label">${trans.binaryResult || 'Binary'}:</div>
            <div class="result-value"><span class="highlight">${sign}${Math.abs(decimal).toString(2)}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${trans.octalResult || 'Octal'}:</div>
            <div class="result-value"><span class="highlight">${sign}${Math.abs(decimal).toString(8)}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${trans.decimalResult || 'Decimal'}:</div>
            <div class="result-value"><span class="highlight">${sign}${Math.abs(decimal)}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${trans.hexResult || 'Hexadecimal'}:</div>
            <div class="result-value"><span class="highlight">${sign}${Math.abs(decimal).toString(16).toUpperCase()}</span></div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${input} (base ${fromBase}) = ${sign}${Math.abs(decimal)} (base 10)`);
}

function setupUnitConverter() {
    const convertBtn = document.getElementById('convertUnit');
    const categorySelect = document.getElementById('unitCategory');
    
    if (convertBtn) {
        convertBtn.addEventListener('click', performUnitConversion);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', updateUnitOptions);
        updateUnitOptions();
    }
}

function updateUnitOptions() {
    const category = document.getElementById('unitCategory')?.value;
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    if (!category || !fromSelect || !toSelect) return;
    
    const units = Object.keys(unitConversions[category] || {});
    const trans = translations[window.currentLang];
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    units.forEach((unit, index) => {
        const fromOption = document.createElement('option');
        fromOption.value = unit;
        fromOption.textContent = trans[unit] || unit;
        fromSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unit;
        toOption.textContent = trans[unit] || unit;
        if (index === 1) toOption.selected = true;
        toSelect.appendChild(toOption);
    });
}

function performUnitConversion() {
    const category = document.getElementById('unitCategory')?.value;
    const value = parseFloat(document.getElementById('unitValue')?.value);
    const fromUnit = document.getElementById('fromUnit')?.value;
    const toUnit = document.getElementById('toUnit')?.value;
    const resultDiv = document.getElementById('unitConverterSolution');
    const trans = translations[window.currentLang];
    
    if (isNaN(value) || !resultDiv) {
        if (resultDiv) resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    let result;
    if (category === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        const toBase = value / unitConversions[category][fromUnit];
        result = toBase * unitConversions[category][toUnit];
    }
    
    const fromLabel = trans[fromUnit] || fromUnit;
    const toLabel = trans[toUnit] || toUnit;
    
    resultDiv.innerHTML = `<div class="result-group">
        <div class="result-label">${trans.result || 'Result'}:</div>
        <div class="result-value">${value} ${fromLabel} = <span class="highlight">${result.toFixed(6)}</span> ${toLabel}</div>
    </div>`;
    
    addToHistory(`${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`);
}

// ===================================
// EXPORTS FOR TESTING (CommonJS)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Re-export everything for tests
        factorial,
        complexAdd, complexSub, complexMul, complexDiv, complexSqrt, complexAbs,
        complexConjugate, formatComplex,
        solveQuadraticComplex, solveCubicComplex,
        findPolynomialRoots, findPolynomialRootsComplex, separateRoots,
        addMatrices, multiplyMatrices, calculateDeterminant, invertMatrix,
        gcd, lcm, gcdMultiple, lcmMultiple, primeFactorization, formatFactorization,
        modulo, modularInverse, modularPower,
        factorialBig, permutation, combination,
        simplifyFractionFunc, fractionToMixed,
        calculateMean, calculateMedian, calculateMode, calculateVariance, calculateStdDev,
        generateArithmeticSequence, generateGeometricSequence, generateFibonacciSequence,
        evaluateLimitFunction,
        taylorSin, taylorCos, taylorExp, taylorLn, taylorAtan,
        trapezoidalRule, simpsonsRule,
        parseLatexEquation,
        evaluateExpression,
        solveLinearInequality, solveQuadraticInequality, flipOperator, evaluateComparison, formatOperator,
        parsePolynomial, dividePolynomials, formatPolynomial,
        convertTemperature, unitConversions
    };
}
