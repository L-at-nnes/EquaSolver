/**
 * Tests for history management (src/js/ui/history.js)
 */

window.escapeHtml = require('../../src/js/ui/inputs.js').escapeHtml;
const history = require('../../src/js/ui/history.js');

describe('History', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '<div id="historyList"></div>';
    });

    test('stores entries newest first and caps the list at 50', () => {
        for (let i = 0; i < 55; i++) history.addToHistory(`entry ${i}`);
        const stored = history.getHistory();
        expect(stored).toHaveLength(50);
        expect(stored[0].entry).toBe('entry 54');
    });

    test('renders entries as text, never as html', () => {
        history.addToHistory('(<img src=x onerror=alert(1)>) ÷ (x)');
        const list = document.getElementById('historyList');
        expect(list.querySelector('img')).toBeNull();
        expect(list.textContent).toContain('<img src=x onerror=alert(1)>');
    });

    test('survives corrupted storage', () => {
        localStorage.setItem('equasolver_history', '{broken');
        expect(history.getHistory()).toEqual([]);
        expect(() => history.addToHistory('after corruption')).not.toThrow();
        expect(history.getHistory()).toHaveLength(1);
    });

    test('ignores storage content that is not a list', () => {
        localStorage.setItem('equasolver_history', '{"a":1}');
        expect(history.getHistory()).toEqual([]);
    });

    test('keeps working when storage writes fail', () => {
        const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
        expect(() => history.addToHistory('x')).not.toThrow();
        spy.mockRestore();
    });

    test('clearHistory empties the list and shows the placeholder', () => {
        history.addToHistory('x');
        history.clearHistory();
        expect(history.getHistory()).toEqual([]);
        expect(document.getElementById('historyList').textContent).toContain('No history yet');
    });
});
