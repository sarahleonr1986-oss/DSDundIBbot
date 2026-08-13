// sw.js - Service Worker para cachear recursos y permitir funcionamiento offline parcial

const CACHE_NAME = 'dsd-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error al cachear:', err))
  );
});

// Activación - limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en caché, devolverlo
        if (response) {
          return response;
        }
        
        // Si no está en caché, intentar obtenerlo de la red
        return fetch(event.request)
          .then(response => {
            // Clonar la respuesta para guardarla en caché
            const responseClone = response.clone();
            
            caches.open(CACHE_NAME).then(cache => {
              // Solo cachear recursos GET exitosos
              if (event.request.method === 'GET' && response.status === 200) {
                cache.put(event.request, responseClone);
              }
            });
            
            return response;
          })
          .catch(() => {
            // Si falla la red y no está en caché, devolver una respuesta offline
            // Para peticiones de API, devolver un mensaje de error
            if (event.request.url.includes('/api/') || event.request.url.includes('workers.dev')) {
              return new Response(JSON.stringify({ 
                error: 'Modo offline. No se puede conectar con el tutor IA.' 
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            }
            
            // Para otros recursos, devolver una página offline genérica
            return new Response('Offline - Recurso no disponible', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});
