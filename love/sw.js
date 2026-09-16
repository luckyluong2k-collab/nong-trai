const CACHE_NAME = 'love-together-v2026-09-16-loveplus-polish1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/love-together-icon-v3.png',
  './assets/mochi-corgi-pixel.png',
  './assets/mochi-corgi-excited.png',
  './assets/mochi-12-expressions.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    if (event.request.url.startsWith(self.location.origin)) caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
