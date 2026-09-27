const { parseDecimal, readNumberInput, escapeHtml } = require('../../src/js/ui/inputs.js');

describe('parseDecimal', () => {
    test('parses plain numbers', () => {
        expect(parseDecimal('12')).toBe(12);
        expect(parseDecimal('-3.5')).toBe(-3.5);
        expect(parseDecimal(' 7 ')).toBe(7);
        expect(parseDecimal('.5')).toBe(0.5);
        expect(parseDecimal('1e3')).toBe(1000);
    });

    test('accepts a decimal comma and the unicode minus', () => {
        expect(parseDecimal('1,5')).toBe(1.5);
        expect(parseDecimal('−2,25')).toBe(-2.25);
    });

    test('rejects text that is not entirely a number', () => {
        expect(parseDecimal('5abc')).toBeNaN();
        expect(parseDecimal('')).toBeNaN();
        expect(parseDecimal('1/2')).toBeNaN();
        expect(parseDecimal('1.2.3')).toBeNaN();
        expect(parseDecimal(null)).toBeNaN();
    });

    test('passes numbers through', () => {
        expect(parseDecimal(0)).toBe(0);
        expect(parseDecimal(-10)).toBe(-10);
    });
});

describe('readNumberInput', () => {
    beforeEach(() => {
        document.body.innerHTML = '<input id="a" value="0"><input id="b" value=""><input id="c" value="x">';
    });

    test('keeps a typed zero instead of replacing it with the fallback', () => {
        expect(readNumberInput('a', 5)).toBe(0);
    });

    test('uses the fallback for blank or missing fields', () => {
        expect(readNumberInput('b', 5)).toBe(5);
        expect(readNumberInput('missing', 7)).toBe(7);
    });

    test('returns NaN for invalid text', () => {
        expect(readNumberInput('c', 5)).toBeNaN();
    });
});

describe('escapeHtml', () => {
    test('escapes markup characters', () => {
        expect(escapeHtml('<img src=x onerror="a()">&\'')).toBe('&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;&#39;');
    });

    test('leaves plain math untouched and accepts numbers', () => {
        expect(escapeHtml('x^2 + 3x - 1')).toBe('x^2 + 3x - 1');
        expect(escapeHtml(42)).toBe('42');
    });
});

describe('escapeHtml', () => {
    test('escapes markup characters', () => {
        expect(escapeHtml('<img src=x onerror="a()">&\'')).toBe('&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;&#39;');
    });

    test('leaves plain math untouched and accepts numbers', () => {
        expect(escapeHtml('x^2 + 3x - 1')).toBe('x^2 + 3x - 1');
        expect(escapeHtml(42)).toBe('42');
    });
});
