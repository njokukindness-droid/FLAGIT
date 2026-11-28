const CACHE = 'flagit-v20261128';
const SHELL = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cache the app shell, then activate immediately
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL))
  );
});

// Activate: delete OLD version caches only — never the current one
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: network first, update cache, fall back to cache when offline
self.addEventListener('fetch', e => {
  // Only handle GET requests — skip POST/PUT etc. (Supabase API calls)
  if (e.request.method !== 'GET') return;

  // Skip cross-origin requests (Supabase, Groq, fonts) except for caching shell
  const url = new URL(e.request.url);
  const isShell = SHELL.includes(url.pathname);
  const isSameOrigin = url.origin === self.location.origin;

  if (!isSameOrigin) {
    // For cross-origin (Supabase/API): network only, no cache involvement
    return;
  }

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        // Cache successful same-origin responses
        if (res.ok && (isShell || url.pathname === '/')) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Offline fallback — serve from cache
        return caches.match(e.request)
          .then(cached => cached || caches.match('/'));
      })
  );
});

// Message handler: app sends 'SKIP_WAITING' when user taps the update banner
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
