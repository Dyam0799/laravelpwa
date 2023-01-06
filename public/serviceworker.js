var staticCacheName = "pwa-v" + new Date().getTime();
var filesToCache = [
    '/offline',
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');


workbox.routing.registerRoute(
 /^https?.*/,
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(/^http?.*/, new workbox.strategies.NetworkFirst(), 'GET');