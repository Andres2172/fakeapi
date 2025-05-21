const CACHE_NAME = 'cars-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/lista.js',
  '/js/favoritos.js',
  '/js/detalle.js',
  '/js/usuario.js',
  '/js/aleatorios.js',
  '/js/api.js',
  '/js/general.js',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});