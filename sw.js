/* Service Worker для «Мои папки»
 * Стратегия:
 *  - Навигация (HTML): network-first, при офлайне — из кэша
 *  - Статика (иконка, манифест): cache-first
 *  - Данные (IndexedDB) SW не трогает — они живут в браузере отдельно
 */

const VERSION = 'v1.0.0';
const CACHE = 'folders-app-' + VERSION;

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if(event.data && event.data.type === 'SKIP_WAITING'){
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Только GET и только свой origin
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;

  // Навигационные запросы — network-first с фолбэком в кэш
  if(req.mode === 'navigate'){
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('/', copy)).catch(()=>{});
          return res;
        })
        .catch(() => caches.match('/').then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Остальное — cache-first
  event.respondWith(
    caches.match(req).then(hit => {
      if(hit) return hit;
      return fetch(req).then(res => {
        // Кэшируем только успешные same-origin ответы
        if(res && res.status === 200 && res.type === 'basic'){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
        }
        return res;
      });
    })
  );
});