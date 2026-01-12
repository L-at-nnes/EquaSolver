/**
 * Tests for Custom Theme Builder
 */

describe('Custom Theme Builder', () => {
    describe('Color Validation', () => {
        function isValidHexColor(color) {
            return /^#[0-9A-Fa-f]{6}$/.test(color);
        }

        test('should validate valid hex colors', () => {
            expect(isValidHexColor('#ff0080')).toBe(true);
            expect(isValidHexColor('#00ffff')).toBe(true);
            expect(isValidHexColor('#000000')).toBe(true);
            expect(isValidHexColor('#FFFFFF')).toBe(true);
            expect(isValidHexColor('#AbCdEf')).toBe(true);
        });

        test('should reject invalid hex colors', () => {
            expect(isValidHexColor('ff0080')).toBe(false);
            expect(isValidHexColor('#ff008')).toBe(false);
            expect(isValidHexColor('#ff00800')).toBe(false);
            expect(isValidHexColor('#gggggg')).toBe(false);
            expect(isValidHexColor('rgb(255,0,0)')).toBe(false);
        });
    });

    describe('Shadow Color Generation', () => {
        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        test('should convert #ff0080 to rgba(255, 0, 128, 0.5)', () => {
            expect(hexToRgba('#ff0080', 0.5)).toBe('rgba(255, 0, 128, 0.5)');
        });

        test('should convert #00ffff to rgba(0, 255, 255, 0.5)', () => {
            expect(hexToRgba('#00ffff', 0.5)).toBe('rgba(0, 255, 255, 0.5)');
        });

        test('should convert #000000 to rgba(0, 0, 0, 0.5)', () => {
            expect(hexToRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
        });

        test('should convert #ffffff to rgba(255, 255, 255, 0.5)', () => {
            expect(hexToRgba('#ffffff', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
        });

        test('should handle different alpha values', () => {
            expect(hexToRgba('#ff0000', 0.3)).toBe('rgba(255, 0, 0, 0.3)');
            expect(hexToRgba('#ff0000', 0.8)).toBe('rgba(255, 0, 0, 0.8)');
            expect(hexToRgba('#ff0000', 1)).toBe('rgba(255, 0, 0, 1)');
        });
    });

    describe('Theme Color Structure', () => {
        const defaultThemeColors = {
            primary: '#ff0080',
            secondary: '#00ffff',
            accent: '#ffff00',
            bgPrimary: '#0a0a0f',
            bgSecondary: '#1a1a2e'
        };

        test('should have all required color properties', () => {
            expect(defaultThemeColors).toHaveProperty('primary');
            expect(defaultThemeColors).toHaveProperty('secondary');
            expect(defaultThemeColors).toHaveProperty('accent');
            expect(defaultThemeColors).toHaveProperty('bgPrimary');
            expect(defaultThemeColors).toHaveProperty('bgSecondary');
        });

        test('should have valid hex colors for all properties', () => {
            const hexRegex = /^#[0-9A-Fa-f]{6}$/;
            Object.values(defaultThemeColors).forEach(color => {
                expect(color).toMatch(hexRegex);
            });
        });
    });

    describe('Theme Preset Validation', () => {
        const presetThemes = {
            cyberpunk: { primary: '#ff0080', secondary: '#00ffff' },
            neon: { primary: '#00ff9f', secondary: '#00d4ff' },
            matrix: { primary: '#00ff41', secondary: '#008f11' },
            sunset: { primary: '#ff6b35', secondary: '#f7931e' },
            ocean: { primary: '#00b4d8', secondary: '#0077b6' },
            galaxy: { primary: '#b537f2', secondary: '#7209b7' }
        };

        test('should have valid cyberpunk theme', () => {
            expect(presetThemes.cyberpunk.primary).toBe('#ff0080');
            expect(presetThemes.cyberpunk.secondary).toBe('#00ffff');
        });

        test('should have valid matrix theme', () => {
            expect(presetThemes.matrix.primary).toBe('#00ff41');
        });

        test('all preset themes should have primary and secondary colors', () => {
            Object.values(presetThemes).forEach(theme => {
                expect(theme).toHaveProperty('primary');
                expect(theme).toHaveProperty('secondary');
            });
        });
    });

    describe('Local Storage Integration', () => {
        let mockStorage = {};

        beforeEach(() => {
            mockStorage = {};
        });

        function saveTheme(key, theme) {
            mockStorage[key] = JSON.stringify(theme);
        }

        function loadTheme(key) {
            const saved = mockStorage[key];
            return saved ? JSON.parse(saved) : null;
        }

        test('should save theme to storage', () => {
            const theme = { primary: '#ff0000', secondary: '#00ff00' };
            saveTheme('custom_theme', theme);
            expect(mockStorage['custom_theme']).toBeDefined();
        });

        test('should load theme from storage', () => {
            const theme = { primary: '#ff0000', secondary: '#00ff00' };
            saveTheme('custom_theme', theme);
            const loaded = loadTheme('custom_theme');
            expect(loaded).toEqual(theme);
        });

        test('should return null for missing theme', () => {
            const loaded = loadTheme('nonexistent');
            expect(loaded).toBeNull();
        });

        test('should overwrite existing theme', () => {
            saveTheme('custom_theme', { primary: '#ff0000' });
            saveTheme('custom_theme', { primary: '#00ff00' });
            const loaded = loadTheme('custom_theme');
            expect(loaded.primary).toBe('#00ff00');
        });
    });

    describe('Color Contrast Calculation', () => {
        function getLuminance(hex) {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            
            const adjust = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            
            return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
        }

        function getContrastRatio(color1, color2) {
            const l1 = getLuminance(color1);
            const l2 = getLuminance(color2);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
        }

        test('should calculate luminance for white', () => {
            expect(getLuminance('#ffffff')).toBeCloseTo(1, 2);
        });

        test('should calculate luminance for black', () => {
            expect(getLuminance('#000000')).toBeCloseTo(0, 2);
        });

        test('should calculate high contrast for black and white', () => {
            const contrast = getContrastRatio('#ffffff', '#000000');
            expect(contrast).toBeGreaterThan(20);
        });

        test('should calculate low contrast for similar colors', () => {
            const contrast = getContrastRatio('#808080', '#909090');
            expect(contrast).toBeLessThan(2);
        });
    });

    describe('CSS Variable Generation', () => {
        function generateCSSVariables(theme) {
            return {
                '--custom-primary': theme.primary,
                '--custom-secondary': theme.secondary,
                '--custom-accent': theme.accent,
                '--custom-bg-primary': theme.bgPrimary,
                '--custom-bg-secondary': theme.bgSecondary
            };
        }

        test('should generate correct CSS variable names', () => {
            const theme = {
                primary: '#ff0080',
                secondary: '#00ffff',
                accent: '#ffff00',
                bgPrimary: '#0a0a0f',
                bgSecondary: '#1a1a2e'
            };

            const vars = generateCSSVariables(theme);

            expect(vars['--custom-primary']).toBe('#ff0080');
            expect(vars['--custom-secondary']).toBe('#00ffff');
            expect(vars['--custom-accent']).toBe('#ffff00');
            expect(vars['--custom-bg-primary']).toBe('#0a0a0f');
            expect(vars['--custom-bg-secondary']).toBe('#1a1a2e');
        });
    });
});
