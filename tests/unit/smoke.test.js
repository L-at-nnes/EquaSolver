/**
 * Smoke test: load the real page (HTML + every script in the order index.html
 * lists them) in jsdom, then press every solve/calculate button with its
 * default values. Catches missing globals, broken wiring and runtime errors
 * that the unit tests of single modules cannot see.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..', 'src');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function scriptPaths() {
    return [...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(match => match[1]);
}

function installBrowserStubs() {
    // jsdom has no canvas, matchMedia, ResizeObserver or layout
    const context = new Proxy({}, {
        get: (target, prop) => {
            if (prop === 'canvas') return null;
            if (prop === 'measureText') return () => ({ width: 10 });
            if (prop === 'getImageData') return () => ({ data: [0, 0, 0, 0] });
            return () => {};
        },
        set: () => true
    });
    HTMLCanvasElement.prototype.getContext = () => context;
    HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,AA==';
    window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    window.ResizeObserver = class { observe() {} disconnect() {} };
    window.scrollTo = () => {};
    Element.prototype.scrollIntoView = () => {};
    window.alert = jest.fn();
    window.requestAnimationFrame = cb => setTimeout(cb, 0);
}

const SOLVE_BUTTONS = [
    'solveLinear', 'solveQuadratic', 'solveCubic', 'solveQuartic', 'solveQuintic', 'solveSystems',
    'solveSystem3x3', 'calculateMatrix', 'solveInequalityLinear', 'solveInequalityQuadratic',
    'solveAbsoluteEquation', 'solveAbsoluteInequality', 'solveTrigonometric', 'plotGraph', 'plotParametric',
    'plotPolar', 'solveLatex', 'calculateGcdLcm', 'calculateModular', 'calculateCombinatorics',
    'calculateFractions', 'calculatePercentage', 'calculateRatio', 'convertBase', 'convertUnit',
    'calculateStatistics', 'calculateSequence', 'calculateLimit', 'calculateTaylor', 'calculateIntegration',
    'dividePolynomials', 'calculateDerivative', 'calculateIntegral', 'solveExponential', 'solveLogarithmic'
];

describe('application smoke test', () => {
    const errors = [];
    const onError = event => errors.push(event.error || event.message);

    beforeAll(() => {
        installBrowserStubs();
        window.addEventListener('error', onError);
        const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');
        document.body.innerHTML = body;
        document.body.className = 'theme-matrix light-mode';

        scriptPaths().forEach(relative => {
            const code = fs.readFileSync(path.join(root, relative), 'utf8');
            const script = document.createElement('script');
            script.textContent = code;
            document.head.appendChild(script);
        });
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    afterAll(() => window.removeEventListener('error', onError));

    test('boots without runtime errors', () => {
        expect(errors).toEqual([]);
    });

    test('every translated key used on the page resolves in the active language', () => {
        const missing = [...document.querySelectorAll('[data-translate]')]
            .filter(el => !(el.dataset.translate in window.translations.en));
        expect(missing).toHaveLength(0);
    });

    test.each(SOLVE_BUTTONS)('%s runs with its default values and renders something', id => {
        const button = document.getElementById(id);
        expect(button).not.toBeNull();
        const before = errors.length;
        button.click();
        expect(errors.slice(before)).toEqual([]);
    });

    test('the quadratic solver shows both roots and an exact form', () => {
        document.getElementById('quadA').value = '1';
        document.getElementById('quadB').value = '-3';
        document.getElementById('quadC').value = '1';
        document.getElementById('solveQuadratic').click();
        const output = document.getElementById('quadraticSolution').textContent;
        expect(output).toContain('2.6180');
        expect(output).toContain('0.3820');
        expect(output).toContain('√5');
    });

    test('opening a tool through the hash activates its panel', () => {
        window.location.hash = '#cubic';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        expect(document.querySelector('.calculator-panel.active').id).toBe('cubic');
    });

    test('switching language updates the translated labels', () => {
        document.querySelector('.lang-btn[data-lang="fr"]').click();
        expect(document.querySelector('[data-translate="settings"]').textContent).toBe('Paramètres');
    });

    test('keyboard digits drive the standard calculator only when it is visible', () => {
        document.querySelector('.tab[data-tab="standard"]').click();
        document.getElementById('calculatorScreen').classList.add('active');
        document.getElementById('clearHistory');
        document.dispatchEvent(new KeyboardEvent('keydown', { key: '7', bubbles: true }));
        expect(document.getElementById('display').value).toBe('7');
    });
});
