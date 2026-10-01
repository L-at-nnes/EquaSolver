const { parseToolHash, writeToolHash } = require('../../src/js/ui/router.js');

describe('parseToolHash', () => {
    const tools = ['standard', 'quadratic', 'graph', 'statisticsCalc'];

    test('accepts plain and slash hashes', () => {
        expect(parseToolHash('#quadratic', tools)).toBe('quadratic');
        expect(parseToolHash('#/graph', tools)).toBe('graph');
        expect(parseToolHash('statisticsCalc', tools)).toBe('statisticsCalc');
    });

    test('rejects unknown, empty and malicious values', () => {
        expect(parseToolHash('#nope', tools)).toBeNull();
        expect(parseToolHash('', tools)).toBeNull();
        expect(parseToolHash(undefined, tools)).toBeNull();
        expect(parseToolHash('#<img src=x onerror=alert(1)>', tools)).toBeNull();
        expect(parseToolHash('#constructor', tools)).toBeNull();
    });
});

describe('writeToolHash', () => {
    test('sets and clears the hash without a new history entry', () => {
        const before = window.history.length;
        writeToolHash('cubic');
        expect(window.location.hash).toBe('#cubic');
        writeToolHash(null);
        expect(window.location.hash).toBe('');
        expect(window.history.length).toBe(before);
    });
});
