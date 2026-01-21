// Translation loader - combines all language files
// This file imports all language translations and exports them as a single object

// ES6 module imports
import { en } from './en.js';
import { fr } from './fr.js';
import { es } from './es.js';
import { de } from './de.js';
import { it } from './it.js';
import { ru } from './ru.js';

const translations = { en, fr, es, de, it, ru };

// CommonJS export for Jest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations };
}
