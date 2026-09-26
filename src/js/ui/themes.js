// ===================================
// THEMES AND SETTINGS MANAGEMENT
// ===================================

let currentTheme = 'matrix';
let currentLang = 'en';
let currentMode = 'dark';

// Custom theme colors
let customThemeColors = {
    primary: '#ff0080',
    secondary: '#00ffff',
    accent: '#ffff00',
    bgPrimary: '#0a0a0f',
    bgSecondary: '#1a1a2e'
};

// Swap the theme-* class without touching other body classes (e.g. light-mode)
function setThemeClass(theme) {
    Array.from(document.body.classList)
        .filter(cls => cls.startsWith('theme-'))
        .forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add(`theme-${theme}`);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Publish the custom colors as the --custom-* variables read by .theme-custom in style.css
function applyCustomColors() {
    const root = document.documentElement.style;
    root.setProperty('--custom-primary', customThemeColors.primary);
    root.setProperty('--custom-secondary', customThemeColors.secondary);
    root.setProperty('--custom-accent', customThemeColors.accent);
    root.setProperty('--custom-bg-primary', customThemeColors.bgPrimary);
    root.setProperty('--custom-bg-secondary', customThemeColors.bgSecondary);
    root.setProperty('--custom-bg-panel', customThemeColors.bgSecondary);
    root.setProperty('--custom-shadow', hexToRgba(customThemeColors.primary, 0.5));
}

function syncColorPickers() {
    const ids = {
        customPrimary: 'primary',
        customSecondary: 'secondary',
        customAccent: 'accent',
        customBgPrimary: 'bgPrimary',
        customBgSecondary: 'bgSecondary'
    };
    Object.entries(ids).forEach(([id, key]) => {
        const input = document.getElementById(id);
        if (input && customThemeColors[key]) input.value = customThemeColors[key];
    });
}

function showCustomThemeBuilder(visible) {
    const builder = document.getElementById('customThemeBuilder');
    if (builder) builder.style.display = visible ? 'block' : 'none';
}

function getCurrentTheme() {
    return currentTheme;
}

function getCurrentLang() {
    return currentLang;
}

function getCurrentMode() {
    return currentMode;
}

function getCustomThemeColors() {
    return customThemeColors;
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

function changeTheme(theme, updateParticlesColorFn = null) {
    currentTheme = theme;
    setThemeClass(theme);
    if (theme === 'custom') applyCustomColors();
    showCustomThemeBuilder(theme === 'custom');
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    saveSettings();
    
    if (updateParticlesColorFn) {
        updateParticlesColorFn();
    }
}

function changeLanguage(lang, translations = null, updateTranslationsFn = null) {
    currentLang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    if (updateTranslationsFn) {
        updateTranslationsFn();
    }
    
    saveSettings();
}

function changeMode(mode) {
    currentMode = mode;
    
    if (mode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    saveSettings();
}

function updateTranslations(translationsArg) {
    // Use argument or fall back to global window.translations
    const translations = translationsArg || (typeof window !== 'undefined' ? window.translations : null);
    if (!translations || !translations[currentLang]) return;
    
    const trans = translations[currentLang];
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        if (!trans[key]) return;
        
        if (el.tagName === 'INPUT') {
            el.placeholder = trans[key];
        } else {
            el.textContent = trans[key];
        }
    });
}

function saveSettings() {
    try {
        localStorage.setItem('equasolver_settings', JSON.stringify({
            theme: currentTheme,
            lang: currentLang,
            mode: currentMode,
            customTheme: customThemeColors
        }));
    } catch (e) {
        // Storage unavailable (private mode, quota): settings simply won't persist
    }
}

function loadSettings() {
    const defaults = { theme: 'matrix', lang: 'en', mode: 'dark' };
    let settings;
    try {
        const saved = localStorage.getItem('equasolver_settings');
        settings = saved ? JSON.parse(saved) : null;
    } catch (e) {
        settings = null;
    }
    if (!settings || typeof settings !== 'object') {
        return defaults;
    }

    if (settings.customTheme && typeof settings.customTheme === 'object') {
        customThemeColors = Object.assign({}, customThemeColors, settings.customTheme);
        syncColorPickers();
    }
    return Object.assign({}, defaults, settings);
}

// Custom theme builder
function setupCustomThemeBuilder() {
    // Attach event listeners for custom theme color pickers
    const colorInputs = ['customPrimary', 'customSecondary', 'customAccent', 'customBgPrimary', 'customBgSecondary'];
    colorInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateCustomThemePreview);
        }
    });

    // Apply and save buttons
    const applyBtn = document.getElementById('applyCustomTheme');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCustomTheme);
    }

    const saveBtn = document.getElementById('saveCustomTheme');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCustomTheme);
    }
}

function updateColorPickerValues() {
    const primary = document.getElementById('customPrimary');
    const secondary = document.getElementById('customSecondary');
    const accent = document.getElementById('customAccent');
    const bgPrimary = document.getElementById('customBgPrimary');
    
    if (primary) customThemeColors.primary = primary.value;
    if (secondary) customThemeColors.secondary = secondary.value;
    if (accent) customThemeColors.accent = accent.value;
    if (bgPrimary) customThemeColors.bgPrimary = bgPrimary.value;
    const bgSecondary = document.getElementById('customBgSecondary');
    if (bgSecondary) customThemeColors.bgSecondary = bgSecondary.value;
}

function updateCustomThemePreview() {
    updateColorPickerValues();
    
    const preview = document.getElementById('themePreview');
    if (preview) {
        preview.style.setProperty('--primary', customThemeColors.primary);
        preview.style.setProperty('--secondary', customThemeColors.secondary);
        preview.style.setProperty('--accent', customThemeColors.accent);
        preview.style.setProperty('--bg-primary', customThemeColors.bgPrimary);
        preview.style.setProperty('--bg-secondary', customThemeColors.bgSecondary);
    }
}

function applyCustomTheme() {
    updateColorPickerValues();
    
    applyCustomColors();

    currentTheme = 'custom';
    setThemeClass('custom');
    showCustomThemeBuilder(true);
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === 'custom');
    });
    
    saveSettings();
}

function saveCustomTheme() {
    applyCustomTheme();
    
    const customThemeBtn = document.querySelector('.theme-btn[data-theme="custom"]');
    if (customThemeBtn) {
        customThemeBtn.style.display = 'block';
    }
}

function setCurrentLang(lang) {
    currentLang = lang;
}

function setCurrentTheme(theme) {
    currentTheme = theme;
}

function setCurrentMode(mode) {
    currentMode = mode;
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentTheme,
        getCurrentLang,
        getCurrentMode,
        getCustomThemeColors,
        toggleSettings,
        changeTheme,
        changeLanguage,
        changeMode,
        updateTranslations,
        saveSettings,
        loadSettings,
        updateColorPickerValues,
        updateCustomThemePreview,
        applyCustomTheme,
        saveCustomTheme,
        setupCustomThemeBuilder,
        syncColorPickers,
        setCurrentLang,
        setCurrentTheme,
        setCurrentMode
    };
}

// Expose globally for browser
if (typeof window !== 'undefined') {
    window.changeTheme = changeTheme;
    window.changeLanguage = changeLanguage;
    window.changeMode = changeMode;
    window.updateTranslations = updateTranslations;
    window.saveSettings = saveSettings;
    window.loadSettings = loadSettings;
    window.applyCustomTheme = applyCustomTheme;
    window.saveCustomTheme = saveCustomTheme;
    window.toggleSettings = toggleSettings;
    window.setupCustomThemeBuilder = setupCustomThemeBuilder;
}

