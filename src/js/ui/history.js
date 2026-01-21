// ===================================
// HISTORY MANAGEMENT
// ===================================

function addToHistory(entry) {
    const history = JSON.parse(localStorage.getItem('equasolver_history') || '[]');
    history.unshift({ 
        entry, 
        timestamp: new Date().toLocaleString() 
    });
    
    if (history.length > 50) history.pop();
    
    localStorage.setItem('equasolver_history', JSON.stringify(history));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('equasolver_history') || '[]');
    const historyList = document.getElementById('historyList');
    
    if (!historyList) return;
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center; color:var(--text-secondary);">No history yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-entry">${item.entry}</div>
            <div class="history-time">${item.timestamp}</div>
        </div>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem('equasolver_history');
    updateHistoryDisplay();
}

function getHistory() {
    return JSON.parse(localStorage.getItem('equasolver_history') || '[]');
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

