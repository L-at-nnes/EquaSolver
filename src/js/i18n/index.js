// Translation loader - combines all language files
// This file imports all language translations and exports them as a single object

// For browser environment, these files should be loaded via script tags before this file
// For Node.js/Jest environment, use require()

let translations;

if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment (Jest tests)
    const en = require('./en.js');
    const fr = require('./fr.js');
    const es = require('./es.js');
    const de = require('./de.js');
    const it = require('./it.js');
    const ru = require('./ru.js');
    
    translations = { en, fr, es, de, it, ru };
    module.exports = translations;
} else {
    // Browser environment - translations are already loaded globally
    translations = {
        en: typeof en !== 'undefined' ? en : {},
        fr: typeof fr !== 'undefined' ? fr : {},
        es: typeof es !== 'undefined' ? es : {},
        de: typeof de !== 'undefined' ? de : {},
        it: typeof it !== 'undefined' ? it : {},
        ru: typeof ru !== 'undefined' ? ru : {}
    };
}
