// ===================================
// STATE MANAGEMENT
// ===================================
let currentTheme = 'matrix';
let currentLang = 'en';
let state = {
    display: '0',
    operation: null,
    previousValue: null,
    waitingForOperand: false
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Set default theme first
    document.body.className = 'theme-matrix';
    
    // Clear old settings to force defaults
    localStorage.removeItem('equasolver_settings');
    
    initParticles();
    initEventListeners();
    loadFlags();
    
    // Force default settings
    changeTheme('matrix');
    changeLanguage('en');
    
    updateTranslations();
    updateHistoryDisplay();
});

// Load country flag images
function loadFlags() {
    document.querySelectorAll('[data-lang-flag]').forEach(img => {
        const lang = img.dataset.langFlag;
        if (FLAGS[lang]) {
            img.src = FLAGS[lang];
        }
    });
}

// ===================================
// PARTICLES.JS CONFIGURATION
// ===================================
function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
        particles: {
            number: { 
                value: 80, 
                density: { enable: true, value_area: 800 } 
            },
            color: { value: '#ff0080' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00ffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });
}

// Update particle colors based on theme
function updateParticlesColor() {
    const themeColors = {
        cyberpunk: { particle: '#ff0080', line: '#00ffff' },
        neon: { particle: '#00ff9f', line: '#ff006e' },
        matrix: { particle: '#00ff41', line: '#008f11' },
        sunset: { particle: '#ff6b35', line: '#ffd23f' },
        ocean: { particle: '#00b4d8', line: '#90e0ef' },
        galaxy: { particle: '#b537f2', line: '#f72585' }
    };
    
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        pJSDom[0].pJS.particles.color.value = themeColors[currentTheme].particle;
        pJSDom[0].pJS.particles.line_linked.color = themeColors[currentTheme].line;
        pJSDom[0].pJS.fn.particlesRefresh();
    }
}

// ===================================
// EVENT LISTENERS SETUP
// ===================================
function initEventListeners() {
    // Settings panel
    document.getElementById('settingsBtn').addEventListener('click', toggleSettings);
    document.getElementById('closeSettings').addEventListener('click', toggleSettings);
    
    // Theme selection
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
    });
    
    // Language selection
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => changeLanguage(btn.dataset.lang));
    });
    
    // Calculator tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Standard calculator buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', handleCalculatorButton);
    });
    
    // Equation solver buttons
    document.getElementById('solveLinear').addEventListener('click', solveLinearEquation);
    document.getElementById('solveQuadratic').addEventListener('click', solveQuadraticEquation);
    document.getElementById('solveCubic').addEventListener('click', solveCubicEquation);
    document.getElementById('solveQuartic').addEventListener('click', solveQuarticEquation);
    document.getElementById('solveQuintic').addEventListener('click', solveQuinticEquation);
    document.getElementById('solveSystems').addEventListener('click', solveSystemEquations);
    document.getElementById('calculateMatrix').addEventListener('click', calculateMatrix);
    
    // PDF Export buttons
    document.getElementById('exportLinearPdf').addEventListener('click', () => exportToPDF('linear'));
    document.getElementById('exportQuadraticPdf').addEventListener('click', () => exportToPDF('quadratic'));
    document.getElementById('exportCubicPdf').addEventListener('click', () => exportToPDF('cubic'));
    document.getElementById('exportQuarticPdf').addEventListener('click', () => exportToPDF('quartic'));
    document.getElementById('exportQuinticPdf').addEventListener('click', () => exportToPDF('quintic'));
    document.getElementById('exportSystemsPdf').addEventListener('click', () => exportToPDF('systems'));
    document.getElementById('exportMatrixPdf').addEventListener('click', () => exportToPDF('matrix'));
    
    // Slider updates for equations
    setupSliderListeners();
    
    // Matrix calculator setup
    setupMatrixCalculator();
    
    // Graph visualization setup
    setupGraphVisualization();
    
    // History management
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    
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
    document.getElementById('backBtn').addEventListener('click', showHomeScreen);
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Setup slider listeners for real-time updates
function setupSliderListeners() {
    // Linear equation inputs
    const linearA = document.getElementById('linearA');
    const linearB = document.getElementById('linearB');
    linearA.addEventListener('input', updateLinearPreview);
    linearB.addEventListener('input', updateLinearPreview);
    updateLinearPreview();
    
    // Quadratic equation inputs
    const quadA = document.getElementById('quadA');
    const quadB = document.getElementById('quadB');
    const quadC = document.getElementById('quadC');
    quadA.addEventListener('input', updateQuadraticPreview);
    quadB.addEventListener('input', updateQuadraticPreview);
    quadC.addEventListener('input', updateQuadraticPreview);
    updateQuadraticPreview();
    
    // Cubic equation inputs
    const cubicA = document.getElementById('cubicA');
    const cubicB = document.getElementById('cubicB');
    const cubicC = document.getElementById('cubicC');
    const cubicD = document.getElementById('cubicD');
    cubicA.addEventListener('input', updateCubicPreview);
    cubicB.addEventListener('input', updateCubicPreview);
    cubicC.addEventListener('input', updateCubicPreview);
    cubicD.addEventListener('input', updateCubicPreview);
    updateCubicPreview();
    
    // Quartic equation inputs
    const quartA = document.getElementById('quartA');
    const quartB = document.getElementById('quartB');
    const quartC = document.getElementById('quartC');
    const quartD = document.getElementById('quartD');
    const quartE = document.getElementById('quartE');
    quartA.addEventListener('input', updateQuarticPreview);
    quartB.addEventListener('input', updateQuarticPreview);
    quartC.addEventListener('input', updateQuarticPreview);
    quartD.addEventListener('input', updateQuarticPreview);
    quartE.addEventListener('input', updateQuarticPreview);
    updateQuarticPreview();
    
    // Quintic equation inputs
    const quintA = document.getElementById('quintA');
    const quintB = document.getElementById('quintB');
    const quintC = document.getElementById('quintC');
    const quintD = document.getElementById('quintD');
    const quintE = document.getElementById('quintE');
    const quintF = document.getElementById('quintF');
    quintA.addEventListener('input', updateQuinticPreview);
    quintB.addEventListener('input', updateQuinticPreview);
    quintC.addEventListener('input', updateQuinticPreview);
    quintD.addEventListener('input', updateQuinticPreview);
    quintE.addEventListener('input', updateQuinticPreview);
    quintF.addEventListener('input', updateQuinticPreview);
    updateQuinticPreview();
    
    // System equation inputs
    const sysA = document.getElementById('sysA');
    const sysB = document.getElementById('sysB');
    const sysE = document.getElementById('sysE');
    const sysC = document.getElementById('sysC');
    const sysD = document.getElementById('sysD');
    const sysF = document.getElementById('sysF');
    
    sysA.addEventListener('input', updateSystemsPreview);
    sysB.addEventListener('input', updateSystemsPreview);
    sysE.addEventListener('input', updateSystemsPreview);
    sysC.addEventListener('input', updateSystemsPreview);
    sysD.addEventListener('input', updateSystemsPreview);
    sysF.addEventListener('input', updateSystemsPreview);
    updateSystemsPreview();
}

// Update preview functions
function updateLinearPreview() {
    const a = document.getElementById('linearA').value;
    const b = document.getElementById('linearB').value;
    document.getElementById('linearPreview').textContent = `${a}x + ${b} = 0`;
}

function updateQuadraticPreview() {
    const a = document.getElementById('quadA').value;
    const b = document.getElementById('quadB').value;
    const c = document.getElementById('quadC').value;
    document.getElementById('quadraticPreview').textContent = `${a}x² + ${b}x + ${c} = 0`;
}

function updateCubicPreview() {
    const a = document.getElementById('cubicA').value;
    const b = document.getElementById('cubicB').value;
    const c = document.getElementById('cubicC').value;
    const d = document.getElementById('cubicD').value;
    document.getElementById('cubicPreview').textContent = `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;
}

function updateQuarticPreview() {
    const a = document.getElementById('quartA').value;
    const b = document.getElementById('quartB').value;
    const c = document.getElementById('quartC').value;
    const d = document.getElementById('quartD').value;
    const e = document.getElementById('quartE').value;
    document.getElementById('quarticPreview').textContent = `${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0`;
}

function updateQuinticPreview() {
    const a = document.getElementById('quintA').value;
    const b = document.getElementById('quintB').value;
    const c = document.getElementById('quintC').value;
    const d = document.getElementById('quintD').value;
    const e = document.getElementById('quintE').value;
    const f = document.getElementById('quintF').value;
    document.getElementById('quinticPreview').textContent = `${a}x⁵ + ${b}x⁴ + ${c}x³ + ${d}x² + ${e}x + ${f} = 0`;
}

function updateSystemsPreview() {
    const a = document.getElementById('sysA').value;
    const b = document.getElementById('sysB').value;
    const e = document.getElementById('sysE').value;
    const c = document.getElementById('sysC').value;
    const d = document.getElementById('sysD').value;
    const f = document.getElementById('sysF').value;
    
    const preview = document.getElementById('systemsPreview');
    preview.innerHTML = `
        <div>${a}x + ${b}y = ${e}</div>
        <div>${c}x + ${d}y = ${f}</div>
    `;
}

// ===================================
// SCREEN NAVIGATION
// ===================================
function showHomeScreen() {
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('calculatorScreen').classList.remove('active');
}

function showCalculatorScreen(tool) {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('calculatorScreen').classList.add('active');
    
    document.querySelector('.calculator-wrapper').style.display = 'block';
    document.querySelector('.history-panel').style.display = 'none';
    
    switchTab(tool);
}

function showHistoryScreen() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('calculatorScreen').classList.add('active');
    
    document.querySelector('.calculator-wrapper').style.display = 'none';
    document.querySelector('.history-panel').style.display = 'block';
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
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    
    // Update tab panels
    document.querySelectorAll('.calculator-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tab);
    });
}

// ===================================
// SETTINGS MANAGEMENT
// ===================================
function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('active');
}

function changeTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    saveSettings();
    updateParticlesColor();
}

function changeLanguage(lang) {
    currentLang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    updateTranslations();
    saveSettings();
}

function updateTranslations() {
    const trans = translations[currentLang];
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (!trans[key]) return;
        
        if (el.tagName === 'INPUT') {
            el.placeholder = trans[key];
        } else {
            el.textContent = trans[key];
        }
    });
}

function saveSettings() {
    localStorage.setItem('equasolver_settings', JSON.stringify({
        theme: currentTheme,
        lang: currentLang
    }));
}

function loadSettings() {
    const saved = localStorage.getItem('equasolver_settings');
    if (!saved) {
        // No saved settings, use defaults
        changeTheme('matrix');
        changeLanguage('en');
        return;
    }
    
    const settings = JSON.parse(saved);
    // Always default to matrix and english if not explicitly saved
    changeTheme(settings.theme || 'matrix');
    changeLanguage(settings.lang || 'en');
}

// ===================================
// STANDARD CALCULATOR
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
    }
}

function handleValue(value) {
    if (state.waitingForOperand) {
        state.display = value;
        state.waitingForOperand = false;
    } else {
        state.display = state.display === '0' ? value : state.display + value;
    }
    updateDisplay();
}

function handleOperator(op) {
    const currentValue = parseFloat(state.display);
    
    if (state.operation && !state.waitingForOperand) {
        calculate();
    } else {
        state.previousValue = currentValue;
    }
    
    state.operation = op;
    state.waitingForOperand = true;
}

function calculate() {
    const prev = state.previousValue;
    const current = parseFloat(state.display);
    let result;
    
    switch (state.operation) {
        case '+': result = prev + current; break;
        case '−': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': result = prev / current; break;
        default: return;
    }
    
    const expression = `${prev} ${state.operation} ${current}`;
    
    state.display = String(result);
    state.operation = null;
    state.previousValue = null;
    state.waitingForOperand = true;
    updateDisplay();
    
    addToHistory(`${expression} = ${result}`);
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

function clearCalculator() {
    state.display = '0';
    state.operation = null;
    state.previousValue = null;
    state.waitingForOperand = false;
    updateDisplay();
}

function deleteLastDigit() {
    state.display = state.display.slice(0, -1) || '0';
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').value = state.display;
}

// ===================================
// KEYBOARD SUPPORT
// ===================================
function handleKeyboard(e) {
    if (e.key >= '0' && e.key <= '9') {
        handleValue(e.key);
    } else if (e.key === '.') {
        handleValue('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
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
// LINEAR EQUATION SOLVER (ax + b = 0)
// ===================================
function solveLinearEquation() {
    const a = parseFloat(document.getElementById('linearA').value);
    const b = parseFloat(document.getElementById('linearB').value);
    const resultDiv = document.getElementById('linearSolution');
    const trans = translations[currentLang];
    
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
        html += `<div class="solution">x = ${x.toFixed(4)}</div>`;
        html += `<div class="steps">
            <h4>${trans.steps}:</h4>
            <p>ax + b = 0</p>
            <p>${a}x + ${b} = 0</p>
            <p>${a}x = ${-b}</p>
            <p>x = ${-b} / ${a}</p>
            <p>x = ${x.toFixed(4)}</p>
        </div>`;
        
        addToHistory(`${a}x + ${b} = 0 → x = ${x.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('linear');
}

// ===================================
// QUADRATIC EQUATION SOLVER (ax² + bx + c = 0)
// ===================================
function solveQuadraticEquation() {
    const a = parseFloat(document.getElementById('quadA').value);
    const b = parseFloat(document.getElementById('quadB').value);
    const c = parseFloat(document.getElementById('quadC').value);
    const resultDiv = document.getElementById('quadraticSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const delta = b * b - 4 * a * c;
    let html = `<h3>${trans.solution}</h3>`;
    html += `<p><strong>${trans.discriminant} (Δ):</strong> ${delta.toFixed(4)}</p>`;
    
    if (delta < 0) {
        html += `<p class="solution">${trans.noSolution}</p>`;
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
    
    html += `<div class="steps">
        <h4>${trans.steps}:</h4>
        <p>Δ = b² - 4ac</p>
        <p>Δ = (${b})² - 4(${a})(${c})</p>
        <p>Δ = ${delta.toFixed(4)}</p>
    </div>`;
    
    resultDiv.innerHTML = html;
    showExportButton('quadratic');
}

// ===================================
// CUBIC EQUATION SOLVER (ax³ + bx² + cx + d = 0)
// ===================================
function solveCubicEquation() {
    const a = parseFloat(document.getElementById('cubicA').value);
    const b = parseFloat(document.getElementById('cubicB').value);
    const c = parseFloat(document.getElementById('cubicC').value);
    const d = parseFloat(document.getElementById('cubicD').value);
    const resultDiv = document.getElementById('cubicSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    // Normalize coefficients
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    
    const discriminant = -(4 * p * p * p + 27 * q * q);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<p><strong>${trans.discriminant}:</strong> ${discriminant.toFixed(4)}</p>`;
    
    let solutions = [];
    
    if (discriminant > 0) {
        // Three real roots (trigonometric solution)
        const m = 2 * Math.sqrt(-p / 3);
        const theta = Math.acos((3 * q / p) * Math.sqrt(-3 / p)) / 3;
        
        for (let k = 0; k < 3; k++) {
            const x = m * Math.cos(theta - (2 * Math.PI * k) / 3) - b / (3 * a);
            solutions.push(x);
        }
        
        html += `<div class="solution">
            <p>${trans.threeSolutions}</p>
            <p>x₁ = ${solutions[0].toFixed(4)}</p>
            <p>x₂ = ${solutions[1].toFixed(4)}</p>
            <p>x₃ = ${solutions[2].toFixed(4)}</p>
        </div>`;
    } else {
        // One real root (Cardano's formula)
        const u = Math.cbrt(-q / 2 + Math.sqrt(-discriminant / 108));
        const v = Math.cbrt(-q / 2 - Math.sqrt(-discriminant / 108));
        const x = u + v - b / (3 * a);
        
        solutions.push(x);
        
        html += `<div class="solution">
            <p>${trans.oneSolution}</p>
            <p>x = ${x.toFixed(4)}</p>
        </div>`;
    }
    
    resultDiv.innerHTML = html;
    showExportButton('cubic');
    addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → ${solutions.map(s => s.toFixed(4)).join(', ')}`);
}

// ===================================
// QUARTIC EQUATION SOLVER (Numerical)
// ===================================
function solveQuarticEquation() {
    const a = parseFloat(document.getElementById('quartA').value);
    const b = parseFloat(document.getElementById('quartB').value);
    const c = parseFloat(document.getElementById('quartC').value);
    const d = parseFloat(document.getElementById('quartD').value);
    const e = parseFloat(document.getElementById('quartE').value);
    const resultDiv = document.getElementById('quarticSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const roots = findPolynomialRoots([a, b, c, d, e]);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<div class="solution">`;
    
    if (roots.length === 0) {
        html += `<p>${trans.noRealSolutions}</p>`;
    } else {
        html += `<p>${roots.length} ${trans.solutionsFound}:</p>`;
        roots.forEach((root, i) => {
            html += `<p>x${i + 1} = ${root.toFixed(4)}</p>`;
        });
    }
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    showExportButton('quartic');
    addToHistory(`${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0 → ${roots.map(r => r.toFixed(4)).join(', ')}`);
}

// ===================================
// QUINTIC EQUATION SOLVER (Numerical)
// ===================================
function solveQuinticEquation() {
    const a = parseFloat(document.getElementById('quintA').value);
    const b = parseFloat(document.getElementById('quintB').value);
    const c = parseFloat(document.getElementById('quintC').value);
    const d = parseFloat(document.getElementById('quintD').value);
    const e = parseFloat(document.getElementById('quintE').value);
    const f = parseFloat(document.getElementById('quintF').value);
    const resultDiv = document.getElementById('quinticSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const roots = findPolynomialRoots([a, b, c, d, e, f]);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<div class="solution">`;
    
    if (roots.length === 0) {
        html += `<p>${trans.noRealSolutions}</p>`;
    } else {
        html += `<p>${roots.length} ${trans.solutionsFound}:</p>`;
        roots.forEach((root, i) => {
            html += `<p>x${i + 1} = ${root.toFixed(4)}</p>`;
        });
    }
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    showExportButton('quintic');
    addToHistory(`${a}x⁵ + ${b}x⁴ + ${c}x³ + ${d}x² + ${e}x + ${f} = 0 → ${roots.map(r => r.toFixed(4)).join(', ')}`);
}

// Numerical root finding using Durand-Kerner method
function findPolynomialRoots(coeffs) {
    const degree = coeffs.length - 1;
    if (degree < 1) return [];
    
    // Normalize coefficients
    const normalized = coeffs.map(c => c / coeffs[0]);
    
    // Initial guesses (unit circle)
    const roots = [];
    for (let i = 0; i < degree; i++) {
        const angle = (2 * Math.PI * i) / degree;
        roots.push({ re: Math.cos(angle), im: Math.sin(angle) });
    }
    
    // Durand-Kerner iterations
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
    
    // Extract real roots
    return roots
        .filter(z => Math.abs(z.im) < 0.01)
        .map(z => z.re)
        .sort((a, b) => a - b);
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

function complexPow(z, n) {
    if (n === 0) return { re: 1, im: 0 };
    if (n === 1) return z;
    
    let result = { re: 1, im: 0 };
    for (let i = 0; i < n; i++) {
        result = complexMul(result, z);
    }
    return result;
}

function complexScale(z, scalar) {
    return { re: z.re * scalar, im: z.im * scalar };
}

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
    if (denom === 0) return { re: 0, im: 0 };
    return {
        re: (a.re * b.re + a.im * b.im) / denom,
        im: (a.im * b.re - a.re * b.im) / denom
    };
}

// ===================================
// SYSTEM OF EQUATIONS SOLVER (Cramer's Rule)
// ===================================
function solveSystemEquations() {
    const a = parseFloat(document.getElementById('sysA').value);
    const b = parseFloat(document.getElementById('sysB').value);
    const e = parseFloat(document.getElementById('sysE').value);
    const c = parseFloat(document.getElementById('sysC').value);
    const d = parseFloat(document.getElementById('sysD').value);
    const f = parseFloat(document.getElementById('sysF').value);
    const resultDiv = document.getElementById('systemsSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e) || isNaN(f)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const det = a * d - b * c;
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<p><strong>${trans.determinant}:</strong> ${det.toFixed(4)}</p>`;
    
    if (det === 0) {
        if (a * f === c * e && b * f === d * e) {
            html += `<p class="solution">${trans.coincidentLines}</p>`;
        } else {
            html += `<p class="solution">${trans.parallelLines}</p>`;
        }
    } else {
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        html += `<div class="solution">
            <p>${trans.uniqueSolution}</p>
            <p>x = ${x.toFixed(4)}</p>
            <p>y = ${y.toFixed(4)}</p>
        </div>`;
        
        html += `<div class="steps">
            <h4>${trans.steps}:</h4>
            <p>${a}x + ${b}y = ${e}</p>
            <p>${c}x + ${d}y = ${f}</p>
            <p>Det = ${det.toFixed(4)}</p>
        </div>`;
        
        addToHistory(`System → x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('systems');
}

// ===================================
// HISTORY MANAGEMENT
// ===================================
function addToHistory(entry) {
    const history = JSON.parse(localStorage.getItem('equasolver_history') || '[]');
    history.unshift({ 
        entry, 
        timestamp: new Date().toLocaleString() 
    });
    
    // Keep only last 50 entries
    if (history.length > 50) history.pop();
    
    localStorage.setItem('equasolver_history', JSON.stringify(history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('equasolver_history') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No history yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-entry">${item.entry}</div>
            <div class="history-time">${item.timestamp}</div>
        </div>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem('equasolver_history');
    updateHistoryDisplay();
}

// ==================== MATRIX CALCULATOR ====================

function setupMatrixCalculator() {
    const matrixSize = document.getElementById('matrixSize');
    const matrixOperation = document.getElementById('matrixOperation');
    
    matrixSize.addEventListener('change', updateMatrixGrids);
    matrixOperation.addEventListener('change', updateMatrixVisibility);
    
    updateMatrixGrids();
    updateMatrixVisibility();
}

function updateMatrixGrids() {
    const size = parseInt(document.getElementById('matrixSize').value);
    createMatrixGrid('matrixAGrid', size);
    createMatrixGrid('matrixBGrid', size);
}

function createMatrixGrid(gridId, size) {
    const grid = document.getElementById(gridId);
    grid.className = `matrix-grid size-${size}`;
    grid.innerHTML = '';
    
    for (let i = 0; i < size * size; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'matrix-cell';
        input.value = '0';
        input.step = '0.1';
        grid.appendChild(input);
    }
}

function updateMatrixVisibility() {
    const operation = document.getElementById('matrixOperation').value;
    const matrixBWrapper = document.getElementById('matrixBWrapper');
    
    // Show matrix B only for addition and multiplication
    if (operation === 'add' || operation === 'multiply') {
        matrixBWrapper.style.display = 'block';
    } else {
        matrixBWrapper.style.display = 'none';
    }
}

function getMatrixFromGrid(gridId, size) {
    const grid = document.getElementById(gridId);
    const inputs = grid.querySelectorAll('.matrix-cell');
    const matrix = [];
    
    for (let i = 0; i < size; i++) {
        matrix[i] = [];
        for (let j = 0; j < size; j++) {
            matrix[i][j] = parseFloat(inputs[i * size + j].value) || 0;
        }
    }
    
    return matrix;
}

function calculateMatrix() {
    const size = parseInt(document.getElementById('matrixSize').value);
    const operation = document.getElementById('matrixOperation').value;
    const matrixA = getMatrixFromGrid('matrixAGrid', size);
    
    const solution = document.getElementById('matrixSolution');
    solution.innerHTML = '';
    
    try {
        let result;
        let resultHTML = '';
        
        switch (operation) {
            case 'add':
                const matrixB = getMatrixFromGrid('matrixBGrid', size);
                result = addMatrices(matrixA, matrixB);
                resultHTML = displayMatrixResult('Addition Result', result);
                break;
                
            case 'multiply':
                const matrixB2 = getMatrixFromGrid('matrixBGrid', size);
                result = multiplyMatrices(matrixA, matrixB2);
                resultHTML = displayMatrixResult('Multiplication Result', result);
                break;
                
            case 'determinant':
                const det = calculateDeterminant(matrixA);
                resultHTML = `
                    <div class="matrix-result">
                        <h4 data-translate="determinantCalc">Determinant</h4>
                        <div class="solution-text">det(A) = ${det.toFixed(4)}</div>
                    </div>
                `;
                break;
                
            case 'inverse':
                result = invertMatrix(matrixA);
                if (result === null) {
                    throw new Error(translations[currentLanguage].singularMatrix);
                }
                resultHTML = displayMatrixResult('Inverse Matrix', result);
                break;
        }
        
        solution.innerHTML = resultHTML;
        showExportButton('matrix');
        
    } catch (error) {
        solution.innerHTML = `
            <div class="error-message">
                <p>${error.message}</p>
            </div>
        `;
    }
}

function addMatrices(A, B) {
    const size = A.length;
    const result = [];
    
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    
    return result;
}

function multiplyMatrices(A, B) {
    const size = A.length;
    const result = [];
    
    for (let i = 0; i < size; i++) {
        result[i] = [];
        for (let j = 0; j < size; j++) {
            result[i][j] = 0;
            for (let k = 0; k < size; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    return result;
}

function calculateDeterminant(matrix) {
    const size = matrix.length;
    
    if (size === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (size === 3) {
        return (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );
    }
    
    return 0;
}

function invertMatrix(matrix) {
    const size = matrix.length;
    const det = calculateDeterminant(matrix);
    
    if (Math.abs(det) < 1e-10) {
        return null; // Singular matrix
    }
    
    if (size === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    } else if (size === 3) {
        const inv = [];
        
        // Calculate cofactor matrix
        inv[0] = [];
        inv[0][0] = (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) / det;
        inv[0][1] = -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]) / det;
        inv[0][2] = (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) / det;
        
        inv[1] = [];
        inv[1][0] = -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) / det;
        inv[1][1] = (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) / det;
        inv[1][2] = -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]) / det;
        
        inv[2] = [];
        inv[2][0] = (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) / det;
        inv[2][1] = -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]) / det;
        inv[2][2] = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) / det;
        
        return inv;
    }
    
    return null;
}

function displayMatrixResult(title, matrix) {
    const size = matrix.length;
    const cells = matrix.flat().map(val => 
        `<div class="matrix-display-cell">${val.toFixed(4)}</div>`
    ).join('');
    
    return `
        <div class="matrix-result">
            <h4>${title}</h4>
            <div class="matrix-display size-${size}">
                ${cells}
            </div>
        </div>
    `;
}

// ==================== GRAPH VISUALIZATION ====================

let graphState = {
    canvas: null,
    ctx: null,
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    equationType: 'linear',
    coefficients: {}
};

function setupGraphVisualization() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    
    graphState.canvas = canvas;
    graphState.ctx = ctx;
    
    // Event listeners
    document.getElementById('graphEquationType').addEventListener('change', updateGraphInputs);
    document.getElementById('plotGraph').addEventListener('click', plotGraph);
    document.getElementById('resetView').addEventListener('click', resetGraphView);
    document.getElementById('zoomIn').addEventListener('click', () => zoomGraph(0.8));
    document.getElementById('zoomOut').addEventListener('click', () => zoomGraph(1.25));
    
    // Export graph PDF
    document.getElementById('exportGraphPdf').addEventListener('click', exportGraphToPDF);
    
    // Range inputs
    ['xMin', 'xMax', 'yMin', 'yMax'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateGraphRange);
    });
    
    updateGraphInputs();
    drawGraph();
}

function updateGraphInputs() {
    const type = document.getElementById('graphEquationType').value;
    graphState.equationType = type;
    
    const inputsContainer = document.getElementById('graphInputs');
    let html = '';
    
    switch(type) {
        case 'linear':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="number" id="graphA" value="1" step="0.1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="number" id="graphB" value="0" step="0.1" class="graph-input">
                </div>
            `;
            break;
        case 'quadratic':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="number" id="graphA" value="1" step="0.1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="number" id="graphB" value="0" step="0.1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>c:</label>
                    <input type="number" id="graphC" value="0" step="0.1" class="graph-input">
                </div>
            `;
            break;
        case 'cubic':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="number" id="graphA" value="1" step="0.1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="number" id="graphB" value="0" step="0.1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>c:</label>
                    <input type="number" id="graphC" value="0" step="0.1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>d:</label>
                    <input type="number" id="graphD" value="0" step="0.1" class="graph-input">
                </div>
            `;
            break;
    }
    
    inputsContainer.innerHTML = html;
}

function updateGraphRange() {
    graphState.xMin = parseFloat(document.getElementById('xMin').value);
    graphState.xMax = parseFloat(document.getElementById('xMax').value);
    graphState.yMin = parseFloat(document.getElementById('yMin').value);
    graphState.yMax = parseFloat(document.getElementById('yMax').value);
}

function plotGraph() {
    updateGraphRange();
    
    // Get coefficients
    const a = parseFloat(document.getElementById('graphA')?.value || 0);
    const b = parseFloat(document.getElementById('graphB')?.value || 0);
    const c = parseFloat(document.getElementById('graphC')?.value || 0);
    const d = parseFloat(document.getElementById('graphD')?.value || 0);
    
    graphState.coefficients = { a, b, c, d };
    
    drawGraph();
    showExportButton('graph');
}

function drawGraph() {
    const { canvas, ctx, xMin, xMax, yMin, yMax } = graphState;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid if enabled
    if (document.getElementById('showGrid').checked) {
        drawGrid(ctx, width, height);
    }
    
    // Draw axes if enabled
    if (document.getElementById('showAxes').checked) {
        drawAxes(ctx, width, height);
    }
    
    // Draw equation
    if (graphState.coefficients.a !== undefined) {
        drawEquation(ctx, width, height);
    }
}

function drawGrid(ctx, width, height) {
    const { xMin, xMax, yMin, yMax } = graphState;
    
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    // Vertical lines
    const xStep = (xMax - xMin) / 20;
    for (let x = xMin; x <= xMax; x += xStep) {
        const px = mapX(x, width);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
    }
    
    // Horizontal lines
    const yStep = (yMax - yMin) / 20;
    for (let y = yMin; y <= yMax; y += yStep) {
        const py = mapY(y, height);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
    }
}

function drawAxes(ctx, width, height) {
    const { xMin, xMax, yMin, yMax } = graphState;
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    
    // X-axis
    if (yMin <= 0 && yMax >= 0) {
        const y0 = mapY(0, height);
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(width, y0);
        ctx.stroke();
        
        // X-axis labels
        ctx.fillStyle = '#00ff88';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        const xStep = Math.ceil((xMax - xMin) / 10);
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            if (x !== 0) {
                const px = mapX(x, width);
                ctx.fillText(x.toString(), px, y0 + 20);
            }
        }
    }
    
    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
        const x0 = mapX(0, width);
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, height);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = '#00ff88';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'right';
        const yStep = Math.ceil((yMax - yMin) / 10);
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            if (y !== 0) {
                const py = mapY(y, height);
                ctx.fillText(y.toString(), x0 - 10, py + 4);
            }
        }
    }
}

function drawEquation(ctx, width, height) {
    const { equationType, coefficients, xMin, xMax } = graphState;
    const { a, b, c, d } = coefficients;
    
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    const step = (xMax - xMin) / width;
    
    for (let x = xMin; x <= xMax; x += step) {
        let y;
        
        switch(equationType) {
            case 'linear':
                y = a * x + b;
                break;
            case 'quadratic':
                y = a * x * x + b * x + c;
                break;
            case 'cubic':
                y = a * x * x * x + b * x * x + c * x + d;
                break;
        }
        
        const px = mapX(x, width);
        const py = mapY(y, height);
        
        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
        } else {
            ctx.lineTo(px, py);
        }
    }
    
    ctx.stroke();
}

function mapX(x, width) {
    const { xMin, xMax } = graphState;
    return ((x - xMin) / (xMax - xMin)) * width;
}

function mapY(y, height) {
    const { yMin, yMax } = graphState;
    return height - ((y - yMin) / (yMax - yMin)) * height;
}

function resetGraphView() {
    graphState.xMin = -10;
    graphState.xMax = 10;
    graphState.yMin = -10;
    graphState.yMax = 10;
    
    document.getElementById('xMin').value = -10;
    document.getElementById('xMax').value = 10;
    document.getElementById('yMin').value = -10;
    document.getElementById('yMax').value = 10;
    
    drawGraph();
}

function zoomGraph(factor) {
    const xRange = (graphState.xMax - graphState.xMin) * factor;
    const yRange = (graphState.yMax - graphState.yMin) * factor;
    const xCenter = (graphState.xMax + graphState.xMin) / 2;
    const yCenter = (graphState.yMax + graphState.yMin) / 2;
    
    graphState.xMin = xCenter - xRange / 2;
    graphState.xMax = xCenter + xRange / 2;
    graphState.yMin = yCenter - yRange / 2;
    graphState.yMax = yCenter + yRange / 2;
    
    document.getElementById('xMin').value = graphState.xMin.toFixed(1);
    document.getElementById('xMax').value = graphState.xMax.toFixed(1);
    document.getElementById('yMin').value = graphState.yMin.toFixed(1);
    document.getElementById('yMax').value = graphState.yMax.toFixed(1);
    
    drawGraph();
}

// ==================== PDF EXPORT ====================

function showExportButton(type) {
    const exportBtn = document.getElementById(`export${type.charAt(0).toUpperCase() + type.slice(1)}Pdf`);
    if (exportBtn) {
        exportBtn.style.display = 'block';
    }
}

function exportToPDF(type) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Title
    doc.setFontSize(20);
    doc.text('EquaSolver - Solution', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    
    let yPos = 50;
    
    // Get solution content based on type
    const solutionContainer = document.getElementById(`${type}Solution`);
    if (!solutionContainer || !solutionContainer.textContent.trim()) {
        alert('No solution to export. Please solve the equation first.');
        return;
    }
    
    // Extract equation and solution text
    const equationDisplay = document.querySelector(`#${type} .equation-preview`);
    const solutionText = solutionContainer.textContent;
    
    // Equation
    if (equationDisplay) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Equation:', 20, yPos);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(equationDisplay.textContent, 20, yPos);
        yPos += 15;
    }
    
    // Solution
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Solution:', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Split solution text into lines that fit
    const lines = doc.splitTextToSize(solutionText, 170);
    lines.forEach(line => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 7;
    });
    
    // Save PDF
    const fileName = `equasolver_${type}_${Date.now()}.pdf`;
    doc.save(fileName);
}

function exportGraphToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const canvas = document.getElementById('graphCanvas');
    
    if (!graphState.coefficients.a && graphState.coefficients.a !== 0) {
        alert('Please plot a graph first.');
        return;
    }
    
    // Set font
    doc.setFont('helvetica');
    
    // Title
    doc.setFontSize(20);
    doc.text('EquaSolver - Graph', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    
    let yPos = 45;
    
    // Equation type and coefficients
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Equation:', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const { equationType, coefficients, xMin, xMax, yMin, yMax } = graphState;
    const { a, b, c, d } = coefficients;
    
    let equationText = '';
    switch(equationType) {
        case 'linear':
            equationText = `y = ${a}x + ${b}`;
            break;
        case 'quadratic':
            equationText = `y = ${a}x² + ${b}x + ${c}`;
            break;
        case 'cubic':
            equationText = `y = ${a}x³ + ${b}x² + ${c}x + ${d}`;
            break;
    }
    
    doc.text(equationText, 20, yPos);
    yPos += 15;
    
    // Range information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Range:', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`X: [${xMin}, ${xMax}]`, 20, yPos);
    yPos += 7;
    doc.text(`Y: [${yMin}, ${yMax}]`, 20, yPos);
    yPos += 15;
    
    // Add canvas image
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 170;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    
    doc.addImage(imgData, 'PNG', 20, yPos, imgWidth, imgHeight);
    
    // Save PDF
    const fileName = `equasolver_graph_${Date.now()}.pdf`;
    doc.save(fileName);
}
