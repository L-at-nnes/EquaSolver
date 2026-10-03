// ===================================
// 3D SURFACE PLOTTER  z = f(x, y)
// ===================================
// A software renderer on a 2D canvas: the surface is sampled on a grid, rotated,
// projected with a mild perspective, then painted back to front as coloured quads.
// Drag to rotate, wheel or pinch to zoom, double-click to reset.

// compileExpression is available globally from parsers/expression.js

const SURFACE_DEFAULT_VIEW = { yaw: -0.8, pitch: 0.55, zoom: 1 };

// ---------- pure helpers (unit tested) ----------

/**
 * Sample fn over a square grid. z is normalised to roughly [-1, 1] using the 2nd and 98th
 * percentiles, so a single spike (1/x near 0) does not flatten the rest of the surface.
 * @returns {{n:number, xs:number[], ys:number[], z:number[][], zRaw:number[][], zMin:number, zMax:number}}
 */
function sampleSurface(fn, xMin, xMax, yMin, yMax, n = 36) {
    const xs = [];
    const ys = [];
    for (let i = 0; i <= n; i++) {
        xs.push(xMin + ((xMax - xMin) * i) / n);
        ys.push(yMin + ((yMax - yMin) * i) / n);
    }
    const zRaw = ys.map(y => xs.map(x => {
        const value = fn([x, y]);
        return typeof value === 'number' && Number.isFinite(value) ? value : NaN;
    }));

    const finite = zRaw.flat().filter(Number.isFinite).sort((a, b) => a - b);
    if (finite.length === 0) {
        return { n, xs, ys, z: zRaw.map(row => row.map(() => NaN)), zRaw, zMin: 0, zMax: 0 };
    }
    const at = q => finite[Math.min(finite.length - 1, Math.max(0, Math.round(q * (finite.length - 1))))];
    let zMin = at(0.02);
    let zMax = at(0.98);
    if (zMax - zMin < 1e-12) {
        zMin -= 0.5;
        zMax += 0.5;
    }
    const mid = (zMin + zMax) / 2;
    const half = (zMax - zMin) / 2;
    const z = zRaw.map(row => row.map(value => (Number.isFinite(value) ? (value - mid) / half : NaN)));
    return { n, xs, ys, z, zRaw, zMin, zMax };
}

/**
 * Rotate a point of the unit cube about the vertical axis (yaw), then tilt it (pitch), and
 * project it. Returns screen offsets (units of "half the canvas") and the depth used for sorting.
 */
function projectPoint(x, y, z, view, cameraDistance = 4) {
    const cosY = Math.cos(view.yaw);
    const sinY = Math.sin(view.yaw);
    const rx = x * cosY - y * sinY;
    const ry = x * sinY + y * cosY;
    const cosP = Math.cos(view.pitch);
    const sinP = Math.sin(view.pitch);
    const sy = ry * cosP - z * sinP; // depth, positive = away from the camera
    const sz = ry * sinP + z * cosP; // screen up
    const perspective = cameraDistance / (cameraDistance + sy);
    return { px: rx * perspective * view.zoom, py: -sz * perspective * view.zoom, depth: sy };
}

/** Quads of the grid, back to front, with their average height for colouring. */
function buildQuads(surface, view, reveal = 1) {
    const { n, xs, ys, z } = surface;
    const xCenter = (xs[0] + xs[n]) / 2;
    const yCenter = (ys[0] + ys[n]) / 2;
    const xHalf = (xs[n] - xs[0]) / 2 || 1;
    const yHalf = (ys[n] - ys[0]) / 2 || 1;
    const clampZ = value => Math.max(-1.25, Math.min(1.25, value));

    const projected = ys.map((yv, j) => xs.map((xv, i) => {
        const zv = z[j][i];
        if (!Number.isFinite(zv)) return null;
        return {
            ...projectPoint((xv - xCenter) / xHalf, (yv - yCenter) / yHalf, clampZ(zv) * reveal * 0.8, view),
            height: zv
        };
    }));

    const quads = [];
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            const corners = [projected[j][i], projected[j][i + 1], projected[j + 1][i + 1], projected[j + 1][i]];
            if (corners.some(c => c === null)) continue;
            quads.push({
                corners,
                depth: corners.reduce((sum, c) => sum + c.depth, 0) / 4,
                height: corners.reduce((sum, c) => sum + c.height, 0) / 4
            });
        }
    }
    return quads.sort((a, b) => b.depth - a.depth);
}

/** Height 0..1 to a perceptual ramp from deep blue to warm orange (interpolated in OKLCH). */
function heightColor(t) {
    const clamp = Math.min(1, Math.max(0, t));
    const from = { l: 0.45, c: 0.15, h: 262 };
    const to = { l: 0.74, c: 0.16, h: 40 };
    // Blue down through teal and yellow-green to orange: the short way round the hue wheel
    const hue = from.h - (from.h - to.h) * clamp;
    const l = from.l + (to.l - from.l) * clamp;
    const c = from.c + (to.c - from.c) * clamp;
    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${((hue % 360) + 360) % 360})`;
}

function prefersReducedMotionSurface() {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ---------- drawing ----------

function drawSurface(canvas, surface, view, reveal = 1) {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || canvas.width;
    const height = canvas.clientHeight || canvas.height;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = typeof readPlotColors === 'function' ? readPlotColors() : { surface: '#eee', border: '#ccc', muted: '#777', text: '#111' };

    ctx.fillStyle = colors.surface;
    ctx.fillRect(0, 0, width, height);

    const unit = Math.min(width, height) * 0.28;
    const cx = width / 2;
    const cy = height / 2;
    const toScreen = p => [cx + p.px * unit, cy + p.py * unit];

    // Bounding box floor and the three axes through the origin corner
    const corner = (x, y, z) => toScreen(projectPoint(x, y, z, view));
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.border;
    ctx.beginPath();
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([x, y], index) => {
        const [sx, sy] = corner(x, y, -0.8);
        if (index === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
    });
    ctx.closePath();
    ctx.stroke();

    // Surface
    const quads = buildQuads(surface, view, reveal);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = colors.surface;
    quads.forEach(quad => {
        ctx.fillStyle = heightColor((quad.height + 1) / 2);
        ctx.beginPath();
        quad.corners.forEach((p, index) => {
            const [sx, sy] = toScreen(p);
            if (index === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    // Axis labels at the box corners
    ctx.fillStyle = colors.muted;
    ctx.font = '12px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    const [lx, ly] = corner(1.15, -1, -0.8);
    ctx.fillText('x', lx, ly);
    const [mx, my] = corner(-1, 1.15, -0.8);
    ctx.fillText('y', mx, my);
    const [zx, zy] = corner(-1.1, -1.1, 0.9);
    ctx.fillText('z', zx, zy);
}

// ---------- panel wiring ----------

function setupSurface() {
    const canvas = document.getElementById('surfaceCanvas');
    const input = document.getElementById('surfaceExpr');
    if (!canvas || !input) return;

    const rangeInputs = ['surfaceXMin', 'surfaceXMax', 'surfaceYMin', 'surfaceYMax'].map(id => document.getElementById(id));
    const info = document.getElementById('surfaceInfo');
    let view = { ...SURFACE_DEFAULT_VIEW };
    let surface = null;
    let reveal = 1;
    let frame = 0;

    function readRange() {
        const values = rangeInputs.map(el => parseDecimal(el?.value));
        const [xMin, xMax, yMin, yMax] = values;
        return values.every(Number.isFinite) && xMin < xMax && yMin < yMax ? { xMin, xMax, yMin, yMax } : null;
    }

    function resample() {
        const compiled = compileExpression(input.value.trim(), ['x', 'y']);
        const range = readRange();
        input.removeAttribute('aria-invalid');
        if (!compiled || !range) {
            input.setAttribute('aria-invalid', 'true');
            if (info) info.textContent = '';
            return false;
        }
        surface = sampleSurface(compiled, range.xMin, range.xMax, range.yMin, range.yMax, 36);
        if (info) info.textContent = `z ∈ [${formatPlotNumber(surface.zMin)}, ${formatPlotNumber(surface.zMax)}]`;
        return true;
    }

    function paint() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            if (surface) drawSurface(canvas, surface, view, reveal);
        });
    }

    function rise(duration = 800) {
        if (prefersReducedMotionSurface() || !canvas.clientWidth) {
            reveal = 1;
            paint();
            return;
        }
        const start = performance.now();
        const step = now => {
            const t = Math.min(1, (now - start) / duration);
            reveal = 1 - Math.pow(1 - t, 4);
            if (surface) drawSurface(canvas, surface, view, reveal);
            if (t < 1) frame = requestAnimationFrame(step);
        };
        reveal = 0;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(step);
    }

    const refresh = () => {
        if (resample()) {
            reveal = 1;
            paint();
        }
    };
    input.addEventListener('input', refresh);
    rangeInputs.forEach(el => el?.addEventListener('change', refresh));

    document.getElementById('surfaceReset')?.addEventListener('click', () => {
        view = { ...SURFACE_DEFAULT_VIEW };
        rise(600);
    });

    document.querySelectorAll('.surface-preset').forEach(button => {
        button.addEventListener('click', () => {
            input.value = button.dataset.expr;
            if (resample()) rise();
        });
    });

    // ----- pointer interaction: one finger/mouse rotates, two fingers zoom -----
    const pointers = new Map();
    let pinch = 0;
    canvas.addEventListener('pointerdown', event => {
        canvas.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        canvas.classList.add('grabbing');
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinch = Math.hypot(a.x - b.x, a.y - b.y);
        }
    });
    canvas.addEventListener('pointermove', event => {
        const previous = pointers.get(event.pointerId);
        if (!previous) return;
        if (pointers.size === 1) {
            view.yaw += (event.clientX - previous.x) * 0.01;
            view.pitch = Math.max(-1.45, Math.min(1.45, view.pitch + (event.clientY - previous.y) * 0.01));
        }
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (pinch > 0) view.zoom = Math.max(0.3, Math.min(4, view.zoom * (distance / pinch)));
            pinch = distance;
        }
        paint();
    });
    const release = event => {
        pointers.delete(event.pointerId);
        pinch = 0;
        if (pointers.size === 0) canvas.classList.remove('grabbing');
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('wheel', event => {
        event.preventDefault();
        view.zoom = Math.max(0.3, Math.min(4, view.zoom * Math.exp(-event.deltaY * 0.0012)));
        paint();
    }, { passive: false });
    canvas.addEventListener('dblclick', () => document.getElementById('surfaceReset')?.click());

    // Arrow keys rotate for keyboard users
    canvas.addEventListener('keydown', event => {
        const step = 0.08;
        if (event.key === 'ArrowLeft') view.yaw -= step;
        else if (event.key === 'ArrowRight') view.yaw += step;
        else if (event.key === 'ArrowUp') view.pitch = Math.min(1.45, view.pitch + step);
        else if (event.key === 'ArrowDown') view.pitch = Math.max(-1.45, view.pitch - step);
        else return;
        event.preventDefault();
        paint();
    });

    let shown = false;
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(() => {
            if (!shown && canvas.clientWidth > 0) {
                shown = true;
                if (resample()) rise();
                return;
            }
            paint();
        }).observe(canvas);
    }
    new MutationObserver(() => setTimeout(paint, 480)).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    resample();
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sampleSurface, projectPoint, buildQuads, heightColor, SURFACE_DEFAULT_VIEW };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupSurface = setupSurface;
}
