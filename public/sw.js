const CACHE_STATIC_NAME = "static-v2";
const CACHE_DYNAMIC_NAME = "dynamic-v2";

const ROOT_URL = "/";
const STATIC_FILES = [
  `${ROOT_URL}`,
  `${ROOT_URL}index.html`,
  `${ROOT_URL}src/js/external/perlin.js`,
  `${ROOT_URL}src/js/app.js`,
  `${ROOT_URL}src/js/cursor.js`,
  `${ROOT_URL}src/js/debounce.js`,
  `${ROOT_URL}src/css/style.css`,
  `${ROOT_URL}src/assets/videos/about.mp4`,
  `${ROOT_URL}src/assets/images/cover.png`,
  `${ROOT_URL}src/assets/images/astro.jpeg`,
  `${ROOT_URL}src/assets/images/hellowean.jpeg`,
  `${ROOT_URL}src/assets/images/horror.jpeg`,
  `${ROOT_URL}src/assets/images/movie.jpeg`,
  `https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap`,
];

self.addEventListener("install", function (event) {
  event.waitUntil(
      caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        return cache.addAll(STATIC_FILES);

      })
    
  );
});

self.addEventListener("activate", (event) => {
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {
            return cachedResponse;
        }
        fetch(event.request)
            .then(response => {
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                    cache.put(event.request, responseToCache);
                    return response;
                })
            });
        })
  );
});