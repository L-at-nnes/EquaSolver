// ===================================
// POLAR GRAPHING MODULE
// ===================================

// evaluateExpression is available globally from parsers/expression.js
// showExportButton is available globally from ui/export.js

function setupPolarGraph() {
    const plotBtn = document.getElementById('plotPolar');
    const rInput = document.getElementById('polarR');
    
    if (plotBtn) {
        plotBtn.addEventListener('click', plotPolarGraph);
    }
    
    if (rInput) {
        rInput.addEventListener('input', updatePolarPreview);
    }
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            applyPolarPreset(btn.dataset.preset);
        });
    });
}

function updatePolarPreview() {
    const rExpr = document.getElementById('polarR').value;
    const preview = document.getElementById('polarPreview');
    
    if (preview) {
        preview.textContent = `r(θ) = ${rExpr}`;
    }
}

function applyPolarPreset(preset) {
    const rInput = document.getElementById('polarR');
    const thetaMax = document.getElementById('thetaMax');
    
    const presets = {
        circle: { r: '2', max: '6.28' },
        cardioid: { r: '1 + cos(theta)', max: '6.28' },
        rose3: { r: 'cos(3*theta)', max: '6.28' },
        rose4: { r: 'cos(2*theta)', max: '6.28' },
        spiral: { r: 'theta', max: '18.84' },
        lemniscate: { r: 'sqrt(abs(4*cos(2*theta)))', max: '6.28' }
    };
    
    if (presets[preset]) {
        rInput.value = presets[preset].r;
        thetaMax.value = presets[preset].max;
        updatePolarPreview();
    }
}

function plotPolarGraph() {
    const canvas = document.getElementById('polarCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const rExpr = document.getElementById('polarR').value;
    const thetaMin = parseFloat(document.getElementById('thetaMin').value);
    const thetaMax = parseFloat(document.getElementById('thetaMax').value);
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate points and convert to Cartesian
    const points = [];
    const steps = 1000;
    let maxR = 0;
    
    for (let i = 0; i <= steps; i++) {
        const theta = thetaMin + (thetaMax - thetaMin) * i / steps;
        const r = evaluateExpression(rExpr, 'theta', theta);
        
        if (!isNaN(r) && isFinite(r)) {
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            points.push({ x, y, r: Math.abs(r) });
            if (Math.abs(r) > maxR) maxR = Math.abs(r);
        }
    }
    
    // Add margin
    maxR *= 1.2;
    
    // Center of canvas
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) / (2 * maxR);
    
    // Draw polar grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    // Radial lines
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + maxR * scale * Math.cos(angle), centerY - maxR * scale * Math.sin(angle));
        ctx.stroke();
    }
    
    // Concentric circles
    const numCircles = 5;
    for (let i = 1; i <= numCircles; i++) {
        const r = (maxR / numCircles) * i * scale;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    
    // Draw curve
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    points.forEach(point => {
        const px = centerX + point.x * scale;
        const py = centerY - point.y * scale;
        
        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
        } else {
            ctx.lineTo(px, py);
        }
    });
    
    ctx.stroke();
    showExportButton('polar');
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupPolarGraph,
        updatePolarPreview,
        applyPolarPreset,
        plotPolarGraph
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupPolarGraph = setupPolarGraph;
    window.plotPolarGraph = plotPolarGraph;
    window.applyPolarPreset = applyPolarPreset;
}
