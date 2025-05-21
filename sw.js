const CACHE_NAME = 'cars-pwa-v1';
const urlsToCache = [
  './',
  './index.html',
  './Style.css',
  './js/lista.js',
  './js/favoritos.js',
  './js/detalle.js',
  './js/usuario.js',
  './js/aleatorios.js',
  './js/api.js',
  './js/general.js',
  './icons/logo.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to cache ${url}`);
                }
                return cache.put(url, response);
              })
              .catch(error => {
                console.error(`Error caching ${url}:`, error);
              });
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
      .catch(() => {
        // Fallback opcional para cuando no hay conexión
        return new Response('Offline content here');
      })
  );
});