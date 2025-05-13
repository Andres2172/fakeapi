const CACHE_NAME = "fakeapi-cache-v1";
const urlsToCache = [
  "/fakeapi/",
  "/fakeapi/index.html",
  "/fakeapi/Style.css",
  "/fakeapi/api.js",
  "/fakeapi/lista.js",
  "/fakeapi/Usuario.js",
  "/fakeapi/aleatorios.js",
  "/fakeapi/Favoritos.js",
  "/fakeapi/detalle.js",
  "/fakeapi/general.js",
  "/fakeapi/icons/icon-192.png",
  "/fakeapi/icons/icon-512.png",
  "/fakeapi/manifest.json"
];

// Instala el service worker y guarda en caché archivos esenciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activa el service worker y elimina cachés antiguas si existen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Intercepta solicitudes y responde desde caché si está disponible
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
