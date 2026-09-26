const VERSION = 'kya-banaye-v7';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'recipes.json', 'recipes.js', 'manifest.webmanifest', 'logo-mark.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Stale-while-revalidate: serve cached copy instantly, refresh it in the background.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const network = fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached || (e.request.mode === 'navigate' ? cache.match('index.html') : undefined));
    return cached || network;
  }));
});

// Best-effort background meal check (Periodic Background Sync).
// Chrome/Android only, and only after the browser grants it based on engagement --
// there's no equivalent on iOS. registered from enableNotifications() in app.js.
self.addEventListener('periodicsync', event => {
  if (event.tag === 'meal-check') event.waitUntil(runBackgroundMealCheck());
});

async function runBackgroundMealCheck() {
  try {
    const res = await fetch('recipes.json');
    const data = await res.json();
    const recipes = data.recipes || data;

    const hour = new Date().getHours();
    let mealType = null, label = null;
    if (hour >= 7 && hour < 10)       { mealType = 'breakfast'; label = 'Breakfast'; }
    else if (hour >= 12 && hour < 14) { mealType = 'lunch';     label = 'Lunch'; }
    else if (hour >= 16 && hour < 18) { mealType = 'snack';     label = 'Snacks'; }
    else if (hour >= 19 && hour < 21) { mealType = 'dinner';    label = 'Dinner'; }
    if (!mealType) return;

    const pool = recipes.filter(r => r.mealType === mealType);
    if (!pool.length) return;
    const dayIndex = Math.floor(Date.now() / 86400000);
    const pick = pool[dayIndex % pool.length];

    await self.registration.showNotification(label + ' time! 🍽️', {
      body: `How about ${pick.name}?`,
      icon: 'icon-192.png',
      badge: 'icon-192.png'
    });
  } catch (e) { /* offline or blocked -- skip silently */ }
}
