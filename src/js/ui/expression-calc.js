// ===================================
// EXPRESSION CALCULATOR
// ===================================
// Type a whole expression (2 + 3 * (4 - 1)^2, sqrt(2) * pi, fact(5) / ans) and get the
// result. `ans` is the previous result. Uses the safe parser: no eval of any kind.

// compileExpression is available globally from parsers/expression.js

const EXPRESSION_CALC_HISTORY_LIMIT = 8;

/**
 * Evaluate calculator text.
 * @param {string} text
 * @param {number} ans value of the previous result, used for `ans`
 * @returns {{ok:true, value:number, display:string} | {ok:false, error:'empty'|'syntax'|'math'}}
 */
function evaluateCalculatorExpression(text, ans = 0) {
    const source = String(text ?? '').trim();
    if (source === '') return { ok: false, error: 'empty' };

    // "5!" style factorial is rewritten to fact(5) for simple numeric or parenthesised operands
    const withFactorials = source.replace(/(\d+(?:\.\d+)?|\([^()]*\))!/g, 'fact($1)');

    const compiled = compileExpression(withFactorials, 'ans');
    if (!compiled) return { ok: false, error: 'syntax' };

    const value = compiled(ans);
    if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
        return { ok: false, error: 'math' };
    }
    return { ok: true, value, display: formatExpressionResult(value) };
}

/** 12 significant digits, no floating point noise, large and small values in exponent form. */
function formatExpressionResult(value) {
    if (value === 0) return '0';
    const abs = Math.abs(value);
    if (abs >= 1e15 || abs < 1e-9) {
        return value.toExponential(8).replace(/\.?0+e/, 'e').replace('e+', 'e');
    }
    return String(parseFloat(value.toPrecision(12)));
}

function setupExpressionCalculator() {
    const input = document.getElementById('exprInput');
    const output = document.getElementById('exprResult');
    const list = document.getElementById('exprHistory');
    if (!input || !output || !list) return;

    let ans = 0;
    const entries = [];

    const messages = () => (typeof translations !== 'undefined' && translations[window.currentLang]) || {};
    const errorText = code => {
        const t = messages();
        if (code === 'empty') return t.exprEmpty || 'Type an expression';
        if (code === 'syntax') return t.exprSyntax || 'Invalid expression';
        return t.exprMath || 'Result is undefined';
    };

    function renderHistory() {
        list.textContent = '';
        entries.forEach(entry => {
            const item = document.createElement('li');
            const reuse = document.createElement('button');
            reuse.type = 'button';
            reuse.className = 'expr-entry';
            reuse.textContent = `${entry.text} = ${entry.display}`;
            reuse.addEventListener('click', () => {
                input.value = entry.text;
                input.focus();
            });
            item.appendChild(reuse);
            list.appendChild(item);
        });
    }

    function calculate() {
        const result = evaluateCalculatorExpression(input.value, ans);
        output.classList.toggle('error', !result.ok);
        if (!result.ok) {
            output.textContent = errorText(result.error);
            return;
        }
        output.textContent = result.display;
        ans = result.value;
        entries.unshift({ text: input.value.trim(), display: result.display });
        entries.length = Math.min(entries.length, EXPRESSION_CALC_HISTORY_LIMIT);
        renderHistory();
        if (typeof addToHistory === 'function') addToHistory(`${input.value.trim()} = ${result.display}`);
    }

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            calculate();
        }
    });
    document.getElementById('exprCalculate')?.addEventListener('click', calculate);
    document.getElementById('exprClear')?.addEventListener('click', () => {
        input.value = '';
        output.textContent = '';
        output.classList.remove('error');
        input.focus();
    });

    // Quick insert keys: functions get their opening bracket, others are inserted as is
    document.querySelectorAll('.expr-key').forEach(key => {
        key.addEventListener('click', () => {
            const text = key.dataset.insert;
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? input.value.length;
            input.value = input.value.slice(0, start) + text + input.value.slice(end);
            const caret = start + text.length;
            input.setSelectionRange(caret, caret);
            input.focus();
        });
    });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateCalculatorExpression, formatExpressionResult, setupExpressionCalculator };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupExpressionCalculator = setupExpressionCalculator;
}
