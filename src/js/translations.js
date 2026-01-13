// Translations loader - loads language files from i18n folder
// This replaces the old monolithic translations.js

// Create a global translations object that will be populated by language files
const translations = {};

// Function to load translations (called after language files are loaded)
function loadTranslations() {
    if (typeof en !== 'undefined') translations.en = en;
    if (typeof fr !== 'undefined') translations.fr = fr;
    if (typeof es !== 'undefined') translations.es = es;
    if (typeof de !== 'undefined') translations.de = de;
    if (typeof it !== 'undefined') translations.it = it;
    if (typeof ru !== 'undefined') translations.ru = ru;
}

// Auto-load when DOM is ready (if language files are loaded via script tags)
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTranslations);
    } else {
        loadTranslations();
    }
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, loadTranslations };
}
