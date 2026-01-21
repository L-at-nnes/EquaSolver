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
    bgPrimary: '#1a1a2e'
};

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
    document.body.className = `theme-${theme}`;
    
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
    localStorage.setItem('equasolver_settings', JSON.stringify({
        theme: currentTheme,
        lang: currentLang,
        mode: currentMode,
        customTheme: customThemeColors
    }));
}

function loadSettings() {
    const saved = localStorage.getItem('equasolver_settings');
    if (!saved) {
        return { theme: 'matrix', lang: 'en', mode: 'dark' };
    }
    
    const settings = JSON.parse(saved);
    if (settings.customTheme) {
        customThemeColors = settings.customTheme;
    }
    return settings;
}

// Custom theme builder
function setupCustomThemeBuilder() {
    // Attach event listeners for custom theme color pickers
    const colorInputs = ['customPrimary', 'customSecondary', 'customAccent', 'customBgPrimary'];
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
}

function updateCustomThemePreview() {
    updateColorPickerValues();
    
    const preview = document.getElementById('themePreview');
    if (preview) {
        preview.style.setProperty('--primary-color', customThemeColors.primary);
        preview.style.setProperty('--secondary-color', customThemeColors.secondary);
        preview.style.setProperty('--accent-color', customThemeColors.accent);
        preview.style.setProperty('--bg-primary', customThemeColors.bgPrimary);
    }
}

function applyCustomTheme() {
    updateColorPickerValues();
    
    document.documentElement.style.setProperty('--primary-color', customThemeColors.primary);
    document.documentElement.style.setProperty('--secondary-color', customThemeColors.secondary);
    document.documentElement.style.setProperty('--accent-color', customThemeColors.accent);
    document.documentElement.style.setProperty('--bg-primary', customThemeColors.bgPrimary);
    
    currentTheme = 'custom';
    document.body.className = 'theme-custom';
    
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

