// Translations loader - loads language files from i18n folder
// This file creates a global translations object that is populated by the language files

// Create a global translations object that will be populated by language files
const translations = {};

// Function to load translations (called after language files are loaded)
function loadTranslations() {
    // Browser environment - use window
    if (typeof window !== 'undefined') {
        if (typeof window.en !== 'undefined') translations.en = window.en;
        if (typeof window.fr !== 'undefined') translations.fr = window.fr;
        if (typeof window.es !== 'undefined') translations.es = window.es;
        if (typeof window.de !== 'undefined') translations.de = window.de;
        if (typeof window.it !== 'undefined') translations.it = window.it;
        if (typeof window.ru !== 'undefined') translations.ru = window.ru;
    } else {
        // Node.js environment
        if (typeof en !== 'undefined') translations.en = en;
        if (typeof fr !== 'undefined') translations.fr = fr;
        if (typeof es !== 'undefined') translations.es = es;
        if (typeof de !== 'undefined') translations.de = de;
        if (typeof it !== 'undefined') translations.it = it;
        if (typeof ru !== 'undefined') translations.ru = ru;
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.translations = translations;
    window.loadTranslations = loadTranslations;
    // Auto-load translations since language files should be loaded by now
    loadTranslations();
}

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, loadTranslations };
}
