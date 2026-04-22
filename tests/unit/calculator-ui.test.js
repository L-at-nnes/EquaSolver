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
