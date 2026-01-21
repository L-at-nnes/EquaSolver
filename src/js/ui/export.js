// ===================================
// PDF EXPORT
// ===================================

function showExportButton(type) {
    const exportBtn = document.getElementById(`export${type.charAt(0).toUpperCase() + type.slice(1)}Pdf`);
    if (exportBtn) {
        exportBtn.style.display = 'block';
    }
}

function exportToPDF(type) {
    if (typeof window === 'undefined' || !window.jspdf) {
        console.error('jsPDF not available');
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
    
    const solutionContainer = document.getElementById(`${type}Solution`);
    if (!solutionContainer || !solutionContainer.textContent.trim()) {
        alert('No solution to export. Please solve the equation first.');
        return;
    }
    
    const equationDisplay = document.querySelector(`#${type} .equation-preview`);
    const solutionText = solutionContainer.textContent;
    
    if (equationDisplay) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Equation:', 20, yPos);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.text(equationDisplay.textContent, 20, yPos);
        yPos += 15;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Solution:', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(solutionText, 170);
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

function exportGraphToPDF(graphState) {
    if (typeof window === 'undefined' || !window.jspdf) {
        console.error('jsPDF not available');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const canvas = document.getElementById('graphCanvas');
    
    if (!canvas || (!graphState.coefficients.a && graphState.coefficients.a !== 0)) {
        alert('Please plot a graph first.');
        return;
    }
    
    doc.setFont('helvetica');
    
    doc.setFontSize(20);
    doc.text('EquaSolver - Graph', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Equation:', 20, 50);
    doc.setFont('helvetica', 'normal');
    
    let equationText = '';
    const coef = graphState.coefficients;
    switch (graphState.type) {
        case 'linear':
            equationText = `y = ${coef.a}x + ${coef.b}`;
            break;
        case 'quadratic':
            equationText = `y = ${coef.a}x² + ${coef.b}x + ${coef.c}`;
            break;
        case 'cubic':
            equationText = `y = ${coef.a}x³ + ${coef.b}x² + ${coef.c}x + ${coef.d}`;
            break;
    }
    doc.text(equationText, 20, 60);
    
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, 70, 170, 120);
    
    const fileName = `equasolver_graph_${Date.now()}.pdf`;
    doc.save(fileName);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showExportButton,
        exportToPDF,
        exportGraphToPDF
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.showExportButton = showExportButton;
    window.exportToPDF = exportToPDF;
    window.exportGraphToPDF = exportGraphToPDF;
}

