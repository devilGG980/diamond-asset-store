importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log('Yay! Workbox is loaded 🎉');

  // Precaching allows you to cache a set of files during the installing step
  // asking Workbox to simply install immediately
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Cache Google Fonts
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts',
    }),
  );

  // Cache Images (Cache First - they don't change often)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );

  // Cache JS and CSS (Stale While Revalidate)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' ||
      request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    }),
  );

} else {
  console.log('Boo! Workbox didn\'t load 😬');
}

// Fallback for offline usage
self.addEventListener('fetch', (event) => {
  // Logic inherited from Workbox routes
});