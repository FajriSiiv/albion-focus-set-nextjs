const CACHE_NAME = 'albion-focus-v1';
const CHECK_INTERVAL = 60 * 60 * 1000; // Check setiap 1 jam

// Install service worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Periodic background sync (check focus)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-focus') {
    event.waitUntil(checkFocusAndNotify());
  }
});

// Check focus dan kirim notifikasi
async function checkFocusAndNotify() {
  try {
    // Get data dari storage (via message dari client)
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      clients[0].postMessage({ type: 'CHECK_FOCUS' });
    }
  } catch (error) {
    console.error('Error checking focus:', error);
  }
}

// Handle messages dari client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NOTIFY_FULL') {
    const { nickname, focus } = event.data;
    self.registration.showNotification('🎉 Focus Penuh!', {
      body: `${nickname} sudah mencapai ${focus.toLocaleString()} focus!`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `focus-full-${Date.now()}`,
      requireInteraction: true,
      vibrate: [200, 100, 200],
    });
  }
});