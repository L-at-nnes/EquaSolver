/**
 * Tests for theme / settings management (src/js/ui/themes.js)
 */

const themes = require('../../src/js/ui/themes.js');

function buildDom() {
    document.body.className = '';
    document.body.innerHTML = `
        <button class="theme-btn" data-theme="matrix"></button>
        <button class="theme-btn" data-theme="custom"></button>
        <div id="customThemeBuilder" style="display:none;">
            <input type="color" id="customPrimary" value="#ff0080">
            <input type="color" id="customSecondary" value="#00ffff">
            <input type="color" id="customAccent" value="#ffff00">
            <input type="color" id="customBgPrimary" value="#0a0a0f">
            <input type="color" id="customBgSecondary" value="#1a1a2e">
        </div>`;
    document.documentElement.removeAttribute('style');
}

describe('Themes', () => {
    beforeEach(() => {
        localStorage.clear();
        buildDom();
    });

    test('changing the theme keeps light mode active', () => {
        themes.changeMode('light');
        themes.changeTheme('ocean');
        expect(document.body.classList.contains('light-mode')).toBe(true);
        expect(document.body.classList.contains('theme-ocean')).toBe(true);
        themes.changeTheme('galaxy');
        expect(document.body.classList.contains('theme-ocean')).toBe(false);
        expect(document.body.classList.contains('theme-galaxy')).toBe(true);
        expect(document.body.classList.contains('light-mode')).toBe(true);
    });

    test('applying the custom theme publishes the variables read by the stylesheet', () => {
        document.getElementById('customPrimary').value = '#123456';
        document.getElementById('customBgSecondary').value = '#abcdef';
        themes.applyCustomTheme();
        const style = document.documentElement.style;
        expect(style.getPropertyValue('--custom-primary')).toBe('#123456');
        expect(style.getPropertyValue('--custom-bg-secondary')).toBe('#abcdef');
        expect(style.getPropertyValue('--custom-shadow')).toBe('rgba(18, 52, 86, 0.5)');
        expect(document.body.classList.contains('theme-custom')).toBe(true);
    });

    test('the custom theme builder is only visible for the custom theme', () => {
        const builder = document.getElementById('customThemeBuilder');
        themes.changeTheme('custom');
        expect(builder.style.display).toBe('block');
        themes.changeTheme('matrix');
        expect(builder.style.display).toBe('none');
    });

    test('a saved custom theme is restored by loadSettings', () => {
        document.getElementById('customAccent').value = '#00ff00';
        themes.applyCustomTheme();
        buildDom();
        themes.loadSettings();
        expect(document.getElementById('customAccent').value).toBe('#00ff00');
        themes.changeTheme('custom');
        expect(document.documentElement.style.getPropertyValue('--custom-accent')).toBe('#00ff00');
    });

    test('loadSettings survives corrupted storage', () => {
        localStorage.setItem('equasolver_settings', '{not json');
        expect(themes.loadSettings()).toEqual({ theme: 'matrix', lang: 'en', mode: 'light' });
    });

    test('loadSettings fills missing fields with defaults', () => {
        localStorage.setItem('equasolver_settings', JSON.stringify({ lang: 'fr' }));
        expect(themes.loadSettings()).toEqual({ theme: 'matrix', lang: 'fr', mode: 'light' });
    });
});
