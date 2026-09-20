/* sw.js — Zentra Realty Field prototype service worker.
   Scope: /agency-system/field/  (app shell only — never caches API responses) */
const CACHE = 'zh-field-v1';
const SHELL = [
  './',
  './index.html',
  './listing-new.html',
  './photos.html',
  './offline.html',
  './field.css',
  './field.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;           // let cross-origin pass through
  if (!url.pathname.includes('/agency-system/field/')) return;

  // Navigation: network first, fall back to cached shell, then offline page.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./offline.html')))
    );
    return;
  }

  // Static assets: cache first.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match('./offline.html')))
  );
});

// Tiny demo of a background sync request queue (not real upload — prototype only).
self.addEventListener('sync', (e) => {
  if (e.tag === 'zh-upload-queue') {
    e.waitUntil(self.clients.matchAll().then((cs) => cs.forEach((c) => c.postMessage({ type: 'flush-queue' }))));
  }
});
