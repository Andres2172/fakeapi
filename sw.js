cambio:const CACHE_NAME = "fakeapi-cache-v2"; // ¡Incrementa la versión de caché!
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
      console.log('Instalando Service Worker y cacheando recursos'); // Agrega logging
      return cache.addAll(urlsToCache);
    })
  );
  // Agrega esto para forzar la actualización del service worker en la primera carga.
  self.skipWaiting();
});

// Activa el service worker y elimina cachés antiguas si existen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName); // Agrega logging
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Agrega esto para tomar el control de la página inmediatamente.
  self.clients.claim();
});

// Intercepta solicitudes y responde desde caché si está disponible, si no, desde la red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async (response) => { // Usa async para mayor claridad
      if (response) {
        return response; // Devolver de caché
      }
      try {
        const fetchResponse = await fetch(event.request);
        //Verifica que la respuesta sea valida
        if(!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic'){
          return fetchResponse;
        }

        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request.clone(), fetchResponse.clone());
        return fetchResponse;
      } catch (error) {
        console.error('Fetch falló:', error); // Mejora el manejo de errores
        return fetchResponse;
      }
    })
  );
});
