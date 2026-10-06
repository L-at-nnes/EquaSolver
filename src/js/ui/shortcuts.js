// ===================================
// KEYBOARD SHORTCUTS HELP
// ===================================

/**
 * True when the event target is somewhere the user is typing text.
 * @param {EventTarget|null} target
 */
function isTypingTarget(target) {
    if (!target || !target.tagName) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable === true;
}

/**
 * Open the shortcuts dialog with "?" or its button, close it with Escape or its close button.
 * @param {Document} doc
 */
function setupShortcutsHelp(doc = document) {
    const dialog = doc.getElementById('shortcutsDialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const open = () => {
        if (!dialog.open) dialog.showModal();
    };

    doc.getElementById('shortcutsBtn')?.addEventListener('click', open);
    doc.getElementById('shortcutsClose')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
    });
    doc.addEventListener('keydown', event => {
        if (event.key !== '?' || event.ctrlKey || event.metaKey || event.altKey) return;
        if (isTypingTarget(event.target)) return;
        event.preventDefault();
        open();
    });
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isTypingTarget, setupShortcutsHelp };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.isTypingTarget = isTypingTarget;
    window.setupShortcutsHelp = setupShortcutsHelp;
}
