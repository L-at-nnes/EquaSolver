// ===================================
// FUNCTION PLOTTER
// ===================================
// Several y = f(x) curves on one canvas: drag to pan, wheel or pinch to zoom,
// hover to read values, with roots, extrema and intersections found numerically.

// compileExpression is available globally from parsers/expression.js

const PLOT_COLORS = [
    'oklch(55% 0.2 262)',
    'oklch(62% 0.19 35)',
    'oklch(55% 0.14 160)',
    'oklch(55% 0.2 320)'
];
const PLOT_MAX_FUNCTIONS = 4;

// ---------- numerical helpers (pure, unit tested) ----------

function bisect(fn, a, b, iterations = 60) {
    let lo = a;
    let hi = b;
    let fLo = fn(lo);
    for (let i = 0; i < iterations; i++) {
        const mid = (lo + hi) / 2;
        const fMid = fn(mid);
        if (!Number.isFinite(fMid)) return null;
        if (fMid === 0) return mid;
        if (fLo * fMid < 0) {
            hi = mid;
        } else {
            lo = mid;
            fLo = fMid;
        }
    }
    return (lo + hi) / 2;
}

function dedupeSorted(values, tolerance) {
    const sorted = [...values].sort((p, q) => p - q);
    return sorted.filter((value, index) => index === 0 || value - sorted[index - 1] > tolerance);
}

/**
 * Sign-change roots of fn on [a, b]. Poles (tan, 1/x) are rejected because the
 * function value at the converged point is not close to zero.
 */
function findRoots(fn, a, b, steps = 800) {
    const roots = [];
    let prevX = a;
    let prevY = fn(a);
    for (let i = 1; i <= steps; i++) {
        const x = a + ((b - a) * i) / steps;
        const y = fn(x);
        if (Number.isFinite(prevY) && Number.isFinite(y)) {
            if (y === 0) {
                roots.push(x);
            } else if (prevY * y < 0) {
                const root = bisect(fn, prevX, x);
                if (root !== null && Math.abs(fn(root)) < 1e-6) roots.push(root);
            }
        }
        prevX = x;
        prevY = y;
    }
    return dedupeSorted(roots, (b - a) * 1e-9);
}

/**
 * Local minima and maxima of fn on [a, b], found where the numerical derivative
 * changes sign. Returns [{x, y, type: 'min'|'max'}].
 */
function findExtrema(fn, a, b, steps = 800) {
    const span = b - a;
    const h = span * 1e-6;
    const d = x => (fn(x + h) - fn(x - h)) / (2 * h);
    const points = [];
    let prevX = a;
    let prevD = d(a);
    for (let i = 1; i <= steps; i++) {
        const x = a + (span * i) / steps;
        const dx = d(x);
        // A derivative that lands exactly on 0 (a grid point on the extremum) is a hit too
        const crossing = Number.isFinite(prevD) && Number.isFinite(dx) && (prevD * dx < 0 || (dx === 0 && prevD !== 0));
        if (crossing) {
            const xe = dx === 0 ? x : bisect(d, prevX, x);
            if (xe !== null) {
                const y = fn(xe);
                const delta = span * 1e-4;
                const left = fn(xe - delta);
                const right = fn(xe + delta);
                // Reject poles: a genuine extremum has a value close to its neighbours'
                const nearby = Math.max(Math.abs(left), Math.abs(right), 1);
                if (Number.isFinite(y) && Math.abs(y) < 1e8 && Number.isFinite(left) && Number.isFinite(right) && Math.abs(y) <= 2 * nearby) {
                    if (left > y && right > y) points.push({ x: xe, y, type: 'min' });
                    else if (left < y && right < y) points.push({ x: xe, y, type: 'max' });
                }
            }
        }
        prevX = x;
        prevD = dx;
    }
    const tolerance = span * 1e-7;
    return points.filter((p, i) => i === 0 || p.x - points[i - 1].x > tolerance);
}

/**
 * Points where f and g meet, as [{x, y}]. Overlapping curves (more than 50
 * crossings) report nothing instead of flooding the plot.
 */
function findIntersections(f, g, a, b) {
    const roots = findRoots(x => f(x) - g(x), a, b);
    if (roots.length > 50) return [];
    return roots.map(x => ({ x, y: f(x) }));
}

/**
 * Roots including tangent touches (x^2 at 0), which have no sign change but
 * show up as an extremum sitting on the x axis.
 */
function findAllRoots(fn, a, b) {
    const roots = findRoots(fn, a, b);
    const touching = findExtrema(fn, a, b).filter(p => Math.abs(p.y) < 1e-7).map(p => p.x);
    return dedupeSorted([...roots, ...touching], (b - a) * 1e-6);
}

function formatPlotNumber(value) {
    if (!Number.isFinite(value)) return '—';
    if (Math.abs(value) < 1e-9) return '0';
    return String(parseFloat(value.toPrecision(5)));
}

// ---------- view model ----------

function createPlotterState(width, height) {
    // Equal scale on both axes: 20 units across, the height follows the aspect ratio
    const xRange = 20;
    const yRange = xRange * (height / width || 0.6);
    return {
        view: { xMin: -xRange / 2, xMax: xRange / 2, yMin: -yRange / 2, yMax: yRange / 2 },
        functions: [],
        hoverX: null
    };
}

function zoomView(view, factor, centerX, centerY) {
    const clamp = range => Math.min(1e9, Math.max(1e-9, range));
    const xRange = clamp((view.xMax - view.xMin) * factor);
    const yRange = clamp((view.yMax - view.yMin) * factor);
    const tx = (centerX - view.xMin) / (view.xMax - view.xMin);
    const ty = (centerY - view.yMin) / (view.yMax - view.yMin);
    return {
        xMin: centerX - tx * xRange,
        xMax: centerX + (1 - tx) * xRange,
        yMin: centerY - ty * yRange,
        yMax: centerY + (1 - ty) * yRange
    };
}

function panView(view, dxUnits, dyUnits) {
    return {
        xMin: view.xMin + dxUnits,
        xMax: view.xMax + dxUnits,
        yMin: view.yMin + dyUnits,
        yMax: view.yMax + dyUnits
    };
}

// ---------- drawing ----------

// Theme tokens use light-dark() and relative colours, which a canvas cannot resolve
// from a raw custom property string. A probe element lets the browser compute them.
function readPlotColors() {
    const probe = document.createElement('span');
    probe.style.display = 'none';
    document.body.appendChild(probe);
    const read = (name, fallback) => {
        probe.style.color = '';
        probe.style.color = `var(${name})`;
        return getComputedStyle(probe).color || fallback;
    };
    const colors = {
        surface: read('--surface-2', '#eee'),
        text: read('--text', '#111'),
        muted: read('--text-muted', '#666'),
        border: read('--border', '#ccc')
    };
    probe.remove();
    return colors;
}

function drawPlot(canvas, state, options) {
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || canvas.width;
    const cssHeight = canvas.clientHeight || canvas.height;
    if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = readPlotColors();
    const { xMin, xMax, yMin, yMax } = state.view;
    const toPx = x => ((x - xMin) / (xMax - xMin)) * cssWidth;
    const toPy = y => cssHeight - ((y - yMin) / (yMax - yMin)) * cssHeight;

    ctx.fillStyle = colors.surface;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const stepFor = range => {
        const rough = range / 10;
        const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
        const normalized = rough / magnitude;
        return (normalized < 1.5 ? 1 : normalized < 3.5 ? 2 : normalized < 7.5 ? 5 : 10) * magnitude;
    };
    const xStep = stepFor(xMax - xMin);
    const yStep = stepFor(yMax - yMin);
    const decimals = step => Math.min(10, Math.max(0, -Math.floor(Math.log10(step))));

    // Grid: the border tone at reduced alpha (canvas does not accept every alpha colour syntax)
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.border;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    for (let k = Math.ceil(xMin / xStep); k * xStep <= xMax; k++) {
        const px = Math.round(toPx(k * xStep)) + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, cssHeight);
    }
    for (let k = Math.ceil(yMin / yStep); k * yStep <= yMax; k++) {
        const py = Math.round(toPy(k * yStep)) + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(cssWidth, py);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Axes and labels
    const axisX = Math.min(cssHeight - 2, Math.max(2, toPy(0)));
    const axisY = Math.min(cssWidth - 2, Math.max(2, toPx(0)));
    ctx.strokeStyle = colors.muted;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, axisX);
    ctx.lineTo(cssWidth, axisX);
    ctx.moveTo(axisY, 0);
    ctx.lineTo(axisY, cssHeight);
    ctx.stroke();

    ctx.fillStyle = colors.muted;
    ctx.font = '11px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    for (let k = Math.ceil(xMin / xStep); k * xStep <= xMax; k++) {
        if (k === 0) continue;
        const labelY = axisX > cssHeight - 18 ? axisX - 6 : axisX + 14;
        ctx.fillText((k * xStep).toFixed(decimals(xStep)), toPx(k * xStep), labelY);
    }
    ctx.textAlign = axisY > cssWidth - 44 ? 'right' : 'left';
    for (let k = Math.ceil(yMin / yStep); k * yStep <= yMax; k++) {
        if (k === 0) continue;
        const labelX = ctx.textAlign === 'right' ? axisY - 6 : axisY + 6;
        ctx.fillText((k * yStep).toFixed(decimals(yStep)), labelX, toPy(k * yStep) + 4);
    }

    // Curves: one sample per pixel column, broken at gaps and at asymptote jumps
    ctx.lineWidth = 2.25;
    ctx.lineJoin = 'round';
    state.functions.forEach(entry => {
        if (!entry.fn) return;
        ctx.strokeStyle = entry.color;
        ctx.beginPath();
        let penDown = false;
        let prevPy = 0;
        for (let px = 0; px <= cssWidth; px++) {
            const x = xMin + ((xMax - xMin) * px) / cssWidth;
            const y = entry.fn(x);
            if (!Number.isFinite(y)) {
                penDown = false;
                continue;
            }
            const py = toPy(y);
            if (penDown && Math.abs(py - prevPy) > cssHeight * 3) penDown = false;
            if (penDown) {
                ctx.lineTo(px, py);
            } else {
                ctx.moveTo(px, py);
                penDown = true;
            }
            prevPy = py;
        }
        ctx.stroke();
    });

    // Points of interest
    (options.points || []).forEach(point => {
        const px = toPx(point.x);
        const py = toPy(point.y);
        if (px < -8 || px > cssWidth + 8 || py < -8 || py > cssHeight + 8) return;
        ctx.lineWidth = 2;
        ctx.strokeStyle = point.color;
        ctx.fillStyle = point.kind === 'intersection' ? point.color : colors.surface;
        ctx.beginPath();
        if (point.kind === 'extremum') {
            ctx.moveTo(px, py - 6);
            ctx.lineTo(px + 6, py);
            ctx.lineTo(px, py + 6);
            ctx.lineTo(px - 6, py);
            ctx.closePath();
        } else {
            ctx.arc(px, py, 5, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();
    });

    // Hover trace
    if (state.hoverX !== null) {
        const px = toPx(state.hoverX);
        ctx.lineWidth = 1;
        ctx.strokeStyle = colors.muted;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, cssHeight);
        ctx.stroke();
        ctx.setLineDash([]);
        state.functions.forEach(entry => {
            if (!entry.fn) return;
            const y = entry.fn(state.hoverX);
            if (!Number.isFinite(y)) return;
            ctx.fillStyle = entry.color;
            ctx.beginPath();
            ctx.arc(px, toPy(y), 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// ---------- panel wiring ----------

function setupPlotter() {
    const canvas = document.getElementById('plotterCanvas');
    const list = document.getElementById('plotterList');
    if (!canvas || !list) return;

    const state = createPlotterState(canvas.clientWidth || 800, canvas.clientHeight || 480);
    const readout = document.getElementById('plotterReadout');
    const pointsBox = document.getElementById('plotterPoints');
    const toggles = {
        roots: document.getElementById('plotterShowRoots'),
        extrema: document.getElementById('plotterShowExtrema'),
        intersections: document.getElementById('plotterShowIntersections')
    };
    let frame = 0;
    let points = [];

    function rebuildFunction(entry) {
        entry.fn = null;
        const text = entry.input.value.trim();
        entry.input.removeAttribute('aria-invalid');
        if (!text) return;
        const compiled = compileExpression(text, 'x');
        if (!compiled) {
            entry.input.setAttribute('aria-invalid', 'true');
            return;
        }
        entry.fn = x => {
            const y = compiled(x);
            return typeof y === 'number' ? y : NaN;
        };
    }

    function computePoints() {
        const { xMin, xMax } = state.view;
        const found = [];
        const active = state.functions.filter(entry => entry.fn);
        if (toggles.roots?.checked || toggles.extrema?.checked) {
            active.forEach((entry, index) => {
                if (toggles.roots?.checked) {
                    findAllRoots(entry.fn, xMin, xMax).forEach(x => found.push({ x, y: 0, kind: 'root', color: entry.color, label: `f${index + 1}` }));
                }
                if (toggles.extrema?.checked) {
                    findExtrema(entry.fn, xMin, xMax).forEach(p => found.push({ ...p, kind: 'extremum', color: entry.color, label: `f${index + 1}` }));
                }
            });
        }
        if (toggles.intersections?.checked) {
            for (let i = 0; i < active.length; i++) {
                for (let j = i + 1; j < active.length; j++) {
                    findIntersections(active[i].fn, active[j].fn, xMin, xMax).forEach(p =>
                        found.push({ ...p, kind: 'intersection', color: active[i].color, label: `f${i + 1} ∩ f${j + 1}` }));
                }
            }
        }
        return found;
    }

    function renderPointsList() {
        if (!pointsBox) return;
        pointsBox.textContent = '';
        points.slice(0, 16).forEach(point => {
            const item = document.createElement('li');
            const kind = point.kind === 'extremum' ? (point.type === 'min' ? '↓' : '↑') : point.kind === 'root' ? '○' : '●';
            item.textContent = `${kind} ${point.label}  (${formatPlotNumber(point.x)}, ${formatPlotNumber(point.y)})`;
            item.style.setProperty('--dot', point.color);
            pointsBox.appendChild(item);
        });
    }

    function redraw(withPoints = true) {
        if (withPoints) {
            points = computePoints();
            renderPointsList();
        }
        drawPlot(canvas, state, { points });
    }

    function schedule(withPoints = true) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => redraw(withPoints));
    }

    function addFunction(text = '') {
        if (state.functions.length >= PLOT_MAX_FUNCTIONS) return;
        const color = PLOT_COLORS[state.functions.length % PLOT_COLORS.length];
        const row = document.createElement('div');
        row.className = 'plotter-row';
        row.style.setProperty('--curve', color);

        const label = document.createElement('span');
        label.className = 'plotter-label';
        label.textContent = `f${state.functions.length + 1}(x) =`;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'equation-text-input plotter-input';
        input.value = text;
        input.placeholder = 'sin(x)';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-label', `f${state.functions.length + 1}(x)`);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'plotter-remove';
        remove.setAttribute('aria-label', 'Remove function');
        remove.textContent = '×';

        row.append(label, input, remove);
        list.appendChild(row);

        const entry = { color, input, row, fn: null };
        state.functions.push(entry);
        rebuildFunction(entry);

        input.addEventListener('input', () => {
            rebuildFunction(entry);
            schedule();
        });
        remove.addEventListener('click', () => {
            state.functions.splice(state.functions.indexOf(entry), 1);
            row.remove();
            // Keep labels and colours consistent with the new order
            state.functions.forEach((other, index) => {
                other.color = PLOT_COLORS[index % PLOT_COLORS.length];
                other.row.style.setProperty('--curve', other.color);
                other.row.querySelector('.plotter-label').textContent = `f${index + 1}(x) =`;
            });
            updateAddButton();
            schedule();
        });
        updateAddButton();
        schedule();
    }

    function updateAddButton() {
        const add = document.getElementById('plotterAdd');
        if (add) add.disabled = state.functions.length >= PLOT_MAX_FUNCTIONS;
    }

    document.getElementById('plotterAdd')?.addEventListener('click', () => {
        addFunction('');
        state.functions[state.functions.length - 1]?.input.focus();
    });

    document.getElementById('plotterReset')?.addEventListener('click', () => {
        state.view = createPlotterState(canvas.clientWidth || 800, canvas.clientHeight || 480).view;
        schedule();
    });

    document.getElementById('plotterExport')?.addEventListener('click', () => {
        redraw(false);
        canvas.toBlob(blob => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `equasolver_plot_${Date.now()}.png`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
    });

    Object.values(toggles).forEach(toggle => toggle?.addEventListener('change', () => schedule()));

    // ----- pointer interaction -----
    const pointers = new Map();
    let pinchDistance = 0;

    const unitsPerPixel = () => ({
        x: (state.view.xMax - state.view.xMin) / canvas.clientWidth,
        y: (state.view.yMax - state.view.yMin) / canvas.clientHeight
    });
    const toWorld = event => {
        const box = canvas.getBoundingClientRect();
        const px = event.clientX - box.left;
        const py = event.clientY - box.top;
        return {
            x: state.view.xMin + (px / box.width) * (state.view.xMax - state.view.xMin),
            y: state.view.yMax - (py / box.height) * (state.view.yMax - state.view.yMin)
        };
    };

    canvas.addEventListener('pointerdown', event => {
        canvas.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        canvas.classList.add('grabbing');
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
        }
    });

    canvas.addEventListener('pointermove', event => {
        const previous = pointers.get(event.pointerId);
        if (!previous) {
            // Hover trace
            state.hoverX = toWorld(event).x;
            if (readout) readout.textContent = describeValues(state.hoverX);
            schedule(false);
            return;
        }
        if (pointers.size === 1) {
            const scale = unitsPerPixel();
            state.view = panView(state.view, -(event.clientX - previous.x) * scale.x, (event.clientY - previous.y) * scale.y);
        }
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (pinchDistance > 0 && distance > 0) {
                const center = toWorld({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
                state.view = zoomView(state.view, pinchDistance / distance, center.x, center.y);
            }
            pinchDistance = distance;
        }
        schedule();
    });

    const release = event => {
        pointers.delete(event.pointerId);
        pinchDistance = 0;
        if (pointers.size === 0) canvas.classList.remove('grabbing');
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', () => {
        if (pointers.size === 0) {
            state.hoverX = null;
            if (readout) readout.textContent = '';
            schedule(false);
        }
    });

    canvas.addEventListener('wheel', event => {
        event.preventDefault();
        const center = toWorld(event);
        state.view = zoomView(state.view, Math.exp(event.deltaY * 0.0015), center.x, center.y);
        schedule();
    }, { passive: false });

    canvas.addEventListener('dblclick', () => document.getElementById('plotterReset')?.click());

    function describeValues(x) {
        const parts = [`x = ${formatPlotNumber(x)}`];
        state.functions.forEach((entry, index) => {
            if (entry.fn) parts.push(`f${index + 1} = ${formatPlotNumber(entry.fn(x))}`);
        });
        return parts.join('   ');
    }

    // Keep the bitmap sharp when the panel resizes, and follow theme changes
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(() => schedule(false)).observe(canvas);
    }
    new MutationObserver(() => setTimeout(() => schedule(false), 480)).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    addFunction('sin(x)');
    addFunction('x^2 / 4 - 1');
    // The saved theme may still be fading in at startup: repaint once it has settled
    setTimeout(() => schedule(false), 520);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bisect,
        findRoots,
        findAllRoots,
        findExtrema,
        findIntersections,
        formatPlotNumber,
        createPlotterState,
        zoomView,
        panView,
        setupPlotter
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupPlotter = setupPlotter;
}
