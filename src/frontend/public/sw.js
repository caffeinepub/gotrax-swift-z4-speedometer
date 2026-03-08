// Gotrax Swift Z4 Speedometer — Service Worker
// Cache-first strategy for full offline support

const CACHE_NAME = "z4-speedo-v1";

// On install: cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache the root and known static assets
        // Vite hashes JS/CSS file names, so we cache them on first fetch
        return cache.addAll([
          "/",
          "/manifest.json",
          "/assets/generated/pwa-icon-192.dim_192x192.png",
          "/assets/generated/pwa-icon-512.dim_512x512.png",
        ]);
      })
      .then(() => self.skipWaiting()),
  );
});

// On activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch: cache-first with network fallback, then cache new responses
self.addEventListener("fetch", (event) => {
  // Only handle GET requests for same-origin or app assets
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip ICP/API calls — those need network
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      // Not in cache — fetch from network and cache the response
      return fetch(event.request)
        .then((response) => {
          // Only cache successful same-origin responses
          if (
            response.ok &&
            (url.origin === self.location.origin ||
              event.request.url.includes("/assets/"))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline and not in cache — return the cached root for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          // For other assets, just fail gracefully
          return new Response("Offline", { status: 503 });
        });
    }),
  );
});
