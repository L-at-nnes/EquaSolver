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
    'solveSystem3x3', 'solveSystemN', 'calculateMatrix', 'solveInequalityLinear', 'solveInequalityQuadratic',
    'solveAbsoluteEquation', 'solveAbsoluteInequality', 'solveTrigonometric', 'plotGraph', 'plotParametric',
    'plotPolar', 'solveLatex', 'calculateGcdLcm', 'calculateModular', 'calculateCombinatorics',
    'calculateFractions', 'calculatePercentage', 'calculateRatio', 'convertBase', 'convertUnit',
    'calculateStatistics', 'calculateRegression', 'calculateSequence', 'calculateLimit', 'calculateTaylor', 'calculateIntegration',
    'dividePolynomials', 'decomposePartialFractions', 'calculateDerivative', 'calculateIntegral', 'solveExponential', 'solveLogarithmic'
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

describe('polynomial division shows the factored form', () => {
    test('x^3 - 6x^2 + 11x - 6 is factored', () => {
        document.getElementById('polyDividend').value = 'x^3 - 6x^2 + 11x - 6';
        document.getElementById('polyDivisor').value = 'x - 1';
        document.getElementById('dividePolynomials').click();
        const text = document.getElementById('polynomialDivisionSolution').textContent;
        expect(text).toContain('(x - 1)(x - 2)(x - 3)');
    });

    test('an irreducible dividend shows no factored line', () => {
        document.getElementById('polyDividend').value = 'x^2 + 1';
        document.getElementById('polyDivisor').value = 'x';
        document.getElementById('dividePolynomials').click();
        expect(document.getElementById('polynomialDivisionSolution').textContent).not.toMatch(/Factored form|Forme factoris/);
    });
});

describe('partial fractions panel', () => {
    test('decomposes the default example', () => {
        document.getElementById('pfNumerator').value = '3x + 5';
        document.getElementById('pfDenominator').value = 'x^2 - x - 6';
        document.getElementById('decomposePartialFractions').click();
        const text = document.getElementById('partialFractionsSolution').textContent;
        expect(text).toContain('14/(5(x - 3))');
        expect(text).toContain('1/(5(x + 2))');
    });

    test('invalid input shows an error', () => {
        document.getElementById('pfNumerator').value = '1';
        document.getElementById('pfDenominator').value = '(x+1)';
        document.getElementById('decomposePartialFractions').click();
        expect(document.getElementById('partialFractionsSolution').querySelector('.error')).not.toBeNull();
    });
});

describe('3D surface panel', () => {
    test('renders without errors and reports the height range', () => {
        document.getElementById('surfaceExpr').value = 'x^2 + y^2';
        document.getElementById('surfaceExpr').dispatchEvent(new Event('input'));
        expect(document.getElementById('surfaceExpr').getAttribute('aria-invalid')).toBeNull();
        expect(document.getElementById('surfaceInfo').textContent).toMatch(/^z ∈ \[/);
    });

    test('an invalid expression is flagged', () => {
        document.getElementById('surfaceExpr').value = 'sin(';
        document.getElementById('surfaceExpr').dispatchEvent(new Event('input'));
        expect(document.getElementById('surfaceExpr').getAttribute('aria-invalid')).toBe('true');
    });

    test('presets fill the expression', () => {
        document.querySelector('.surface-preset[data-expr="x^2 - y^2"]').click();
        expect(document.getElementById('surfaceExpr').value).toBe('x^2 - y^2');
    });
});

describe('expression calculator panel', () => {
    test('evaluates a typed expression through the real page wiring', () => {
        document.getElementById('exprInput').value = '2 + 3 * (4 - 1)^2';
        document.getElementById('exprCalculate').click();
        expect(document.getElementById('exprResult').textContent).toBe('29');
    });
});

describe('statistics panel extras', () => {
    test('shows quartiles, outliers and a histogram', () => {
        document.getElementById('statsInput').value = '1, 2, 3, 4, 5, 100';
        document.getElementById('calculateStatistics').click();
        const box = document.getElementById('statisticsSolution');
        expect(box.textContent).toContain('100');
        expect(box.querySelectorAll('.hist-bar').length).toBeGreaterThan(1);
        expect(box.textContent).toMatch(/Q1|Q3/);
    });
});

describe('regression panel', () => {
    test('fits the default data and predicts', () => {
        document.getElementById('calculateRegression').click();
        const text = document.getElementById('regressionSolution').textContent;
        expect(text).toContain('y = 0.6x + 2.2');
        expect(text).toContain('0.774597');
        document.getElementById('regressionPredictX').value = '10';
        document.getElementById('regressionPredictX').dispatchEvent(new Event('input'));
        expect(document.getElementById('regressionPrediction').textContent).toBe('y(10) = 8.2');
    });

    test('malformed lines are reported by number', () => {
        document.getElementById('regressionInput').value = '1 2\nfoo\n3 4';
        document.getElementById('calculateRegression').click();
        expect(document.getElementById('regressionSolution').querySelector('.error').textContent).toContain('(2)');
    });

    test('not enough points shows a message', () => {
        document.getElementById('regressionInput').value = '1 2';
        document.getElementById('calculateRegression').click();
        expect(document.getElementById('regressionSolution').querySelector('.error')).not.toBeNull();
    });
});

describe('matrix extras', () => {
    test('trace, rank and eigenvalues are listed for a 2x2 matrix', () => {
        document.getElementById('matrixSize').value = '2';
        document.getElementById('matrixSize').dispatchEvent(new Event('change'));
        const values = [['2', '0'], ['0', '3']];
        values.forEach((row, i) => row.forEach((v, j) => { document.getElementById(`matrixA_${i}_${j}`).value = v; }));
        document.getElementById('matrixOperation').value = 'properties';
        document.getElementById('calculateMatrix').click();
        const text = document.getElementById('matrixSolution').textContent;
        expect(text).toContain('5');
        expect(text).toMatch(/2\.0000,\s+3\.0000|3\.0000,\s+2\.0000/);
    });

    test('transpose shows the transposed matrix', () => {
        document.getElementById('matrixOperation').value = 'transpose';
        document.getElementById('calculateMatrix').click();
        expect(document.getElementById('matrixSolution').textContent).toContain('Aᵀ');
    });
});

describe('unit converter extras', () => {
    test('new categories list their units and the swap key converts back', () => {
        const category = document.getElementById('unitCategory');
        category.value = 'speed';
        category.dispatchEvent(new Event('change'));
        expect(document.querySelectorAll('#fromUnit option')).toHaveLength(5);
        document.getElementById('unitValue').value = '36';
        document.getElementById('fromUnit').value = 'kilometerPerHour';
        document.getElementById('toUnit').value = 'meterPerSecond';
        document.getElementById('convertUnit').click();
        expect(document.getElementById('unitConverterSolution').textContent).toContain('10');
        document.getElementById('swapUnits').click();
        expect(document.getElementById('fromUnit').value).toBe('meterPerSecond');
        expect(document.getElementById('toUnit').value).toBe('kilometerPerHour');
        expect(document.getElementById('unitConverterSolution').textContent).toContain('129.6');
    });
});
