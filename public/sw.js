const CACHE_NAME = 'image-cache-v1';
const IMAGE_CACHE_PATHS = [
  '/images/Our-story.webp',
  '/images/Final_Logo.png',
  '/images/moodboard/image1.webp',
  '/images/moodboard/image2.webp',
  '/images/moodboard/image3.webp',
  '/images/moodboard/image4.webp',
  '/images/moodboard/image5.webp',
  '/images/moodboard/image6.webp',
  '/images/moodboard/image7.webp',
  '/images/moodboard/image8.webp',
  '/images/moodboard/image9.webp',
  '/images/moodboard/image10.webp',
  '/images/moodboard/image11.webp',
  '/images/moodboard/image13.webp',
  '/images/moodboard/image14.webp',
  '/images/moodboard/image15.webp',
  '/images/moodboard/image16.webp',
  '/images/moodboard/image17.webp',
  '/images/moodboard/image18.webp',
  '/images/moodboard/image19.webp',
  '/images/moodboard/image20.webp',
  '/images/moodboard/image21.webp',
  '/images/moodboard/image22.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(IMAGE_CACHE_PATHS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});