/* FSMS launcher service worker.
 *
 * Its only job is to make the app installable and to make the splash screen
 * appear instantly on a cold start. It caches the launcher shell — this page,
 * the manifest and the icons — and nothing else.
 *
 * It deliberately does NOT cache script.google.com. FSMS is live data behind a
 * session: a cached register, an old attendance list or a stale wallet balance
 * would be worse than an honest failure. Those requests are not same-origin
 * anyway, so they pass straight through to the network.
 */

var CACHE = 'fsms-shell-v1';

var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/splash-mark.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      // addAll is all-or-nothing; one missing icon would abort the install,
      // so add them individually and tolerate a miss.
      .then(function (c) {
        return Promise.all(SHELL.map(function (u) {
          return c.add(u).catch(function () {});
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;

  // Only ever touch our own shell. Everything else — above all the Apps
  // Script app itself — goes to the network untouched.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Network-first, so a launcher update is picked up on the next visit,
  // with the cache as the offline fallback.
  e.respondWith(
    fetch(req)
      .then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('./index.html');
        });
      })
  );
});
