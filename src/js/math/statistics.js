// ===================================
// STATISTICS
// ===================================

function calculateMean(data) {
    if (!data || data.length === 0) return null;
    return data.reduce((a, b) => a + b, 0) / data.length;
}

function calculateMedian(data) {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateMode(data) {
    if (!data || data.length === 0) return null;
    const frequency = {};
    data.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(Number);
    
    if (modes.length === data.length) return null;
    return modes;
}

function calculateVariance(data, isSample = true) {
    if (!data || data.length === 0) return null;
    if (isSample && data.length < 2) return null;
    const mean = calculateMean(data);
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const divisor = isSample ? data.length - 1 : data.length;
    return squaredDiffs.reduce((a, b) => a + b, 0) / divisor;
}

function calculateStdDev(data, isSample = true) {
    const variance = calculateVariance(data, isSample);
    if (variance === null) return null;
    return Math.sqrt(variance);
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateMean,
        calculateMedian,
        calculateMode,
        calculateVariance,
        calculateStdDev
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.calculateMean = calculateMean;
    window.calculateMedian = calculateMedian;
    window.calculateMode = calculateMode;
    window.calculateVariance = calculateVariance;
    window.calculateStdDev = calculateStdDev;
}