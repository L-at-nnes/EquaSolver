// ===================================
// PDF EXPORT
// ===================================

function showExportButton(type) {
    const exportBtn = document.getElementById(`export${type.charAt(0).toUpperCase() + type.slice(1)}Pdf`);
    if (exportBtn) {
        exportBtn.style.display = 'block';
    }
}

// jsPDF's built-in fonts only cover Latin-1, so symbols such as ∞ ≤ ₁ Δ would be
// printed as garbage. Replace them with readable ASCII equivalents.
const PDF_TEXT_REPLACEMENTS = {
    '∞': 'inf', '≤': '<=', '≥': '>=', '≠': '!=', '≈': '~',
    '→': '->', '∅': '{}', '∪': 'U', 'ℝ': 'R', 'Δ': 'Delta',
    '√': 'sqrt', '∫': 'Integral', 'π': 'pi', 'θ': 'theta',
    '−': '-', '·': '*', '⁻': '-', '⁺': '+', '¹': '^1',
    '⁰': '^0', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7',
    '⁸': '^8', '⁹': '^9', '₀': '0', '₁': '1', '₂': '2',
    '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7',
    '₈': '8', '₉': '9', 'ˣ': '^x', 'ₙ': 'n'
};

function toPdfText(text) {
    return String(text).replace(/[^\u0000-ÿ]/g, ch => PDF_TEXT_REPLACEMENTS[ch] || '?');
}

function exportToPDF(type) {
    if (typeof window === 'undefined' || !window.jspdf) {
        console.error('jsPDF not available');
        return;
    }

    const solutionContainer = document.getElementById(`${type}Solution`);
    if (!solutionContainer || !solutionContainer.textContent.trim()) {
        alert('No solution to export. Please solve the equation first.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('helvetica');

    doc.setFontSize(20);
    doc.text('EquaSolver - Solution', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });

    let yPos = 50;

    const panel = solutionContainer.closest('.calculator-panel');
    const equationDisplay = panel ? panel.querySelector('.equation-preview') : null;
    const solutionText = solutionContainer.textContent;

    if (equationDisplay && equationDisplay.textContent.trim()) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Equation:', 20, yPos);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.splitTextToSize(toPdfText(equationDisplay.textContent.trim()), 170).forEach(line => {
            doc.text(line, 20, yPos);
            yPos += 7;
        });
        yPos += 8;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Solution:', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(toPdfText(solutionText.replace(/[ \t]*\n[ \t\n]*/g, '\n').trim()), 170);
    lines.forEach(line => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 7;
    });

    const fileName = `equasolver_${type}_${Date.now()}.pdf`;
    doc.save(fileName);
}

/**
 * Export a canvas drawing (graph, parametric or polar plot) to a PDF.
 * @param {string} canvasId id of the canvas element
 * @param {string} title PDF heading
 * @param {string[]} equationLines equations printed above the picture
 * @param {string} filePrefix prefix of the downloaded file name
 */
function exportCanvasToPDF(canvasId, title, equationLines, filePrefix) {
    if (typeof window === 'undefined' || !window.jspdf) {
        console.error('jsPDF not available');
        return;
    }

    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        alert('Please plot a graph first.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont('helvetica');

    doc.setFontSize(20);
    doc.text(toPdfText(title), 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Equation:', 20, 50);
    doc.setFont('helvetica', 'normal');

    let yPos = 60;
    equationLines.forEach(line => {
        doc.splitTextToSize(toPdfText(line), 170).forEach(part => {
            doc.text(part, 20, yPos);
            yPos += 7;
        });
    });

    // Keep the canvas aspect ratio instead of stretching it to a fixed box
    const imageWidth = 170;
    const imageHeight = imageWidth * (canvas.height / canvas.width || 0.75);
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 20, yPos + 5, imageWidth, imageHeight);

    doc.save(`${filePrefix}_${Date.now()}.pdf`);
}

function formatSignedTerm(coefficient, suffix) {
    const sign = coefficient < 0 ? '-' : '+';
    return `${sign} ${Math.abs(coefficient)}${suffix}`;
}

function exportGraphToPDF(graphState) {
    const coef = graphState.coefficients || {};
    if (coef.a === undefined || Number.isNaN(coef.a)) {
        alert('Please plot a graph first.');
        return;
    }

    let equationText = '';
    switch (graphState.equationType) {
        case 'linear':
            equationText = `y = ${coef.a}x ${formatSignedTerm(coef.b, '')}`;
            break;
        case 'quadratic':
            equationText = `y = ${coef.a}x² ${formatSignedTerm(coef.b, 'x')} ${formatSignedTerm(coef.c, '')}`;
            break;
        case 'cubic':
            equationText = `y = ${coef.a}x³ ${formatSignedTerm(coef.b, 'x²')} ${formatSignedTerm(coef.c, 'x')} ${formatSignedTerm(coef.d, '')}`;
            break;
    }

    exportCanvasToPDF('graphCanvas', 'EquaSolver - Graph', [equationText], 'equasolver_graph');
}

function exportParametricToPDF() {
    const xExpr = document.getElementById('parametricX')?.value || '';
    const yExpr = document.getElementById('parametricY')?.value || '';
    exportCanvasToPDF('parametricCanvas', 'EquaSolver - Parametric Graph',
        [`x(t) = ${xExpr}`, `y(t) = ${yExpr}`], 'equasolver_parametric');
}

function exportPolarToPDF() {
    const rExpr = document.getElementById('polarR')?.value || '';
    exportCanvasToPDF('polarCanvas', 'EquaSolver - Polar Graph', [`r(θ) = ${rExpr}`], 'equasolver_polar');
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showExportButton,
        exportToPDF,
        exportGraphToPDF,
        exportCanvasToPDF,
        exportParametricToPDF,
        exportPolarToPDF,
        toPdfText
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.showExportButton = showExportButton;
    window.exportToPDF = exportToPDF;
    window.exportGraphToPDF = exportGraphToPDF;
    window.exportCanvasToPDF = exportCanvasToPDF;
    window.exportParametricToPDF = exportParametricToPDF;
    window.exportPolarToPDF = exportPolarToPDF;
}
