let cacheStorageKey = 'jigsaw_v1.0'

let cacheList = [
    './index.html',
    './manifest.json',
    './sw.js',
    './static/css/reset.css',
    './static/css/style.css',
    './static/js/jigsaw.js',
    './static/js/jquery-3.2.1.min.js',
    './static/img/darksiders-1.jpg',
    './static/img/darksiders-2.jpg',
    './static/img/dead-cell.jpg',
    './static/img/stardew-valley.jpg',
    './static/img/favicon.png',
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey)
        .then(cache => cache.addAll(cacheList))
        .then(() => self.skipWaiting())
    )
})

self.addEventListener('fetch' , e => {
    e.respondWith(caches.match(e.request).then(response => {
        if(response != null){
            return response
        }
        return fetch(e.request.url)
    }))
})

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.filter(cacheNames => {
            return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
            return caches.delete(cacheNames)
        }))
    }).then(() => {
        return self.clients.claim()
    }))
})