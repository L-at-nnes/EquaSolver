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

describe('History favorites', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.innerHTML = '<div id="historyList"></div>';
    });

    const idOf = text => history.getHistory().find(item => item.entry === text).id;

    test('pinning moves an entry to the top and marks it', () => {
        history.addToHistory('first');
        history.addToHistory('second');
        expect(history.togglePin(idOf('first'))).toBe(true);
        const rendered = [...document.querySelectorAll('.history-entry')].map(el => el.textContent);
        expect(rendered).toEqual(['first', 'second']);
        expect(document.querySelector('.history-item.pinned .history-entry').textContent).toBe('first');
        expect(document.querySelector('.history-pin[aria-pressed="true"]')).not.toBeNull();
    });

    test('unpinning restores the normal order', () => {
        history.addToHistory('first');
        history.addToHistory('second');
        const id = idOf('first');
        history.togglePin(id);
        history.togglePin(id);
        expect([...document.querySelectorAll('.history-entry')].map(el => el.textContent)).toEqual(['second', 'first']);
    });

    test('favorites survive clearing and the 50 entry limit', () => {
        history.addToHistory('keep me');
        history.togglePin(idOf('keep me'));
        for (let i = 0; i < 60; i++) history.addToHistory(`entry ${i}`);
        const stored = history.getHistory();
        expect(stored.filter(item => !item.pinned)).toHaveLength(50);
        expect(stored.some(item => item.entry === 'keep me')).toBe(true);
        history.clearHistory();
        expect(history.getHistory().map(item => item.entry)).toEqual(['keep me']);
    });

    test('the delegated click handler toggles the pin', () => {
        history.addToHistory('clickable');
        history.setupHistoryPinning();
        history.setupHistoryPinning();
        document.querySelector('.history-pin').click();
        expect(history.getHistory()[0].pinned).toBe(true);
        document.querySelector('.history-pin').click();
        expect(history.getHistory()[0].pinned).toBe(false);
    });

    test('unknown ids are ignored and old entries without ids still work', () => {
        expect(history.togglePin('nope')).toBe(false);
        localStorage.setItem('equasolver_history', JSON.stringify([{ entry: 'old', timestamp: 'then' }]));
        const [item] = history.getHistory();
        expect(item.id).toBeTruthy();
        expect(history.togglePin(item.id)).toBe(true);
        expect(history.getHistory()[0].pinned).toBe(true);
    });
});
