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