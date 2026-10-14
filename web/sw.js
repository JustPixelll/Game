/* Bump CACHE for every public build. No silent replacement of a running game. */
const CACHE='bramblehaven-1.0.0';
const FILES=['./','./index.html','./style.css','./content.js','./engine.js','./art.js','./app.js','./icon.svg','./icon-192.png','./icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bramblehaven-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(response=>{if(response.ok&&FILES.some(f=>new URL(f,self.location.href).href===e.request.url)){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));}return response;})));});
