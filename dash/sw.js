const C='hmk-v1.3',A=['./','index.html','app.js','manifest.webmanifest','icon-192.png','icon-512.png','fonts/IBMPlexSansArabic-Regular.ttf','fonts/IBMPlexSansArabic-SemiBold.ttf','fonts/IBMPlexSansArabic-Bold.ttf'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A))));
self.addEventListener('fetch',e=>{if(e.request.url.includes('.enc.json'))return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});

self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
