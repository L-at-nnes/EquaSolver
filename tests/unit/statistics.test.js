/**
 * Tests for Statistics Calculator
 * 
 * This test suite covers:
 * - Mean (average)
 * - Median
 * - Mode
 * - Variance (sample and population)
 * - Standard Deviation
 * - Edge cases and mathematical properties
 */

// Mock DOM elements
document.body.innerHTML = `
    <input type="text" id="statsInput">
    <div id="statisticsSolution"></div>
    <button id="calculateStatistics"></button>
    <button id="exportStatisticsPdf" style="display:none"></button>
`;

// Mock translations
global.translations = {
    en: {
        invalidInput: "Invalid input",
        count: "Count",
        sum: "Sum",
        mean: "Mean",
        median: "Median",
        mode: "Mode",
        variance: "Variance",
        stdDeviation: "Standard Deviation",
        range: "Range",
        noMode: "No mode",
        multipleMode: "Multiple modes"
    }
};
global.currentLang = 'en';

// Import functions from script.js
const {
    calculateMean,
    calculateMedian,
    calculateMode,
    calculateVariance,
    calculateStdDev
} = require('../../src/js/script.js');

describe('Mean (Average)', () => {
    describe('Basic mean calculations', () => {
        test('should calculate mean of simple dataset', () => {
            expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
        });

        test('should calculate mean of even count dataset', () => {
            expect(calculateMean([2, 4, 6, 8])).toBe(5);
        });

        test('should handle single value', () => {
            expect(calculateMean([42])).toBe(42);
        });

        test('should handle decimal results', () => {
            expect(calculateMean([1, 2, 3])).toBeCloseTo(2, 10);
            expect(calculateMean([1, 2])).toBeCloseTo(1.5, 10);
        });

        test('should handle negative numbers', () => {
            expect(calculateMean([-5, -3, -1, 1, 3, 5])).toBe(0);
            expect(calculateMean([-10, 10])).toBe(0);
        });

        test('should handle decimal inputs', () => {
            expect(calculateMean([1.5, 2.5, 3.5])).toBeCloseTo(2.5, 10);
        });
    });

    describe('Edge cases', () => {
        test('should handle zeros', () => {
            expect(calculateMean([0, 0, 0])).toBe(0);
            expect(calculateMean([0, 10, 0])).toBeCloseTo(10/3, 10);
        });

        test('should handle large numbers', () => {
            expect(calculateMean([1000000, 2000000, 3000000])).toBe(2000000);
        });
    });
});

describe('Median', () => {
    describe('Odd count datasets', () => {
        test('should find middle value in sorted odd-length array', () => {
            expect(calculateMedian([1, 2, 3, 4, 5])).toBe(3);
            expect(calculateMedian([1, 3, 5])).toBe(3);
        });

        test('should handle unsorted input', () => {
            expect(calculateMedian([5, 1, 3, 2, 4])).toBe(3);
            expect(calculateMedian([9, 1, 5])).toBe(5);
        });
    });

    describe('Even count datasets', () => {
        test('should average two middle values', () => {
            expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
            expect(calculateMedian([1, 2, 3, 4, 5, 6])).toBe(3.5);
        });

        test('should handle unsorted even-length input', () => {
            expect(calculateMedian([4, 1, 3, 2])).toBe(2.5);
        });
    });

    describe('Edge cases', () => {
        test('should handle single value', () => {
            expect(calculateMedian([42])).toBe(42);
        });

        test('should handle two values', () => {
            expect(calculateMedian([1, 5])).toBe(3);
        });

        test('should handle duplicate values', () => {
            expect(calculateMedian([5, 5, 5, 5, 5])).toBe(5);
        });

        test('should handle negative numbers', () => {
            expect(calculateMedian([-5, -3, -1, 1, 3])).toBe(-1);
        });
    });
});

describe('Mode', () => {
    describe('Single mode', () => {
        test('should find most frequent value', () => {
            expect(calculateMode([1, 2, 2, 3, 4])).toEqual([2]);
            expect(calculateMode([1, 1, 2, 3, 4, 5])).toEqual([1]);
        });

        test('should find mode at end of array', () => {
            expect(calculateMode([1, 2, 3, 4, 4])).toEqual([4]);
        });
    });

    describe('Multiple modes (multimodal)', () => {
        test('should return all modes when tied', () => {
            const result = calculateMode([1, 1, 2, 2, 3]);
            expect(result).toContain(1);
            expect(result).toContain(2);
            expect(result.length).toBe(2);
        });

        test('should handle three modes', () => {
            const result = calculateMode([1, 1, 2, 2, 3, 3]);
            expect(result.length).toBe(3);
        });
    });

    describe('No mode', () => {
        test('should return null when all values appear equally', () => {
            expect(calculateMode([1, 2, 3, 4, 5])).toBeNull();
        });

        test('should return null for all unique values', () => {
            expect(calculateMode([10, 20, 30])).toBeNull();
        });
    });

    describe('Edge cases', () => {
        test('should handle all same values', () => {
            // When all values are the same, that value IS the mode (it appears most frequently)
            expect(calculateMode([5, 5, 5, 5])).toEqual([5]);
        });

        test('should handle single value', () => {
            expect(calculateMode([42])).toBeNull();
        });
    });
});

describe('Variance', () => {
    describe('Sample variance (default)', () => {
        test('should calculate sample variance', () => {
            // [2, 4, 4, 4, 5, 5, 7, 9] mean = 5
            // Sum of squared diff = 9+1+1+1+0+0+4+16 = 32
            // Sample variance = 32 / (8-1) = 32/7 ≈ 4.571
            expect(calculateVariance([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(32/7, 5);
        });

        test('should handle simple dataset', () => {
            // [1, 2, 3] mean = 2
            // Squared diffs: 1, 0, 1 = 2
            // Sample variance = 2/2 = 1
            expect(calculateVariance([1, 2, 3])).toBe(1);
        });
    });

    describe('Population variance', () => {
        test('should calculate population variance', () => {
            // [2, 4, 4, 4, 5, 5, 7, 9] mean = 5
            // Population variance = 32/8 = 4
            expect(calculateVariance([2, 4, 4, 4, 5, 5, 7, 9], false)).toBe(4);
        });
    });

    describe('Edge cases', () => {
        test('should return 0 for identical values', () => {
            expect(calculateVariance([5, 5, 5, 5])).toBe(0);
        });

        test('should handle two values', () => {
            // [1, 3] mean = 2, squared diffs = 1, 1 = 2
            // Sample variance = 2/1 = 2
            expect(calculateVariance([1, 3])).toBe(2);
        });
    });
});

describe('Standard Deviation', () => {
    describe('Sample standard deviation (default)', () => {
        test('should be square root of variance', () => {
            const data = [2, 4, 4, 4, 5, 5, 7, 9];
            const variance = calculateVariance(data);
            expect(calculateStdDev(data)).toBeCloseTo(Math.sqrt(variance), 10);
        });

        test('should calculate for simple dataset', () => {
            // [1, 2, 3] sample variance = 1, std dev = 1
            expect(calculateStdDev([1, 2, 3])).toBe(1);
        });
    });

    describe('Population standard deviation', () => {
        test('should use population variance', () => {
            const data = [2, 4, 4, 4, 5, 5, 7, 9];
            const popVariance = calculateVariance(data, false);
            expect(calculateStdDev(data, false)).toBeCloseTo(Math.sqrt(popVariance), 10);
        });
    });

    describe('Edge cases', () => {
        test('should return 0 for identical values', () => {
            expect(calculateStdDev([5, 5, 5, 5])).toBe(0);
        });

        test('should handle negative numbers', () => {
            // [-2, -1, 0, 1, 2] mean = 0
            const result = calculateStdDev([-2, -1, 0, 1, 2]);
            expect(result).toBeGreaterThan(0);
        });
    });
});

describe('Statistical Properties', () => {
    test('variance of translated data remains same', () => {
        const data = [1, 2, 3, 4, 5];
        const translated = data.map(x => x + 100);
        expect(calculateVariance(data)).toBeCloseTo(calculateVariance(translated), 10);
    });

    test('variance scales with square of multiplier', () => {
        const data = [1, 2, 3, 4, 5];
        const scaled = data.map(x => x * 2);
        expect(calculateVariance(scaled)).toBeCloseTo(calculateVariance(data) * 4, 10);
    });

    test('median is less affected by outliers than mean', () => {
        const normalData = [1, 2, 3, 4, 5];
        const withOutlier = [1, 2, 3, 4, 100];
        
        expect(calculateMedian(normalData)).toBe(3);
        expect(calculateMedian(withOutlier)).toBe(3); // Same median
        
        expect(calculateMean(normalData)).toBe(3);
        expect(calculateMean(withOutlier)).toBe(22); // Mean affected significantly
    });
});
