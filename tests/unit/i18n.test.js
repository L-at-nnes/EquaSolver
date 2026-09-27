/**
 * Translation consistency: every language defines the same keys, and every key
 * referenced from the HTML or the UI scripts exists.
 */

const fs = require('fs');
const path = require('path');

const languages = ['en', 'fr', 'es', 'de', 'it', 'ru'];
const translations = {};
languages.forEach(lang => {
    translations[lang] = require(`../../src/js/i18n/${lang}.js`);
});

const root = path.join(__dirname, '..', '..', 'src');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

describe('i18n', () => {
    test.each(languages)('%s defines exactly the same keys as English', lang => {
        const english = Object.keys(translations.en).sort();
        const keys = Object.keys(translations[lang]).sort();
        expect(keys.filter(k => !english.includes(k))).toEqual([]);
        expect(english.filter(k => !keys.includes(k))).toEqual([]);
    });

    test.each(languages)('%s has no empty translations', lang => {
        const empty = Object.entries(translations[lang]).filter(([, v]) => typeof v !== 'string' || v.trim() === '');
        expect(empty).toEqual([]);
    });

    test('every data-translate key of the page exists', () => {
        const html = read('index.html');
        const used = new Set([...html.matchAll(/data-translate="([^"]+)"/g)].map(m => m[1]));
        const missing = [...used].filter(key => !(key in translations.en));
        expect(missing).toEqual([]);
    });

    test('every key looked up by the UI scripts exists', () => {
        const files = ['js/script.js', 'js/ui/exponential-log.js', 'js/ui/derivatives-integrals.js'];
        const used = new Set();
        files.forEach(file => {
            const source = read(file);
            [...source.matchAll(/\btrans\.([A-Za-z0-9_]+)/g)].forEach(m => used.add(m[1]));
            [...source.matchAll(/translations\[window\.currentLang\]\??\.([A-Za-z0-9_]+)/g)].forEach(m => used.add(m[1]));
        });
        const missing = [...used].filter(key => !(key in translations.en));
        expect(missing).toEqual([]);
    });
});
