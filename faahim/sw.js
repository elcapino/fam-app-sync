const V='fh-v1.4';self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(['./','index.html','uae.js','app.js','manifest.json','demos.js','icon.png','skyline.svg','quran.js','islam.js','comp.js','shell.js','logo.svg','fonts/Cairo.ttf']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{if(new URL(e.request.url).origin==location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
