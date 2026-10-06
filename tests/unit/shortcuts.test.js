const { isTypingTarget, setupShortcutsHelp } = require('../../src/js/ui/shortcuts.js');

function buildDom() {
    document.body.innerHTML = `
        <button id="shortcutsBtn"></button>
        <input id="field" type="text">
        <select id="pick"><option>a</option></select>
        <dialog id="shortcutsDialog"><button id="shortcutsClose"></button></dialog>`;
    const dialog = document.getElementById('shortcutsDialog');
    // jsdom has no native modal dialog support
    dialog.showModal = jest.fn(() => { dialog.open = true; });
    dialog.close = jest.fn(() => { dialog.open = false; });
    return dialog;
}

const press = (target, init) => target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));

describe('isTypingTarget', () => {
    test('detects text controls', () => {
        document.body.innerHTML = '<input id="a"><textarea id="b"></textarea><select id="c"></select><div id="d"></div>';
        ['a', 'b', 'c'].forEach(id => expect(isTypingTarget(document.getElementById(id))).toBe(true));
        expect(isTypingTarget(document.getElementById('d'))).toBe(false);
    });

    test('handles missing targets', () => {
        expect(isTypingTarget(null)).toBe(false);
        expect(isTypingTarget({})).toBe(false);
    });
});

describe('setupShortcutsHelp', () => {
    test('? opens the dialog', () => {
        const dialog = buildDom();
        setupShortcutsHelp();
        press(document.body, { key: '?' });
        expect(dialog.showModal).toHaveBeenCalledTimes(1);
        expect(dialog.open).toBe(true);
    });

    test('? is ignored while typing', () => {
        const dialog = buildDom();
        setupShortcutsHelp();
        press(document.getElementById('field'), { key: '?' });
        press(document.getElementById('pick'), { key: '?' });
        expect(dialog.showModal).not.toHaveBeenCalled();
    });

    test('other keys and modified keys are ignored', () => {
        const dialog = buildDom();
        setupShortcutsHelp();
        press(document.body, { key: 'a' });
        press(document.body, { key: '?', ctrlKey: true });
        expect(dialog.showModal).not.toHaveBeenCalled();
    });

    test('does not reopen an open dialog', () => {
        const dialog = buildDom();
        setupShortcutsHelp();
        press(document.body, { key: '?' });
        press(document.body, { key: '?' });
        expect(dialog.showModal).toHaveBeenCalledTimes(1);
    });

    test('button opens and close button closes', () => {
        const dialog = buildDom();
        setupShortcutsHelp();
        document.getElementById('shortcutsBtn').click();
        expect(dialog.open).toBe(true);
        document.getElementById('shortcutsClose').click();
        expect(dialog.open).toBe(false);
    });

    test('clicking the backdrop closes', () => {
        const dialog = buildDom();
        setupShortcutsHelp();
        document.getElementById('shortcutsBtn').click();
        dialog.click();
        expect(dialog.close).toHaveBeenCalled();
    });

    test('does nothing without a dialog', () => {
        document.body.innerHTML = '';
        expect(() => setupShortcutsHelp()).not.toThrow();
    });
});
