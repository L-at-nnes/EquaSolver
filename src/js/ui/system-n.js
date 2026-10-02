// ===================================
// N x N LINEAR SYSTEM UI
// ===================================

// solveLinearSystem (math/linear-system.js), parseDecimal (ui/inputs.js), escapeHtml, subscriptNum,
// addToHistory and showExportButton are available globally.

const SYSTEM_N_LIMITS = { min: 2, max: 5 };

function systemSubscript(index) {
    return String(index).split('').map(digit => '₀₁₂₃₄₅₆₇₈₉'[Number(digit)]).join('');
}

/** Build the n x (n + 1) grid of inputs: coefficients, then the constant column. */
function buildSystemNGrid(size, grid = document.getElementById('systemNGrid')) {
    if (!grid) return;
    grid.textContent = '';
    grid.style.setProperty('--columns', size + 1);
    for (let row = 0; row < size; row++) {
        for (let col = 0; col <= size; col++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'decimal';
            input.className = 'matrix-cell' + (col === size ? ' constant-cell' : '');
            input.id = `sysN_${row}_${col}`;
            input.value = row === col ? '1' : '0';
            input.setAttribute('aria-label', col === size
                ? `constant ${row + 1}`
                : `a${row + 1}${col + 1}`);
            grid.appendChild(input);
        }
    }
}

/** Read the grid; blank cells count as 0 and any invalid cell makes the result null. */
function readSystemN(size, root = document) {
    const A = [];
    const b = [];
    for (let row = 0; row < size; row++) {
        const values = [];
        for (let col = 0; col <= size; col++) {
            const input = root.getElementById ? root.getElementById(`sysN_${row}_${col}`) : root.querySelector(`#sysN_${row}_${col}`);
            const raw = input ? String(input.value).trim() : '';
            const value = raw === '' ? 0 : parseDecimal(raw);
            if (Number.isNaN(value)) return null;
            values.push(value);
        }
        b.push(values.pop());
        A.push(values);
    }
    return { A, b };
}

function matrixTableHtml(matrix) {
    const size = matrix.length;
    const cells = matrix.map(row => `<tr>${row.map((value, col) =>
        `<td${col === size ? ' class="constant-col"' : ''}>${escapeHtml(value)}</td>`).join('')}</tr>`).join('');
    return `<table class="gauss-matrix"><tbody>${cells}</tbody></table>`;
}

/**
 * HTML for a solved system: the verdict (values, or why there is none) and the
 * elimination steps folded into a <details> block.
 */
function renderSystemNSolution(result, trans = {}) {
    const t = key => trans[key] || '';
    let html = `<h3>${t('solution') || 'Solution'}</h3>`;

    if (result.status === 'invalid') {
        return `<p class="error">${t('invalidInput') || 'Invalid input'}</p>`;
    }

    if (result.status === 'unique') {
        html += '<div class="solution values">' + result.solution.map((value, i) =>
            `<p>x${systemSubscript(i + 1)} = <span class="highlight">${escapeHtml(formatSystemNumber(value))}</span></p>`).join('') + '</div>';
    } else if (result.status === 'infinite') {
        html += `<div class="solution"><p>${t('infiniteSolutions') || 'Infinite solutions'}</p><p>rank = ${result.rank}</p></div>`;
    } else {
        html += `<div class="solution"><p>${t('noSolution') || 'No solution'}</p></div>`;
    }

    const steps = result.steps.map((step, index) => `
        <li class="gauss-step">
            <span class="gauss-op">${index === 0 ? escapeHtml(t('systemStart') || 'Augmented matrix') : escapeHtml(step.description)}</span>
            ${matrixTableHtml(step.matrix)}
        </li>`).join('');
    html += `<details class="gauss-steps"><summary>${t('gaussianSteps') || 'Elimination steps'}</summary><ol>${steps}</ol></details>`;
    return html;
}

function setupSystemN() {
    const sizeSelect = document.getElementById('systemNSize');
    const button = document.getElementById('solveSystemN');
    if (!sizeSelect || !button) return;

    const currentSize = () => Math.min(SYSTEM_N_LIMITS.max, Math.max(SYSTEM_N_LIMITS.min, parseInt(sizeSelect.value, 10) || 3));

    buildSystemNGrid(currentSize());
    sizeSelect.addEventListener('change', () => buildSystemNGrid(currentSize()));

    button.addEventListener('click', () => {
        const size = currentSize();
        const output = document.getElementById('systemNSolution');
        const trans = (typeof translations !== 'undefined' && translations[window.currentLang]) || {};
        const data = readSystemN(size);
        if (!data) {
            output.innerHTML = `<p class="error">${trans.invalidInput || 'Invalid input'}</p>`;
            return;
        }
        const result = solveLinearSystem(data.A, data.b);
        output.innerHTML = renderSystemNSolution(result, trans);
        showExportButton('systemN');

        const summary = result.status === 'unique'
            ? result.solution.map((value, i) => `x${i + 1} = ${formatSystemNumber(value)}`).join(', ')
            : result.status;
        addToHistory(`${size}×${size} system: ${summary}`);
    });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildSystemNGrid, readSystemN, renderSystemNSolution, setupSystemN, systemSubscript };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupSystemN = setupSystemN;
}
