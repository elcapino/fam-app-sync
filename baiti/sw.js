const V='bt-v1.0';self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(['./','index.html','app.js','steps.js','manifest.json','logo.svg','icon.png','fonts/Cairo.ttf']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(new URL(e.request.url).origin==location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
