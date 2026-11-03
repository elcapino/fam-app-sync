const C='iqra-v17';self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','style.css','app.js','update.js','data.js','fonts/Cairo.ttf','icon-192.png']))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
