const { solutionToText, copyTextToClipboard, setupCopyButtons } = require('../../src/js/ui/clipboard.js');

describe('solutionToText', () => {
    test('puts one block per line and drops markup whitespace', () => {
        document.body.innerHTML = `
            <div id="c">
                <h3>Solution</h3>
                <div class="solution"><p>Two solutions</p><p>x\u2081 = 3.0000</p><p>x\u2082 = 2.0000</p></div>
            </div>`;
        expect(solutionToText(document.getElementById('c'))).toBe('Solution\nTwo solutions\nx\u2081 = 3.0000\nx\u2082 = 2.0000');
    });

    test('does not repeat text of nested blocks', () => {
        document.body.innerHTML = '<div id="c"><div class="result-group"><p>inner</p></div></div>';
        expect(solutionToText(document.getElementById('c'))).toBe('inner');
    });

    test('falls back to the raw text when there are no known blocks', () => {
        document.body.innerHTML = '<div id="c"><span>plain</span> text</div>';
        expect(solutionToText(document.getElementById('c'))).toBe('plain text');
    });
});

describe('copyTextToClipboard', () => {
    afterEach(() => {
        delete navigator.clipboard;
        delete document.execCommand;
    });

    test('uses the async clipboard API when available', async () => {
        const writeText = jest.fn().mockResolvedValue();
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        await expect(copyTextToClipboard('abc')).resolves.toBe(true);
        expect(writeText).toHaveBeenCalledWith('abc');
    });

    test('falls back to execCommand when the API rejects', async () => {
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: jest.fn().mockRejectedValue(new Error('denied')) }, configurable: true });
        document.execCommand = jest.fn(() => true);
        await expect(copyTextToClipboard('abc')).resolves.toBe(true);
        expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    test('reports failure when nothing works', async () => {
        document.execCommand = jest.fn(() => false);
        await expect(copyTextToClipboard('abc')).resolves.toBe(false);
    });
});

describe('setupCopyButtons', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div class="solution-container" id="s"></div>';
        window.currentLang = 'en';
    });

    test('adds one hidden button that appears when the block has content', async () => {
        setupCopyButtons();
        setupCopyButtons();
        const buttons = document.querySelectorAll('.copy-result');
        expect(buttons).toHaveLength(1);
        expect(buttons[0].hidden).toBe(true);

        document.getElementById('s').innerHTML = '<p>x = 2</p>';
        await Promise.resolve();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(buttons[0].hidden).toBe(false);

        document.getElementById('s').innerHTML = '';
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(buttons[0].hidden).toBe(true);
    });

    test('clicking copies the solution text and confirms', async () => {
        const writeText = jest.fn().mockResolvedValue();
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        setupCopyButtons();
        document.getElementById('s').innerHTML = '<p>x = 2</p>';
        const button = document.querySelector('.copy-result');
        button.click();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(writeText).toHaveBeenCalledWith('x = 2');
        expect(button.classList.contains('done')).toBe(true);
        delete navigator.clipboard;
    });
});
