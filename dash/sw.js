const C="hd-v3.0",A=["./","index.html","app.js","loader.js","fonts/Cairo.ttf","icon-192.png","manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("hd-")&&x!=C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(!u.pathname.includes("/dash/"))return;
if(u.pathname.endsWith("dash.enc.json")||u.pathname.endsWith("/")||u.pathname.endsWith("index.html")||u.pathname.endsWith(".js")){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request.url.split("?")[0],c));return r}).catch(()=>caches.match(e.request.url.split("?")[0])));return}
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
