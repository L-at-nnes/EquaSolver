// ===================================
// STATE MANAGEMENT
// ===================================
let currentTheme = 'matrix';
let currentLang = 'en';
let currentMode = 'dark';
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
    
    // Load saved settings or use defaults
    const savedSettings = JSON.parse(localStorage.getItem('equasolver_settings') || '{}');
    
    initParticles();
    initEventListeners();
    loadFlags();
    
    // Apply saved settings or defaults
    changeTheme(savedSettings.theme || 'matrix');
    changeLanguage(savedSettings.lang || 'en');
    changeMode(savedSettings.mode || 'dark');
    
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

window.addEventListener('resize', debounce(() => {
    if (typeof pJSDom !== 'undefined' && pJSDom[0]) {
        const config = getParticleConfig();
        pJSDom[0].pJS.particles.number.value = config.particles.number.value;
        pJSDom[0].pJS.particles.line_linked.enable = config.particles.line_linked.enable;
        pJSDom[0].pJS.interactivity.events.onhover.enable = config.interactivity.events.onhover.enable;
        pJSDom[0].pJS.fn.particlesRefresh();
    }
}, 250));

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
    
    // Mode selection
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => changeMode(btn.dataset.mode));
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
    document.querySelectorAll('#standard .btn').forEach(btn => {
        btn.addEventListener('click', handleCalculatorButton);
    });
    
    // Equation solver buttons
    document.getElementById('solveLinear').addEventListener('click', solveLinearEquation);
    document.getElementById('solveQuadratic').addEventListener('click', solveQuadraticEquation);
    document.getElementById('solveCubic').addEventListener('click', solveCubicEquation);
    document.getElementById('solveQuartic').addEventListener('click', solveQuarticEquation);
    document.getElementById('solveQuintic').addEventListener('click', solveQuinticEquation);
    document.getElementById('solveSystems').addEventListener('click', solveSystemEquations);
    document.getElementById('solveSystem3x3').addEventListener('click', solve3x3System);
    document.getElementById('calculateMatrix').addEventListener('click', calculateMatrix);
    
    // Inequality solver buttons
    document.getElementById('solveInequalityLinear').addEventListener('click', solveLinearInequalityUI);
    document.getElementById('solveInequalityQuadratic').addEventListener('click', solveQuadraticInequalityUI);
    
    // Inequality input listeners
    ['ineqLinearA', 'ineqLinearB', 'ineqLinearOp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateLinearInequalityPreview);
        if (el) el.addEventListener('change', updateLinearInequalityPreview);
    });
    ['ineqQuadA', 'ineqQuadB', 'ineqQuadC', 'ineqQuadOp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateQuadraticInequalityPreview);
        if (el) el.addEventListener('change', updateQuadraticInequalityPreview);
    });
    
    // PDF Export buttons
    document.getElementById('exportLinearPdf').addEventListener('click', () => exportToPDF('linear'));
    document.getElementById('exportQuadraticPdf').addEventListener('click', () => exportToPDF('quadratic'));
    document.getElementById('exportCubicPdf').addEventListener('click', () => exportToPDF('cubic'));
    document.getElementById('exportQuarticPdf').addEventListener('click', () => exportToPDF('quartic'));
    document.getElementById('exportQuinticPdf').addEventListener('click', () => exportToPDF('quintic'));
    document.getElementById('exportSystemsPdf').addEventListener('click', () => exportToPDF('systems'));
    document.getElementById('exportMatrixPdf').addEventListener('click', () => exportToPDF('matrix'));
    document.getElementById('exportInequalityLinearPdf').addEventListener('click', () => exportToPDF('inequalityLinear'));
    document.getElementById('exportInequalityQuadraticPdf').addEventListener('click', () => exportToPDF('inequalityQuadratic'));
    
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
    
    // Force all coef-input and range-input to be editable without restrictions
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.coef-input, .range-input, .graph-input').forEach(input => {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.setAttribute('autocomplete', 'off');
        });
    });
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

function changeMode(mode) {
    currentMode = mode;
    
    if (mode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
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
        lang: currentLang,
        mode: currentMode
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
    } else if (btn.classList.contains('scientific')) {
        handleScientificFunction(action);
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
// SCIENTIFIC CALCULATOR
// ===================================
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
        deleteSciLastDigit();
    } else if (action === 'ans') {
        handleAnswer();
    } else if (btn.classList.contains('scientific')) {
        handleScientificFunction(action);
    }
}

function handleSciValue(value) {
    if (sciState.waitingForOperand) {
        sciState.display = value;
        sciState.waitingForOperand = false;
    } else {
        sciState.display = sciState.display === '0' ? value : sciState.display + value;
    }
    updateSciDisplay();
}

function handleSciOperator(op) {
    const currentValue = parseFloat(sciState.display);
    
    if (sciState.operation && !sciState.waitingForOperand) {
        calculateScientific();
    } else {
        sciState.previousValue = currentValue;
    }
    
    sciState.operation = op;
    sciState.waitingForOperand = true;
}

function calculateScientific() {
    const prev = sciState.previousValue;
    const current = parseFloat(sciState.display);
    let result;
    
    switch (sciState.operation) {
        case '+': result = prev + current; break;
        case '−': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': 
            if (current === 0) {
                sciState.display = 'Error';
                updateSciDisplay();
                return;
            }
            result = prev / current; 
            break;
        case '^': result = Math.pow(prev, current); break;
        default: return;
    }
    
    const expression = `${prev} ${sciState.operation} ${current}`;
    
    sciState.display = String(result);
    sciState.operation = null;
    sciState.previousValue = null;
    sciState.waitingForOperand = true;
    sciState.lastAnswer = result;
    updateSciDisplay();
    
    addToSciHistory(`${expression} = ${result}`);
}

function handleScientificFunction(func) {
    const current = parseFloat(sciState.display);
    let result;
    let expression = '';
    
    try {
        switch (func) {
            case 'sin':
                result = Math.sin(current);
                expression = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(current);
                expression = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(current);
                expression = `tan(${current})`;
                break;
            case 'asin':
                if (current < -1 || current > 1) throw new Error('Domain error');
                result = Math.asin(current);
                expression = `asin(${current})`;
                break;
            case 'acos':
                if (current < -1 || current > 1) throw new Error('Domain error');
                result = Math.acos(current);
                expression = `acos(${current})`;
                break;
            case 'atan':
                result = Math.atan(current);
                expression = `atan(${current})`;
                break;
            case 'ln':
                if (current <= 0) throw new Error('Domain error');
                result = Math.log(current);
                expression = `ln(${current})`;
                break;
            case 'log':
                if (current <= 0) throw new Error('Domain error');
                result = Math.log10(current);
                expression = `log(${current})`;
                break;
            case 'exp':
                result = Math.exp(current);
                expression = `e^${current}`;
                break;
            case 'sqrt':
                if (current < 0) throw new Error('Domain error');
                result = Math.sqrt(current);
                expression = `√${current}`;
                break;
            case 'power':
                sciState.previousValue = current;
                sciState.operation = '^';
                sciState.waitingForOperand = true;
                return;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) throw new Error('Domain error');
                result = factorial(current);
                expression = `${current}!`;
                break;
            case 'pi':
                sciState.display = String(Math.PI);
                sciState.waitingForOperand = false;
                updateSciDisplay();
                return;
            case 'e':
                sciState.display = String(Math.E);
                sciState.waitingForOperand = false;
                updateSciDisplay();
                return;
            default:
                return;
        }
        
        sciState.display = String(result);
        sciState.waitingForOperand = true;
        sciState.lastAnswer = result;
        updateSciDisplay();
        addToSciHistory(`${expression} = ${result}`);
        
    } catch (error) {
        sciState.display = 'Error';
        updateSciDisplay();
    }
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    if (n > 170) throw new Error('Number too large');
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function handleAnswer() {
    sciState.display = String(sciState.lastAnswer);
    sciState.waitingForOperand = false;
    updateSciDisplay();
}

function clearScientific() {
    sciState.display = '0';
    sciState.operation = null;
    sciState.previousValue = null;
    sciState.waitingForOperand = false;
    updateSciDisplay();
}

function deleteSciLastDigit() {
    sciState.display = sciState.display.slice(0, -1) || '0';
    updateSciDisplay();
}

function updateSciDisplay() {
    document.getElementById('sciDisplay').value = sciState.display;
}

function addToSciHistory(entry) {
    const historyDiv = document.getElementById('sciHistory');
    const historyEntry = document.createElement('div');
    historyEntry.className = 'history-item';
    historyEntry.textContent = entry;
    
    historyDiv.insertBefore(historyEntry, historyDiv.firstChild);
    
    // Keep only last 5 entries
    while (historyDiv.children.length > 5) {
        historyDiv.removeChild(historyDiv.lastChild);
    }
}


// ===================================
// KEYBOARD SUPPORT
// ===================================
function handleKeyboard(e) {
    // Ne gérer les raccourcis clavier QUE si on n'est PAS dans un input
    // Permet de taper librement dans les champs de coefficients
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return; // Laisser l'utilisateur taper normalement
    }
    
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
        // Complex conjugate roots
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-delta) / (2 * a);
        const z1 = { re: realPart, im: imagPart };
        const z2 = { re: realPart, im: -imagPart };
        
        html += `<div class="solution">
            <p>${trans.twoComplexSolutions || 'Two complex conjugate solutions'}</p>
            <p>x₁ = ${formatComplex(z1)}</p>
            <p>x₂ = ${formatComplex(z2)}</p>
        </div>`;
        html += `<div class="steps">
            <h4>${trans.steps}:</h4>
            <p>Δ = b² - 4ac = ${delta.toFixed(4)} < 0</p>
            <p>${trans.complexRootsExplanation || 'When Δ < 0, roots are complex conjugates:'}</p>
            <p>x = (-b ± √Δ) / (2a)</p>
            <p>x = (${-b} ± √${delta}) / ${2 * a}</p>
            <p>x = ${realPart.toFixed(4)} ± ${imagPart.toFixed(4)}i</p>
        </div>`;
        addToHistory(`${a}x² + ${b}x + ${c} = 0 → x₁ = ${formatComplex(z1)}, x₂ = ${formatComplex(z2)}`);
    } else if (delta === 0) {
        const x = -b / (2 * a);
        html += `<div class="solution">
            <p>${trans.oneSolution}</p>
            <p>x = ${x.toFixed(4)}</p>
        </div>`;
        html += `<div class="steps">
            <h4>${trans.steps}:</h4>
            <p>Δ = b² - 4ac</p>
            <p>Δ = (${b})² - 4(${a})(${c})</p>
            <p>Δ = ${delta.toFixed(4)}</p>
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
        html += `<div class="steps">
            <h4>${trans.steps}:</h4>
            <p>Δ = b² - 4ac</p>
            <p>Δ = (${b})² - 4(${a})(${c})</p>
            <p>Δ = ${delta.toFixed(4)}</p>
        </div>`;
        addToHistory(`${a}x² + ${b}x + ${c} = 0 → x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`);
    }
    
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
    
    // Use the new complex-aware solver
    const roots = solveCubicComplex(a, b, c, d);
    const { realRoots, complexRoots } = separateRoots(roots);
    
    let html = `<h3>${trans.solution}</h3>`;
    
    if (realRoots.length === 3) {
        html += `<div class="solution">
            <p>${trans.threeSolutions}</p>
            <p>x₁ = ${realRoots[0].toFixed(4)}</p>
            <p>x₂ = ${realRoots[1].toFixed(4)}</p>
            <p>x₃ = ${realRoots[2].toFixed(4)}</p>
        </div>`;
        addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → ${realRoots.map(r => r.toFixed(4)).join(', ')}`);
    } else if (realRoots.length === 1 && complexRoots.length === 1) {
        const z = complexRoots[0];
        const zConj = complexConjugate(z);
        html += `<div class="solution">
            <p>${trans.oneRealTwoComplex || 'One real solution and two complex conjugates'}</p>
            <p>x₁ = ${realRoots[0].toFixed(4)} <span class="real-badge">${trans.realSolution || 'real'}</span></p>
            <p>x₂ = ${formatComplex(z)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>
            <p>x₃ = ${formatComplex(zConj)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>
        </div>`;
        addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → x₁ = ${realRoots[0].toFixed(4)}, x₂ = ${formatComplex(z)}, x₃ = ${formatComplex(zConj)}`);
    } else {
        // Edge case: might be a repeated root situation
        html += `<div class="solution">
            <p>${realRoots.length} ${trans.solutionsFound || 'solution(s) found'}:</p>`;
        realRoots.forEach((root, i) => {
            html += `<p>x${i + 1} = ${root.toFixed(4)}</p>`;
        });
        html += `</div>`;
        addToHistory(`${a}x³ + ${b}x² + ${c}x + ${d} = 0 → ${realRoots.map(r => r.toFixed(4)).join(', ')}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('cubic');
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
    
    // Use the new complex-aware solver
    const allRoots = findPolynomialRootsComplex([a, b, c, d, e]);
    const { realRoots, complexRoots } = separateRoots(allRoots);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<div class="solution">`;
    
    const totalRoots = realRoots.length + complexRoots.length * 2;
    html += `<p>${totalRoots} ${trans.solutionsFound || 'solution(s) found'}:</p>`;
    
    let rootIndex = 1;
    realRoots.forEach(root => {
        html += `<p>x${rootIndex++} = ${root.toFixed(4)} <span class="real-badge">${trans.realSolution || 'real'}</span></p>`;
    });
    
    complexRoots.forEach(z => {
        const zConj = complexConjugate(z);
        html += `<p>x${rootIndex++} = ${formatComplex(z)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
        html += `<p>x${rootIndex++} = ${formatComplex(zConj)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
    });
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    showExportButton('quartic');
    
    // Format history entry
    const historyRoots = [...realRoots.map(r => r.toFixed(4)), ...complexRoots.flatMap(z => [formatComplex(z), formatComplex(complexConjugate(z))])];
    addToHistory(`${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0 → ${historyRoots.join(', ')}`);
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
    
    // Use the new complex-aware solver
    const allRoots = findPolynomialRootsComplex([a, b, c, d, e, f]);
    const { realRoots, complexRoots } = separateRoots(allRoots);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<div class="solution">`;
    
    const totalRoots = realRoots.length + complexRoots.length * 2;
    html += `<p>${totalRoots} ${trans.solutionsFound || 'solution(s) found'}:</p>`;
    
    let rootIndex = 1;
    realRoots.forEach(root => {
        html += `<p>x${rootIndex++} = ${root.toFixed(4)} <span class="real-badge">${trans.realSolution || 'real'}</span></p>`;
    });
    
    complexRoots.forEach(z => {
        const zConj = complexConjugate(z);
        html += `<p>x${rootIndex++} = ${formatComplex(z)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
        html += `<p>x${rootIndex++} = ${formatComplex(zConj)} <span class="complex-badge">${trans.complexSolution || 'complex'}</span></p>`;
    });
    
    html += `</div>`;
    resultDiv.innerHTML = html;
    showExportButton('quintic');
    
    // Format history entry
    const historyRoots = [...realRoots.map(r => r.toFixed(4)), ...complexRoots.flatMap(z => [formatComplex(z), formatComplex(complexConjugate(z))])];
    addToHistory(`${a}x⁵ + ${b}x⁴ + ${c}x³ + ${d}x² + ${e}x + ${f} = 0 → ${historyRoots.join(', ')}`);
}

// ===================================
// INEQUALITY SOLVER
// ===================================

// Solve linear inequality: ax + b <|>|<=|>= 0
function solveLinearInequality(a, b, operator) {
    // Returns { type: 'interval'|'all'|'none', solution: string, interval: array }
    if (a === 0) {
        // Constant inequality: b <|>|<=|>= 0
        const holds = evaluateComparison(b, 0, operator);
        if (holds) {
            return { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'] };
        } else {
            return { type: 'none', solution: '∅ (no solution)', interval: [] };
        }
    }
    
    const x = -b / a;
    
    // When dividing by negative a, inequality flips
    let effectiveOp = operator;
    if (a < 0) {
        effectiveOp = flipOperator(operator);
    }
    
    switch (effectiveOp) {
        case '<':
            return { type: 'interval', solution: `x < ${x.toFixed(4)}`, interval: ['-∞', x], notation: `]-∞, ${x.toFixed(4)}[` };
        case '>':
            return { type: 'interval', solution: `x > ${x.toFixed(4)}`, interval: [x, '+∞'], notation: `]${x.toFixed(4)}, +∞[` };
        case '<=':
            return { type: 'interval', solution: `x ≤ ${x.toFixed(4)}`, interval: ['-∞', x], notation: `]-∞, ${x.toFixed(4)}]` };
        case '>=':
            return { type: 'interval', solution: `x ≥ ${x.toFixed(4)}`, interval: [x, '+∞'], notation: `[${x.toFixed(4)}, +∞[` };
        default:
            return { type: 'none', solution: 'Invalid operator', interval: [] };
    }
}

// Solve quadratic inequality: ax² + bx + c <|>|<=|>= 0
function solveQuadraticInequality(a, b, c, operator) {
    if (a === 0) {
        // Degenerate case: linear inequality
        return solveLinearInequality(b, c, operator);
    }
    
    const delta = b * b - 4 * a * c;
    const x_vertex = -b / (2 * a);
    
    // Parabola opens upward (a > 0) or downward (a < 0)
    const opensUp = a > 0;
    
    if (delta < 0) {
        // No real roots - parabola never crosses x-axis
        // If a > 0: parabola always positive
        // If a < 0: parabola always negative
        const alwaysPositive = opensUp;
        
        if (operator === '>' || operator === '>=') {
            return alwaysPositive 
                ? { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' }
                : { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' };
        } else { // < or <=
            return alwaysPositive
                ? { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' }
                : { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' };
        }
    }
    
    if (delta === 0) {
        // One root (double root)
        const x0 = -b / (2 * a);
        
        if (operator === '>' || operator === '<') {
            // Strictly greater or less (excludes the root)
            if (opensUp) {
                // Parabola touches axis at x0, otherwise positive
                return operator === '>'
                    ? { type: 'interval', solution: `x ≠ ${x0.toFixed(4)}`, interval: [['-∞', x0], [x0, '+∞']], notation: `]-∞, ${x0.toFixed(4)}[ ∪ ]${x0.toFixed(4)}, +∞[` }
                    : { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' };
            } else {
                // Parabola touches axis at x0, otherwise negative
                return operator === '<'
                    ? { type: 'interval', solution: `x ≠ ${x0.toFixed(4)}`, interval: [['-∞', x0], [x0, '+∞']], notation: `]-∞, ${x0.toFixed(4)}[ ∪ ]${x0.toFixed(4)}, +∞[` }
                    : { type: 'none', solution: '∅ (no solution)', interval: [], notation: '∅' };
            }
        } else { // >= or <=
            if (opensUp) {
                return operator === '>='
                    ? { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' }
                    : { type: 'point', solution: `x = ${x0.toFixed(4)}`, interval: [x0], notation: `{${x0.toFixed(4)}}` };
            } else {
                return operator === '<='
                    ? { type: 'all', solution: 'ℝ (all real numbers)', interval: ['-∞', '+∞'], notation: ']-∞, +∞[' }
                    : { type: 'point', solution: `x = ${x0.toFixed(4)}`, interval: [x0], notation: `{${x0.toFixed(4)}}` };
            }
        }
    }
    
    // Two distinct roots
    const sqrtDelta = Math.sqrt(delta);
    let x1 = (-b - sqrtDelta) / (2 * a);
    let x2 = (-b + sqrtDelta) / (2 * a);
    
    // Ensure x1 < x2
    if (x1 > x2) [x1, x2] = [x2, x1];
    
    // For parabola opening upward: negative between roots, positive outside
    // For parabola opening downward: positive between roots, negative outside
    
    if (opensUp) {
        switch (operator) {
            case '>':
                return { type: 'union', solution: `x < ${x1.toFixed(4)} or x > ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}[ ∪ ]${x2.toFixed(4)}, +∞[` };
            case '>=':
                return { type: 'union', solution: `x ≤ ${x1.toFixed(4)} or x ≥ ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}] ∪ [${x2.toFixed(4)}, +∞[` };
            case '<':
                return { type: 'interval', solution: `${x1.toFixed(4)} < x < ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `]${x1.toFixed(4)}, ${x2.toFixed(4)}[` };
            case '<=':
                return { type: 'interval', solution: `${x1.toFixed(4)} ≤ x ≤ ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `[${x1.toFixed(4)}, ${x2.toFixed(4)}]` };
        }
    } else {
        switch (operator) {
            case '<':
                return { type: 'union', solution: `x < ${x1.toFixed(4)} or x > ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}[ ∪ ]${x2.toFixed(4)}, +∞[` };
            case '<=':
                return { type: 'union', solution: `x ≤ ${x1.toFixed(4)} or x ≥ ${x2.toFixed(4)}`, 
                    interval: [['-∞', x1], [x2, '+∞']], notation: `]-∞, ${x1.toFixed(4)}] ∪ [${x2.toFixed(4)}, +∞[` };
            case '>':
                return { type: 'interval', solution: `${x1.toFixed(4)} < x < ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `]${x1.toFixed(4)}, ${x2.toFixed(4)}[` };
            case '>=':
                return { type: 'interval', solution: `${x1.toFixed(4)} ≤ x ≤ ${x2.toFixed(4)}`, 
                    interval: [x1, x2], notation: `[${x1.toFixed(4)}, ${x2.toFixed(4)}]` };
        }
    }
    
    return { type: 'none', solution: 'Error', interval: [] };
}

// Helper: flip inequality operator when dividing by negative number
function flipOperator(op) {
    switch (op) {
        case '<': return '>';
        case '>': return '<';
        case '<=': return '>=';
        case '>=': return '<=';
        default: return op;
    }
}

// Helper: evaluate a comparison
function evaluateComparison(a, b, operator) {
    switch (operator) {
        case '<': return a < b;
        case '>': return a > b;
        case '<=': return a <= b;
        case '>=': return a >= b;
        default: return false;
    }
}

// Format operator for display
function formatOperator(op) {
    switch (op) {
        case '<': return '<';
        case '>': return '>';
        case '<=': return '≤';
        case '>=': return '≥';
        default: return op;
    }
}

// UI function for linear inequality
function solveLinearInequalityUI() {
    const a = parseFloat(document.getElementById('ineqLinearA').value);
    const b = parseFloat(document.getElementById('ineqLinearB').value);
    const operator = document.getElementById('ineqLinearOp').value;
    const resultDiv = document.getElementById('inequalityLinearSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const result = solveLinearInequality(a, b, operator);
    const opDisplay = formatOperator(operator);
    
    let html = `<h3>${trans.solution || 'Solution'}</h3>`;
    html += `<div class="equation-preview">${a}x + ${b} ${opDisplay} 0</div>`;
    
    html += `<div class="solution">`;
    html += `<p><strong>${trans.solutionSet || 'Solution set'}:</strong></p>`;
    html += `<p class="inequality-result">${result.solution}</p>`;
    if (result.notation) {
        html += `<p><strong>${trans.intervalNotation || 'Interval notation'}:</strong> ${result.notation}</p>`;
    }
    html += `</div>`;
    
    // Steps
    html += `<div class="steps">`;
    html += `<h4>${trans.steps || 'Solution Steps'}:</h4>`;
    html += `<p>${a}x + ${b} ${opDisplay} 0</p>`;
    html += `<p>${a}x ${opDisplay} ${-b}</p>`;
    if (a !== 0) {
        if (a < 0) {
            html += `<p><em>${trans.divideNegative || 'Dividing by negative number, inequality flips'}:</em></p>`;
        }
        html += `<p>x ${formatOperator(a < 0 ? flipOperator(operator) : operator)} ${(-b / a).toFixed(4)}</p>`;
    }
    html += `</div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${a}x + ${b} ${opDisplay} 0 → ${result.solution}`);
    showExportButton('inequalityLinear');
}

// UI function for quadratic inequality
function solveQuadraticInequalityUI() {
    const a = parseFloat(document.getElementById('ineqQuadA').value);
    const b = parseFloat(document.getElementById('ineqQuadB').value);
    const c = parseFloat(document.getElementById('ineqQuadC').value);
    const operator = document.getElementById('ineqQuadOp').value;
    const resultDiv = document.getElementById('inequalityQuadraticSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.notQuadratic || 'Coefficient a cannot be zero for quadratic inequality'}</p>`;
        return;
    }
    
    const result = solveQuadraticInequality(a, b, c, operator);
    const opDisplay = formatOperator(operator);
    const delta = b * b - 4 * a * c;
    
    let html = `<h3>${trans.solution || 'Solution'}</h3>`;
    html += `<div class="equation-preview">${a}x² + ${b}x + ${c} ${opDisplay} 0</div>`;
    
    // Discriminant info
    html += `<p><strong>${trans.discriminant || 'Discriminant'} (Δ):</strong> ${delta.toFixed(4)}</p>`;
    
    html += `<div class="solution">`;
    html += `<p><strong>${trans.solutionSet || 'Solution set'}:</strong></p>`;
    html += `<p class="inequality-result">${result.solution}</p>`;
    if (result.notation) {
        html += `<p><strong>${trans.intervalNotation || 'Interval notation'}:</strong> ${result.notation}</p>`;
    }
    html += `</div>`;
    
    // Steps
    html += `<div class="steps">`;
    html += `<h4>${trans.steps || 'Solution Steps'}:</h4>`;
    html += `<p>1. ${trans.findRoots || 'Find roots of'} ${a}x² + ${b}x + ${c} = 0</p>`;
    html += `<p>2. Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${delta.toFixed(4)}</p>`;
    
    if (delta < 0) {
        html += `<p>3. Δ < 0: ${trans.noRealRoots || 'no real roots'}</p>`;
        html += `<p>4. ${a > 0 ? trans.parabUpAlwaysPos || 'Parabola opens upward, always positive' : trans.parabDownAlwaysNeg || 'Parabola opens downward, always negative'}</p>`;
    } else if (delta === 0) {
        const x0 = -b / (2 * a);
        html += `<p>3. Δ = 0: ${trans.oneRoot || 'one root'} x = ${x0.toFixed(4)}</p>`;
        html += `<p>4. ${trans.parabolaTouches || 'Parabola touches x-axis at'} x = ${x0.toFixed(4)}</p>`;
    } else {
        const sqrtDelta = Math.sqrt(delta);
        let x1 = (-b - sqrtDelta) / (2 * a);
        let x2 = (-b + sqrtDelta) / (2 * a);
        if (x1 > x2) [x1, x2] = [x2, x1];
        html += `<p>3. Δ > 0: ${trans.twoRoots || 'two roots'} x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}</p>`;
        html += `<p>4. ${a > 0 ? trans.parabUpSign || 'Parabola opens upward: negative between roots' : trans.parabDownSign || 'Parabola opens downward: positive between roots'}</p>`;
    }
    html += `</div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${a}x² + ${b}x + ${c} ${opDisplay} 0 → ${result.solution}`);
    showExportButton('inequalityQuadratic');
}

// Update inequality preview functions
function updateLinearInequalityPreview() {
    const a = parseFloat(document.getElementById('ineqLinearA').value) || 0;
    const b = parseFloat(document.getElementById('ineqLinearB').value) || 0;
    const op = document.getElementById('ineqLinearOp').value;
    const preview = document.getElementById('ineqLinearPreview');
    if (preview) {
        preview.textContent = `${a}x + ${b} ${formatOperator(op)} 0`;
    }
}

function updateQuadraticInequalityPreview() {
    const a = parseFloat(document.getElementById('ineqQuadA').value) || 0;
    const b = parseFloat(document.getElementById('ineqQuadB').value) || 0;
    const c = parseFloat(document.getElementById('ineqQuadC').value) || 0;
    const op = document.getElementById('ineqQuadOp').value;
    const preview = document.getElementById('ineqQuadPreview');
    if (preview) {
        preview.textContent = `${a}x² + ${b}x + ${c} ${formatOperator(op)} 0`;
    }
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

// Complex square root
function complexSqrt(z) {
    const r = Math.sqrt(z.re * z.re + z.im * z.im);
    const theta = Math.atan2(z.im, z.re);
    return {
        re: Math.sqrt(r) * Math.cos(theta / 2),
        im: Math.sqrt(r) * Math.sin(theta / 2)
    };
}

// Complex absolute value (modulus)
function complexAbs(z) {
    return Math.sqrt(z.re * z.re + z.im * z.im);
}

// Complex conjugate
function complexConjugate(z) {
    return { re: z.re, im: -z.im };
}

// Check if complex number is essentially real
function isEssentiallyReal(z, tolerance = 1e-10) {
    return Math.abs(z.im) < tolerance;
}

// Check if complex number is essentially zero
function isEssentiallyZero(z, tolerance = 1e-10) {
    return Math.abs(z.re) < tolerance && Math.abs(z.im) < tolerance;
}

// Format complex number for display
function formatComplex(z, decimals = 4) {
    const re = z.re;
    const im = z.im;
    const tolerance = Math.pow(10, -decimals);
    
    // Handle essentially zero
    if (Math.abs(re) < tolerance && Math.abs(im) < tolerance) {
        return '0';
    }
    
    // Handle essentially real
    if (Math.abs(im) < tolerance) {
        return re.toFixed(decimals);
    }
    
    // Handle pure imaginary
    if (Math.abs(re) < tolerance) {
        if (Math.abs(im - 1) < tolerance) return 'i';
        if (Math.abs(im + 1) < tolerance) return '-i';
        return `${im.toFixed(decimals)}i`;
    }
    
    // Full complex number
    const sign = im >= 0 ? '+' : '-';
    const absIm = Math.abs(im);
    if (Math.abs(absIm - 1) < tolerance) {
        return `${re.toFixed(decimals)} ${sign} i`;
    }
    return `${re.toFixed(decimals)} ${sign} ${absIm.toFixed(decimals)}i`;
}

// Create complex from real number
function complexFromReal(x) {
    return { re: x, im: 0 };
}

// Solve quadratic equation and return complex roots
function solveQuadraticComplex(a, b, c) {
    if (a === 0) {
        if (b === 0) {
            return c === 0 ? [{ re: 0, im: 0 }] : [];
        }
        return [complexFromReal(-c / b)];
    }
    
    const delta = b * b - 4 * a * c;
    
    if (delta >= 0) {
        // Two real roots
        const sqrtDelta = Math.sqrt(delta);
        return [
            complexFromReal((-b + sqrtDelta) / (2 * a)),
            complexFromReal((-b - sqrtDelta) / (2 * a))
        ];
    } else {
        // Two complex conjugate roots
        const realPart = -b / (2 * a);
        const imagPart = Math.sqrt(-delta) / (2 * a);
        return [
            { re: realPart, im: imagPart },
            { re: realPart, im: -imagPart }
        ];
    }
}

// Solve cubic equation and return all roots (real and complex)
function solveCubicComplex(a, b, c, d) {
    if (a === 0) {
        return solveQuadraticComplex(b, c, d);
    }
    
    // Normalize: x³ + px² + qx + r = 0
    const p = b / a;
    const q = c / a;
    const r = d / a;
    
    // Depress the cubic: t³ + pt + q = 0 where x = t - p/3
    const p1 = q - p * p / 3;
    const q1 = r - p * q / 3 + 2 * p * p * p / 27;
    
    // Cardano's discriminant
    const discriminant = q1 * q1 / 4 + p1 * p1 * p1 / 27;
    
    const shift = -p / 3;
    let roots = [];
    
    if (Math.abs(discriminant) < 1e-10) {
        // Three real roots, at least two equal
        if (Math.abs(q1) < 1e-10) {
            roots = [complexFromReal(shift)];
            // Triple root
        } else {
            const u = Math.cbrt(-q1 / 2);
            roots = [
                complexFromReal(2 * u + shift),
                complexFromReal(-u + shift)
            ];
        }
    } else if (discriminant > 0) {
        // One real root, two complex conjugates
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
        // Three distinct real roots (casus irreducibilis)
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

// Find all polynomial roots (including complex) using Durand-Kerner
function findPolynomialRootsComplex(coeffs) {
    const degree = coeffs.length - 1;
    if (degree < 1) return [];
    
    // Use specific formulas for low-degree polynomials
    if (degree === 1) {
        return [complexFromReal(-coeffs[1] / coeffs[0])];
    }
    if (degree === 2) {
        return solveQuadraticComplex(coeffs[0], coeffs[1], coeffs[2]);
    }
    if (degree === 3) {
        return solveCubicComplex(coeffs[0], coeffs[1], coeffs[2], coeffs[3]);
    }
    
    // Normalize coefficients
    const normalized = coeffs.map(c => c / coeffs[0]);
    
    // Initial guesses (unit circle with slight offset to avoid symmetry issues)
    const roots = [];
    for (let i = 0; i < degree; i++) {
        const angle = (2 * Math.PI * i) / degree + 0.1;
        const r = 1 + 0.1 * i / degree;
        roots.push({ re: r * Math.cos(angle), im: r * Math.sin(angle) });
    }
    
    // Durand-Kerner iterations
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
    
    // Clean up roots (pair complex conjugates, round small values)
    return roots.map(z => ({
        re: Math.abs(z.re) < 1e-10 ? 0 : z.re,
        im: Math.abs(z.im) < 1e-10 ? 0 : z.im
    }));
}

// Separate real and complex roots
function separateRoots(roots, tolerance = 1e-6) {
    const realRoots = [];
    const complexRoots = [];
    
    for (const root of roots) {
        if (Math.abs(root.im) < tolerance) {
            realRoots.push(root.re);
        } else if (root.im > 0) {
            // Only add complex roots with positive imaginary part (conjugate pairs)
            complexRoots.push(root);
        }
    }
    
    return { realRoots: realRoots.sort((a, b) => a - b), complexRoots };
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

// SYSTEM OF 3 EQUATIONS SOLVER (Cramer's Rule for 3x3)
// ===================================
function solve3x3System() {
    // Get coefficients for the 3x3 system:
    // a1*x + b1*y + c1*z = d1
    // a2*x + b2*y + c2*z = d2
    // a3*x + b3*y + c3*z = d3
    const a1 = parseFloat(document.getElementById('sys3A1').value);
    const b1 = parseFloat(document.getElementById('sys3B1').value);
    const c1 = parseFloat(document.getElementById('sys3C1').value);
    const d1 = parseFloat(document.getElementById('sys3D1').value);
    
    const a2 = parseFloat(document.getElementById('sys3A2').value);
    const b2 = parseFloat(document.getElementById('sys3B2').value);
    const c2 = parseFloat(document.getElementById('sys3C2').value);
    const d2 = parseFloat(document.getElementById('sys3D2').value);
    
    const a3 = parseFloat(document.getElementById('sys3A3').value);
    const b3 = parseFloat(document.getElementById('sys3B3').value);
    const c3 = parseFloat(document.getElementById('sys3C3').value);
    const d3 = parseFloat(document.getElementById('sys3D3').value);
    
    const resultDiv = document.getElementById('system3x3Solution');
    const trans = translations[currentLang];
    
    if (isNaN(a1) || isNaN(b1) || isNaN(c1) || isNaN(d1) ||
        isNaN(a2) || isNaN(b2) || isNaN(c2) || isNaN(d2) ||
        isNaN(a3) || isNaN(b3) || isNaN(c3) || isNaN(d3)) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    // Calculate main determinant using cofactor expansion
    const det = a1 * (b2 * c3 - b3 * c2) - 
                b1 * (a2 * c3 - a3 * c2) + 
                c1 * (a2 * b3 - a3 * b2);
    
    let html = `<h3>${trans.solution}</h3>`;
    html += `<p><strong>${trans.determinant}:</strong> ${det.toFixed(6)}</p>`;
    
    if (Math.abs(det) < 1e-10) {
        html += `<p class="solution">${trans.system3x3NoUniqueSolution || 'No unique solution (system is singular or dependent)'}</p>`;
    } else {
        // Calculate determinants for each variable using Cramer's rule
        const detX = d1 * (b2 * c3 - b3 * c2) - 
                     b1 * (d2 * c3 - d3 * c2) + 
                     c1 * (d2 * b3 - d3 * b2);
        
        const detY = a1 * (d2 * c3 - d3 * c2) - 
                     d1 * (a2 * c3 - a3 * c2) + 
                     c1 * (a2 * d3 - a3 * d2);
        
        const detZ = a1 * (b2 * d3 - b3 * d2) - 
                     b1 * (a2 * d3 - a3 * d2) + 
                     d1 * (a2 * b3 - a3 * b2);
        
        const x = detX / det;
        const y = detY / det;
        const z = detZ / det;
        
        html += `<div class="solution">
            <p>${trans.uniqueSolution}</p>
            <p>x = ${x.toFixed(6)}</p>
            <p>y = ${y.toFixed(6)}</p>
            <p>z = ${z.toFixed(6)}</p>
        </div>`;
        
        html += `<div class="steps">
            <h4>${trans.steps}:</h4>
            <p>${a1}x + ${b1}y + ${c1}z = ${d1}</p>
            <p>${a2}x + ${b2}y + ${c2}z = ${d2}</p>
            <p>${a3}x + ${b3}y + ${c3}z = ${d3}</p>
            <p>Det = ${det.toFixed(6)}</p>
            <p>Det<sub>x</sub> = ${detX.toFixed(6)}</p>
            <p>Det<sub>y</sub> = ${detY.toFixed(6)}</p>
            <p>Det<sub>z</sub> = ${detZ.toFixed(6)}</p>
        </div>`;
        
        addToHistory(`System 3x3 → x = ${x.toFixed(4)}, y = ${y.toFixed(4)}, z = ${z.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('system3x3');
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
        const input = document.getElementById(id);
        input.addEventListener('change', updateGraphRange);
        // Permettre toute modification
        input.addEventListener('keydown', (e) => {
            // Ne rien bloquer
            return true;
        });
        input.addEventListener('input', (e) => {
            // Ne rien bloquer
            return true;
        });
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
                    <input type="text" inputmode="decimal" id="graphA" value="1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="text" inputmode="decimal" id="graphB" value="0" class="graph-input">
                </div>
            `;
            break;
        case 'quadratic':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="text" inputmode="decimal" id="graphA" value="1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="text" inputmode="decimal" id="graphB" value="0" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>c:</label>
                    <input type="text" inputmode="decimal" id="graphC" value="0" class="graph-input">
                </div>
            `;
            break;
        case 'cubic':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="text" inputmode="decimal" id="graphA" value="1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="text" inputmode="decimal" id="graphB" value="0" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>c:</label>
                    <input type="text" inputmode="decimal" id="graphC" value="0" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>d:</label>
                    <input type="text" inputmode="decimal" id="graphD" value="0" class="graph-input">
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

// ===================================
// CUSTOM THEME BUILDER
// ===================================
let customThemeColors = {
    primary: '#ff0080',
    secondary: '#00ffff',
    accent: '#ffff00',
    bgPrimary: '#0a0a0f',
    bgSecondary: '#1a1a2e'
};

function setupCustomThemeBuilder() {
    const customThemeBtn = document.querySelector('[data-theme="custom"]');
    const themeBuilder = document.getElementById('customThemeBuilder');
    const applyBtn = document.getElementById('applyCustomTheme');
    const saveBtn = document.getElementById('saveCustomTheme');
    
    if (customThemeBtn) {
        customThemeBtn.addEventListener('click', () => {
            themeBuilder.style.display = themeBuilder.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Load saved custom theme
    const savedCustomTheme = localStorage.getItem('equasolver_custom_theme');
    if (savedCustomTheme) {
        customThemeColors = JSON.parse(savedCustomTheme);
        updateColorPickerValues();
    }
    
    // Color picker listeners
    ['customPrimary', 'customSecondary', 'customAccent', 'customBgPrimary', 'customBgSecondary'].forEach(id => {
        const picker = document.getElementById(id);
        if (picker) {
            picker.addEventListener('input', () => {
                updateCustomThemePreview();
            });
        }
    });
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCustomTheme);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCustomTheme);
    }
}

function updateColorPickerValues() {
    document.getElementById('customPrimary').value = customThemeColors.primary;
    document.getElementById('customSecondary').value = customThemeColors.secondary;
    document.getElementById('customAccent').value = customThemeColors.accent;
    document.getElementById('customBgPrimary').value = customThemeColors.bgPrimary;
    document.getElementById('customBgSecondary').value = customThemeColors.bgSecondary;
}

function updateCustomThemePreview() {
    const preview = document.querySelector('.custom-preview');
    if (preview) {
        const primary = document.getElementById('customPrimary').value;
        const secondary = document.getElementById('customSecondary').value;
        preview.style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
    }
}

function applyCustomTheme() {
    customThemeColors = {
        primary: document.getElementById('customPrimary').value,
        secondary: document.getElementById('customSecondary').value,
        accent: document.getElementById('customAccent').value,
        bgPrimary: document.getElementById('customBgPrimary').value,
        bgSecondary: document.getElementById('customBgSecondary').value
    };
    
    document.documentElement.style.setProperty('--custom-primary', customThemeColors.primary);
    document.documentElement.style.setProperty('--custom-secondary', customThemeColors.secondary);
    document.documentElement.style.setProperty('--custom-accent', customThemeColors.accent);
    document.documentElement.style.setProperty('--custom-bg-primary', customThemeColors.bgPrimary);
    document.documentElement.style.setProperty('--custom-bg-secondary', customThemeColors.bgSecondary);
    
    // Calculate shadow color from primary
    const r = parseInt(customThemeColors.primary.slice(1, 3), 16);
    const g = parseInt(customThemeColors.primary.slice(3, 5), 16);
    const b = parseInt(customThemeColors.primary.slice(5, 7), 16);
    document.documentElement.style.setProperty('--custom-shadow', `rgba(${r}, ${g}, ${b}, 0.5)`);
    
    changeTheme('custom');
}

function saveCustomTheme() {
    applyCustomTheme();
    localStorage.setItem('equasolver_custom_theme', JSON.stringify(customThemeColors));
}

// ===================================
// LATEX EQUATION PARSER
// ===================================
function setupLatexInput() {
    const latexInput = document.getElementById('latexInput');
    const solveBtn = document.getElementById('solveLatex');
    
    if (latexInput) {
        latexInput.addEventListener('input', updateLatexPreview);
        updateLatexPreview();
    }
    
    if (solveBtn) {
        solveBtn.addEventListener('click', solveLatexEquation);
    }
    
    // Shortcut buttons
    document.querySelectorAll('.shortcut-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const insert = btn.dataset.insert;
            insertLatexSymbol(insert);
        });
    });
    
    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            latexInput.value = btn.dataset.example;
            updateLatexPreview();
        });
    });
}

function insertLatexSymbol(symbol) {
    const input = document.getElementById('latexInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    input.value = text.substring(0, start) + symbol + text.substring(end);
    input.focus();
    
    // Position cursor inside brackets if applicable
    if (symbol.includes('{}')) {
        input.selectionStart = input.selectionEnd = start + symbol.indexOf('{') + 1;
    } else {
        input.selectionStart = input.selectionEnd = start + symbol.length;
    }
    
    updateLatexPreview();
}

function updateLatexPreview() {
    const input = document.getElementById('latexInput');
    const preview = document.getElementById('latexRendered');
    
    if (!input || !preview) return;
    
    // Convert LaTeX to readable format
    let latex = input.value;
    let display = latex
        .replace(/\^(\d)/g, '<sup>$1</sup>')
        .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
        .replace(/_(\d)/g, '<sub>$1</sub>')
        .replace(/_{([^}]+)}/g, '<sub>$1</sub>')
        .replace(/\\sqrt{([^}]+)}/g, 'sqrt($1)')
        .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)')
        .replace(/\\pm/g, ' + or - ')
        .replace(/\\pi/g, 'pi')
        .replace(/\\theta/g, 'theta')
        .replace(/\\infty/g, 'infinity');
    
    preview.innerHTML = display;
}

function parseLatexEquation(latex) {
    // Parse LaTeX equation into coefficients
    // Supports: ax^n + bx^(n-1) + ... + c = 0
    
    let equation = latex
        .replace(/\s+/g, '')
        .replace(/\\cdot/g, '*')
        .replace(/\\times/g, '*')
        .replace(/\^{(\d+)}/g, '^$1');
    
    // Split by = 0
    const parts = equation.split('=');
    if (parts.length !== 2) {
        throw new Error('Equation must contain = sign');
    }
    
    equation = parts[0];
    
    // Find the degree
    let maxDegree = 0;
    const degreeMatches = equation.match(/x\^(\d+)/g);
    if (degreeMatches) {
        degreeMatches.forEach(match => {
            const deg = parseInt(match.replace('x^', ''));
            if (deg > maxDegree) maxDegree = deg;
        });
    }
    
    // Check for x without power (degree 1)
    if (/[+-]?\d*x(?!\^)/.test(equation) && maxDegree < 1) {
        maxDegree = 1;
    }
    
    if (maxDegree === 0) {
        // Check if there's an x term
        if (equation.includes('x')) {
            maxDegree = 1;
        }
    }
    
    // Extract coefficients
    const coefficients = new Array(maxDegree + 1).fill(0);
    
    // Add + at the beginning if equation doesn't start with - or +
    if (!equation.startsWith('-') && !equation.startsWith('+')) {
        equation = '+' + equation;
    }
    
    // Match terms like +3x^2, -5x, +7
    const termRegex = /([+-]?\d*\.?\d*)x\^(\d+)|([+-]?\d*\.?\d*)x(?!\^)|([+-]\d+\.?\d*)/g;
    let match;
    
    while ((match = termRegex.exec(equation)) !== null) {
        if (match[1] !== undefined && match[2] !== undefined) {
            // Term like 3x^2
            const coef = match[1] === '' || match[1] === '+' ? 1 : (match[1] === '-' ? -1 : parseFloat(match[1]));
            const power = parseInt(match[2]);
            coefficients[maxDegree - power] = coef;
        } else if (match[3] !== undefined) {
            // Term like 3x
            const coef = match[3] === '' || match[3] === '+' ? 1 : (match[3] === '-' ? -1 : parseFloat(match[3]));
            coefficients[maxDegree - 1] = coef;
        } else if (match[4] !== undefined) {
            // Constant term
            coefficients[maxDegree] = parseFloat(match[4]);
        }
    }
    
    return { degree: maxDegree, coefficients };
}

function solveLatexEquation() {
    const latex = document.getElementById('latexInput').value;
    const resultDiv = document.getElementById('latexSolution');
    const trans = translations[currentLang];
    
    try {
        const parsed = parseLatexEquation(latex);
        const { degree, coefficients } = parsed;
        
        let html = `<h3>${trans.solution}</h3>`;
        html += `<p>Detected: Degree ${degree} polynomial</p>`;
        html += `<p>Coefficients: [${coefficients.join(', ')}]</p>`;
        
        let solutions = [];
        
        switch (degree) {
            case 1:
                // Linear: ax + b = 0
                const a1 = coefficients[0];
                const b1 = coefficients[1];
                if (a1 !== 0) {
                    solutions = [-b1 / a1];
                }
                break;
            case 2:
                // Quadratic
                const a2 = coefficients[0];
                const b2 = coefficients[1];
                const c2 = coefficients[2];
                const delta = b2 * b2 - 4 * a2 * c2;
                if (delta >= 0) {
                    solutions = [
                        (-b2 + Math.sqrt(delta)) / (2 * a2),
                        (-b2 - Math.sqrt(delta)) / (2 * a2)
                    ];
                    if (delta === 0) solutions = [solutions[0]];
                }
                break;
            default:
                // Higher degree - use numerical method
                solutions = findPolynomialRoots(coefficients);
        }
        
        if (solutions.length === 0) {
            html += `<div class="solution"><p>${trans.noRealSolutions}</p></div>`;
        } else {
            html += `<div class="solution animated-steps">`;
            solutions.forEach((sol, i) => {
                html += `<div class="step-item" style="animation-delay: ${i * 0.2}s;">
                    <span class="step-number">${i + 1}</span>
                    <span class="step-content">x = ${sol.toFixed(6)}</span>
                </div>`;
            });
            html += `</div>`;
        }
        
        resultDiv.innerHTML = html;
        showExportButton('latex');
        addToHistory(`LaTeX: ${latex} -> ${solutions.map(s => s.toFixed(4)).join(', ')}`);
        
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// ===================================
// PARAMETRIC EQUATIONS
// ===================================
function setupParametricGraph() {
    const plotBtn = document.getElementById('plotParametric');
    const xInput = document.getElementById('parametricX');
    const yInput = document.getElementById('parametricY');
    
    if (plotBtn) {
        plotBtn.addEventListener('click', plotParametricGraph);
    }
    
    if (xInput) {
        xInput.addEventListener('input', updateParametricPreview);
    }
    if (yInput) {
        yInput.addEventListener('input', updateParametricPreview);
    }
}

function updateParametricPreview() {
    const xExpr = document.getElementById('parametricX').value;
    const yExpr = document.getElementById('parametricY').value;
    const preview = document.getElementById('parametricPreview');
    
    if (preview) {
        preview.innerHTML = `<div>x(t) = ${xExpr}</div><div>y(t) = ${yExpr}</div>`;
    }
}

function evaluateExpression(expr, varName, value) {
    // Safe math expression evaluator
    let processed = expr
        .replace(new RegExp(varName, 'g'), `(${value})`)
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/log/g, 'Math.log')
        .replace(/pi/g, 'Math.PI')
        .replace(/pow/g, 'Math.pow');
    
    try {
        return eval(processed);
    } catch (e) {
        return NaN;
    }
}

function plotParametricGraph() {
    const canvas = document.getElementById('parametricCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const xExpr = document.getElementById('parametricX').value;
    const yExpr = document.getElementById('parametricY').value;
    const tMin = parseFloat(document.getElementById('tMin').value);
    const tMax = parseFloat(document.getElementById('tMax').value);
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate points
    const points = [];
    const steps = 1000;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (let i = 0; i <= steps; i++) {
        const t = tMin + (tMax - tMin) * i / steps;
        const x = evaluateExpression(xExpr, 't', t);
        const y = evaluateExpression(yExpr, 't', t);
        
        if (!isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
            points.push({ x, y });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
    
    // Add margin
    const margin = 0.1;
    const rangeX = (maxX - minX) * (1 + margin);
    const rangeY = (maxY - minY) * (1 + margin);
    minX -= rangeX * margin / 2;
    maxX += rangeX * margin / 2;
    minY -= rangeY * margin / 2;
    maxY += rangeY * margin / 2;
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
        const px = (i / 20) * width;
        const py = (i / 20) * height;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    
    if (minX <= 0 && maxX >= 0) {
        const x0 = ((0 - minX) / (maxX - minX)) * width;
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, height);
        ctx.stroke();
    }
    
    if (minY <= 0 && maxY >= 0) {
        const y0 = height - ((0 - minY) / (maxY - minY)) * height;
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(width, y0);
        ctx.stroke();
    }
    
    // Draw curve
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    points.forEach(point => {
        const px = ((point.x - minX) / (maxX - minX)) * width;
        const py = height - ((point.y - minY) / (maxY - minY)) * height;
        
        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
        } else {
            ctx.lineTo(px, py);
        }
    });
    
    ctx.stroke();
    showExportButton('parametric');
}

// ===================================
// POLAR EQUATIONS
// ===================================
function setupPolarGraph() {
    const plotBtn = document.getElementById('plotPolar');
    const rInput = document.getElementById('polarR');
    
    if (plotBtn) {
        plotBtn.addEventListener('click', plotPolarGraph);
    }
    
    if (rInput) {
        rInput.addEventListener('input', updatePolarPreview);
    }
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyPolarPreset(btn.dataset.preset);
        });
    });
}

function updatePolarPreview() {
    const rExpr = document.getElementById('polarR').value;
    const preview = document.getElementById('polarPreview');
    
    if (preview) {
        preview.textContent = `r(theta) = ${rExpr}`;
    }
}

function applyPolarPreset(preset) {
    const rInput = document.getElementById('polarR');
    const thetaMax = document.getElementById('thetaMax');
    
    const presets = {
        circle: { r: '2', max: '6.28' },
        cardioid: { r: '1 + cos(theta)', max: '6.28' },
        rose3: { r: 'cos(3*theta)', max: '6.28' },
        rose4: { r: 'cos(2*theta)', max: '6.28' },
        spiral: { r: 'theta', max: '18.84' },
        lemniscate: { r: 'sqrt(abs(4*cos(2*theta)))', max: '6.28' }
    };
    
    if (presets[preset]) {
        rInput.value = presets[preset].r;
        thetaMax.value = presets[preset].max;
        updatePolarPreview();
    }
}

function plotPolarGraph() {
    const canvas = document.getElementById('polarCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const rExpr = document.getElementById('polarR').value;
    const thetaMin = parseFloat(document.getElementById('thetaMin').value);
    const thetaMax = parseFloat(document.getElementById('thetaMax').value);
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate points and convert to Cartesian
    const points = [];
    const steps = 1000;
    let maxR = 0;
    
    for (let i = 0; i <= steps; i++) {
        const theta = thetaMin + (thetaMax - thetaMin) * i / steps;
        const r = evaluateExpression(rExpr, 'theta', theta);
        
        if (!isNaN(r) && isFinite(r)) {
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            points.push({ x, y, r: Math.abs(r) });
            if (Math.abs(r) > maxR) maxR = Math.abs(r);
        }
    }
    
    // Add margin
    maxR *= 1.2;
    
    // Center of canvas
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (2 * maxR);
    
    // Draw polar grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    // Radial lines
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + maxR * scale * Math.cos(angle), centerY - maxR * scale * Math.sin(angle));
        ctx.stroke();
    }
    
    // Concentric circles
    const numCircles = 5;
    for (let i = 1; i <= numCircles; i++) {
        const r = (maxR / numCircles) * i * scale;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw curve
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    points.forEach(point => {
        const px = centerX + point.x * scale;
        const py = centerY - point.y * scale;
        
        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
        } else {
            ctx.lineTo(px, py);
        }
    });
    
    ctx.stroke();
    showExportButton('polar');
}

// ===================================
// STEP-BY-STEP ANIMATIONS
// ===================================
let animationEnabled = true;
let animationSpeed = 500; // ms per step

function generateAnimatedSteps(steps, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    let html = '<div class="animated-steps">';
    
    steps.forEach((step, index) => {
        const delay = animationEnabled ? index * (animationSpeed / 1000) : 0;
        html += `
            <div class="step-item" style="animation-delay: ${delay}s;">
                <span class="step-number">${index + 1}</span>
                <div class="step-content">
                    <div class="step-explanation">${step.explanation}</div>
                    <div class="step-equation">${step.equation}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function solveLinearWithAnimation() {
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

function solveQuadraticWithAnimation() {
    const a = parseFloat(document.getElementById('quadA').value);
    const b = parseFloat(document.getElementById('quadB').value);
    const c = parseFloat(document.getElementById('quadC').value);
    const resultDiv = document.getElementById('quadraticSolution');
    const trans = translations[currentLang];
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
        resultDiv.innerHTML = `<p class="error">${trans.invalidInput}</p>`;
        return;
    }
    
    const delta = b * b - 4 * a * c;
    let html = `<h3>${trans.solution}</h3>`;
    
    const steps = [
        { explanation: trans.startEquation || 'Starting equation', equation: `${a}x^2 + ${b}x + ${c} = 0` },
        { explanation: trans.calcDiscriminant || 'Calculate discriminant', equation: `Delta = b^2 - 4ac = ${b}^2 - 4(${a})(${c})` },
        { explanation: trans.discriminantValue || 'Discriminant value', equation: `Delta = ${delta.toFixed(4)}` }
    ];
    
    if (delta < 0) {
        steps.push({ explanation: trans.deltaLessThanZero || 'Delta < 0, no real solutions', equation: trans.noRealSolutions });
        html += generateAnimatedSteps(steps, '#quadraticSolution');
        html += `<div class="final-result"><h4>${trans.noSolution}</h4></div>`;
    } else if (delta === 0) {
        const x = -b / (2 * a);
        steps.push({ explanation: trans.deltaEqualsZero || 'Delta = 0, one solution', equation: `x = -b / 2a = ${-b} / ${2 * a}` });
        steps.push({ explanation: trans.simplify || 'Simplify', equation: `x = ${x.toFixed(4)}` });
        html += generateAnimatedSteps(steps, '#quadraticSolution');
        html += `<div class="final-result">
            <h4>${trans.oneSolution}</h4>
            <div class="result-value">x = ${x.toFixed(4)}</div>
        </div>`;
        addToHistory(`${a}x^2 + ${b}x + ${c} = 0 -> x = ${x.toFixed(4)}`);
    } else {
        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);
        steps.push({ explanation: trans.deltaGreaterThanZero || 'Delta > 0, two solutions', equation: `sqrt(Delta) = ${Math.sqrt(delta).toFixed(4)}` });
        steps.push({ explanation: trans.calcX1 || 'Calculate x1', equation: `x1 = (-b + sqrt(Delta)) / 2a = ${x1.toFixed(4)}` });
        steps.push({ explanation: trans.calcX2 || 'Calculate x2', equation: `x2 = (-b - sqrt(Delta)) / 2a = ${x2.toFixed(4)}` });
        html += generateAnimatedSteps(steps, '#quadraticSolution');
        html += `<div class="final-result">
            <h4>${trans.twoSolutions}</h4>
            <div class="result-value">x1 = ${x1.toFixed(4)}</div>
            <div class="result-value">x2 = ${x2.toFixed(4)}</div>
        </div>`;
        addToHistory(`${a}x^2 + ${b}x + ${c} = 0 -> x1 = ${x1.toFixed(4)}, x2 = ${x2.toFixed(4)}`);
    }
    
    resultDiv.innerHTML = html;
    showExportButton('quadratic');
}

// Override original solve functions with animated versions
const originalSolveLinear = solveLinearEquation;
const originalSolveQuadratic = solveQuadraticEquation;

solveLinearEquation = function() {
    if (animationEnabled) {
        solveLinearWithAnimation();
    } else {
        originalSolveLinear();
    }
};

solveQuadraticEquation = function() {
    if (animationEnabled) {
        solveQuadraticWithAnimation();
    } else {
        originalSolveQuadratic();
    }
};

// ===================================
// GCD AND LCM CALCULATOR
// ===================================
function gcd(a, b) {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.floor(a) * Math.floor(b)) / gcd(a, b);
}

function gcdMultiple(numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.length === 1) return Math.abs(Math.floor(numbers[0]));
    return numbers.reduce((acc, num) => gcd(acc, num));
}

function lcmMultiple(numbers) {
    if (numbers.length === 0) return 0;
    if (numbers.length === 1) return Math.abs(Math.floor(numbers[0]));
    return numbers.reduce((acc, num) => lcm(acc, num));
}

function primeFactorization(n) {
    n = Math.abs(Math.floor(n));
    if (n <= 1) return {};
    
    const factors = {};
    let divisor = 2;
    
    while (n >= 2) {
        if (n % divisor === 0) {
            factors[divisor] = (factors[divisor] || 0) + 1;
            n = n / divisor;
        } else {
            divisor++;
        }
    }
    
    return factors;
}

function formatFactorization(factors) {
    if (Object.keys(factors).length === 0) return '1';
    return Object.entries(factors)
        .map(([prime, exp]) => exp > 1 ? `${prime}^${exp}` : prime)
        .join(' x ');
}

function setupGcdLcmCalculator() {
    const calculateBtn = document.getElementById('calculateGcdLcm');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateGcdLcm);
    
    const input = document.getElementById('gcdlcmInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateGcdLcm();
        });
    }
}

function calculateGcdLcm() {
    const input = document.getElementById('gcdlcmInput');
    const resultDiv = document.getElementById('gcdlcmSolution');
    
    if (!input || !resultDiv) return;
    
    const inputValue = input.value.trim();
    if (!inputValue) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].enterNumbers || 'Please enter numbers'}</div>`;
        return;
    }
    
    const numbers = inputValue.split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n > 0);
    
    if (numbers.length < 2) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].gcdlcmError || 'Please enter at least 2 positive integers'}</div>`;
        return;
    }
    
    const gcdResult = gcdMultiple(numbers);
    const lcmResult = lcmMultiple(numbers);
    
    const numbersStr = numbers.join(', ');
    
    let html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].numbers || 'Numbers'}:</div>
            <div class="result-value">${numbersStr}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].gcdResult || 'GCD (Greatest Common Divisor)'}:</div>
            <div class="result-value highlight">${gcdResult}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].lcmResult || 'LCM (Least Common Multiple)'}:</div>
            <div class="result-value highlight">${lcmResult}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].primeFactorizations || 'Prime Factorizations'}:</div>
            <div class="factorization-list">`;
    
    numbers.forEach(num => {
        const factors = primeFactorization(num);
        html += `<div class="factorization-item">${num} = ${formatFactorization(factors)}</div>`;
    });
    
    html += `</div></div>`;
    
    resultDiv.innerHTML = html;
    
    addToHistory(`GCD(${numbersStr}) = ${gcdResult}, LCM(${numbersStr}) = ${lcmResult}`);
    
    document.getElementById('exportGcdLcmPdf').style.display = 'inline-block';
}

// ===================================
// INITIALIZATION EXTENSION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize new features
    setTimeout(() => {
        setupCustomThemeBuilder();
        setupLatexInput();
        setupParametricGraph();
        setupPolarGraph();
        setupGcdLcmCalculator();
        setupModularCalculator();
        setupCombinatoricsCalculator();
        setupFractionsCalculator();
        setupPercentageCalculator();
        setupRatioCalculator();
        setupBaseConverter();
        setupUnitConverter();
        setupStatisticsCalculator();
        setupSequenceCalculator();
        setupLimitCalculator();
        setupTaylorCalculator();
        setupIntegrationCalculator();
    }, 100);
});

// ===================================
// MODULAR ARITHMETIC CALCULATOR
// ===================================
function setupModularCalculator() {
    const calculateBtn = document.getElementById('calculateModular');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateModular);
    
    const operationSelect = document.getElementById('modularOperation');
    if (operationSelect) {
        operationSelect.addEventListener('change', () => {
            const bGroup = document.getElementById('modValueBGroup');
            if (bGroup) {
                bGroup.style.display = operationSelect.value === 'power' ? 'block' : 'none';
            }
        });
        // Initialize visibility
        const bGroup = document.getElementById('modValueBGroup');
        if (bGroup) bGroup.style.display = 'none';
    }
}

function modulo(a, n) {
    return ((a % n) + n) % n;
}

function modularInverse(a, n) {
    // Extended Euclidean Algorithm
    let [oldR, r] = [a, n];
    let [oldS, s] = [1, 0];
    
    while (r !== 0) {
        const quotient = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - quotient * r];
        [oldS, s] = [s, oldS - quotient * s];
    }
    
    if (oldR !== 1) return null; // No inverse exists
    return modulo(oldS, n);
}

function modularPower(base, exp, mod) {
    if (mod === 1) return 0;
    let result = 1;
    base = modulo(base, mod);
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = modulo(result * base, mod);
        }
        exp = Math.floor(exp / 2);
        base = modulo(base * base, mod);
    }
    return result;
}

function calculateModular() {
    const operation = document.getElementById('modularOperation').value;
    const a = parseInt(document.getElementById('modValueA').value);
    const b = parseInt(document.getElementById('modValueB').value);
    const n = parseInt(document.getElementById('modValueN').value);
    const resultDiv = document.getElementById('modularSolution');
    
    if (isNaN(a) || isNaN(n) || n <= 0) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    let result, html;
    
    switch (operation) {
        case 'modulo':
            result = modulo(a, n);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].moduloResult || 'a mod n'}:</div>
                    <div class="result-value">${a} mod ${n} = <span class="highlight">${result}</span></div>
                </div>`;
            addToHistory(`${a} mod ${n} = ${result}`);
            break;
            
        case 'inverse':
            result = modularInverse(a, n);
            if (result === null) {
                html = `<div class="error">${translations[currentLang].noModInverse || 'No modular inverse exists (a and n are not coprime)'}</div>`;
            } else {
                html = `
                    <div class="result-group">
                        <div class="result-label">${translations[currentLang].modInverseResult || 'Modular Inverse'}:</div>
                        <div class="result-value">${a}⁻¹ mod ${n} = <span class="highlight">${result}</span></div>
                    </div>
                    <div class="result-group">
                        <div class="result-label">${translations[currentLang].verification || 'Verification'}:</div>
                        <div class="result-value">${a} × ${result} mod ${n} = ${modulo(a * result, n)}</div>
                    </div>`;
                addToHistory(`${a}⁻¹ mod ${n} = ${result}`);
            }
            break;
            
        case 'power':
            if (isNaN(b) || b < 0) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
                return;
            }
            result = modularPower(a, b, n);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].modPowerResult || 'a^b mod n'}:</div>
                    <div class="result-value">${a}^${b} mod ${n} = <span class="highlight">${result}</span></div>
                </div>`;
            addToHistory(`${a}^${b} mod ${n} = ${result}`);
            break;
    }
    
    resultDiv.innerHTML = html;
    document.getElementById('exportModularPdf').style.display = 'inline-block';
}

// ===================================
// COMBINATORICS CALCULATOR
// ===================================
function setupCombinatoricsCalculator() {
    const calculateBtn = document.getElementById('calculateCombinatorics');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateCombinatorics);
    
    const operationSelect = document.getElementById('combinatoricsOperation');
    if (operationSelect) {
        operationSelect.addEventListener('change', () => {
            const rGroup = document.getElementById('combValueRGroup');
            if (rGroup) {
                rGroup.style.display = operationSelect.value === 'factorial' ? 'none' : 'block';
            }
        });
    }
}

function factorialBig(n) {
    if (n < 0) return null;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function permutation(n, r) {
    if (n < 0 || r < 0 || r > n) return null;
    return factorialBig(n) / factorialBig(n - r);
}

function combination(n, r) {
    if (n < 0 || r < 0 || r > n) return null;
    return factorialBig(n) / (factorialBig(r) * factorialBig(n - r));
}

function calculateCombinatorics() {
    const operation = document.getElementById('combinatoricsOperation').value;
    const n = parseInt(document.getElementById('combValueN').value);
    const r = parseInt(document.getElementById('combValueR').value);
    const resultDiv = document.getElementById('combinatoricsSolution');
    
    if (isNaN(n) || n < 0) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    let result, html;
    
    switch (operation) {
        case 'factorial':
            if (n > 170) {
                resultDiv.innerHTML = `<div class="error">Number too large (max 170)</div>`;
                return;
            }
            result = factorialBig(n);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].factorialResult || 'n!'}:</div>
                    <div class="result-value">${n}! = <span class="highlight">${result.toLocaleString()}</span></div>
                </div>`;
            addToHistory(`${n}! = ${result}`);
            break;
            
        case 'permutation':
            if (isNaN(r) || r < 0 || r > n) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidNR || 'n must be ≥ r and both must be non-negative'}</div>`;
                return;
            }
            result = permutation(n, r);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].permutationResult || 'P(n,r)'}:</div>
                    <div class="result-value">P(${n},${r}) = ${n}!/(${n}-${r})! = <span class="highlight">${result.toLocaleString()}</span></div>
                </div>`;
            addToHistory(`P(${n},${r}) = ${result}`);
            break;
            
        case 'combination':
            if (isNaN(r) || r < 0 || r > n) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidNR || 'n must be ≥ r and both must be non-negative'}</div>`;
                return;
            }
            result = combination(n, r);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].combinationResult || 'C(n,r)'}:</div>
                    <div class="result-value">C(${n},${r}) = ${n}!/[${r}!(${n}-${r})!] = <span class="highlight">${result.toLocaleString()}</span></div>
                </div>`;
            addToHistory(`C(${n},${r}) = ${result}`);
            break;
    }
    
    resultDiv.innerHTML = html;
    document.getElementById('exportCombinatoricsPdf').style.display = 'inline-block';
}

// ===================================
// FRACTIONS CALCULATOR
// ===================================
function setupFractionsCalculator() {
    const calculateBtn = document.getElementById('calculateFractions');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateFractions);
    
    const operationSelect = document.getElementById('fractionOperation');
    if (operationSelect) {
        operationSelect.addEventListener('change', () => {
            const frac2Group = document.getElementById('fraction2Group');
            if (frac2Group) {
                frac2Group.style.display = operationSelect.value === 'simplify' ? 'none' : 'block';
            }
        });
    }
}

function simplifyFractionFunc(num, den) {
    if (den === 0) return null;
    const g = gcd(Math.abs(num), Math.abs(den));
    let simpNum = num / g;
    let simpDen = den / g;
    if (simpDen < 0) {
        simpNum = -simpNum;
        simpDen = -simpDen;
    }
    return { num: simpNum, den: simpDen };
}

function fractionToMixed(num, den) {
    if (den === 0) return null;
    const whole = Math.floor(Math.abs(num) / Math.abs(den));
    const remainder = Math.abs(num) % Math.abs(den);
    const sign = (num < 0) !== (den < 0) ? -1 : 1;
    return { whole: sign * whole, num: remainder, den: Math.abs(den) };
}

function calculateFractions() {
    const operation = document.getElementById('fractionOperation').value;
    const num1 = parseInt(document.getElementById('frac1Num').value);
    const den1 = parseInt(document.getElementById('frac1Den').value);
    const num2 = parseInt(document.getElementById('frac2Num').value);
    const den2 = parseInt(document.getElementById('frac2Den').value);
    const resultDiv = document.getElementById('fractionsSolution');
    
    if (isNaN(num1) || isNaN(den1) || den1 === 0) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidFraction || 'Invalid fraction'}</div>`;
        return;
    }
    
    let resultNum, resultDen, html;
    
    switch (operation) {
        case 'simplify':
            const simplified = simplifyFractionFunc(num1, den1);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].simplifiedForm || 'Simplified form'}:</div>
                    <div class="result-value">${num1}/${den1} = <span class="highlight">${simplified.num}/${simplified.den}</span></div>
                </div>
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].decimalValue || 'Decimal value'}:</div>
                    <div class="result-value">${(num1 / den1).toFixed(6)}</div>
                </div>`;
            addToHistory(`${num1}/${den1} = ${simplified.num}/${simplified.den}`);
            break;
            
        case 'add':
            if (isNaN(num2) || isNaN(den2) || den2 === 0) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidFraction || 'Invalid fraction'}</div>`;
                return;
            }
            resultNum = num1 * den2 + num2 * den1;
            resultDen = den1 * den2;
            break;
            
        case 'subtract':
            if (isNaN(num2) || isNaN(den2) || den2 === 0) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidFraction || 'Invalid fraction'}</div>`;
                return;
            }
            resultNum = num1 * den2 - num2 * den1;
            resultDen = den1 * den2;
            break;
            
        case 'multiply':
            if (isNaN(num2) || isNaN(den2) || den2 === 0) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidFraction || 'Invalid fraction'}</div>`;
                return;
            }
            resultNum = num1 * num2;
            resultDen = den1 * den2;
            break;
            
        case 'divide':
            if (isNaN(num2) || isNaN(den2) || den2 === 0 || num2 === 0) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidFraction || 'Invalid fraction'}</div>`;
                return;
            }
            resultNum = num1 * den2;
            resultDen = den1 * num2;
            break;
    }
    
    if (operation !== 'simplify') {
        const result = simplifyFractionFunc(resultNum, resultDen);
        const opSymbol = { add: '+', subtract: '−', multiply: '×', divide: '÷' }[operation];
        html = `
            <div class="result-group">
                <div class="result-label">${translations[currentLang].fractionResult || 'Result'}:</div>
                <div class="result-value">${num1}/${den1} ${opSymbol} ${num2}/${den2} = <span class="highlight">${result.num}/${result.den}</span></div>
            </div>
            <div class="result-group">
                <div class="result-label">${translations[currentLang].decimalValue || 'Decimal value'}:</div>
                <div class="result-value">${(result.num / result.den).toFixed(6)}</div>
            </div>`;
        addToHistory(`${num1}/${den1} ${opSymbol} ${num2}/${den2} = ${result.num}/${result.den}`);
    }
    
    resultDiv.innerHTML = html;
    document.getElementById('exportFractionsPdf').style.display = 'inline-block';
}

// ===================================
// PERCENTAGE CALCULATOR
// ===================================
function setupPercentageCalculator() {
    const calculateBtn = document.getElementById('calculatePercentage');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculatePercentage);
}

function calculatePercentage() {
    const operation = document.getElementById('percentageOperation').value;
    const x = parseFloat(document.getElementById('percentValueX').value);
    const y = parseFloat(document.getElementById('percentValueY').value);
    const resultDiv = document.getElementById('percentageSolution');
    
    if (isNaN(x) || isNaN(y)) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    let result, html;
    
    switch (operation) {
        case 'percentOf':
            result = (x / 100) * y;
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].percentResult || 'Result'}:</div>
                    <div class="result-value">${x}% of ${y} = <span class="highlight">${result.toFixed(4)}</span></div>
                </div>`;
            addToHistory(`${x}% of ${y} = ${result.toFixed(4)}`);
            break;
            
        case 'percentChange':
            if (x === 0) {
                resultDiv.innerHTML = `<div class="error">Cannot calculate change from 0</div>`;
                return;
            }
            result = ((y - x) / Math.abs(x)) * 100;
            const changeType = result >= 0 ? (translations[currentLang].isIncreaseOf || 'increase') : (translations[currentLang].isDecreaseOf || 'decrease');
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].changePercent || 'Change'}:</div>
                    <div class="result-value">From ${x} to ${y} is a <span class="highlight">${Math.abs(result).toFixed(2)}%</span> ${changeType}</div>
                </div>`;
            addToHistory(`Change from ${x} to ${y} = ${result.toFixed(2)}%`);
            break;
            
        case 'percentIncrease':
            result = x * (1 + y / 100);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].newValue || 'New value'}:</div>
                    <div class="result-value">${x} + ${y}% = <span class="highlight">${result.toFixed(4)}</span></div>
                </div>`;
            addToHistory(`${x} + ${y}% = ${result.toFixed(4)}`);
            break;
            
        case 'percentDecrease':
            result = x * (1 - y / 100);
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].newValue || 'New value'}:</div>
                    <div class="result-value">${x} - ${y}% = <span class="highlight">${result.toFixed(4)}</span></div>
                </div>`;
            addToHistory(`${x} - ${y}% = ${result.toFixed(4)}`);
            break;
    }
    
    resultDiv.innerHTML = html;
    document.getElementById('exportPercentagePdf').style.display = 'inline-block';
}

// ===================================
// RATIO CALCULATOR
// ===================================
function setupRatioCalculator() {
    const calculateBtn = document.getElementById('calculateRatio');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateRatio);
    
    const operationSelect = document.getElementById('ratioOperation');
    if (operationSelect) {
        operationSelect.addEventListener('change', () => {
            const cGroup = document.getElementById('ratioCGroup');
            if (cGroup) {
                cGroup.style.display = operationSelect.value === 'proportion' ? 'block' : 'none';
            }
        });
        // Initialize
        const cGroup = document.getElementById('ratioCGroup');
        if (cGroup) cGroup.style.display = 'none';
    }
}

function calculateRatio() {
    const operation = document.getElementById('ratioOperation').value;
    const a = parseFloat(document.getElementById('ratioValueA').value);
    const b = parseFloat(document.getElementById('ratioValueB').value);
    const c = parseFloat(document.getElementById('ratioValueC').value);
    const resultDiv = document.getElementById('ratioSolution');
    
    if (isNaN(a) || isNaN(b) || a === 0 && b === 0) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    let html;
    
    switch (operation) {
        case 'simplify':
            const g = gcd(Math.abs(Math.round(a)), Math.abs(Math.round(b)));
            const simpA = Math.round(a) / g;
            const simpB = Math.round(b) / g;
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].simplifiedRatio || 'Simplified ratio'}:</div>
                    <div class="result-value">${Math.round(a)}:${Math.round(b)} = <span class="highlight">${simpA}:${simpB}</span></div>
                </div>`;
            addToHistory(`${Math.round(a)}:${Math.round(b)} = ${simpA}:${simpB}`);
            break;
            
        case 'proportion':
            if (isNaN(c) || a === 0) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
                return;
            }
            const x = (b * c) / a;
            html = `
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].proportionResult || 'Proportion solution'}:</div>
                    <div class="result-value">${a}:${b} = ${c}:x</div>
                </div>
                <div class="result-group">
                    <div class="result-label">${translations[currentLang].missingValue || 'Missing value x'}:</div>
                    <div class="result-value">x = <span class="highlight">${x.toFixed(4)}</span></div>
                </div>`;
            addToHistory(`${a}:${b} = ${c}:${x.toFixed(4)}`);
            break;
    }
    
    resultDiv.innerHTML = html;
    document.getElementById('exportRatioPdf').style.display = 'inline-block';
}

// ===================================
// STATISTICS CALCULATOR
// ===================================
function setupStatisticsCalculator() {
    const calculateBtn = document.getElementById('calculateStatistics');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateStatistics);
}

function calculateMean(data) {
    return data.reduce((a, b) => a + b, 0) / data.length;
}

function calculateMedian(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateMode(data) {
    const frequency = {};
    data.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(Number);
    
    if (modes.length === data.length) return null; // No mode
    return modes;
}

function calculateVariance(data, isSample = true) {
    const mean = calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const divisor = isSample ? data.length - 1 : data.length;
    return squaredDiffs.reduce((a, b) => a + b, 0) / divisor;
}

function calculateStdDev(data, isSample = true) {
    return Math.sqrt(calculateVariance(data, isSample));
}

function calculateStatistics() {
    const input = document.getElementById('statsInput').value.trim();
    const resultDiv = document.getElementById('statisticsSolution');
    
    if (!input) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    const data = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    
    if (data.length < 2) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Enter at least 2 numbers'}</div>`;
        return;
    }
    
    const mean = calculateMean(data);
    const median = calculateMedian(data);
    const mode = calculateMode(data);
    const variance = calculateVariance(data);
    const stdDev = calculateStdDev(data);
    const sum = data.reduce((a, b) => a + b, 0);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    let modeText;
    if (mode === null) {
        modeText = translations[currentLang].noMode || 'No mode';
    } else if (mode.length > 3) {
        modeText = translations[currentLang].multipleMode || 'Multiple modes';
    } else {
        modeText = mode.join(', ');
    }
    
    const html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].count || 'Count'}:</div>
            <div class="result-value">${data.length}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].sum || 'Sum'}:</div>
            <div class="result-value">${sum.toFixed(4)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].mean || 'Mean'}:</div>
            <div class="result-value highlight">${mean.toFixed(4)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].median || 'Median'}:</div>
            <div class="result-value highlight">${median.toFixed(4)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].mode || 'Mode'}:</div>
            <div class="result-value">${modeText}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].variance || 'Variance'}:</div>
            <div class="result-value">${variance.toFixed(4)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].stdDeviation || 'Standard Deviation'}:</div>
            <div class="result-value highlight">${stdDev.toFixed(4)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].range || 'Range'}:</div>
            <div class="result-value">${range.toFixed(4)} (${min} - ${max})</div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`Stats: n=${data.length}, μ=${mean.toFixed(2)}, σ=${stdDev.toFixed(2)}`);
    document.getElementById('exportStatisticsPdf').style.display = 'inline-block';
}

// ===================================
// SEQUENCE CALCULATOR
// ===================================
function setupSequenceCalculator() {
    const calculateBtn = document.getElementById('calculateSequence');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateSequence);
    
    const typeSelect = document.getElementById('sequenceType');
    if (typeSelect) {
        typeSelect.addEventListener('change', updateSequenceInputs);
        updateSequenceInputs();
    }
}

function updateSequenceInputs() {
    const type = document.getElementById('sequenceType').value;
    const firstTermGroup = document.getElementById('seqFirstTermGroup');
    const diffGroup = document.getElementById('seqDiffGroup');
    const ratioGroup = document.getElementById('seqRatioGroup');
    
    if (type === 'fibonacci') {
        if (firstTermGroup) firstTermGroup.style.display = 'none';
        if (diffGroup) diffGroup.style.display = 'none';
        if (ratioGroup) ratioGroup.style.display = 'none';
    } else if (type === 'arithmetic') {
        if (firstTermGroup) firstTermGroup.style.display = 'block';
        if (diffGroup) diffGroup.style.display = 'block';
        if (ratioGroup) ratioGroup.style.display = 'none';
    } else if (type === 'geometric') {
        if (firstTermGroup) firstTermGroup.style.display = 'block';
        if (diffGroup) diffGroup.style.display = 'none';
        if (ratioGroup) ratioGroup.style.display = 'block';
    }
}

function generateArithmeticSequence(a1, d, n) {
    const terms = [];
    for (let i = 0; i < n; i++) {
        terms.push(a1 + i * d);
    }
    const nthTerm = a1 + (n - 1) * d;
    const sum = (n / 2) * (2 * a1 + (n - 1) * d);
    return { terms, nthTerm, sum, formula: `aₙ = ${a1} + (n-1)×${d}` };
}

function generateGeometricSequence(a1, r, n) {
    const terms = [];
    for (let i = 0; i < n; i++) {
        terms.push(a1 * Math.pow(r, i));
    }
    const nthTerm = a1 * Math.pow(r, n - 1);
    const sum = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r);
    return { terms, nthTerm, sum, formula: `aₙ = ${a1} × ${r}^(n-1)` };
}

function generateFibonacciSequence(n) {
    const terms = [0, 1];
    for (let i = 2; i < n; i++) {
        terms.push(terms[i - 1] + terms[i - 2]);
    }
    const sum = terms.slice(0, n).reduce((a, b) => a + b, 0);
    return { terms: terms.slice(0, n), nthTerm: terms[n - 1], sum, formula: 'Fₙ = Fₙ₋₁ + Fₙ₋₂' };
}

function calculateSequence() {
    const type = document.getElementById('sequenceType').value;
    const n = parseInt(document.getElementById('seqNumTerms').value);
    const resultDiv = document.getElementById('sequencesSolution');
    
    if (isNaN(n) || n < 1 || n > 100) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input (1-100 terms)'}</div>`;
        return;
    }
    
    let result;
    
    switch (type) {
        case 'arithmetic':
            const a1 = parseFloat(document.getElementById('seqFirstTerm').value);
            const d = parseFloat(document.getElementById('seqDiff').value);
            if (isNaN(a1) || isNaN(d)) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
                return;
            }
            result = generateArithmeticSequence(a1, d, n);
            break;
            
        case 'geometric':
            const g1 = parseFloat(document.getElementById('seqFirstTerm').value);
            const r = parseFloat(document.getElementById('seqRatio').value);
            if (isNaN(g1) || isNaN(r)) {
                resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
                return;
            }
            result = generateGeometricSequence(g1, r, n);
            break;
            
        case 'fibonacci':
            result = generateFibonacciSequence(n);
            break;
    }
    
    const termsDisplay = result.terms.length > 15 
        ? result.terms.slice(0, 10).join(', ') + ', ... , ' + result.terms.slice(-3).join(', ')
        : result.terms.join(', ');
    
    const html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].generalFormula || 'General formula'}:</div>
            <div class="result-value">${result.formula}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].sequenceTerms || 'Sequence terms'}:</div>
            <div class="result-value" style="word-break: break-all;">${termsDisplay}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].nthTermResult || 'nth term'} (n=${n}):</div>
            <div class="result-value highlight">${result.nthTerm.toFixed(4)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].sumOfTerms || 'Sum of terms'}:</div>
            <div class="result-value highlight">${result.sum.toFixed(4)}</div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${type} sequence: n=${n}, aₙ=${result.nthTerm.toFixed(2)}, Σ=${result.sum.toFixed(2)}`);
    document.getElementById('exportSequencesPdf').style.display = 'inline-block';
}

// ===================================
// LIMIT CALCULATOR
// ===================================
function setupLimitCalculator() {
    const calculateBtn = document.getElementById('calculateLimit');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateLimit);
}

function evaluateLimitFunction(expr, x) {
    try {
        // Replace common math functions
        let safeExpr = expr
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/abs/g, 'Math.abs')
            .replace(/exp/g, 'Math.exp')
            .replace(/pi/gi, 'Math.PI')
            .replace(/e(?![xp])/g, 'Math.E');
        
        return Function('x', `"use strict"; return (${safeExpr})`)(x);
    } catch (e) {
        return NaN;
    }
}

function calculateLimit() {
    const expr = document.getElementById('limitFunction').value.trim();
    const pointStr = document.getElementById('limitPoint').value.trim().toLowerCase();
    const direction = document.getElementById('limitDirection').value;
    const resultDiv = document.getElementById('limitsSolution');
    
    if (!expr) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    let point;
    let isInfinity = false;
    let isNegInfinity = false;
    
    if (pointStr === 'infinity' || pointStr === 'inf' || pointStr === '∞') {
        isInfinity = true;
        point = 1e10;
    } else if (pointStr === '-infinity' || pointStr === '-inf' || pointStr === '-∞') {
        isNegInfinity = true;
        point = -1e10;
    } else {
        point = parseFloat(pointStr);
        if (isNaN(point)) {
            resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid limit point'}</div>`;
            return;
        }
    }
    
    const epsilon = 1e-8;
    let leftLimit, rightLimit, limitValue;
    
    if (isInfinity || isNegInfinity) {
        const val1 = evaluateLimitFunction(expr, point);
        const val2 = evaluateLimitFunction(expr, point * 1.1);
        
        if (Math.abs(val1 - val2) < 1e-6) {
            limitValue = val1;
        } else if (val1 > val2 && isInfinity || val1 < val2 && isNegInfinity) {
            limitValue = Infinity;
        } else {
            limitValue = -Infinity;
        }
    } else {
        leftLimit = evaluateLimitFunction(expr, point - epsilon);
        rightLimit = evaluateLimitFunction(expr, point + epsilon);
        
        if (direction === 'left') {
            limitValue = leftLimit;
        } else if (direction === 'right') {
            limitValue = rightLimit;
        } else {
            if (Math.abs(leftLimit - rightLimit) < 1e-6) {
                limitValue = (leftLimit + rightLimit) / 2;
            } else {
                resultDiv.innerHTML = `
                    <div class="result-group">
                        <div class="result-label">${translations[currentLang].limitDNE || 'Limit does not exist'}:</div>
                        <div class="result-value">Left limit ≈ ${leftLimit.toFixed(6)}, Right limit ≈ ${rightLimit.toFixed(6)}</div>
                    </div>`;
                return;
            }
        }
    }
    
    let limitDisplay;
    if (!isFinite(limitValue)) {
        limitDisplay = limitValue > 0 ? '∞' : '-∞';
    } else if (isNaN(limitValue)) {
        limitDisplay = translations[currentLang].indeterminate || 'Indeterminate';
    } else {
        limitDisplay = limitValue.toFixed(6);
    }
    
    const pointDisplay = isInfinity ? '∞' : (isNegInfinity ? '-∞' : point);
    
    const html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].limitResult || 'Limit result'}:</div>
            <div class="result-value">lim(x→${pointDisplay}) [${expr}] = <span class="highlight">${limitDisplay}</span></div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`lim(x→${pointDisplay}) [${expr}] = ${limitDisplay}`);
    document.getElementById('exportLimitsPdf').style.display = 'inline-block';
}

// ===================================
// TAYLOR SERIES CALCULATOR
// ===================================
function setupTaylorCalculator() {
    const calculateBtn = document.getElementById('calculateTaylor');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateTaylor);
}

function taylorSin(x, a, n) {
    let result = 0;
    for (let k = 0; k < n; k++) {
        const term = Math.pow(-1, k) * Math.pow(x - a, 2*k + 1) / factorialBig(2*k + 1);
        result += term;
    }
    return result;
}

function taylorCos(x, a, n) {
    let result = 0;
    for (let k = 0; k < n; k++) {
        const term = Math.pow(-1, k) * Math.pow(x - a, 2*k) / factorialBig(2*k);
        result += term;
    }
    return result;
}

function taylorExp(x, a, n) {
    let result = 0;
    const ea = Math.exp(a);
    for (let k = 0; k < n; k++) {
        result += ea * Math.pow(x - a, k) / factorialBig(k);
    }
    return result;
}

function taylorLn(x, a, n) {
    // ln(1+x) around a=0
    if (a !== 0) return NaN;
    let result = 0;
    for (let k = 1; k <= n; k++) {
        result += Math.pow(-1, k + 1) * Math.pow(x, k) / k;
    }
    return result;
}

function taylorAtan(x, a, n) {
    if (a !== 0) return NaN;
    let result = 0;
    for (let k = 0; k < n; k++) {
        result += Math.pow(-1, k) * Math.pow(x, 2*k + 1) / (2*k + 1);
    }
    return result;
}

function getTaylorFormula(func, a, n) {
    const formulas = {
        sin: a === 0 ? `x - x³/3! + x⁵/5! - x⁷/7! + ...` : `Σ (-1)ⁿ(x-${a})^(2n+1)/(2n+1)!`,
        cos: a === 0 ? `1 - x²/2! + x⁴/4! - x⁶/6! + ...` : `Σ (-1)ⁿ(x-${a})^(2n)/(2n)!`,
        exp: a === 0 ? `1 + x + x²/2! + x³/3! + ...` : `e^${a} × Σ (x-${a})ⁿ/n!`,
        ln: `x - x²/2 + x³/3 - x⁴/4 + ...`,
        atan: `x - x³/3 + x⁵/5 - x⁷/7 + ...`
    };
    return formulas[func];
}

function calculateTaylor() {
    const func = document.getElementById('taylorFunction').value;
    const a = parseFloat(document.getElementById('taylorPoint').value);
    const n = parseInt(document.getElementById('taylorTerms').value);
    const resultDiv = document.getElementById('taylorSolution');
    
    if (isNaN(a) || isNaN(n) || n < 1 || n > 15) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    // Test values
    const testX = a + 0.5;
    let approxValue, exactValue;
    
    switch (func) {
        case 'sin':
            approxValue = taylorSin(testX, a, n);
            exactValue = Math.sin(testX);
            break;
        case 'cos':
            approxValue = taylorCos(testX, a, n);
            exactValue = Math.cos(testX);
            break;
        case 'exp':
            approxValue = taylorExp(testX, a, n);
            exactValue = Math.exp(testX);
            break;
        case 'ln':
            if (a !== 0) {
                resultDiv.innerHTML = `<div class="error">ln(1+x) expansion only valid for a=0</div>`;
                return;
            }
            approxValue = taylorLn(testX, a, n);
            exactValue = Math.log(1 + testX);
            break;
        case 'atan':
            if (a !== 0) {
                resultDiv.innerHTML = `<div class="error">arctan(x) expansion only valid for a=0</div>`;
                return;
            }
            approxValue = taylorAtan(testX, a, n);
            exactValue = Math.atan(testX);
            break;
    }
    
    const error = Math.abs(exactValue - approxValue);
    const formula = getTaylorFormula(func, a, n);
    const isMaclaurin = a === 0;
    
    const html = `
        <div class="result-group">
            <div class="result-label">${isMaclaurin ? (translations[currentLang].maclaurinNote || 'Maclaurin series (a=0)') : (translations[currentLang].taylorResult || 'Taylor Series')}:</div>
            <div class="result-value">${func}(x) ≈ ${formula}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].polynomialApprox || 'Polynomial approximation'} (x=${testX}, ${n} terms):</div>
            <div class="result-value">P(${testX}) ≈ <span class="highlight">${approxValue.toFixed(8)}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">Exact value:</div>
            <div class="result-value">${func}(${testX}) = ${exactValue.toFixed(8)}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].estimatedError || 'Error'}:</div>
            <div class="result-value">${error.toExponential(4)}</div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`Taylor ${func}(x) at a=${a}, ${n} terms`);
    document.getElementById('exportTaylorPdf').style.display = 'inline-block';
}

// ===================================
// NUMERICAL INTEGRATION
// ===================================
function setupIntegrationCalculator() {
    const calculateBtn = document.getElementById('calculateIntegration');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', calculateIntegration);
}

function trapezoidalRule(f, a, b, n) {
    const h = (b - a) / n;
    let sum = (f(a) + f(b)) / 2;
    
    for (let i = 1; i < n; i++) {
        sum += f(a + i * h);
    }
    
    return h * sum;
}

function simpsonsRule(f, a, b, n) {
    // n must be even
    if (n % 2 !== 0) n++;
    
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    
    return (h / 3) * sum;
}

function calculateIntegration() {
    const expr = document.getElementById('integrationFunction').value.trim();
    const a = parseFloat(document.getElementById('integrationLower').value);
    const b = parseFloat(document.getElementById('integrationUpper').value);
    let n = parseInt(document.getElementById('integrationIntervals').value);
    const method = document.getElementById('integrationMethod').value;
    const resultDiv = document.getElementById('integrationSolution');
    
    if (!expr || isNaN(a) || isNaN(b) || isNaN(n) || n < 2) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    // Create function from expression
    const f = (x) => evaluateLimitFunction(expr, x);
    
    // Test if function is valid
    if (isNaN(f((a + b) / 2))) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid function'}</div>`;
        return;
    }
    
    let result;
    let methodName;
    
    if (method === 'trapezoidal') {
        result = trapezoidalRule(f, a, b, n);
        methodName = translations[currentLang].trapezoidalRule || 'Trapezoidal Rule';
    } else {
        if (n % 2 !== 0) n++;
        result = simpsonsRule(f, a, b, n);
        methodName = translations[currentLang].simpsonsRule || "Simpson's Rule";
    }
    
    // Estimate error by comparing with more intervals
    const finerResult = method === 'trapezoidal' 
        ? trapezoidalRule(f, a, b, n * 2)
        : simpsonsRule(f, a, b, n * 2);
    const estimatedError = Math.abs(result - finerResult);
    
    const html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].integrationResult || 'Integration Result'}:</div>
            <div class="result-value">∫[${a} to ${b}] ${expr} dx ≈ <span class="highlight">${result.toFixed(8)}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].methodUsed || 'Method'}:</div>
            <div class="result-value">${methodName}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].intervalsUsed || 'Intervals'}:</div>
            <div class="result-value">${n}</div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].estimatedError || 'Estimated error'}:</div>
            <div class="result-value">${estimatedError.toExponential(4)}</div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`∫[${a},${b}] ${expr} dx ≈ ${result.toFixed(6)}`);
    document.getElementById('exportIntegrationPdf').style.display = 'inline-block';
}

// ===================================
// BASE CONVERTER
// ===================================
function setupBaseConverter() {
    const convertBtn = document.getElementById('convertBase');
    if (!convertBtn) return;
    
    convertBtn.addEventListener('click', convertBase);
}

function convertBase() {
    const input = document.getElementById('baseInput').value.trim().toUpperCase();
    const fromBase = parseInt(document.getElementById('fromBase').value);
    const resultDiv = document.getElementById('baseConverterSolution');
    
    if (!input) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    // Validate input for the given base
    const validChars = '0123456789ABCDEF'.substring(0, fromBase);
    const isValid = input.split('').every(char => validChars.includes(char) || char === '-');
    
    if (!isValid) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidBaseNumber || 'Invalid number for the selected base'}</div>`;
        return;
    }
    
    // Convert to decimal first
    const isNegative = input.startsWith('-');
    const cleanInput = isNegative ? input.substring(1) : input;
    const decimal = parseInt(cleanInput, fromBase);
    
    if (isNaN(decimal)) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    const sign = isNegative ? '-' : '';
    const binary = sign + Math.abs(decimal).toString(2);
    const octal = sign + Math.abs(decimal).toString(8);
    const hex = sign + Math.abs(decimal).toString(16).toUpperCase();
    const dec = sign + Math.abs(decimal).toString(10);
    
    const html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].binaryResult || 'Binary (base 2)'}:</div>
            <div class="result-value"><span class="highlight">${binary}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].octalResult || 'Octal (base 8)'}:</div>
            <div class="result-value"><span class="highlight">${octal}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].decimalResult || 'Decimal (base 10)'}:</div>
            <div class="result-value"><span class="highlight">${dec}</span></div>
        </div>
        <div class="result-group">
            <div class="result-label">${translations[currentLang].hexResult || 'Hexadecimal (base 16)'}:</div>
            <div class="result-value"><span class="highlight">${hex}</span></div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${input} (base ${fromBase}) = ${dec} (base 10)`);
    document.getElementById('exportBaseConverterPdf').style.display = 'inline-block';
}

// ===================================
// UNIT CONVERTER
// ===================================
const unitConversions = {
    length: {
        meter: 1,
        kilometer: 0.001,
        centimeter: 100,
        millimeter: 1000,
        mile: 0.000621371,
        yard: 1.09361,
        foot: 3.28084,
        inch: 39.3701
    },
    mass: {
        kilogram: 1,
        gram: 1000,
        milligram: 1000000,
        pound: 2.20462,
        ounce: 35.274,
        ton: 0.001
    },
    temperature: {
        celsius: 'special',
        fahrenheit: 'special',
        kelvin: 'special'
    },
    time: {
        second: 1,
        minute: 1/60,
        hour: 1/3600,
        day: 1/86400,
        week: 1/604800,
        month: 1/2592000,
        year: 1/31536000
    },
    area: {
        squareMeter: 1,
        squareKilometer: 0.000001,
        squareFoot: 10.7639,
        squareMile: 3.861e-7,
        acre: 0.000247105,
        hectare: 0.0001
    },
    volume: {
        liter: 1,
        milliliter: 1000,
        cubicMeter: 0.001,
        gallon: 0.264172,
        quart: 1.05669,
        pint: 2.11338,
        cup: 4.22675
    }
};

function setupUnitConverter() {
    const convertBtn = document.getElementById('convertUnit');
    if (!convertBtn) return;
    
    convertBtn.addEventListener('click', convertUnit);
    
    const categorySelect = document.getElementById('unitCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateUnitOptions);
        updateUnitOptions(); // Initialize
    }
}

function updateUnitOptions() {
    const category = document.getElementById('unitCategory').value;
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    if (!fromSelect || !toSelect) return;
    
    const units = Object.keys(unitConversions[category]);
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    units.forEach((unit, index) => {
        const fromOption = document.createElement('option');
        fromOption.value = unit;
        fromOption.textContent = translations[currentLang][unit] || unit;
        fromSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unit;
        toOption.textContent = translations[currentLang][unit] || unit;
        if (index === 1) toOption.selected = true;
        toSelect.appendChild(toOption);
    });
}

function convertTemperature(value, from, to) {
    // Convert to Celsius first
    let celsius;
    switch (from) {
        case 'celsius': celsius = value; break;
        case 'fahrenheit': celsius = (value - 32) * 5/9; break;
        case 'kelvin': celsius = value - 273.15; break;
    }
    
    // Convert from Celsius to target
    switch (to) {
        case 'celsius': return celsius;
        case 'fahrenheit': return celsius * 9/5 + 32;
        case 'kelvin': return celsius + 273.15;
    }
}

function convertUnit() {
    const category = document.getElementById('unitCategory').value;
    const value = parseFloat(document.getElementById('unitValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const resultDiv = document.getElementById('unitConverterSolution');
    
    if (isNaN(value)) {
        resultDiv.innerHTML = `<div class="error">${translations[currentLang].invalidInput || 'Invalid input'}</div>`;
        return;
    }
    
    let result;
    
    if (category === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
    } else {
        // Convert to base unit then to target unit
        const toBase = value / unitConversions[category][fromUnit];
        result = toBase * unitConversions[category][toUnit];
    }
    
    const fromLabel = translations[currentLang][fromUnit] || fromUnit;
    const toLabel = translations[currentLang][toUnit] || toUnit;
    
    const html = `
        <div class="result-group">
            <div class="result-label">${translations[currentLang].result || 'Result'}:</div>
            <div class="result-value">${value} ${fromLabel} = <span class="highlight">${result.toFixed(6)}</span> ${toLabel}</div>
        </div>`;
    
    resultDiv.innerHTML = html;
    addToHistory(`${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`);
    document.getElementById('exportUnitConverterPdf').style.display = 'inline-block';
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Basic calculator
        factorial,
        // Complex number operations
        complexAdd,
        complexSub,
        complexMul,
        complexDiv,
        complexScale,
        complexPow,
        complexSqrt,
        complexAbs,
        complexConjugate,
        complexFromReal,
        formatComplex,
        isEssentiallyReal,
        isEssentiallyZero,
        evalPoly,
        findPolynomialRoots,
        // Complex equation solvers
        solveQuadraticComplex,
        solveCubicComplex,
        findPolynomialRootsComplex,
        separateRoots,
        // Inequality solvers
        solveLinearInequality,
        solveQuadraticInequality,
        flipOperator,
        evaluateComparison,
        formatOperator,
        // Matrix operations
        addMatrices,
        multiplyMatrices,
        calculateDeterminant,
        invertMatrix,
        // LaTeX parser
        parseLatexEquation,
        // Expression evaluator
        evaluateExpression,
        // Animation settings
        animationEnabled,
        animationSpeed,
        // GCD/LCM functions
        gcd,
        lcm,
        gcdMultiple,
        lcmMultiple,
        primeFactorization,
        formatFactorization,
        // Modular arithmetic
        modulo,
        modularInverse,
        modularPower,
        // Combinatorics
        factorialBig,
        permutation,
        combination,
        // Fractions
        simplifyFractionFunc,
        fractionToMixed,
        // Base converter
        convertBase,
        // Unit converter
        convertTemperature,
        unitConversions,
        // Statistics
        calculateMean,
        calculateMedian,
        calculateMode,
        calculateVariance,
        calculateStdDev,
        // Sequences
        generateArithmeticSequence,
        generateGeometricSequence,
        generateFibonacciSequence,
        // Limits
        evaluateLimitFunction,
        // Taylor series
        taylorSin,
        taylorCos,
        taylorExp,
        taylorLn,
        taylorAtan,
        // Integration
        trapezoidalRule,
        simpsonsRule
    };
}
