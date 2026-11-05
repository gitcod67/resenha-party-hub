/**
 * Service Worker - Resenha Party Hub
 * Cache offline completo de todos os arquivos do projeto para funcionamento 100% offline (PWA).
 */

const CACHE_NAME = 'resenha-party-hub-v1.0.0';

const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/audio.js',
  'js/data.js',
  'js/state.js',
  'js/games/garrafa.js',
  'js/games/provavel.js',
  'js/games/eununca.js',
  'js/games/copodorei.js',
  'js/games/bomba.js',
  'js/games/natesta.js',
  'js/app.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Instalação do Service Worker e pré-cache de todos os arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Fazendo pré-cache de todos os arquivos para modo offline');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Removendo cache legado:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições: Cache First com fallback para rede
self.addEventListener('fetch', (event) => {
  // Apenas intercepta requisições GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Se resposta for válida, armazena no cache
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Se estiver offline e for navegação de página, retorna index.html
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
        });
    })
  );
});
