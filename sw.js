const CACHE = 'luoke-v66';
const PAGE = '/';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  var url = new URL(e.request.url);
  // Blob URLs: pass through
  if (url.protocol === 'blob:') return;
  // Navigation: network-first, fallback to cache (offline only)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(r) {
        if (r.ok) {
          var rc = r.clone();
          caches.open(CACHE).then(function(c) { c.put(PAGE, rc); });
        }
        return r;
      }).catch(function() { return caches.match(PAGE); })
    );
    return;
  }
  // Other: network-first, fallback to cache
  e.respondWith(
    fetch(e.request).then(function(r) {
      if (r.ok && e.request.method === 'GET') {
        var rc = r.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, rc); });
      }
      return r;
    }).catch(function() { return caches.match(e.request); })
  );
});
