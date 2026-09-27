// ===================================
// PARAMETRIC GRAPHING MODULE
// ===================================

// compileExpression is available globally from parsers/expression.js
// showExportButton is available globally from ui/export.js

function setupParametricGraph() {
    const plotBtn = document.getElementById('plotParametric');
    const xInput = document.getElementById('parametricX');
    const yInput = document.getElementById('parametricY');

    if (plotBtn) {
        plotBtn.addEventListener('click', plotParametricGraph);
    }

    if (xInput) {
        xInput.addEventListener('input', updateParametricPreview);
    }
    if (yInput) {
        yInput.addEventListener('input', updateParametricPreview);
    }
}

function updateParametricPreview() {
    const xExpr = document.getElementById('parametricX').value;
    const yExpr = document.getElementById('parametricY').value;
    const preview = document.getElementById('parametricPreview');

    if (preview) {
        // textContent: the expressions are user input and must not be parsed as HTML
        preview.textContent = '';
        [`x(t) = ${xExpr}`, `y(t) = ${yExpr}`].forEach(line => {
            const row = document.createElement('div');
            row.textContent = line;
            preview.appendChild(row);
        });
    }
}

/**
 * Compute the view that fits the points on a canvas with the same scale on both
 * axes (so x = cos t, y = sin t is drawn as a circle, not an ellipse).
 * Degenerate extents (a vertical line, a single point) get a sensible size.
 */
function computeParametricView(bounds, width, height, margin = 0.1) {
    const extent = (min, max) => (max - min > 1e-12 ? max - min : 2);
    const spanX = extent(bounds.minX, bounds.maxX) * (1 + margin);
    const spanY = extent(bounds.minY, bounds.maxY) * (1 + margin);
    const scale = Math.min(width / spanX, height / spanY);
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    return {
        scale,
        toPx: x => width / 2 + (x - centerX) * scale,
        toPy: y => height / 2 - (y - centerY) * scale
    };
}

function plotParametricGraph() {
    const canvas = document.getElementById('parametricCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const xExpr = document.getElementById('parametricX').value;
    const yExpr = document.getElementById('parametricY').value;
    const tMin = parseDecimal(document.getElementById('tMin').value);
    const tMax = parseDecimal(document.getElementById('tMax').value);

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (!Number.isFinite(tMin) || !Number.isFinite(tMax) || tMin >= tMax) return;

    const fx = compileExpression(xExpr, 't');
    const fy = compileExpression(yExpr, 't');
    if (!fx || !fy) return;

    // Calculate points (null marks a gap where the curve is undefined)
    const points = [];
    const steps = 1000;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (let i = 0; i <= steps; i++) {
        const t = tMin + (tMax - tMin) * i / steps;
        const x = fx(t);
        const y = fy(t);

        if (Number.isFinite(x) && Number.isFinite(y)) {
            points.push({ x, y });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        } else {
            points.push(null);
        }
    }

    if (minX === Infinity) return;

    const { toPx, toPy } = computeParametricView({ minX, maxX, minY, maxY }, width, height);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
        const px = (i / 20) * width;
        const py = (i / 20) * height;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
    }

    // Draw axes (where they are visible)
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;

    const x0 = toPx(0);
    if (x0 >= 0 && x0 <= width) {
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, height);
        ctx.stroke();
    }

    const y0 = toPy(0);
    if (y0 >= 0 && y0 <= height) {
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(width, y0);
        ctx.stroke();
    }

    // Draw curve
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let penDown = false;
    points.forEach(point => {
        if (!point) {
            penDown = false;
            return;
        }

        const px = toPx(point.x);
        const py = toPy(point.y);

        if (!penDown) {
            ctx.moveTo(px, py);
            penDown = true;
        } else {
            ctx.lineTo(px, py);
        }
    });

    ctx.stroke();
    showExportButton('parametric');
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupParametricGraph,
        updateParametricPreview,
        computeParametricView,
        plotParametricGraph
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupParametricGraph = setupParametricGraph;
    window.plotParametricGraph = plotParametricGraph;
}
