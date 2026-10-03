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

describe('Settings panel accessibility', () => {
    beforeEach(() => {
        document.body.className = '';
        document.body.innerHTML = `
            <button id="settingsBtn">gear</button>
            <div id="settingsPanel">
                <button id="a">a</button>
                <button id="b">b</button>
                <button id="closeSettings">close</button>
            </div>`;
        // jsdom has no layout: every element counts as rendered
        Object.defineProperty(HTMLElement.prototype, 'offsetParent', { get() { return document.body; }, configurable: true });
        themes.setupSettingsPanel();
    });

    afterEach(() => {
        delete HTMLElement.prototype.offsetParent;
    });

    const key = (name, extra = {}) => {
        const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...extra });
        document.dispatchEvent(event);
        return event;
    };

    test('exposes state to assistive technology and moves focus in', () => {
        const gear = document.getElementById('settingsBtn');
        expect(document.getElementById('settingsPanel').getAttribute('aria-hidden')).toBe('true');
        themes.toggleSettings(true);
        expect(gear.getAttribute('aria-expanded')).toBe('true');
        expect(document.getElementById('settingsPanel').getAttribute('aria-hidden')).toBe('false');
        expect(document.activeElement.id).toBe('a');
    });

    test('Escape closes the panel and returns focus to the gear', () => {
        themes.toggleSettings(true);
        const event = key('Escape');
        expect(event.defaultPrevented).toBe(true);
        expect(themes.isSettingsOpen()).toBe(false);
        expect(document.activeElement.id).toBe('settingsBtn');
    });

    test('Tab wraps from the last control to the first and back', () => {
        themes.toggleSettings(true);
        document.getElementById('closeSettings').focus();
        const forward = key('Tab');
        expect(forward.defaultPrevented).toBe(true);
        expect(document.activeElement.id).toBe('a');
        const backward = key('Tab', { shiftKey: true });
        expect(backward.defaultPrevented).toBe(true);
        expect(document.activeElement.id).toBe('closeSettings');
    });

    test('Tab in the middle of the panel is left alone', () => {
        themes.toggleSettings(true);
        document.getElementById('b').focus();
        expect(key('Tab').defaultPrevented).toBe(false);
    });

    test('keys do nothing while the panel is closed', () => {
        expect(key('Escape').defaultPrevented).toBe(false);
        expect(key('Tab').defaultPrevented).toBe(false);
    });

    test('toggling without an argument flips the state', () => {
        themes.toggleSettings();
        expect(themes.isSettingsOpen()).toBe(true);
        themes.toggleSettings();
        expect(themes.isSettingsOpen()).toBe(false);
    });
});

describe('System colour scheme', () => {
    const mockScheme = dark => {
        window.matchMedia = jest.fn(() => ({ matches: dark, addEventListener() {}, removeEventListener() {} }));
    };

    beforeEach(() => {
        localStorage.clear();
        buildDom();
    });

    afterEach(() => {
        delete window.matchMedia;
    });

    test('systemMode reads prefers-color-scheme', () => {
        mockScheme(true);
        expect(themes.systemMode()).toBe('dark');
        mockScheme(false);
        expect(themes.systemMode()).toBe('light');
    });

    test('systemMode falls back to light when matchMedia is missing or throws', () => {
        expect(themes.systemMode()).toBe('light');
        window.matchMedia = () => { throw new Error('nope'); };
        expect(themes.systemMode()).toBe('light');
    });

    test('a first visit on a dark system starts in dark mode', () => {
        mockScheme(true);
        expect(themes.loadSettings().mode).toBe('dark');
    });

    test('a saved mode without an explicit choice yields to the system', () => {
        mockScheme(true);
        localStorage.setItem('equasolver_settings', JSON.stringify({ theme: 'ocean', lang: 'fr', mode: 'light' }));
        const settings = themes.loadSettings();
        expect(settings.mode).toBe('dark');
        expect(settings.theme).toBe('ocean');
    });

    test('an explicit choice survives a reload and beats the system', () => {
        mockScheme(true);
        themes.loadSettings();
        themes.changeMode('light', true);
        expect(themes.isModeChosen()).toBe(true);
        const settings = themes.loadSettings();
        expect(settings.mode).toBe('light');
        expect(themes.isModeChosen()).toBe(true);
    });

    test('changeMode without the explicit flag does not lock the choice', () => {
        mockScheme(false);
        localStorage.clear();
        themes.loadSettings();
        themes.changeMode('dark');
        expect(themes.isModeChosen()).toBe(false);
    });
});
