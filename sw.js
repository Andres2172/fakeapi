const CACHE_NAME = "fakeapi-cache-v3";
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
  "/fakeapi/manifest.json",
  // Agrega una página offline
  "/fakeapi/offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Instalando Service Worker y cacheando recursos');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ...resto del código existente...