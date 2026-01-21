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

function updateGraphRange() {
    graphState.xMin = parseFloat(document.getElementById('xMin')?.value || -10);
    graphState.xMax = parseFloat(document.getElementById('xMax')?.value || 10);
    graphState.yMin = parseFloat(document.getElementById('yMin')?.value || -10);
    graphState.yMax = parseFloat(document.getElementById('yMax')?.value || 10);
}

function plotGraph() {
    updateGraphRange();
    
    // Get coefficients
    const a = parseFloat(document.getElementById('graphA')?.value || 0);
    const b = parseFloat(document.getElementById('graphB')?.value || 0);
    const c = parseFloat(document.getElementById('graphC')?.value || 0);
    const d = parseFloat(document.getElementById('graphD')?.value || 0);
    
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
    
    // Vertical lines
    const xStep = (xMax - xMin) / 20;
    for (let x = xMin; x <= xMax; x += xStep) {
        const px = mapX(x, width);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();
    }
    
    // Horizontal lines
    const yStep = (yMax - yMin) / 20;
    for (let y = yMin; y <= yMax; y += yStep) {
        const py = mapY(y, height);
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
        const xStep = Math.ceil((xMax - xMin) / 10);
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            if (x !== 0) {
                const px = mapX(x, width);
                ctx.fillText(x.toString(), px, y0 + 20);
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
        const yStep = Math.ceil((yMax - yMin) / 10);
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            if (y !== 0) {
                const py = mapY(y, height);
                ctx.fillText(y.toString(), x0 - 10, py + 4);
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
    
    let firstPoint = true;
    const step = (xMax - xMin) / width;
    
    for (let x = xMin; x <= xMax; x += step) {
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
        
        const px = mapX(x, width);
        const py = mapY(y, height);
        
        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
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
    
    graphState.xMin = xCenter - xRange / 2;
    graphState.xMax = xCenter + xRange / 2;
    graphState.yMin = yCenter - yRange / 2;
    graphState.yMax = yCenter + yRange / 2;
    
    const inputs = ['xMin', 'xMax', 'yMin', 'yMax'];
    const values = [graphState.xMin, graphState.xMax, graphState.yMin, graphState.yMax];
    inputs.forEach((id, i) => {
        const input = document.getElementById(id);
        if (input) input.value = values[i].toFixed(2);
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
        zoomGraph
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
