// ===================================
// CALCULATOR (STANDARD AND SCIENTIFIC)
// ===================================

// Note: sciFactorial (below) is local to the scientific display's n! button.
// The general-purpose factorial() used by the Combinatorics tool lives in math/combinatorics.js.

const MAX_HISTORY = 100;

// Standard calculator state
let state = {
    display: '0',
    operation: null,
    previousValue: null,
    waitingForOperand: false
};

let undoStack = [];
let redoStack = [];

function cloneStandardState() {
    return {
        display: state.display,
        operation: state.operation,
        previousValue: state.previousValue,
        waitingForOperand: state.waitingForOperand
    };
}

function applyStandardState(snapshot) {
    state.display = snapshot.display;
    state.operation = snapshot.operation;
    state.previousValue = snapshot.previousValue;
    state.waitingForOperand = snapshot.waitingForOperand;
    updateDisplay();
}

function pushUndoSnapshot() {
    undoStack.push(cloneStandardState());
    if (undoStack.length > MAX_HISTORY) {
        undoStack.shift();
    }
}

function recordStandardMutation() {
    pushUndoSnapshot();
    redoStack = [];
}

function undoCalculator() {
    if (undoStack.length === 0) return false;
    const previous = undoStack.pop();
    redoStack.push(cloneStandardState());
    applyStandardState(previous);
    return true;
}

function redoCalculator() {
    if (redoStack.length === 0) return false;
    const next = redoStack.pop();
    undoStack.push(cloneStandardState());
    applyStandardState(next);
    return true;
}

/**
 * Ctrl/Cmd+Z undoes, Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z redoes.
 * @param {{key:string, ctrlKey?:boolean, metaKey?:boolean, shiftKey?:boolean, altKey?:boolean, preventDefault?:Function}} event
 * @returns {boolean} true when the event was an undo/redo shortcut and was handled
 */
function handleUndoRedoKey(event) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return false;
    const key = String(event.key).toLowerCase();
    const isUndo = key === 'z' && !event.shiftKey;
    const isRedo = key === 'y' || (key === 'z' && event.shiftKey);
    if (!isUndo && !isRedo) return false;

    if (event.preventDefault) event.preventDefault();
    if (isUndo) undoCalculator();
    else redoCalculator();
    return true;
}

// Scientific calculator state
let sciState = {
    display: '0',
    operation: null,
    previousValue: null,
    waitingForOperand: false,
    lastAnswer: 0,
    history: []
};

// Format a computed number for the display (drops floating point noise such
// as 0.1 + 0.2 = 0.30000000000000004). Non-finite results become 'Error'.
function formatCalcNumber(n) {
    if (!Number.isFinite(n)) return 'Error';
    return String(parseFloat(n.toPrecision(12)));
}

function hasValidNumber(st) {
    return st.display !== 'Error' && !Number.isNaN(parseFloat(st.display));
}

// Append a digit or decimal point to a calculator display
function appendToDisplay(st, value) {
    if (st.waitingForOperand || st.display === 'Error') {
        st.display = value === '.' ? '0.' : value;
        st.waitingForOperand = false;
    } else if (value === '.') {
        if (!st.display.includes('.')) st.display += '.';
    } else if (st.display === '0') {
        st.display = value;
    } else if (st.display === '-0') {
        st.display = '-' + value;
    } else {
        st.display += value;
    }
}

// Standard calculator functions
function handleValue(value) {
    const before = cloneStandardState();
    appendToDisplay(state, value);
    if (state.display !== before.display || state.waitingForOperand !== before.waitingForOperand) {
        undoStack.push(before);
        if (undoStack.length > MAX_HISTORY) undoStack.shift();
        redoStack = [];
    }
    updateDisplay();
}

function handleOperator(op) {
    if (!hasValidNumber(state)) return;
    recordStandardMutation();
    const currentValue = parseFloat(state.display);

    if (state.operation && !state.waitingForOperand) {
        const calcResult = calculate(false);
        if (!calcResult || typeof calcResult.result !== 'number') {
            return;
        }
        state.previousValue = calcResult.result;
    } else {
        state.previousValue = currentValue;
    }

    state.operation = op;
    state.waitingForOperand = true;
}

function calculate(shouldRecord = true) {
    if (!state.operation) return;
    if (shouldRecord) recordStandardMutation();
    const prev = state.previousValue;
    const current = parseFloat(state.display);
    let result;

    switch (state.operation) {
        case '+': result = prev + current; break;
        case '-':
        case '−': result = prev - current; break;
        case '*':
        case '×': result = prev * current; break;
        case '/':
        case '÷':
            if (current === 0) {
                state.display = 'Error';
                state.operation = null;
                state.previousValue = null;
                state.waitingForOperand = true;
                updateDisplay();
                return { expression: `${prev} ÷ 0`, result: 'Error' };
            }
            result = prev / current;
            break;
        case '^': result = Math.pow(prev, current); break;
        default: return;
    }

    const expression = `${prev} ${state.operation} ${current}`;

    state.display = formatCalcNumber(result);
    state.operation = null;
    state.previousValue = null;
    state.waitingForOperand = true;
    updateDisplay();

    return { expression, result };
}

function handlePercent() {
    if (!hasValidNumber(state)) return;
    recordStandardMutation();
    const current = parseFloat(state.display);
    state.display = formatCalcNumber(current / 100);
    updateDisplay();
}

function handlePower() {
    if (!hasValidNumber(state)) return;
    recordStandardMutation();
    const current = parseFloat(state.display);
    state.display = formatCalcNumber(current * current);
    state.waitingForOperand = true;
    updateDisplay();
    return { expression: `${current}²`, result: state.display };
}

function clearCalculator() {
    recordStandardMutation();
    state.display = '0';
    state.operation = null;
    state.previousValue = null;
    state.waitingForOperand = false;
    updateDisplay();
}

function backspaceDisplay(display) {
    if (display === 'Error') return '0';
    const next = display.slice(0, -1);
    return next === '' || next === '-' ? '0' : next;
}

function deleteLastDigit() {
    if (state.waitingForOperand && state.display !== 'Error') return;
    recordStandardMutation();
    state.display = backspaceDisplay(state.display);
    updateDisplay();
}

function updateDisplay() {
    const display = document.getElementById('display');
    if (display) {
        display.value = state.display;
    }
}

// Scientific calculator functions
function handleSciValue(value) {
    appendToDisplay(sciState, value);
    updateSciDisplay();
}

function handleSciOperator(op) {
    if (!hasValidNumber(sciState)) return;
    const currentValue = parseFloat(sciState.display);

    if (sciState.operation && !sciState.waitingForOperand) {
        const calcResult = calculateScientific();
        if (!calcResult || typeof calcResult.result !== 'number') {
            return;
        }
        sciState.previousValue = calcResult.result;
    } else {
        sciState.previousValue = currentValue;
    }

    sciState.operation = op;
    sciState.waitingForOperand = true;
}

function calculateScientific() {
    if (!sciState.operation) return;
    const prev = sciState.previousValue;
    const current = parseFloat(sciState.display);
    let result;

    switch (sciState.operation) {
        case '+': result = prev + current; break;
        case '-':
        case '−': result = prev - current; break;
        case '*':
        case '×': result = prev * current; break;
        case '/':
        case '÷':
            if (current === 0) {
                sciState.display = 'Error';
                sciState.operation = null;
                sciState.previousValue = null;
                sciState.waitingForOperand = true;
                updateSciDisplay();
                return { expression: `${prev} ÷ 0`, result: 'Error' };
            }
            result = prev / current;
            break;
        case '^': result = Math.pow(prev, current); break;
        default: return;
    }

    const expression = `${prev} ${sciState.operation} ${current}`;

    sciState.display = formatCalcNumber(result);
    sciState.operation = null;
    sciState.previousValue = null;
    sciState.waitingForOperand = true;
    sciState.lastAnswer = result;
    updateSciDisplay();

    return { expression, result };
}

function handleScientificFunction(func, target = 'sci') {
    const st = target === 'main' ? state : sciState;
    const updateTargetDisplay = target === 'main' ? updateDisplay : updateSciDisplay;
    if (func !== 'pi' && func !== 'e' && !hasValidNumber(st)) return null;
    const current = parseFloat(st.display);
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
                st.previousValue = current;
                st.operation = '^';
                st.waitingForOperand = true;
                return null;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) throw new Error('Domain error');
                result = sciFactorial(current);
                expression = `${current}!`;
                break;
            case 'pi':
                st.display = String(Math.PI);
                st.waitingForOperand = false;
                updateTargetDisplay();
                return null;
            case 'e':
                st.display = String(Math.E);
                st.waitingForOperand = false;
                updateTargetDisplay();
                return null;
            default:
                return null;
        }

        // sin(pi) and cos(pi/2) are 1.2e-16 / 6.1e-17 in floating point: show them as 0
        if (['sin', 'cos', 'tan'].includes(func) && Math.abs(result) < 1e-12) result = 0;
        if (!Number.isFinite(result)) throw new Error('Domain error');
        st.display = formatCalcNumber(result);
        st.waitingForOperand = true;
        if (target === 'sci') st.lastAnswer = result;
        updateTargetDisplay();

        return { expression, result };
    } catch (error) {
        st.display = 'Error';
        updateTargetDisplay();
        return null;
    }
}

function sciFactorial(n) {
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
    if (sciState.waitingForOperand && sciState.display !== 'Error') return;
    sciState.display = backspaceDisplay(sciState.display);
    updateSciDisplay();
}

function updateSciDisplay() {
    const display = document.getElementById('sciDisplay');
    if (display) {
        display.value = sciState.display;
    }
}

function addToSciHistory(entry) {
    sciState.history.unshift(entry);
    if (sciState.history.length > 10) {
        sciState.history.pop();
    }
    
    const historyDiv = document.getElementById('sciHistory');
    if (historyDiv) {
        historyDiv.innerHTML = sciState.history.map(item => 
            `<div class="sci-history-item">${item}</div>`
        ).join('');
    }
}

function getState() {
    return state;
}

function getSciState() {
    return sciState;
}

function resetState() {
    state = {
        display: '0',
        operation: null,
        previousValue: null,
        waitingForOperand: false
    };
    undoStack = [];
    redoStack = [];
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleValue,
        handleOperator,
        calculate,
        handlePercent,
        handlePower,
        clearCalculator,
        deleteLastDigit,
        updateDisplay,
        handleSciValue,
        handleSciOperator,
        calculateScientific,
        handleScientificFunction,
        sciFactorial,
        handleAnswer,
        clearScientific,
        deleteSciLastDigit,
        updateSciDisplay,
        addToSciHistory,
        getState,
        getSciState,
        resetState,
        undoCalculator,
        redoCalculator,
        handleUndoRedoKey
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.handleValue = handleValue;
    window.handleOperator = handleOperator;
    window.calculate = calculate;
    window.handlePercent = handlePercent;
    window.handlePower = handlePower;
    window.clearCalculator = clearCalculator;
    window.deleteLastDigit = deleteLastDigit;
    window.updateDisplay = updateDisplay;
    window.undoCalculator = undoCalculator;
    window.redoCalculator = redoCalculator;
    window.handleUndoRedoKey = handleUndoRedoKey;
    window.handleSciValue = handleSciValue;
    window.handleSciOperator = handleSciOperator;
    window.calculateScientific = calculateScientific;
    window.handleScientificFunction = handleScientificFunction;
    window.sciFactorial = sciFactorial;
    window.clearScientific = clearScientific;
    window.updateSciDisplay = updateSciDisplay;
}

