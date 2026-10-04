const { parseToolHash, parseToolRoute, writeToolHash, collectPanelParams, applyPanelParams, buildShareUrl } = require('../../src/js/ui/router.js');

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

describe('parseToolRoute', () => {
    const tools = ['quadratic', 'systemN', 'graph'];

    test('splits the tool id from its saved inputs', () => {
        expect(parseToolRoute('#quadratic?quadA=1&quadB=-3&quadC=2', tools)).toEqual({
            tool: 'quadratic',
            params: { quadA: '1', quadB: '-3', quadC: '2' }
        });
    });

    test('decodes URL encoding', () => {
        expect(parseToolRoute('#graph?expr=x%5E2%20%2B%201', tools).params).toEqual({ expr: 'x^2 + 1' });
    });

    test('a hash without parameters has none', () => {
        expect(parseToolRoute('#quadratic', tools)).toEqual({ tool: 'quadratic', params: {} });
        expect(parseToolRoute('#quadratic?', tools)).toEqual({ tool: 'quadratic', params: {} });
    });

    test('unknown tools yield no parameters at all', () => {
        expect(parseToolRoute('#nope?a=1', tools)).toEqual({ tool: null, params: {} });
    });

    test('unsafe keys and oversized values are dropped', () => {
        const long = 'x'.repeat(501);
        const { params } = parseToolRoute(`#quadratic?ok=1&bad key=2&x]y=3&1abc=4&big=${long}&__proto__=5`, tools);
        expect(params.ok).toBe('1');
        expect(params.big).toBeUndefined();
        expect(params['bad key']).toBeUndefined();
        expect(params['1abc']).toBeUndefined();
        expect(Object.getPrototypeOf(params)).toBe(Object.prototype);
    });

    test('the number of restored entries is capped', () => {
        const query = Array.from({ length: 100 }, (_, i) => `k${i}=${i}`).join('&');
        expect(Object.keys(parseToolRoute(`#quadratic?${query}`, tools).params)).toHaveLength(60);
    });

    test('parseToolHash still accepts routes with parameters', () => {
        expect(parseToolHash('#cubic?a=1', ['cubic'])).toBe('cubic');
    });
});

describe('collecting and applying panel inputs', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="panel">
                <input id="a" value="1">
                <input id="b" value="">
                <textarea id="t">1 2
3 4</textarea>
                <select id="size"><option value="2">2</option><option value="3" selected>3</option></select>
                <input type="checkbox" id="grid" checked>
                <input type="password" id="secret" value="nope">
                <input id="private" value="skip me" data-no-share>
                <button id="go" class="btn-solve">go</button>
            </div>`;
    });

    test('collects non empty values, checkboxes, and skips secrets', () => {
        expect(collectPanelParams(document.getElementById('panel'))).toEqual({
            a: '1', t: '1 2\n3 4', size: '3', grid: '1'
        });
    });

    test('applies values, firing events so dependent UI can react', () => {
        const events = [];
        document.getElementById('size').addEventListener('change', () => events.push('size'));
        document.getElementById('a').addEventListener('input', () => events.push('a'));
        const count = applyPanelParams(document.getElementById('panel'), { a: '9', size: '2', grid: '0', t: 'z' });
        expect(count).toBe(4);
        expect(document.getElementById('a').value).toBe('9');
        expect(document.getElementById('size').value).toBe('2');
        expect(document.getElementById('grid').checked).toBe(false);
        expect(document.getElementById('t').value).toBe('z');
        expect(events).toEqual(['size', 'a']);
    });

    test('selects are applied before inputs', () => {
        const order = [];
        document.getElementById('size').addEventListener('change', () => order.push('select'));
        document.getElementById('a').addEventListener('input', () => order.push('input'));
        applyPanelParams(document.getElementById('panel'), { a: '5', size: '3' });
        expect(order).toEqual(['select', 'input']);
    });

    test('ignores unknown ids, invalid options and ids outside the panel', () => {
        document.body.insertAdjacentHTML('beforeend', '<input id="outside" value="keep">');
        const count = applyPanelParams(document.getElementById('panel'), { nope: '1', size: '99', outside: 'hacked', 'a"]': 'x' });
        expect(count).toBe(0);
        expect(document.getElementById('outside').value).toBe('keep');
    });
});

describe('buildShareUrl', () => {
    test('puts the tool and its inputs in the hash', () => {
        expect(buildShareUrl('https://x.io/app/index.html', 'quadratic', { quadA: '1', quadB: '-3' }))
            .toBe('https://x.io/app/index.html#quadratic?quadA=1&quadB=-3');
    });

    test('round trips through parseToolRoute, including awkward characters', () => {
        const params = { expr: 'sin(x) + 2^3 & more', note: 'a=b#c' };
        const url = buildShareUrl('https://x.io/', 'graph', params);
        const hash = url.slice(url.indexOf('#'));
        expect(parseToolRoute(hash, ['graph']).params).toEqual(params);
    });

    test('no parameters means no question mark', () => {
        expect(buildShareUrl('https://x.io/', 'graph', {})).toBe('https://x.io/#graph');
    });
});
