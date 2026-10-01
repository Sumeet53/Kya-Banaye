const CACHE_NAME = "kb-cache-v3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./lang.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(CORE_ASSETS.map(url => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        // Always kick off a network fetch in the background, whether or not
        // we have a cached copy — this is what keeps the cache self-updating
        // without needing to bump CACHE_NAME by hand on every deploy.
        const networkFetch = fetch(event.request)
          .then(response => {
            if (response && response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached); // offline, or the fetch failed: fall back to cache

        // Serve the cached copy instantly if we have one (fast + works offline).
        // If there's nothing cached yet (first-ever visit), wait on the network.
        return cached || networkFetch;
      })
    )
  );
});
