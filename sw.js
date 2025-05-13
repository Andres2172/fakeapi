const CACHE_NAME = "fakeapi-cache-v2"; // ¡Incrementa la versión de caché!
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
      console.log('Instalando Service Worker y cacheando recursos');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Forzar activación inmediata
});

// Activa el service worker y elimina cachés antiguas si existen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediato
});

// Intercepta solicitudes y responde desde caché si está disponible, si no, desde la red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async (response) => {
      if (response) {
        return response; // Devuelve desde caché
      }

      try {
        const fetchResponse = await fetch(event.request);

        // Solo cachear respuestas válidas (ej: status 200, tipo 'basic' indica recurso de origen cruzado correcto)
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }

        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request.clone(), fetchResponse.clone());

        return fetchResponse;

      } catch (error) {
        console.error('Error al obtener recurso:', error);

        // Opcional: devolver un recurso alternativo o fallar silenciosamente
        // Ejemplo: return caches.match('/offline.html');

        return null; // Si no tienes página offline, puedes devolver null o una respuesta predeterminada
      }
    })
  );
});