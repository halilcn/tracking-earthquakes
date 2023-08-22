// TODO: it will be changed.

const CACHE_NAME = 'v1-cache'
const urlsToCache = ['/']
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache)
    })
  )
})
