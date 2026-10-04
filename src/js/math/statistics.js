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

/**
 * Quantile with linear interpolation between ranks (the "inclusive" method of
 * spreadsheets: QUARTILE.INC / numpy default).
 * @param {number[]} data
 * @param {number} p between 0 and 1
 */
function calculateQuantile(data, p) {
    if (!data || data.length === 0 || !(p >= 0 && p <= 1)) return null;
    const sorted = [...data].sort((a, b) => a - b);
    const position = (sorted.length - 1) * p;
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

/** Five number summary plus the interquartile range. */
function calculateQuartiles(data) {
    if (!data || data.length === 0) return null;
    const q1 = calculateQuantile(data, 0.25);
    const median = calculateQuantile(data, 0.5);
    const q3 = calculateQuantile(data, 0.75);
    return { min: Math.min(...data), q1, median, q3, max: Math.max(...data), iqr: q3 - q1 };
}

/** Values beyond 1.5 x IQR from the quartiles (Tukey's fences), in input order. */
function findOutliers(data) {
    const quartiles = calculateQuartiles(data);
    if (!quartiles) return [];
    const low = quartiles.q1 - 1.5 * quartiles.iqr;
    const high = quartiles.q3 + 1.5 * quartiles.iqr;
    return data.filter(value => value < low || value > high);
}

/**
 * Equal width bins over [min, max]. The default bin count follows Sturges' rule.
 * The maximum falls in the last bin.
 * @returns {{start:number, end:number, count:number}[]}
 */
function buildHistogram(data, bins) {
    if (!data || data.length === 0) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const count = Math.max(1, Math.min(60, bins || Math.ceil(Math.log2(data.length)) + 1));
    if (min === max) return [{ start: min, end: max, count: data.length }];
    const width = (max - min) / count;
    const result = Array.from({ length: count }, (_, i) => ({ start: min + i * width, end: min + (i + 1) * width, count: 0 }));
    data.forEach(value => {
        const index = Math.min(count - 1, Math.floor((value - min) / width));
        result[index].count++;
    });
    return result;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateMean,
        calculateMedian,
        calculateMode,
        calculateVariance,
        calculateStdDev,
        calculateQuantile,
        calculateQuartiles,
        findOutliers,
        buildHistogram
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.calculateMean = calculateMean;
    window.calculateMedian = calculateMedian;
    window.calculateMode = calculateMode;
    window.calculateVariance = calculateVariance;
    window.calculateStdDev = calculateStdDev;
    window.calculateQuantile = calculateQuantile;
    window.calculateQuartiles = calculateQuartiles;
    window.findOutliers = findOutliers;
    window.buildHistogram = buildHistogram;
}