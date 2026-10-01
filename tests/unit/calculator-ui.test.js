const calculator = require('../../src/js/ui/calculator.js');

describe('UI Calculator Core Logic', () => {
    beforeEach(() => {
        calculator.resetState();
        if (typeof calculator.clearScientific === 'function') {
            calculator.clearScientific();
        }
    });

    describe('Standard state machine', () => {
        test('handleValue appends digits', () => {
            calculator.handleValue('1');
            calculator.handleValue('2');
            expect(calculator.getState().display).toBe('12');
        });

        test('handleOperator + calculate performs addition', () => {
            calculator.handleValue('8');
            calculator.handleOperator('+');
            calculator.handleValue('5');
            const result = calculator.calculate();

            expect(result).toEqual({ expression: '8 + 5', result: 13 });
            expect(calculator.getState().display).toBe('13');
            expect(calculator.getState().operation).toBeNull();
        });

        test('division by zero yields Error', () => {
            calculator.handleValue('9');
            calculator.handleOperator('÷');
            calculator.handleValue('0');
            const result = calculator.calculate();

            expect(result.result).toBe('Error');
            expect(calculator.getState().display).toBe('Error');
        });

        test('clearCalculator resets state', () => {
            calculator.handleValue('7');
            calculator.handleOperator('*');
            calculator.handleValue('3');
            calculator.clearCalculator();

            expect(calculator.getState()).toEqual({
                display: '0',
                operation: null,
                previousValue: null,
                waitingForOperand: false
            });
        });

        test('undo restores previous display state', () => {
            calculator.handleValue('1');
            calculator.handleValue('2');
            expect(calculator.getState().display).toBe('12');

            const didUndo = calculator.undoCalculator();
            expect(didUndo).toBe(true);
            expect(calculator.getState().display).toBe('1');
        });

        test('redo reapplies undone state', () => {
            calculator.handleValue('4');
            calculator.handleValue('5');

            calculator.undoCalculator();
            expect(calculator.getState().display).toBe('4');

            const didRedo = calculator.redoCalculator();
            expect(didRedo).toBe(true);
            expect(calculator.getState().display).toBe('45');
        });

        test('deleteLastDigit removes one char', () => {
            calculator.handleValue('1');
            calculator.handleValue('2');
            calculator.handleValue('3');
            calculator.deleteLastDigit();
            expect(calculator.getState().display).toBe('12');
        });
    });

    describe('Scientific functions', () => {
        test('sin(0) = 0', () => {
            calculator.clearScientific();
            calculator.handleSciValue('0');
            const out = calculator.handleScientificFunction('sin');
            expect(out.expression).toBe('sin(0)');
            expect(out.result).toBeCloseTo(0, 10);
        });

        test('sqrt(9) = 3', () => {
            calculator.clearScientific();
            calculator.handleSciValue('9');
            const out = calculator.handleScientificFunction('sqrt');
            expect(out.result).toBe(3);
        });

        test('ln of non-positive gives Error state', () => {
            calculator.clearScientific();
            calculator.handleSciValue('0');
            const out = calculator.handleScientificFunction('ln');
            expect(out).toBeNull();
            expect(calculator.getSciState().display).toBe('Error');
        });
    });
});

describe('Calculator - regressions', () => {
    beforeEach(() => {
        calculator.resetState();
        calculator.clearScientific();
    });

    const press = (...keys) => keys.forEach(k => {
        if (/^[0-9.]$/.test(k)) calculator.handleValue(k);
        else if (k === '=') calculator.calculate();
        else calculator.handleOperator(k);
    });
    const sciPress = (...keys) => keys.forEach(k => {
        if (/^[0-9.]$/.test(k)) calculator.handleSciValue(k);
        else if (k === '=') calculator.calculateScientific();
        else calculator.handleSciOperator(k);
    });

    test('decimal point starts a number with 0. and is accepted only once', () => {
        press('.', '5');
        expect(calculator.getState().display).toBe('0.5');
        press('.', '2', '.', '1');
        expect(calculator.getState().display).toBe('0.521');
    });

    test('decimal point after an operator starts a new 0.x operand', () => {
        press('3', '+', '.', '5', '=');
        expect(calculator.getState().display).toBe('3.5');
    });

    test('floating point noise is removed from results', () => {
        press('0', '.', '1', '+', '0', '.', '2', '=');
        expect(calculator.getState().display).toBe('0.3');
    });

    test('equals without a pending operation does not pollute the undo stack', () => {
        press('5');
        expect(calculator.undoCalculator()).toBe(true);
        expect(calculator.getState().display).toBe('0');
        press('5');
        calculator.calculate();
        expect(calculator.undoCalculator()).toBe(true);
        expect(calculator.getState().display).toBe('0');
        expect(calculator.undoCalculator()).toBe(false);
    });

    test('chained operators keep the running result (standard)', () => {
        press('2', '+', '3', '*', '4', '=');
        expect(calculator.getState().display).toBe('20');
    });

    test('chained operators keep the running result (scientific)', () => {
        sciPress('2', '+', '3', '*', '4', '=');
        expect(calculator.getSciState().display).toBe('20');
    });

    test('an operator after Error is ignored instead of producing NaN', () => {
        press('9', '/', '0', '=');
        expect(calculator.getState().display).toBe('Error');
        press('+', '5', '=');
        expect(calculator.getState().display).toBe('5');
    });

    test('dividing by zero while chaining leaves a clean Error state', () => {
        press('9', '/', '0', '+');
        expect(calculator.getState().display).toBe('Error');
        expect(calculator.getState().operation).toBeNull();
    });

    test('backspace never leaves a lone minus sign or edits a result', () => {
        press('5', '-', '8', '=');
        expect(calculator.getState().display).toBe('-3');
        calculator.deleteLastDigit();
        expect(calculator.getState().display).toBe('-3');
        calculator.clearCalculator();
        press('7');
        calculator.deleteLastDigit();
        expect(calculator.getState().display).toBe('0');
    });

    test('power key on the main calculator can be evaluated with equals', () => {
        press('2');
        calculator.handleScientificFunction('power', 'main');
        press('5', '=');
        expect(calculator.getState().display).toBe('32');
    });

    test('overflowing scientific results show Error', () => {
        press('1', '0', '0', '0');
        calculator.handleScientificFunction('exp', 'main');
        expect(calculator.getState().display).toBe('Error');
    });

    test('trig results are rounded to remove noise', () => {
        calculator.handleSciValue('1');
        calculator.handleScientificFunction('pi');
        calculator.handleScientificFunction('sin');
        expect(calculator.getSciState().display).toBe('0');
    });
});

describe('Undo / redo keyboard shortcuts', () => {
    beforeEach(() => calculator.resetState());

    const key = (k, extra = {}) => ({ key: k, ctrlKey: true, preventDefault: jest.fn(), ...extra });

    test('Ctrl+Z undoes and Ctrl+Y redoes', () => {
        calculator.handleValue('7');
        calculator.handleValue('8');
        const undo = key('z');
        expect(calculator.handleUndoRedoKey(undo)).toBe(true);
        expect(undo.preventDefault).toHaveBeenCalled();
        expect(calculator.getState().display).toBe('7');
        expect(calculator.handleUndoRedoKey(key('y'))).toBe(true);
        expect(calculator.getState().display).toBe('78');
    });

    test('Ctrl+Shift+Z redoes and Cmd works like Ctrl', () => {
        calculator.handleValue('5');
        calculator.handleUndoRedoKey({ key: 'Z', metaKey: true, preventDefault() {} });
        expect(calculator.getState().display).toBe('0');
        calculator.handleUndoRedoKey(key('Z', { shiftKey: true }));
        expect(calculator.getState().display).toBe('5');
    });

    test('ignores other shortcuts and plain keys', () => {
        const copy = key('c');
        expect(calculator.handleUndoRedoKey(copy)).toBe(false);
        expect(copy.preventDefault).not.toHaveBeenCalled();
        expect(calculator.handleUndoRedoKey({ key: 'z' })).toBe(false);
        expect(calculator.handleUndoRedoKey(key('z', { altKey: true }))).toBe(false);
    });
});
