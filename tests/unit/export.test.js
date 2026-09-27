/**
 * Tests for PDF export helpers (src/js/ui/export.js)
 */

const exportModule = require('../../src/js/ui/export.js');

let calls;

function installJsPdfMock() {
    calls = { text: [], images: [], saved: [] };
    window.jspdf = {
        jsPDF: class {
            setFont() {}
            setFontSize() {}
            text(value) { calls.text.push(value); }
            splitTextToSize(value) { return String(value).split('\n'); }
            addPage() {}
            addImage(...args) { calls.images.push(args); }
            save(name) { calls.saved.push(name); }
        }
    };
}

describe('PDF export', () => {
    beforeEach(() => {
        installJsPdfMock();
        window.alert = jest.fn();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        delete window.jspdf;
    });

    test('toPdfText replaces symbols jsPDF cannot print', () => {
        expect(exportModule.toPdfText('x₁ ≤ ∞, Δ = 4')).toBe('x1 <= inf, Delta = 4');
        expect(exportModule.toPdfText('café ²')).toBe('café ²');
    });

    test('exportToPDF uses the equation preview of the panel that contains the solution', () => {
        document.body.innerHTML = `
            <div class="calculator-panel" id="derivatives">
                <div class="equation-preview">d/dx(x^2)</div>
                <div id="derivativeSolution">f'(x) = 2x</div>
            </div>`;
        exportModule.exportToPDF('derivative');
        expect(calls.text).toContain('d/dx(x^2)');
        expect(calls.text.some(t => t.includes("f'(x) = 2x"))).toBe(true);
        expect(calls.saved).toHaveLength(1);
    });

    test('exportToPDF alerts when there is nothing to export', () => {
        document.body.innerHTML = '<div id="linearSolution"></div>';
        exportModule.exportToPDF('linear');
        expect(window.alert).toHaveBeenCalled();
        expect(calls.saved).toHaveLength(0);
    });

    test('exportGraphToPDF prints the plotted equation with correct signs', () => {
        document.body.innerHTML = '<canvas id="graphCanvas" width="800" height="600"></canvas>';
        document.getElementById('graphCanvas').toDataURL = () => 'data:image/png;base64,AAAA';
        exportModule.exportGraphToPDF({ equationType: 'quadratic', coefficients: { a: 1, b: -3, c: 2 } });
        expect(calls.text).toContain('y = 1x² - 3x + 2');
        expect(calls.saved).toHaveLength(1);
    });

    test('exportGraphToPDF keeps the canvas aspect ratio', () => {
        document.body.innerHTML = '<canvas id="graphCanvas" width="800" height="400"></canvas>';
        document.getElementById('graphCanvas').toDataURL = () => 'data:image/png;base64,AAAA';
        exportModule.exportGraphToPDF({ equationType: 'linear', coefficients: { a: 2, b: 1 } });
        const [, , , , width, height] = calls.images[0];
        expect(height / width).toBeCloseTo(0.5, 5);
    });

    test('exportGraphToPDF refuses to export before plotting', () => {
        exportModule.exportGraphToPDF({ equationType: 'linear', coefficients: {} });
        expect(window.alert).toHaveBeenCalled();
        expect(calls.saved).toHaveLength(0);
    });

    test('parametric and polar exports include their expressions', () => {
        document.body.innerHTML = `
            <input id="parametricX" value="cos(t)"><input id="parametricY" value="sin(t)">
            <input id="polarR" value="1 + cos(theta)">
            <canvas id="parametricCanvas" width="800" height="600"></canvas>
            <canvas id="polarCanvas" width="800" height="600"></canvas>`;
        document.getElementById('parametricCanvas').toDataURL = () => 'data:image/png;base64,AAAA';
        document.getElementById('polarCanvas').toDataURL = () => 'data:image/png;base64,AAAA';
        exportModule.exportParametricToPDF();
        expect(calls.text).toEqual(expect.arrayContaining(['x(t) = cos(t)', 'y(t) = sin(t)']));
        exportModule.exportPolarToPDF();
        expect(calls.text).toContain('r(theta) = 1 + cos(theta)');
        expect(calls.saved).toHaveLength(2);
    });

    test('does nothing when jsPDF is unavailable', () => {
        delete window.jspdf;
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => exportModule.exportGraphToPDF({ equationType: 'linear', coefficients: { a: 1, b: 0 } })).not.toThrow();
        spy.mockRestore();
    });
});
