// ===================================
// HISTORY MANAGEMENT
// ===================================

const HISTORY_KEY = 'equasolver_history';
const HISTORY_LIMIT = 50;

function readHistory() {
    try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        if (!Array.isArray(parsed)) return [];
        // Entries saved before pinning existed have no id: derive a stable one from the position
        return parsed.map((item, index) => ({ ...item, id: item.id || `legacy-${index}-${item.timestamp}`, pinned: Boolean(item.pinned) }));
    } catch (e) {
        // Corrupted or unavailable storage: behave as an empty history
        return [];
    }
}

function writeHistory(history) {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        // Storage full or blocked: keep working without persisting
    }
}

function addToHistory(entry) {
    const history = readHistory();
    history.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        entry,
        timestamp: new Date().toLocaleString(),
        pinned: false
    });

    // Favorites never fall off the end: only unpinned entries count toward the limit
    let unpinned = 0;
    const trimmed = history.filter(item => item.pinned || ++unpinned <= HISTORY_LIMIT);

    writeHistory(trimmed);
    updateHistoryDisplay();
}

/**
 * Pin or unpin an entry so it stays at the top and survives "Clear".
 * @param {string} id
 * @returns {boolean} true when the entry exists
 */
function togglePin(id) {
    const history = readHistory();
    const item = history.find(candidate => candidate.id === id);
    if (!item) return false;
    item.pinned = !item.pinned;
    writeHistory(history);
    updateHistoryDisplay();
    return true;
}

function updateHistoryDisplay() {
    const history = readHistory();
    const historyList = document.getElementById('historyList');

    if (!historyList) return;

    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No history yet</p>';
        return;
    }

    // Favorites first, each group keeps newest-first order
    const ordered = [...history.filter(item => item.pinned), ...history.filter(item => !item.pinned)];

    historyList.innerHTML = ordered.map(item => `
        <div class="history-item${item.pinned ? ' pinned' : ''}">
            <div class="history-body">
                <div class="history-entry">${escapeHtml(item.entry)}</div>
                <div class="history-time">${escapeHtml(item.timestamp)}</div>
            </div>
            <button type="button" class="history-pin" data-id="${escapeHtml(item.id)}" aria-pressed="${item.pinned}" aria-label="${item.pinned ? 'Remove from favorites' : 'Add to favorites'}">${item.pinned ? '★' : '☆'}</button>
        </div>
    `).join('');
}

// One delegated listener: the list is re-rendered on every change
function setupHistoryPinning() {
    const historyList = document.getElementById('historyList');
    if (!historyList || historyList.dataset.pinning) return;
    historyList.dataset.pinning = 'true';
    historyList.addEventListener('click', event => {
        const button = event.target.closest && event.target.closest('.history-pin');
        if (button) togglePin(button.dataset.id);
    });
}

// "Clear" removes everything except favorites
function clearHistory() {
    writeHistory(readHistory().filter(item => item.pinned));
    updateHistoryDisplay();
}

function getHistory() {
    return readHistory();
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToHistory,
        updateHistoryDisplay,
        clearHistory,
        getHistory,
        togglePin,
        setupHistoryPinning
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.addToHistory = addToHistory;
    window.updateHistoryDisplay = updateHistoryDisplay;
    window.clearHistory = clearHistory;
    window.getHistory = getHistory;
    window.togglePin = togglePin;
    window.setupHistoryPinning = setupHistoryPinning;
}
