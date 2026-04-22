// ===================================
// CALCULATOR (STANDARD AND SCIENTIFIC)
// ===================================

// factorial function is available globally from math/combinatorics.js

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

// Scientific calculator state
let sciState = {
    display: '0',
    operation: null,
    previousValue: null,
    waitingForOperand: false,
    lastAnswer: 0,
    history: []
};

// Standard calculator functions
function handleValue(value) {
    recordStandardMutation();
    if (state.waitingForOperand) {
        state.display = value;
        state.waitingForOperand = false;
    } else {
        state.display = state.display === '0' ? value : state.display + value;
    }
    updateDisplay();
}

function handleOperator(op) {
    recordStandardMutation();
    const currentValue = parseFloat(state.display);
    
    if (state.operation && !state.waitingForOperand) {
        const calcResult = calculate(false);
        if (calcResult && typeof calcResult.result === 'number') {
            state.previousValue = calcResult.result;
        } else {
            state.previousValue = parseFloat(state.display);
        }
    } else {
        state.previousValue = currentValue;
    }
    
    state.operation = op;
    state.waitingForOperand = true;
}

function calculate(shouldRecord = true) {
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
        default: return;
    }
    
    const expression = `${prev} ${state.operation} ${current}`;
    
    state.display = String(result);
    state.operation = null;
    state.previousValue = null;
    state.waitingForOperand = true;
    updateDisplay();
    
    return { expression, result };
}

function handlePercent() {
    recordStandardMutation();
    const current = parseFloat(state.display);
    state.display = String(current / 100);
    updateDisplay();
}

function handlePower() {
    recordStandardMutation();
    const current = parseFloat(state.display);
    state.display = String(current * current);
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

function deleteLastDigit() {
    recordStandardMutation();
    state.display = state.display.slice(0, -1) || '0';
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
    
    sciState.display = String(result);
    sciState.operation = null;
    sciState.previousValue = null;
    sciState.waitingForOperand = true;
    sciState.lastAnswer = result;
    updateSciDisplay();
    
    return { expression, result };
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
                return null;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) throw new Error('Domain error');
                result = factorial(current);
                expression = `${current}!`;
                break;
            case 'pi':
                sciState.display = String(Math.PI);
                sciState.waitingForOperand = false;
                updateSciDisplay();
                return null;
            case 'e':
                sciState.display = String(Math.E);
                sciState.waitingForOperand = false;
                updateSciDisplay();
                return null;
            default:
                return null;
        }
        
        sciState.display = String(result);
        sciState.waitingForOperand = true;
        sciState.lastAnswer = result;
        updateSciDisplay();
        
        return { expression, result };
    } catch (error) {
        sciState.display = 'Error';
        updateSciDisplay();
        return null;
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
        factorial,
        handleAnswer,
        clearScientific,
        deleteSciLastDigit,
        updateSciDisplay,
        addToSciHistory,
        getState,
        getSciState,
        resetState,
        undoCalculator,
        redoCalculator
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
    window.handleSciValue = handleSciValue;
    window.handleSciOperator = handleSciOperator;
    window.calculateScientific = calculateScientific;
    window.handleScientificFunction = handleScientificFunction;
    window.factorial = factorial;
    window.clearScientific = clearScientific;
    window.updateSciDisplay = updateSciDisplay;
}

