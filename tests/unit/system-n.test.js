const { solveLinearSystem, formatSystemNumber } = require('../../src/js/math/linear-system.js');
const { parseDecimal, escapeHtml } = require('../../src/js/ui/inputs.js');

Object.assign(window, { solveLinearSystem, formatSystemNumber, parseDecimal, escapeHtml });
window.showExportButton = jest.fn();
window.addToHistory = jest.fn();
window.currentLang = 'en';

const { buildSystemNGrid, readSystemN, renderSystemNSolution, setupSystemN, systemSubscript } = require('../../src/js/ui/system-n.js');

describe('system grid', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="systemNGrid"></div>';
    });

    test('builds n x (n + 1) inputs with an identity default', () => {
        buildSystemNGrid(3);
        expect(document.querySelectorAll('#systemNGrid input')).toHaveLength(12);
        expect(document.getElementById('sysN_0_0').value).toBe('1');
        expect(document.getElementById('sysN_0_1').value).toBe('0');
        expect(document.getElementById('sysN_2_3').classList.contains('constant-cell')).toBe(true);
        expect(document.getElementById('systemNGrid').style.getPropertyValue('--columns')).toBe('4');
    });

    test('rebuilding resizes the grid', () => {
        buildSystemNGrid(5);
        expect(document.querySelectorAll('#systemNGrid input')).toHaveLength(30);
        buildSystemNGrid(2);
        expect(document.querySelectorAll('#systemNGrid input')).toHaveLength(6);
    });

    test('reads values, treating blanks as zero and accepting decimal commas', () => {
        buildSystemNGrid(2);
        document.getElementById('sysN_0_0').value = '2,5';
        document.getElementById('sysN_0_1').value = '';
        document.getElementById('sysN_0_2').value = '5';
        document.getElementById('sysN_1_0').value = '0';
        document.getElementById('sysN_1_1').value = '4';
        document.getElementById('sysN_1_2').value = '8';
        expect(readSystemN(2)).toEqual({ A: [[2.5, 0], [0, 4]], b: [5, 8] });
    });

    test('reports invalid cells', () => {
        buildSystemNGrid(2);
        document.getElementById('sysN_1_1').value = 'abc';
        expect(readSystemN(2)).toBeNull();
    });
});

describe('renderSystemNSolution', () => {
    test('lists the unique solution and folds the steps', () => {
        const html = renderSystemNSolution(solveLinearSystem([[1, 1], [1, -1]], [3, 1]), { solution: 'Solution' });
        expect(html).toContain('x\u2081 = <span class="highlight">2</span>');
        expect(html).toContain('x\u2082 = <span class="highlight">1</span>');
        expect(html).toContain('<details class="gauss-steps">');
        expect(html).toContain('<table class="gauss-matrix">');
    });

    test('explains singular systems', () => {
        const infinite = renderSystemNSolution(solveLinearSystem([[1, 2], [2, 4]], [3, 6]), { infiniteSolutions: 'Infinite' });
        expect(infinite).toContain('Infinite');
        expect(infinite).toContain('rank = 1');
        const none = renderSystemNSolution(solveLinearSystem([[1, 2], [2, 4]], [3, 7]), { noSolution: 'None' });
        expect(none).toContain('None');
    });

    test('invalid results show the input error', () => {
        expect(renderSystemNSolution({ status: 'invalid', steps: [] }, { invalidInput: 'Bad input' })).toContain('Bad input');
    });

    test('subscripts', () => {
        expect(systemSubscript(1)).toBe('\u2081');
        expect(systemSubscript(12)).toBe('\u2081\u2082');
    });
});

describe('setupSystemN', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <select id="systemNSize"><option value="2">2</option><option value="3" selected>3</option></select>
            <div id="systemNGrid"></div>
            <button id="solveSystemN"></button>
            <div id="systemNSolution"></div>`;
        window.addToHistory.mockClear();
        window.showExportButton.mockClear();
        setupSystemN();
    });

    test('solving renders the answer, shows export and writes history', () => {
        const size = document.getElementById('systemNSize');
        size.value = '2';
        size.dispatchEvent(new Event('change'));
        document.getElementById('sysN_0_0').value = '2';
        document.getElementById('sysN_0_1').value = '1';
        document.getElementById('sysN_0_2').value = '5';
        document.getElementById('sysN_1_0').value = '1';
        document.getElementById('sysN_1_1').value = '3';
        document.getElementById('sysN_1_2').value = '10';
        document.getElementById('solveSystemN').click();
        const text = document.getElementById('systemNSolution').textContent;
        expect(text).toContain('x\u2081 = 1');
        expect(text).toContain('x\u2082 = 3');
        expect(window.showExportButton).toHaveBeenCalledWith('systemN');
        expect(window.addToHistory).toHaveBeenCalledWith('2\u00d72 system: x1 = 1, x2 = 3');
    });

    test('invalid input shows an error and does not touch history', () => {
        document.getElementById('sysN_0_0').value = 'oops';
        document.getElementById('solveSystemN').click();
        expect(document.getElementById('systemNSolution').textContent).toMatch(/invalid/i);
        expect(window.addToHistory).not.toHaveBeenCalled();
    });
});
