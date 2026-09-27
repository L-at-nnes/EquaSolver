/**
 * Tests for parametric and polar plotting
 */

const inputs = require('../../src/js/ui/inputs.js');
const expression = require('../../src/js/parsers/expression.js');
window.parseDecimal = inputs.parseDecimal;
window.compileExpression = expression.compileExpression;
window.showExportButton = jest.fn();

const parametric = require('../../src/js/graphing/parametric.js');
const polar = require('../../src/js/graphing/polar.js');

function makeCanvas(id) {
    const calls = [];
    const ctx = new Proxy({}, {
        get: (target, prop) => (...args) => { calls.push([prop, ...args]); },
        set: () => true
    });
    const canvas = document.createElement('canvas');
    canvas.id = id;
    canvas.width = 800;
    canvas.height = 600;
    canvas.getContext = () => ctx;
    document.body.appendChild(canvas);
    return calls;
}

describe('computeParametricView', () => {
    test('uses the same scale on both axes so a circle stays round', () => {
        const view = parametric.computeParametricView({ minX: -1, maxX: 1, minY: -1, maxY: 1 }, 800, 600);
        const dx = view.toPx(1) - view.toPx(0);
        const dy = view.toPy(0) - view.toPy(1);
        expect(dx).toBeCloseTo(dy, 8);
        expect(view.toPx(0)).toBeCloseTo(400, 8);
        expect(view.toPy(0)).toBeCloseTo(300, 8);
    });

    test('handles a degenerate extent (vertical line / single point)', () => {
        const view = parametric.computeParametricView({ minX: 2, maxX: 2, minY: -1, maxY: 3 }, 800, 600);
        expect(Number.isFinite(view.scale)).toBe(true);
        expect(Number.isFinite(view.toPx(2))).toBe(true);
        const point = parametric.computeParametricView({ minX: 1, maxX: 1, minY: 1, maxY: 1 }, 800, 600);
        expect(Number.isFinite(point.scale)).toBe(true);
    });
});

describe('plotParametricGraph', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="parametricX" value="2"><input id="parametricY" value="t">
            <input id="tMin" value="0"><input id="tMax" value="1">`;
    });

    test('a vertical line (constant x) is drawn with finite coordinates', () => {
        const calls = makeCanvas('parametricCanvas');
        parametric.plotParametricGraph();
        const coords = calls.filter(c => c[0] === 'lineTo' || c[0] === 'moveTo').flatMap(c => c.slice(1));
        expect(coords.length).toBeGreaterThan(0);
        expect(coords.every(Number.isFinite)).toBe(true);
    });

    test('does not draw anything for an invalid t range', () => {
        const calls = makeCanvas('parametricCanvas');
        document.getElementById('tMax').value = '0';
        parametric.plotParametricGraph();
        expect(calls.filter(c => c[0] === 'stroke')).toHaveLength(0);
    });

    test('does not draw anything for an invalid expression', () => {
        const calls = makeCanvas('parametricCanvas');
        document.getElementById('parametricX').value = 'foo(t';
        parametric.plotParametricGraph();
        expect(calls.filter(c => c[0] === 'stroke')).toHaveLength(0);
    });

    test('the preview shows user input as text, not HTML', () => {
        document.body.innerHTML += '<div id="parametricPreview"></div>';
        document.getElementById('parametricX').value = '<img src=x onerror=alert(1)>';
        parametric.updateParametricPreview();
        const preview = document.getElementById('parametricPreview');
        expect(preview.querySelector('img')).toBeNull();
        expect(preview.textContent).toContain('<img src=x onerror=alert(1)>');
    });
});

describe('plotPolarGraph', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="polarR" value="0">
            <input id="thetaMin" value="0"><input id="thetaMax" value="6.28">`;
    });

    test('r = 0 does not produce an infinite scale', () => {
        const calls = makeCanvas('polarCanvas');
        polar.plotPolarGraph();
        const coords = calls.filter(c => ['lineTo', 'moveTo', 'arc'].includes(c[0])).flatMap(c => c.slice(1, 3));
        expect(coords.length).toBeGreaterThan(0);
        expect(coords.every(Number.isFinite)).toBe(true);
    });

    test('accepts the greek letter theta and unary minus', () => {
        const calls = makeCanvas('polarCanvas');
        document.getElementById('polarR').value = '-2θ';
        polar.plotPolarGraph();
        expect(calls.filter(c => c[0] === 'lineTo').length).toBeGreaterThan(900);
    });

    test('an inverted theta range draws nothing', () => {
        const calls = makeCanvas('polarCanvas');
        document.getElementById('polarR').value = '1';
        document.getElementById('thetaMin').value = '7';
        polar.plotPolarGraph();
        expect(calls.filter(c => c[0] === 'stroke')).toHaveLength(0);
    });
});
