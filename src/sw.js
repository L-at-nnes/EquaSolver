const CACHE_NAME = 'equasolver-v3.0.0';
const STATIC_CACHE = 'equasolver-static-v3.0.0';
const DYNAMIC_CACHE = 'equasolver-dynamic-v3.0.0';

const STATIC_ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/flags.js',
    './js/translations.js',
    './js/script.js',
    // i18n modules
    './js/i18n/en.js',
    './js/i18n/fr.js',
    './js/i18n/es.js',
    './js/i18n/de.js',
    './js/i18n/it.js',
    './js/i18n/ru.js',
    // Math modules
    './js/math/complex.js',
    './js/math/matrix.js',
    './js/math/gcd-lcm.js',
    './js/math/modular.js',
    './js/math/combinatorics.js',
    './js/math/fractions.js',
    './js/math/statistics.js',
    './js/math/sequences.js',
    // Calculus modules
    './js/calculus/limits.js',
    './js/calculus/taylor.js',
    './js/calculus/numerical-integration.js',
    // Solver modules
    './js/solvers/inequality.js',
    './js/solvers/polynomial-division.js',
    // Converter modules
    './js/converters/base.js',
    './js/converters/units.js',
    // Parser modules
    './js/parsers/expression.js',
    './js/parsers/latex.js',
    // UI modules
    './js/ui/animations.js',
    './js/ui/themes.js',
    './js/ui/history.js',
    './js/ui/export.js',
    './js/ui/calculator.js',
    // Graphing modules
    './js/graphing/cartesian.js',
    './js/graphing/parametric.js',
    './js/graphing/polar.js',
    // Assets
    './assets/icon.svg',
    './assets/icon-192.svg',
    './manifest.json'
];

const EXTERNAL_ASSETS = [
    'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                        .map(key => {
                            console.log('Deleting old cache:', key);
                            return caches.delete(key);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
