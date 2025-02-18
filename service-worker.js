import { build, files } from '$service-worker';

const CACHE_PREFIX = 'sudokit-cache-';
const CACHE_VERSION = '1';
const CACHE = `${CACHE_PREFIX}${CACHE_VERSION}`;

const ASSETS_TO_CACHE = ['/', ...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			return cache.addAll(ASSETS_TO_CACHE);
		})
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((key) => {
					if (key.startsWith(CACHE_PREFIX) && key !== CACHE) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	if (event.request.url.startsWith('chrome-extension://')) return;
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}

			return fetch(event.request)
				.then((response) => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					const responseToCache = response.clone();
					caches.open(CACHE).then((cache) => {
						cache.put(event.request, responseToCache).then((r) => r);
					});

					return response;
				})
				.catch(() => {
					return caches.match('/');
				});
		})
	);
});

self.addEventListener('sync', (event) => {
	if (event.tag === 'sync-updates') {
		event.waitUntil(syncData());
	}
});

async function syncData() {
	const cache = await caches.open(CACHE);
	const requests = await cache.keys();

	for (const request of requests) {
		try {
			const response = await fetch(request);
			if (response && response.status === 200 && response.type === 'basic') {
				await cache.put(request, response);
			}
		} catch (error) {
			console.error('Sync failed for', request.url, error);
		}
	}
}

self.addEventListener('periodicsync', (event) => {
	if (event.tag === 'update-cache') {
		event.waitUntil(syncData());
	}
});