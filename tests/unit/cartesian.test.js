/**
 * Tests for the cartesian graph module (src/js/graphing/cartesian.js)
 */

window.parseDecimal = require('../../src/js/ui/inputs.js').parseDecimal;
window.showExportButton = jest.fn();
window.alert = jest.fn();

const cartesian = require('../../src/js/graphing/cartesian.js');

function makeContext() {
    return new Proxy({ calls: [] }, {
        get(target, prop) {
            if (prop === 'calls') return target.calls;
            return (...args) => target.calls.push([prop, ...args]);
        },
        set() { return true; }
    });
}

function setupDom() {
    document.body.innerHTML = `
        <select id="graphEquationType"><option value="linear">l</option><option value="quadratic">q</option></select>
        <div id="graphInputs"></div>
        <input id="xMin" value="-10"><input id="xMax" value="10">
        <input id="yMin" value="-10"><input id="yMax" value="10">
        <input type="checkbox" id="showGrid" checked><input type="checkbox" id="showAxes" checked>
        <canvas id="graphCanvas" width="800" height="600"></canvas>`;
    const ctx = makeContext();
    cartesian.graphState.canvas = document.getElementById('graphCanvas');
    cartesian.graphState.ctx = ctx;
    Object.assign(cartesian.graphState, { xMin: -10, xMax: 10, yMin: -10, yMax: 10, coefficients: {}, equationType: 'linear' });
    return ctx;
}

describe('niceTickStep', () => {
    test('returns 1-2-5 steps', () => {
        expect(cartesian.niceTickStep(20)).toBe(2);
        expect(cartesian.niceTickStep(10)).toBe(1);
        expect(cartesian.niceTickStep(100)).toBe(10);
        expect(cartesian.niceTickStep(1)).toBe(0.1);
        expect(cartesian.niceTickStep(0.004)).toBeCloseTo(0.0005, 10);
    });

    test('falls back to 1 for degenerate ranges', () => {
        expect(cartesian.niceTickStep(0)).toBe(1);
        expect(cartesian.niceTickStep(-5)).toBe(1);
        expect(cartesian.niceTickStep(NaN)).toBe(1);
    });
});

describe('graph range handling', () => {
    test('equal or inverted ranges are rejected and the inputs restored (no endless loop)', () => {
        setupDom();
        document.getElementById('xMax').value = '-10';
        expect(cartesian.updateGraphRange()).toBe(false);
        expect(cartesian.graphState.xMax).toBe(10);
        expect(document.getElementById('xMax').value).toBe('10');
        expect(() => cartesian.plotGraph()).not.toThrow();
    });

    test('drawGraph returns immediately on a degenerate range', () => {
        const ctx = setupDom();
        cartesian.graphState.xMin = 5;
        cartesian.graphState.xMax = 5;
        cartesian.drawGraph();
        expect(ctx.calls.filter(c => c[0] === 'stroke')).toHaveLength(0);
    });

    test('accepts decimal commas in ranges', () => {
        setupDom();
        document.getElementById('xMin').value = '-2,5';
        expect(cartesian.updateGraphRange()).toBe(true);
        expect(cartesian.graphState.xMin).toBe(-2.5);
    });
});

describe('plotting', () => {
    test('invalid coefficients are rejected with an alert', () => {
        setupDom();
        document.getElementById('graphInputs').innerHTML = '<input id="graphA" value="abc">';
        cartesian.plotGraph();
        expect(window.alert).toHaveBeenCalled();
        expect(cartesian.graphState.coefficients.a).toBeUndefined();
    });

    test('changing the equation type clears the previous curve', () => {
        setupDom();
        cartesian.graphState.coefficients = { a: 1, b: 2 };
        cartesian.updateGraphInputs();
        expect(cartesian.graphState.coefficients).toEqual({});
    });

    test('drawEquation skips non finite points instead of connecting them', () => {
        const ctx = setupDom();
        cartesian.graphState.equationType = 'linear';
        cartesian.graphState.coefficients = { a: Infinity, b: 0 };
        cartesian.drawEquation(ctx, 800, 600);
        expect(ctx.calls.filter(c => c[0] === 'lineTo')).toHaveLength(0);
    });

    test('zoom keeps meaningful precision in the inputs', () => {
        setupDom();
        cartesian.graphState.xMin = -0.004;
        cartesian.graphState.xMax = 0.004;
        cartesian.zoomGraph(0.8);
        expect(document.getElementById('xMin').value).toBe('-0.0032');
    });

    test('zoom refuses to go past floating point resolution', () => {
        setupDom();
        cartesian.graphState.xMin = 0;
        cartesian.graphState.xMax = 1e-9;
        cartesian.zoomGraph(0.8);
        expect(cartesian.graphState.xMax).toBe(1e-9);
    });
});
