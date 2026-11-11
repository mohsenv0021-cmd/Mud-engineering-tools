// Mud Engineer Tools — service worker (offline-first).
// __BUILD__ is replaced with the commit SHA by the GitHub Actions workflow so every deploy refreshes the cache.
const V = 'met-__BUILD__';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png', 'icons/favicon.svg',
  'vendor/xlsx.full.min.js', 'vendor/exceljs.min.js', 'vendor/jszip.min.js'
];
// CDN copies are only a fallback in case vendor/ is missing from the deploy
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(async c => {
    await Promise.all(CORE.map(u => c.add(u).catch(() => {})));
    const haveLocal = await Promise.all(['vendor/xlsx.full.min.js', 'vendor/exceljs.min.js', 'vendor/jszip.min.js'].map(u => c.match(u)));
    if (haveLocal.some(x => !x)) await Promise.all(CDN.map(u => c.add(u).catch(() => {})));
  }));
});

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && u.hostname !== 'cdnjs.cloudflare.com') return;
  e.respondWith((async () => {
    const cache = await caches.open(V);
    const hit = await cache.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(r, res.clone());
      return res;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }          // cache first, refresh in background
    const res = await net;
    if (res) return res;
    if (r.mode === 'navigate') return (await cache.match('index.html')) || (await cache.match('./'));
    return Response.error();
  })());
});
