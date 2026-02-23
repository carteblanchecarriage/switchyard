// Keebshelf Service Worker - Cache First Strategy
const CACHE_NAME = 'keebshelf-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/blog.html',
    '/beginner/index.html',
    '/data.json',
    '/sitemap.xml',
    '/robots.txt',
    '/feed.xml'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => console.error('[SW] Cache failed:', err))
    );
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Cache first, network fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external URLs
    if (url.origin !== self.location.origin) return;

    // Strategy: Cache first for static assets
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request));
    }
    // Strategy: Stale-while-revalidate for data
    else if (request.url.includes('data.json')) {
        event.respondWith(staleWhileRevalidate(request));
    }
    // Default: Network first
    else {
        event.respondWith(networkFirst(request));
    }
});

function isStaticAsset(request) {
    const staticExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
    return staticExtensions.some(ext => request.url.endsWith(ext));
}

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (err) {
        console.error('[SW] Fetch failed:', err);
        return new Response('Offline - Cached content unavailable', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    // Return cached immediately
    const networkFetch = fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
    }).catch(() => cached);

    return cached || networkFetch;
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw err;
    }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'subscribe-form') {
        event.waitUntil(handleSubscribeSync());
    }
});

async function handleSubscribeSync() {
    // Process queued form submissions when back online
    console.log('[SW] Processing queued subscriptions');
}