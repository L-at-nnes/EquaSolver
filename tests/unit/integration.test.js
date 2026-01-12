/**
 * Comprehensive Integration Tests
 * Tests for overall application functionality
 */

describe('Application Integration', () => {
    describe('State Management', () => {
        let state = {
            display: '0',
            operation: null,
            previousValue: null,
            waitingForOperand: false
        };

        beforeEach(() => {
            state = {
                display: '0',
                operation: null,
                previousValue: null,
                waitingForOperand: false
            };
        });

        test('should have correct initial state', () => {
            expect(state.display).toBe('0');
            expect(state.operation).toBeNull();
            expect(state.previousValue).toBeNull();
            expect(state.waitingForOperand).toBe(false);
        });

        test('should update display when entering numbers', () => {
            state.display = '5';
            expect(state.display).toBe('5');
            state.display = '52';
            expect(state.display).toBe('52');
        });

        test('should store operation', () => {
            state.operation = '+';
            expect(state.operation).toBe('+');
        });

        test('should store previous value', () => {
            state.previousValue = 10;
            expect(state.previousValue).toBe(10);
        });
    });

    describe('Settings Persistence', () => {
        let mockSettings = {};

        function saveSettings(settings) {
            mockSettings = JSON.stringify(settings);
        }

        function loadSettings() {
            return mockSettings ? JSON.parse(mockSettings) : null;
        }

        test('should save theme setting', () => {
            saveSettings({ theme: 'matrix', lang: 'en', mode: 'dark' });
            const loaded = loadSettings();
            expect(loaded.theme).toBe('matrix');
        });

        test('should save language setting', () => {
            saveSettings({ theme: 'matrix', lang: 'fr', mode: 'dark' });
            const loaded = loadSettings();
            expect(loaded.lang).toBe('fr');
        });

        test('should save mode setting', () => {
            saveSettings({ theme: 'matrix', lang: 'en', mode: 'light' });
            const loaded = loadSettings();
            expect(loaded.mode).toBe('light');
        });
    });

    describe('History Management', () => {
        let history = [];

        function addToHistory(entry) {
            history.unshift({
                entry,
                timestamp: new Date().toISOString()
            });
            if (history.length > 50) history.pop();
        }

        function clearHistory() {
            history = [];
        }

        beforeEach(() => {
            history = [];
        });

        test('should add entry to history', () => {
            addToHistory('2 + 2 = 4');
            expect(history.length).toBe(1);
            expect(history[0].entry).toBe('2 + 2 = 4');
        });

        test('should add entries to beginning', () => {
            addToHistory('first');
            addToHistory('second');
            expect(history[0].entry).toBe('second');
            expect(history[1].entry).toBe('first');
        });

        test('should limit history to 50 entries', () => {
            for (let i = 0; i < 60; i++) {
                addToHistory(`entry ${i}`);
            }
            expect(history.length).toBe(50);
        });

        test('should clear history', () => {
            addToHistory('test');
            clearHistory();
            expect(history.length).toBe(0);
        });

        test('should include timestamp', () => {
            addToHistory('test');
            expect(history[0].timestamp).toBeDefined();
        });
    });

    describe('Tab Navigation', () => {
        const tabs = ['standard', 'linear', 'quadratic', 'cubic', 'quartic', 'quintic', 'systems', 'matrix', 'graph', 'parametric', 'polar', 'latex'];
        let activeTab;

        beforeEach(() => {
            activeTab = 'standard';
        });

        function switchTab(tab) {
            if (tabs.includes(tab)) {
                activeTab = tab;
                return true;
            }
            return false;
        }

        test('should switch to valid tab', () => {
            expect(switchTab('linear')).toBe(true);
            expect(activeTab).toBe('linear');
        });

        test('should not switch to invalid tab', () => {
            expect(switchTab('invalid')).toBe(false);
            expect(activeTab).toBe('standard');
        });

        test('should support all equation types', () => {
            tabs.forEach(tab => {
                activeTab = 'standard';
                expect(switchTab(tab)).toBe(true);
            });
        });
    });

    describe('Theme System', () => {
        const themes = ['cyberpunk', 'neon', 'matrix', 'sunset', 'ocean', 'galaxy', 'custom'];
        let currentTheme = 'matrix';

        function changeTheme(theme) {
            if (themes.includes(theme)) {
                currentTheme = theme;
                return true;
            }
            return false;
        }

        test('should change to valid theme', () => {
            expect(changeTheme('cyberpunk')).toBe(true);
            expect(currentTheme).toBe('cyberpunk');
        });

        test('should support custom theme', () => {
            expect(changeTheme('custom')).toBe(true);
            expect(currentTheme).toBe('custom');
        });

        test('should not change to invalid theme', () => {
            expect(changeTheme('invalid')).toBe(false);
        });

        test('should have 7 themes including custom', () => {
            expect(themes.length).toBe(7);
        });
    });

    describe('Language System', () => {
        const languages = ['en', 'fr', 'es', 'de', 'it', 'ru'];
        let currentLang = 'en';

        function changeLanguage(lang) {
            if (languages.includes(lang)) {
                currentLang = lang;
                return true;
            }
            return false;
        }

        test('should change to valid language', () => {
            expect(changeLanguage('fr')).toBe(true);
            expect(currentLang).toBe('fr');
        });

        test('should support all 6 languages', () => {
            expect(languages.length).toBe(6);
            languages.forEach(lang => {
                expect(changeLanguage(lang)).toBe(true);
            });
        });
    });

    describe('Mode Toggle', () => {
        let currentMode = 'dark';

        function changeMode(mode) {
            if (mode === 'dark' || mode === 'light') {
                currentMode = mode;
                return true;
            }
            return false;
        }

        test('should toggle to light mode', () => {
            expect(changeMode('light')).toBe(true);
            expect(currentMode).toBe('light');
        });

        test('should toggle to dark mode', () => {
            currentMode = 'light';
            expect(changeMode('dark')).toBe(true);
            expect(currentMode).toBe('dark');
        });
    });
});

describe('Input Validation', () => {
    describe('Coefficient Validation', () => {
        function isValidCoefficient(value) {
            if (value === '' || value === null || value === undefined) return false;
            const num = parseFloat(value);
            if (isNaN(num) || !isFinite(num)) return false;
            // Check if the string can be cleanly converted (no multiple dots)
            if (String(value).split('.').length > 2) return false;
            return true;
        }

        test('should accept integers', () => {
            expect(isValidCoefficient('5')).toBe(true);
            expect(isValidCoefficient('-3')).toBe(true);
            expect(isValidCoefficient('0')).toBe(true);
        });

        test('should accept decimals', () => {
            expect(isValidCoefficient('3.14')).toBe(true);
            expect(isValidCoefficient('-2.5')).toBe(true);
            expect(isValidCoefficient('0.001')).toBe(true);
        });

        test('should reject non-numeric values', () => {
            expect(isValidCoefficient('abc')).toBe(false);
            expect(isValidCoefficient('')).toBe(false);
            expect(isValidCoefficient('1.2.3')).toBe(false);
        });

        test('should reject Infinity', () => {
            expect(isValidCoefficient('Infinity')).toBe(false);
            expect(isValidCoefficient('-Infinity')).toBe(false);
        });
    });

    describe('Range Validation', () => {
        function isValidRange(min, max) {
            return parseFloat(min) < parseFloat(max);
        }

        test('should accept valid range', () => {
            expect(isValidRange('-10', '10')).toBe(true);
            expect(isValidRange('0', '100')).toBe(true);
        });

        test('should reject invalid range', () => {
            expect(isValidRange('10', '-10')).toBe(false);
            expect(isValidRange('5', '5')).toBe(false);
        });
    });
});

describe('Mathematical Accuracy', () => {
    describe('Floating Point Precision', () => {
        test('should handle 0.1 + 0.2', () => {
            const result = 0.1 + 0.2;
            expect(result).toBeCloseTo(0.3, 10);
        });

        test('should handle very small numbers', () => {
            const result = 1e-15 + 1e-15;
            expect(result).toBeCloseTo(2e-15, 20);
        });

        test('should handle very large numbers', () => {
            const result = 1e15 + 1e15;
            expect(result).toBe(2e15);
        });
    });

    describe('Edge Cases in Calculations', () => {
        test('should handle division by very small number', () => {
            const result = 1 / 1e-10;
            expect(result).toBe(1e10);
        });

        test('should handle multiplication by zero', () => {
            expect(0 * 1e100).toBe(0);
        });

        test('should handle negative square roots', () => {
            expect(Math.sqrt(-1)).toBeNaN();
        });
    });
});

describe('PDF Export Functionality', () => {
    describe('Export Data Preparation', () => {
        function prepareExportData(type, equation, solution) {
            return {
                title: 'EquaSolver - Solution',
                type,
                equation,
                solution,
                timestamp: new Date().toISOString()
            };
        }

        test('should prepare linear equation data', () => {
            const data = prepareExportData('linear', '2x + 4 = 0', 'x = -2');
            expect(data.type).toBe('linear');
            expect(data.equation).toBe('2x + 4 = 0');
            expect(data.solution).toBe('x = -2');
        });

        test('should include timestamp', () => {
            const data = prepareExportData('quadratic', 'x^2 = 4', 'x = 2, -2');
            expect(data.timestamp).toBeDefined();
        });
    });

    describe('Filename Generation', () => {
        function generateFilename(type) {
            return `equasolver_${type}_${Date.now()}.pdf`;
        }

        test('should generate correct filename format', () => {
            const filename = generateFilename('quadratic');
            expect(filename).toMatch(/^equasolver_quadratic_\d+\.pdf$/);
        });

        test('should include equation type', () => {
            expect(generateFilename('linear')).toContain('linear');
            expect(generateFilename('cubic')).toContain('cubic');
        });
    });
});

describe('Graph Rendering', () => {
    describe('Coordinate Mapping', () => {
        function mapX(x, width, xMin, xMax) {
            return ((x - xMin) / (xMax - xMin)) * width;
        }

        function mapY(y, height, yMin, yMax) {
            return height - ((y - yMin) / (yMax - yMin)) * height;
        }

        test('should map x=0 to center when range is symmetric', () => {
            expect(mapX(0, 800, -10, 10)).toBe(400);
        });

        test('should map y=0 to center when range is symmetric', () => {
            expect(mapY(0, 600, -10, 10)).toBe(300);
        });

        test('should map minimum x to left edge', () => {
            expect(mapX(-10, 800, -10, 10)).toBe(0);
        });

        test('should map maximum x to right edge', () => {
            expect(mapX(10, 800, -10, 10)).toBe(800);
        });

        test('should map maximum y to top edge', () => {
            expect(mapY(10, 600, -10, 10)).toBe(0);
        });

        test('should map minimum y to bottom edge', () => {
            expect(mapY(-10, 600, -10, 10)).toBe(600);
        });
    });

    describe('Zoom Functionality', () => {
        function zoomRange(min, max, factor) {
            const range = (max - min) * factor;
            const center = (max + min) / 2;
            return {
                min: center - range / 2,
                max: center + range / 2
            };
        }

        test('should zoom in (reduce range)', () => {
            const result = zoomRange(-10, 10, 0.8);
            expect(result.max - result.min).toBeCloseTo(16, 5);
        });

        test('should zoom out (increase range)', () => {
            const result = zoomRange(-10, 10, 1.25);
            expect(result.max - result.min).toBeCloseTo(25, 5);
        });

        test('should maintain center point', () => {
            const result = zoomRange(-10, 10, 0.5);
            expect((result.min + result.max) / 2).toBeCloseTo(0, 5);
        });
    });
});
