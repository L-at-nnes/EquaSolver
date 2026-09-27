// ===================================
// HISTORY MANAGEMENT
// ===================================

function readHistory() {
    try {
        const parsed = JSON.parse(localStorage.getItem('equasolver_history') || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        // Corrupted or unavailable storage: behave as an empty history
        return [];
    }
}

function addToHistory(entry) {
    const history = readHistory();
    history.unshift({ 
        entry, 
        timestamp: new Date().toLocaleString() 
    });
    
    if (history.length > 50) history.pop();
    
    try {
        localStorage.setItem('equasolver_history', JSON.stringify(history));
    } catch (e) {
        // Storage full or blocked: keep working without persisting
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = readHistory();
    const historyList = document.getElementById('historyList');
    
    if (!historyList) return;
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No history yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-entry">${escapeHtml(item.entry)}</div>
            <div class="history-time">${escapeHtml(item.timestamp)}</div>
        </div>
    `).join('');
}

function clearHistory() {
    try {
        localStorage.removeItem('equasolver_history');
    } catch (e) {
        // Storage unavailable: nothing to clear
    }
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
        getHistory
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.addToHistory = addToHistory;
    window.updateHistoryDisplay = updateHistoryDisplay;
    window.clearHistory = clearHistory;
    window.getHistory = getHistory;
}

