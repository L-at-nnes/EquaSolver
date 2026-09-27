// ===================================
// CARTESIAN GRAPHING MODULE
// ===================================

// showExportButton is available globally from ui/export.js

// Graph state
const graphState = {
    canvas: null,
    ctx: null,
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
    equationType: 'linear',
    coefficients: {}
};

function setupGraphVisualization() {
    const canvas = document.getElementById('graphCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    graphState.canvas = canvas;
    graphState.ctx = ctx;
    
    // Event listeners
    const typeSelect = document.getElementById('graphEquationType');
    if (typeSelect) {
        typeSelect.addEventListener('change', updateGraphInputs);
    }
    
    const plotBtn = document.getElementById('plotGraph');
    if (plotBtn) {
        plotBtn.addEventListener('click', plotGraph);
    }
    
    const resetBtn = document.getElementById('resetView');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGraphView);
    }
    
    const zoomInBtn = document.getElementById('zoomIn');
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => zoomGraph(0.8));
    }
    
    const zoomOutBtn = document.getElementById('zoomOut');
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => zoomGraph(1.25));
    }
    
    // Export graph PDF
    const exportBtn = document.getElementById('exportGraphPdf');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (typeof window !== 'undefined' && window.exportGraphToPDF) {
                window.exportGraphToPDF(graphState);
            }
        });
    }
    
    // Range inputs
    ['xMin', 'xMax', 'yMin', 'yMax'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', updateGraphRange);
        }
    });
    
    updateGraphInputs();
    drawGraph();
}

function updateGraphInputs() {
    const typeSelect = document.getElementById('graphEquationType');
    if (!typeSelect) return;
    
    const type = typeSelect.value;
    graphState.equationType = type;
    graphState.coefficients = {};
    
    const inputsContainer = document.getElementById('graphInputs');
    if (!inputsContainer) return;
    
    let html = '';
    
    switch(type) {
        case 'linear':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="text" inputmode="decimal" id="graphA" value="1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="text" inputmode="decimal" id="graphB" value="0" class="graph-input">
                </div>
            `;
            break;
        case 'quadratic':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="text" inputmode="decimal" id="graphA" value="1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="text" inputmode="decimal" id="graphB" value="0" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>c:</label>
                    <input type="text" inputmode="decimal" id="graphC" value="0" class="graph-input">
                </div>
            `;
            break;
        case 'cubic':
            html = `
                <div class="graph-input-group">
                    <label>a:</label>
                    <input type="text" inputmode="decimal" id="graphA" value="1" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>b:</label>
                    <input type="text" inputmode="decimal" id="graphB" value="0" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>c:</label>
                    <input type="text" inputmode="decimal" id="graphC" value="0" class="graph-input">
                </div>
                <div class="graph-input-group">
                    <label>d:</label>
                    <input type="text" inputmode="decimal" id="graphD" value="0" class="graph-input">
                </div>
            `;
            break;
    }
    
    inputsContainer.innerHTML = html;
}

// Pick a "nice" tick spacing (1, 2 or 5 times a power of ten) giving roughly `target` ticks
function niceTickStep(range, target = 10) {
    if (!(range > 0) || !Number.isFinite(range)) return 1;
    const rough = range / target;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    const normalized = rough / magnitude;
    const nice = normalized < 1.5 ? 1 : normalized < 3.5 ? 2 : normalized < 7.5 ? 5 : 10;
    return nice * magnitude;
}

function formatTick(value, step) {
    const decimals = Math.max(0, -Math.floor(Math.log10(step)));
    return parseFloat(value.toFixed(Math.min(decimals, 10))).toString();
}

// Read the range inputs. Invalid or inverted ranges (which used to freeze the
// page in an endless drawing loop) are rejected and the inputs restored.
function updateGraphRange() {
    const read = (id, fallback) => {
        const raw = document.getElementById(id)?.value;
        return raw === undefined || String(raw).trim() === '' ? fallback : parseDecimal(raw);
    };
    const xMin = read('xMin', -10);
    const xMax = read('xMax', 10);
    const yMin = read('yMin', -10);
    const yMax = read('yMax', 10);
    const valid = [xMin, xMax, yMin, yMax].every(Number.isFinite) && xMin < xMax && yMin < yMax;

    if (valid) {
        graphState.xMin = xMin;
        graphState.xMax = xMax;
        graphState.yMin = yMin;
        graphState.yMax = yMax;
    } else {
        ['xMin', 'xMax', 'yMin', 'yMax'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = parseFloat(graphState[id].toFixed(6));
        });
    }
    return valid;
}

function plotGraph() {
    updateGraphRange();

    // Get coefficients (a blank field counts as 0)
    const read = id => {
        const raw = document.getElementById(id)?.value;
        return raw === undefined || String(raw).trim() === '' ? 0 : parseDecimal(raw);
    };
    const a = read('graphA');
    const b = read('graphB');
    const c = read('graphC');
    const d = read('graphD');

    if ([a, b, c, d].some(Number.isNaN)) {
        const message = (typeof translations !== 'undefined' && translations[window.currentLang]?.invalidInput) || 'Invalid input';
        alert(message);
        return;
    }

    graphState.coefficients = { a, b, c, d };

    drawGraph();
    showExportButton('graph');
}

function drawGraph() {
    const { canvas, ctx, xMin, xMax, yMin, yMax } = graphState;
    if (!canvas || !ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (!(xMax > xMin) || !(yMax > yMin)) return;

    // Draw grid if enabled
    const showGridCheckbox = document.getElementById('showGrid');
    if (showGridCheckbox?.checked) {
        drawGrid(ctx, width, height);
    }
    
    // Draw axes if enabled
    const showAxesCheckbox = document.getElementById('showAxes');
    if (showAxesCheckbox?.checked) {
        drawAxes(ctx, width, height);
    }
    
    // Draw equation
    if (graphState.coefficients.a !== undefined) {
        drawEquation(ctx, width, height);
    }
}

function drawGrid(ctx, width, height) {
    const { xMin, xMax, yMin, yMax } = graphState;

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;

    // Vertical lines on multiples of the tick step, so they line up with the axis labels
    const xStep = niceTickStep(xMax - xMin);
    for (let k = Math.ceil(xMin / xStep); k * xStep <= xMax; k++) {
        const px = mapX(k * xStep, width);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
    }

    // Horizontal lines
    const yStep = niceTickStep(yMax - yMin);
    for (let k = Math.ceil(yMin / yStep); k * yStep <= yMax; k++) {
        const py = mapY(k * yStep, height);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
    }
}

function drawAxes(ctx, width, height) {
    const { xMin, xMax, yMin, yMax } = graphState;
    
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    
    // X-axis
    if (yMin <= 0 && yMax >= 0) {
        const y0 = mapY(0, height);
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(width, y0);
        ctx.stroke();
        
        // X-axis labels
        ctx.fillStyle = '#00ff88';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        const xStep = niceTickStep(xMax - xMin);
        // Keep labels on screen when the x axis sits at the very bottom edge
        const labelY = y0 + 20 > height ? y0 - 8 : y0 + 20;
        for (let k = Math.ceil(xMin / xStep); k * xStep <= xMax; k++) {
            if (k !== 0) {
                const px = mapX(k * xStep, width);
                ctx.fillText(formatTick(k * xStep, xStep), px, labelY);
            }
        }
    }
    
    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
        const x0 = mapX(0, width);
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, height);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = '#00ff88';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'right';
        const yStep = niceTickStep(yMax - yMin);
        for (let k = Math.ceil(yMin / yStep); k * yStep <= yMax; k++) {
            if (k !== 0) {
                const py = mapY(k * yStep, height);
                ctx.fillText(formatTick(k * yStep, yStep), x0 - 10, py + 4);
            }
        }
    }
}

function drawEquation(ctx, width, height) {
    const { equationType, coefficients, xMin, xMax } = graphState;
    const { a, b, c, d } = coefficients;

    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let penDown = false;

    for (let i = 0; i <= width; i++) {
        const x = xMin + (xMax - xMin) * i / width;
        let y;

        switch(equationType) {
            case 'linear':
                y = a * x + b;
                break;
            case 'quadratic':
                y = a * x * x + b * x + c;
                break;
            case 'cubic':
                y = a * x * x * x + b * x * x + c * x + d;
                break;
        }

        if (!Number.isFinite(y)) {
            penDown = false;
            continue;
        }

        const px = mapX(x, width);
        const py = mapY(y, height);

        if (!penDown) {
            ctx.moveTo(px, py);
            penDown = true;
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.stroke();
}

function mapX(x, width) {
    const { xMin, xMax } = graphState;
    return ((x - xMin) / (xMax - xMin)) * width;
}

function mapY(y, height) {
    const { yMin, yMax } = graphState;
    return height - ((y - yMin) / (yMax - yMin)) * height;
}

function resetGraphView() {
    graphState.xMin = -10;
    graphState.xMax = 10;
    graphState.yMin = -10;
    graphState.yMax = 10;
    
    const inputs = ['xMin', 'xMax', 'yMin', 'yMax'];
    const values = [-10, 10, -10, 10];
    inputs.forEach((id, i) => {
        const input = document.getElementById(id);
        if (input) input.value = values[i];
    });
    
    drawGraph();
}

function zoomGraph(factor) {
    const { xMin, xMax, yMin, yMax } = graphState;
    
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const xRange = (xMax - xMin) * factor;
    const yRange = (yMax - yMin) * factor;
    
    // Stay within a range where floating point coordinates remain meaningful
    if (xRange < 1e-9 || yRange < 1e-9 || xRange > 1e12 || yRange > 1e12) return;
    
    graphState.xMin = xCenter - xRange / 2;
    graphState.xMax = xCenter + xRange / 2;
    graphState.yMin = yCenter - yRange / 2;
    graphState.yMax = yCenter + yRange / 2;
    
    const inputs = ['xMin', 'xMax', 'yMin', 'yMax'];
    const values = [graphState.xMin, graphState.xMax, graphState.yMin, graphState.yMax];
    inputs.forEach((id, i) => {
        const input = document.getElementById(id);
        if (input) input.value = parseFloat(values[i].toPrecision(6));
    });
    
    drawGraph();
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        graphState,
        setupGraphVisualization,
        updateGraphInputs,
        updateGraphRange,
        plotGraph,
        drawGraph,
        drawGrid,
        drawAxes,
        drawEquation,
        mapX,
        mapY,
        resetGraphView,
        zoomGraph,
        niceTickStep,
        formatTick
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.graphState = graphState;
    window.setupGraphVisualization = setupGraphVisualization;
    window.plotGraph = plotGraph;
    window.drawGraph = drawGraph;
    window.resetGraphView = resetGraphView;
    window.zoomGraph = zoomGraph;
}
