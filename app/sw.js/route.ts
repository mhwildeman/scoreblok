export const dynamic = 'force-static';
export function GET() {
  const version = JSON.stringify(process.env.NEXT_PUBLIC_APP_VERSION);
  return new Response(`
const CACHE = 'scoreblok-' + ${version};
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch('/', {cache: 'reload'});
    if (!response.ok) throw new Error('App unavailable');
    const html = await response.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="([^" ]+)"/g)]
      .map(match => match[1].replaceAll('&amp;', '&'))
      .filter(url => url.startsWith('/_next/static/'));
    await cache.addAll([...new Set([...assets, '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'])]);
    await cache.put('/', response);
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('scoreblok-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate' && url.pathname === '/') {
    event.respondWith((async () => {
      const cached = await (await caches.open(CACHE)).match('/');
      return cached || fetch(event.request);
    })());
  } else if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    })());
  }
});
`, { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Service-Worker-Allowed': '/' } });
}
