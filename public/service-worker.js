const cacheName = "static-cache-v2";
const cacheData = "data-cache-v1";
const cacheTime = [
    "/",
    "/index.html",
    "index.js", 
    "/idb.js",
    "/style.css"
];

self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(cacheName).then(cache => {
        console.log("Files were pre cached");
        return cache.addAll(cacheTime);
      })
    );
  
    self.skipWaiting();
  });
  
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== cacheName && key !== cacheData) {
              console.log("Removing cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });

  self.addEventListener("fetch", evt => {
    if(evt.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch(data)', evt.request.url);

evt.respondWith(
                caches.open(cacheData).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200){
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            })
            );
            return;
        }

evt.respondWith(
    caches.open(cacheName).then( cache => {
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })
  );
}); 