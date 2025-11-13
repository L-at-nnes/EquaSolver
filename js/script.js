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
    document.getElementById('solveSystems').addEventListener('click', solveSystemEquations);
    
    // Slider updates for equations
    setupSliderListeners();
    
    // History management
    document.getElementById('clearHistory').addEventListener('click', clearHistory);
    
    // Navigation cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.dataset.tool;
            tool === 'history' ? showHistoryScreen() : showCalculatorScreen(tool);
        });
    });
    
    // Back to home button
    document.getElementById('backBtn').addEventListener('click', showHomeScreen);
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// Setup slider listeners for real-time updates
function setupSliderListeners() {
    // Linear equation sliders
    const linearA = document.getElementById('linearA');
    const linearB = document.getElementById('linearB');
    linearA.addEventListener('input', () => {
        document.getElementById('linearAValue').textContent = linearA.value;
        updateLinearPreview();
    });
    linearB.addEventListener('input', () => {
        document.getElementById('linearBValue').textContent = linearB.value;
        updateLinearPreview();
    });
    updateLinearPreview();
    
    // Quadratic equation sliders
    const quadA = document.getElementById('quadA');
    const quadB = document.getElementById('quadB');
    const quadC = document.getElementById('quadC');
    quadA.addEventListener('input', () => {
        document.getElementById('quadAValue').textContent = quadA.value;
        updateQuadraticPreview();
    });
    quadB.addEventListener('input', () => {
        document.getElementById('quadBValue').textContent = quadB.value;
        updateQuadraticPreview();
    });
    quadC.addEventListener('input', () => {
        document.getElementById('quadCValue').textContent = quadC.value;
        updateQuadraticPreview();
    });
    updateQuadraticPreview();
    
    // Cubic equation sliders
    const cubicA = document.getElementById('cubicA');
    const cubicB = document.getElementById('cubicB');
    const cubicC = document.getElementById('cubicC');
    const cubicD = document.getElementById('cubicD');
    cubicA.addEventListener('input', () => {
        document.getElementById('cubicAValue').textContent = cubicA.value;
        updateCubicPreview();
    });
    cubicB.addEventListener('input', () => {
        document.getElementById('cubicBValue').textContent = cubicB.value;
        updateCubicPreview();
    });
    cubicC.addEventListener('input', () => {
        document.getElementById('cubicCValue').textContent = cubicC.value;
        updateCubicPreview();
    });
    cubicD.addEventListener('input', () => {
        document.getElementById('cubicDValue').textContent = cubicD.value;
        updateCubicPreview();
    });
    updateCubicPreview();
    
    // System equation sliders
    const sysA = document.getElementById('sysA');
    const sysB = document.getElementById('sysB');
    const sysE = document.getElementById('sysE');
    const sysC = document.getElementById('sysC');
    const sysD = document.getElementById('sysD');
    const sysF = document.getElementById('sysF');
    
    [sysA, sysB, sysE, sysC, sysD, sysF].forEach((slider, idx) => {
        const ids = ['sysA', 'sysB', 'sysE', 'sysC', 'sysD', 'sysF'];
        slider.addEventListener('input', () => {
            document.getElementById(ids[idx] + 'Value').textContent = slider.value;
            updateSystemsPreview();
        });
    });
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
    addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → ${solutions.map(s => s.toFixed(4)).join(', ')}`);
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
