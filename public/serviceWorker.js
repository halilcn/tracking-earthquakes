// Minimal Service Worker - sadece PWA gereksinimlerini karşılar

// Install event
self.addEventListener('install', function (event) {
  console.log('Service Worker installed')
  // Hemen aktif hale getir
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', function (event) {
  console.log('Service Worker activated')
  // Tüm sayfalarda hemen kontrol al
  self.clients.claim()
})

// Fetch event - PWA için gerekli (cache yapmadan)
self.addEventListener('fetch', function (event) {
  // Sadece network'e yönlendir, cache yapmıyoruz
  event.respondWith(fetch(event.request))
})
