// ===================================
// PARAMETRIC GRAPHING MODULE
// ===================================

// evaluateExpression is available globally from parsers/expression.js
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
        preview.innerHTML = `<div>x(t) = ${xExpr}</div><div>y(t) = ${yExpr}</div>`;
    }
}

function plotParametricGraph() {
    const canvas = document.getElementById('parametricCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const xExpr = document.getElementById('parametricX').value;
    const yExpr = document.getElementById('parametricY').value;
    const tMin = parseFloat(document.getElementById('tMin').value);
    const tMax = parseFloat(document.getElementById('tMax').value);
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate points
    const points = [];
    const steps = 1000;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    for (let i = 0; i <= steps; i++) {
        const t = tMin + (tMax - tMin) * i / steps;
        const x = evaluateExpression(xExpr, 't', t);
        const y = evaluateExpression(yExpr, 't', t);
        
        if (!isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
            points.push({ x, y });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
    
    // Add margin
    const margin = 0.1;
    const rangeX = (maxX - minX) * (1 + margin);
    const rangeY = (maxY - minY) * (1 + margin);
    minX -= rangeX * margin / 2;
    maxX += rangeX * margin / 2;
    minY -= rangeY * margin / 2;
    maxY += rangeY * margin / 2;
    
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
    
    // Draw axes
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    
    if (minX <= 0 && maxX >= 0) {
        const x0 = ((0 - minX) / (maxX - minX)) * width;
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, height);
        ctx.stroke();
    }
    
    if (minY <= 0 && maxY >= 0) {
        const y0 = height - ((0 - minY) / (maxY - minY)) * height;
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(width, y0);
        ctx.stroke();
    }
    
    // Draw curve
    ctx.strokeStyle = '#ff0080';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    points.forEach(point => {
        const px = ((point.x - minX) / (maxX - minX)) * width;
        const py = height - ((point.y - minY) / (maxY - minY)) * height;
        
        if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
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
        plotParametricGraph
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupParametricGraph = setupParametricGraph;
    window.plotParametricGraph = plotParametricGraph;
}
