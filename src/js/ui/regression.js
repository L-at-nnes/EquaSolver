// ===================================
// REGRESSION UI
// ===================================

// parsePairs / linearRegression / formatRegressionLine (math/regression.js), readPlotColors and
// formatPlotNumber (graphing/plotter.js), escapeHtml, parseDecimal and addToHistory are global.

/** Padded bounds so points never sit on the border and a single value still has a range. */
function regressionBounds(points) {
    const pad = (min, max) => {
        const span = max - min || Math.abs(max) || 1;
        return [min - span * 0.1, max + span * 0.1];
    };
    const [xMin, xMax] = pad(Math.min(...points.map(p => p.x)), Math.max(...points.map(p => p.x)));
    const [yMin, yMax] = pad(Math.min(...points.map(p => p.y)), Math.max(...points.map(p => p.y)));
    return { xMin, xMax, yMin, yMax };
}

function drawScatter(canvas, points, fit) {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || canvas.width;
    const height = canvas.clientHeight || canvas.height;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = typeof readPlotColors === 'function'
        ? readPlotColors()
        : { surface: '#eee', border: '#ccc', muted: '#777', text: '#111' };

    ctx.fillStyle = colors.surface;
    ctx.fillRect(0, 0, width, height);

    const margin = { left: 52, right: 16, top: 16, bottom: 32 };
    const { xMin, xMax, yMin, yMax } = regressionBounds(points);
    const toPx = x => margin.left + ((x - xMin) / (xMax - xMin)) * (width - margin.left - margin.right);
    const toPy = y => height - margin.bottom - ((y - yMin) / (yMax - yMin)) * (height - margin.top - margin.bottom);

    // Frame and a few labelled ticks on each axis
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom);
    ctx.fillStyle = colors.muted;
    ctx.font = '11px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
        const x = xMin + ((xMax - xMin) * i) / 4;
        ctx.fillText(formatPlotNumber(x), toPx(x), height - margin.bottom + 16);
    }
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const y = yMin + ((yMax - yMin) * i) / 4;
        ctx.fillText(formatPlotNumber(y), margin.left - 6, toPy(y) + 4);
    }

    // Fitted line across the whole x range
    if (fit) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(margin.left, margin.top, width - margin.left - margin.right, height - margin.top - margin.bottom);
        ctx.clip();
        ctx.strokeStyle = 'oklch(62% 0.19 35)';
        ctx.lineWidth = 2.25;
        ctx.beginPath();
        ctx.moveTo(toPx(xMin), toPy(fit.slope * xMin + fit.intercept));
        ctx.lineTo(toPx(xMax), toPy(fit.slope * xMax + fit.intercept));
        ctx.stroke();
        ctx.restore();
    }

    // Data points
    ctx.fillStyle = 'oklch(55% 0.2 262)';
    ctx.strokeStyle = colors.surface;
    ctx.lineWidth = 1.5;
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(toPx(p.x), toPy(p.y), 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });
}

function regressionResultHtml(fit, trans = {}) {
    const row = (label, value) => `<div class="result-group"><div class="result-label">${label}:</div><div class="result-value">${value}</div></div>`;
    const clean = v => (Number.isFinite(v) ? String(parseFloat(v.toPrecision(6))) : '—');
    return `<h3>${trans.solution || 'Solution'}</h3>
        <div class="result-group"><div class="result-label">${trans.regressionLine || 'Fitted line'}:</div><div class="result-value"><span class="highlight">${escapeHtml(formatRegressionLine(fit))}</span></div></div>
        ${row(trans.regressionSlope || 'Slope', clean(fit.slope))}
        ${row(trans.regressionIntercept || 'Intercept', clean(fit.intercept))}
        ${row('r', clean(fit.r))}
        ${row('R²', clean(fit.r2))}
        ${row('n', fit.n)}`;
}

function setupRegression() {
    const button = document.getElementById('calculateRegression');
    const input = document.getElementById('regressionInput');
    const output = document.getElementById('regressionSolution');
    const canvas = document.getElementById('regressionCanvas');
    if (!button || !input || !output) return;

    const predictInput = document.getElementById('regressionPredictX');
    const predictOutput = document.getElementById('regressionPrediction');
    let current = null;

    const trans = () => (typeof translations !== 'undefined' && translations[window.currentLang]) || {};

    function updatePrediction() {
        if (!predictOutput) return;
        predictOutput.textContent = '';
        if (!current || !predictInput || predictInput.value.trim() === '') return;
        const x = parseDecimal(predictInput.value);
        if (Number.isNaN(x)) return;
        predictOutput.textContent = `y(${formatPlotNumber(x)}) = ${formatPlotNumber(current.slope * x + current.intercept)}`;
    }

    function calculate() {
        const { points, invalidLines } = parsePairs(input.value);
        const t = trans();
        if (invalidLines.length > 0) {
            output.innerHTML = `<p class="error">${escapeHtml(t.regressionBadLines || 'Each line needs exactly two numbers')} (${invalidLines.join(', ')})</p>`;
            return;
        }
        const fit = linearRegression(points);
        if (!fit) {
            output.innerHTML = `<p class="error">${escapeHtml(t.regressionNeedPoints || 'Enter at least two points with different x values')}</p>`;
            return;
        }
        current = fit;
        output.innerHTML = regressionResultHtml(fit, t);
        if (canvas) {
            canvas.parentElement.hidden = false;
            drawScatter(canvas, points, fit);
        }
        updatePrediction();
        if (typeof addToHistory === 'function') addToHistory(`Regression (${fit.n} points): ${formatRegressionLine(fit)}, R² = ${formatPlotNumber(fit.r2)}`);
    }

    button.addEventListener('click', calculate);
    predictInput?.addEventListener('input', updatePrediction);
    if (canvas && typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(() => {
            if (current) drawScatter(canvas, parsePairs(input.value).points, current);
        }).observe(canvas);
    }
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { regressionBounds, regressionResultHtml, setupRegression };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupRegression = setupRegression;
}
