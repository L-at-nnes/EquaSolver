// ===================================
// COPY RESULT
// ===================================

/**
 * Plain text of a solution block: whitespace collapsed, one value per line.
 * @param {Element} container
 */
function solutionToText(container) {
    const lines = [];
    const blocks = container.querySelectorAll('h3, h4, h5, p, .result-group, .step-item, .matrix-result, .final-result');
    const seen = new Set();
    blocks.forEach(block => {
        // Skip blocks nested in an already collected block (a step inside the steps list, etc.)
        for (let parent = block.parentElement; parent && parent !== container; parent = parent.parentElement) {
            if (seen.has(parent)) return;
        }
        seen.add(block);
        const text = block.textContent.replace(/\s+/g, ' ').trim();
        if (text) lines.push(text);
    });
    return (lines.length ? lines.join('\n') : container.textContent.replace(/[ \t]*\n[ \t\n]*/g, '\n').trim());
}

/**
 * Write text to the clipboard, with a textarea fallback for browsers or
 * contexts (http, older WebViews) where the async API is unavailable.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyTextToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (error) {
        // fall through to the legacy path
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
        ok = document.execCommand('copy');
    } catch (error) {
        ok = false;
    }
    area.remove();
    return ok;
}

/**
 * Give every solution block a "Copy" button that appears once it has content.
 * The button is a sibling, so re-rendering the block never wipes it.
 */
function setupCopyButtons(root = document) {
    root.querySelectorAll('.solution-container').forEach(container => {
        if (container.nextElementSibling && container.nextElementSibling.classList.contains('copy-result')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-result';
        button.hidden = true;
        button.dataset.translate = 'copyResult';
        button.textContent = 'Copy result';
        container.after(button);

        const sync = () => { button.hidden = container.textContent.trim() === ''; };
        new MutationObserver(sync).observe(container, { childList: true, subtree: true, characterData: true });
        sync();

        button.addEventListener('click', async () => {
            const ok = await copyTextToClipboard(solutionToText(container));
            const lang = window.currentLang;
            const labels = (typeof translations !== 'undefined' && translations[lang]) || {};
            const original = labels.copyResult || 'Copy result';
            button.textContent = ok ? (labels.copied || 'Copied') : (labels.copyFailed || 'Copy failed');
            button.classList.toggle('done', ok);
            setTimeout(() => {
                button.textContent = original;
                button.classList.remove('done');
            }, 1600);
        });
    });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { solutionToText, copyTextToClipboard, setupCopyButtons };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.setupCopyButtons = setupCopyButtons;
    window.copyTextToClipboard = copyTextToClipboard;
}
