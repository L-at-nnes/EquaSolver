const CACHE_NAME = 'equasolver-v3.7.0';
const STATIC_CACHE = 'equasolver-static-v3.7.0';
const DYNAMIC_CACHE = 'equasolver-dynamic-v3.7.0';

// Keep in sync with the <script src="js/..."> tags in index.html.
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/base.css',
    './css/home.css',
    './css/calculator.css',
    './css/forms.css',
    './css/results.css',
    './css/settings.css',
    './css/plotter.css',
    './css/print.css',
    './js/flags.js',
    // i18n modules
    './js/i18n/en.js',
    './js/i18n/fr.js',
    './js/i18n/es.js',
    './js/i18n/de.js',
    './js/i18n/it.js',
    './js/i18n/ru.js',
    './js/translations.js',
    // Math modules
    './js/math/complex.js',
    './js/math/matrix.js',
    './js/math/gcd-lcm.js',
    './js/math/primes.js',
    './js/math/modular.js',
    './js/math/combinatorics.js',
    './js/math/fractions.js',
    './js/math/linear-system.js',
    './js/math/exact.js',
    './js/math/statistics.js',
    './js/math/regression.js',
    './js/math/sequences.js',
    // Calculus modules
    './js/calculus/limits.js',
    './js/calculus/taylor.js',
    './js/calculus/numerical-integration.js',
    './js/calculus/derivatives-integrals.js',
    // Solver modules
    './js/solvers/inequality.js',
    './js/solvers/polynomial-division.js',
    './js/solvers/factor.js',
    './js/solvers/partial-fractions.js',
    './js/solvers/exponential-log.js',
    './js/solvers/absolute.js',
    './js/solvers/trigonometric.js',
    // Converter modules
    './js/converters/base.js',
    './js/converters/units.js',
    // Parser modules
    './js/parsers/expression.js',
    './js/parsers/latex.js',
    // UI modules
    './js/ui/inputs.js',
    './js/ui/motion.js',
    './js/ui/router.js',
    './js/ui/search.js',
    './js/ui/clipboard.js',
    './js/ui/animations.js',
    './js/ui/themes.js',
    './js/ui/history.js',
    './js/ui/export.js',
    './js/ui/calculator.js',
    './js/ui/expression-calc.js',
    './js/ui/regression.js',
    './js/ui/exponential-log.js',
    './js/ui/system-n.js',
    './js/ui/derivatives-integrals.js',
    // Graphing modules
    './js/graphing/cartesian.js',
    './js/graphing/parametric.js',
    './js/graphing/polar.js',
    './js/graphing/plotter.js',
    './js/graphing/surface.js',
    // Main script (must load after all modules above)
    './js/script.js',
    // Assets
    './assets/icon.svg',
    './assets/icon-192.svg',
    './manifest.json'
];

const EXTERNAL_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
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
