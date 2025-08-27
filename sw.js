/* sw.js */
const SW_VERSION = 'v1.0.1';
const CACHE_NAME = `uai-cache-${SW_VERSION}`;
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png' // si no renombraste, usa 'apple-touch-icon%202.png'
];

const OFFLINE_HTML = `
<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sin conexión</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto;background:#0f172a;color:#e2e8f0;margin:0;display:grid;place-items:center;height:100vh;}
  .card{background:#1e293b;border:1px solid #475569;padding:24px;border-radius:12px;max-width:520px}
  h1{margin:0 0 8px;font-size:20px} p{margin:0 0 8px;color:#94a3b8}
  button{margin-top:12px;background:#6366f1;border:none;color:#fff;padding:10px 12px;border-radius:8px;cursor:pointer}
</style></head><body>
  <div class="card">
    <h1>Estás sin conexión</h1>
    <p>La página solicitada no está en caché. Inténtalo de nuevo cuando recuperes conexión.</p>
    <button onclick="location.reload()">Reintentar</button>
  </div>
</body></html>
`;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('uai-cache-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Navegaciones: network-first
  if (request.mode === 'navigate' || (request.headers.get('Accept') || '').includes('text/html')) {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return preload;
        const net = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, net.clone());
        return net;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' }});
      }
    })());
    return;
  }

  // Estáticos: stale-while-revalidate
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const networkPromise = fetch(request).then((res) => {
      if (res && res.status === 200 && res.type === 'basic') cache.put(request, res.clone());
      return res;
    }).catch(() => null);
    return cached || networkPromise || fetch(request).catch(() => cached);
  })());
});