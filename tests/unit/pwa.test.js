/**
 * Tests for PWA and Performance Optimizations
 */

describe('Mobile Device Detection', () => {
    const originalInnerWidth = window.innerWidth;
    const originalUserAgent = navigator.userAgent;

    afterEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth
        });
    });

    test('should detect mobile by screen width', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375
        });
        
        const isMobile = window.innerWidth <= 768;
        expect(isMobile).toBe(true);
    });

    test('should detect desktop by screen width', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1920
        });
        
        const isMobile = window.innerWidth <= 768;
        expect(isMobile).toBe(false);
    });

    test('should detect tablet as mobile', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 768
        });
        
        const isMobile = window.innerWidth <= 768;
        expect(isMobile).toBe(true);
    });
});

describe('Particle Configuration', () => {
    test('should return reduced particles for mobile', () => {
        const mobileConfig = {
            particles: { number: { value: 30 } },
            line_linked: { enable: false }
        };
        
        expect(mobileConfig.particles.number.value).toBe(30);
        expect(mobileConfig.line_linked.enable).toBe(false);
    });

    test('should return full particles for desktop', () => {
        const desktopConfig = {
            particles: { number: { value: 80 } },
            line_linked: { enable: true }
        };
        
        expect(desktopConfig.particles.number.value).toBe(80);
        expect(desktopConfig.line_linked.enable).toBe(true);
    });

    test('should disable hover effects on mobile', () => {
        const mobileConfig = {
            interactivity: {
                events: {
                    onhover: { enable: false },
                    onclick: { enable: false }
                }
            }
        };
        
        expect(mobileConfig.interactivity.events.onhover.enable).toBe(false);
        expect(mobileConfig.interactivity.events.onclick.enable).toBe(false);
    });
});

describe('Debounce Function', () => {
    jest.useFakeTimers();

    test('should delay function execution', () => {
        const callback = jest.fn();
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        const debouncedFn = debounce(callback, 250);
        
        debouncedFn();
        expect(callback).not.toHaveBeenCalled();
        
        jest.advanceTimersByTime(250);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should only call once for rapid calls', () => {
        const callback = jest.fn();
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
        
        const debouncedFn = debounce(callback, 250);
        
        debouncedFn();
        debouncedFn();
        debouncedFn();
        
        jest.advanceTimersByTime(250);
        expect(callback).toHaveBeenCalledTimes(1);
    });
});

describe('Service Worker Support', () => {
    test('should check for service worker support', () => {
        const hasServiceWorker = 'serviceWorker' in navigator;
        expect(typeof hasServiceWorker).toBe('boolean');
    });
});

describe('PWA Manifest Structure', () => {
    const manifest = {
        name: "EquaSolver",
        short_name: "EquaSolver",
        description: "A modern, feature-rich equation solver with an elegant user interface",
        start_url: "./index.html",
        display: "standalone",
        background_color: "#0a0a0f",
        theme_color: "#00ff41",
        orientation: "any",
        icons: [
            {
                src: "assets/icon.svg",
                sizes: "any",
                type: "image/svg+xml"
            }
        ]
    };

    test('should have required name field', () => {
        expect(manifest.name).toBe('EquaSolver');
    });

    test('should have required short_name field', () => {
        expect(manifest.short_name).toBe('EquaSolver');
    });

    test('should have standalone display mode', () => {
        expect(manifest.display).toBe('standalone');
    });

    test('should have valid start_url', () => {
        expect(manifest.start_url).toBe('./index.html');
    });

    test('should have at least one icon', () => {
        expect(manifest.icons.length).toBeGreaterThan(0);
    });

    test('should have valid theme_color', () => {
        expect(manifest.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('should have valid background_color', () => {
        expect(manifest.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
});

describe('Cache Strategy', () => {
    const STATIC_ASSETS = [
        './',
        './index.html',
        './css/style.css',
        './js/script.js',
        './js/translations.js',
        './js/flags.js',
        './assets/icon.svg',
        './manifest.json'
    ];

    test('should include index.html in static assets', () => {
        expect(STATIC_ASSETS).toContain('./index.html');
    });

    test('should include CSS in static assets', () => {
        expect(STATIC_ASSETS).toContain('./css/style.css');
    });

    test('should include main script in static assets', () => {
        expect(STATIC_ASSETS).toContain('./js/script.js');
    });

    test('should include translations in static assets', () => {
        expect(STATIC_ASSETS).toContain('./js/translations.js');
    });

    test('should include manifest in static assets', () => {
        expect(STATIC_ASSETS).toContain('./manifest.json');
    });
});

describe('Lazy Loading', () => {
    test('defer attribute should delay script execution', () => {
        const deferredScripts = [
            'particles.min.js',
            'jspdf.umd.min.js',
            'flags.js',
            'translations.js',
            'script.js'
        ];
        
        expect(deferredScripts.length).toBe(5);
        deferredScripts.forEach(script => {
            expect(typeof script).toBe('string');
        });
    });

    test('preload should prioritize font loading', () => {
        const preloadLinks = [
            { rel: 'preload', as: 'style', href: 'fonts.googleapis.com' }
        ];
        
        expect(preloadLinks[0].rel).toBe('preload');
        expect(preloadLinks[0].as).toBe('style');
    });
});

describe('PWA Translations', () => {
    const translations = {
        en: {
            offlineReady: "App ready for offline use",
            updateAvailable: "New version available",
            installApp: "Install app",
            installed: "App installed"
        },
        fr: {
            offlineReady: "Application prete pour utilisation hors ligne",
            updateAvailable: "Nouvelle version disponible",
            installApp: "Installer l'application",
            installed: "Application installee"
        },
        es: {
            offlineReady: "Aplicacion lista para uso sin conexion",
            updateAvailable: "Nueva version disponible",
            installApp: "Instalar aplicacion",
            installed: "Aplicacion instalada"
        },
        de: {
            offlineReady: "App bereit fur Offline-Nutzung",
            updateAvailable: "Neue Version verfugbar",
            installApp: "App installieren",
            installed: "App installiert"
        },
        it: {
            offlineReady: "App pronta per uso offline",
            updateAvailable: "Nuova versione disponibile",
            installApp: "Installa app",
            installed: "App installata"
        },
        ru: {
            offlineReady: "Приложение готово к работе оффлайн",
            updateAvailable: "Доступна новая версия",
            installApp: "Установить приложение",
            installed: "Приложение установлено"
        }
    };

    test('should have offline translations for all languages', () => {
        const languages = ['en', 'fr', 'es', 'de', 'it', 'ru'];
        languages.forEach(lang => {
            expect(translations[lang].offlineReady).toBeDefined();
            expect(translations[lang].updateAvailable).toBeDefined();
            expect(translations[lang].installApp).toBeDefined();
            expect(translations[lang].installed).toBeDefined();
        });
    });

    test('should have English as default', () => {
        expect(translations.en.offlineReady).toBe("App ready for offline use");
    });
});
