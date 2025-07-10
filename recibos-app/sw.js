const CACHE_NAME = 'recibos-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/clientes.html',
  '/recibos.html',
  '/style.css',
  '/script.js',
  '/clientes.js',
  '/recibos.js'
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
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 