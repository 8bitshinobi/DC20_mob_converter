const CACHE_NAME = 'dc20-cache-v4';
const FILES_TO_CACHE = [
  '/DC20_mob_converter/',
  '/DC20_mob_converter/index.html',
  '/DC20_mob_converter/styles.css',
  '/DC20_mob_converter/app.js',
  '/DC20_mob_converter/data.js',
  '/DC20_mob_converter/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});