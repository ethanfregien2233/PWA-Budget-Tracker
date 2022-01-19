let cacheName = "static-cache-v1";
let cacheData = "data-cache-v1";
const cacheTime = [
    "./js/idb.js",
    "./js/index.js",
    "./manifest.json",
    "./css/styles.css",
    "./index.html",
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png'
];

self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(siteCache).then(cache => {
            console.log('Your files were pre-cached');
            return cache.addAll(cacheURL);
        })
    );
    
    self.skipWaiting();
});

self.addEventListener('fetch', function(evt) {
    if (evt.request.url.includes('/api/')) {
        evt.respondWith(
            caches
            .open(cacheData)
            .then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            })
            .catch(err => console.log(err))
        );
        return;
    }
    evt.respondWith(
        fetch(evt.request).catch(function() {
            return caches.match(evt.request).then(function(response) {
                if (response) {
                    return response;
                } else if (evt.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/');
                }
            });
        })
    );
});
  