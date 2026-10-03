const expression = require('../../src/js/parsers/expression.js');
window.compileExpression = expression.compileExpression;
window.addToHistory = jest.fn();
window.currentLang = 'en';

const { evaluateCalculatorExpression, formatExpressionResult, setupExpressionCalculator } = require('../../src/js/ui/expression-calc.js');

describe('evaluateCalculatorExpression', () => {
    const value = (text, ans) => evaluateCalculatorExpression(text, ans).value;

    test('follows operator precedence and brackets', () => {
        expect(value('2 + 3 * 4')).toBe(14);
        expect(value('(2 + 3) * 4')).toBe(20);
        expect(value('2 + 3 * (4 - 1)^2')).toBe(29);
    });

    test('unary minus and powers', () => {
        expect(value('-2^2')).toBe(-4);
        expect(value('2^-1')).toBe(0.5);
        expect(value('2^3^2')).toBe(512);
    });

    test('functions and constants', () => {
        expect(value('sqrt(16) + abs(-3)')).toBe(7);
        expect(value('2 * pi')).toBeCloseTo(2 * Math.PI, 12);
        expect(value('ln(e)')).toBeCloseTo(1, 12);
        expect(value('log10(1000)')).toBeCloseTo(3, 12);
    });

    test('implicit multiplication', () => {
        expect(value('2(3 + 4)')).toBe(14);
        expect(value('3pi')).toBeCloseTo(3 * Math.PI, 12);
    });

    test('factorials in function and postfix form', () => {
        expect(value('fact(5)')).toBe(120);
        expect(value('5!')).toBe(120);
        expect(value('(2 + 3)!')).toBe(120);
        expect(value('5! / 3!')).toBe(20);
        expect(evaluateCalculatorExpression('fact(171)').ok).toBe(false);
        expect(evaluateCalculatorExpression('fact(2.5)').ok).toBe(false);
    });

    test('ans carries the previous result', () => {
        expect(value('ans * 2', 21)).toBe(42);
        expect(value('ans', 7)).toBe(7);
    });

    test('rounds floating point noise', () => {
        expect(evaluateCalculatorExpression('0.1 + 0.2').display).toBe('0.3');
        expect(evaluateCalculatorExpression('1/3').display).toBe('0.333333333333');
    });

    test('classifies failures', () => {
        expect(evaluateCalculatorExpression('')).toEqual({ ok: false, error: 'empty' });
        expect(evaluateCalculatorExpression('   ')).toEqual({ ok: false, error: 'empty' });
        expect(evaluateCalculatorExpression('2 +')).toEqual({ ok: false, error: 'syntax' });
        expect(evaluateCalculatorExpression('foo(2)')).toEqual({ ok: false, error: 'syntax' });
        expect(evaluateCalculatorExpression('1/0')).toEqual({ ok: false, error: 'math' });
        expect(evaluateCalculatorExpression('sqrt(-1)')).toEqual({ ok: false, error: 'math' });
    });

    test('never executes code', () => {
        expect(evaluateCalculatorExpression('alert(1)').ok).toBe(false);
        expect(evaluateCalculatorExpression('constructor.constructor("1")()').ok).toBe(false);
    });
});

describe('formatExpressionResult', () => {
    test('uses exponent form for very large and very small values', () => {
        expect(formatExpressionResult(1.5e20)).toBe('1.5e20');
        expect(formatExpressionResult(2e-12)).toBe('2e-12');
        expect(formatExpressionResult(0)).toBe('0');
        expect(formatExpressionResult(-1234.5)).toBe('-1234.5');
    });
});

describe('expression calculator panel', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="exprInput"><button id="exprCalculate"></button><button id="exprClear"></button>
            <button class="expr-key" data-insert="sqrt(">sqrt</button>
            <output id="exprResult"></output><ul id="exprHistory"></ul>`;
        window.addToHistory.mockClear();
        setupExpressionCalculator();
    });

    const type = text => { document.getElementById('exprInput').value = text; };
    const press = () => document.getElementById('exprInput').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }));

    test('Enter shows the result, writes history and keeps ans', () => {
        type('6 * 7');
        press();
        expect(document.getElementById('exprResult').textContent).toBe('42');
        expect(window.addToHistory).toHaveBeenCalledWith('6 * 7 = 42');
        type('ans + 8');
        press();
        expect(document.getElementById('exprResult').textContent).toBe('50');
        expect(document.querySelectorAll('#exprHistory li')).toHaveLength(2);
    });

    test('errors are shown without touching ans or history', () => {
        type('2 +');
        press();
        const out = document.getElementById('exprResult');
        expect(out.classList.contains('error')).toBe(true);
        expect(out.textContent).toBe('Invalid expression');
        expect(window.addToHistory).not.toHaveBeenCalled();
    });

    test('clicking a history entry reloads its expression', () => {
        type('1 + 1');
        press();
        type('');
        document.querySelector('.expr-entry').click();
        expect(document.getElementById('exprInput').value).toBe('1 + 1');
    });

    test('insert keys write at the caret', () => {
        type('2*');
        const input = document.getElementById('exprInput');
        input.setSelectionRange(2, 2);
        document.querySelector('.expr-key').click();
        expect(input.value).toBe('2*sqrt(');
    });

    test('clear empties input and result', () => {
        type('3');
        press();
        document.getElementById('exprClear').click();
        expect(document.getElementById('exprInput').value).toBe('');
        expect(document.getElementById('exprResult').textContent).toBe('');
    });

    test('history keeps at most eight entries', () => {
        for (let i = 1; i <= 12; i++) {
            type(String(i));
            press();
        }
        expect(document.querySelectorAll('#exprHistory li')).toHaveLength(8);
    });
});
