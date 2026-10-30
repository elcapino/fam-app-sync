/* Family app loader: fetch encrypted data, decrypt locally with WebCrypto, cache for offline. */
(function(){
const URL_="https://elcapino.github.io/fam-app-sync/data.enc.json";
const ls=localStorage,b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),tob=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
const css=document.createElement("style");css.textContent=`#lk{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 20%,#5b2a86,#1a0f2e);color:#fff;font-family:Cairo,sans-serif;direction:rtl}
#lk .bx{width:min(340px,88vw);background:rgba(255,255,255,.08);border:1px solid #e9c46a;border-radius:22px;padding:22px;text-align:center}#lk h2{color:#e9c46a;margin-bottom:6px}#lk p{opacity:.85;font-size:.9em;margin-bottom:12px}
#lk input{width:100%;padding:12px;border-radius:14px;border:0;font-size:1.05em;text-align:center;direction:ltr;margin-bottom:10px}#lk button{width:100%;padding:12px;border-radius:14px;border:0;background:#e9c46a;color:#2a1650;font-weight:900;font-size:1em}#lk .er{color:#ffb4b4;min-height:1.4em;margin-top:8px;font-size:.85em}
#rf{position:fixed;bottom:10px;inset-inline-start:10px;z-index:50;border:1px solid #e9c46a;background:#2a1650cc;color:#e9c46a;border-radius:99px;padding:6px 12px;font:700 .8em Cairo,sans-serif}`;
document.head.appendChild(css);
async function derive(pw,salt){const m=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:b64(salt),iterations:600000},m,{name:"AES-GCM",length:256},true,["decrypt"])}
async function dec(key,e){const p=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(e.iv)},key,b64(e.ct));return JSON.parse(new TextDecoder().decode(p))}
async function storedKey(){const k=ls.getItem("famKey");return k?crypto.subtle.importKey("raw",b64(k),"AES-GCM",false,["decrypt"]):null}
async function fetchEnc(){const r=await fetch(URL_+"?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;return r.json()}
function ask(e,msg){return new Promise(res=>{const d=document.createElement("div");d.id="lk";d.innerHTML=`<div class="bx"><div style="font-size:2.4em">🔐</div><h2>كلمة سر العائلة</h2><p>تنكتب مرة وحدة بس · Family password (once)</p><input id="pwi" type="password" autocomplete="off"><button id="pwb">دخول ✨</button><div class="er">${msg||""}</div></div>`;document.body.appendChild(d);
const go=async()=>{const pw=document.getElementById("pwi").value.trim().toLowerCase();if(!pw)return;d.querySelector(".er").textContent="⏳ ...";try{const k=await derive(pw,e.salt);const data=await dec(k,e);ls.setItem("famKey",tob(await crypto.subtle.exportKey("raw",k)));ls.setItem("famSalt",e.salt);d.remove();res(data)}catch(x){d.querySelector(".er").textContent="كلمة السر غلط، جرّب مرة ثانية · Wrong password"}};
document.getElementById("pwb").onclick=go;document.getElementById("pwi").onkeydown=ev=>{if(ev.key=="Enter")go()}})}
function start(data){window.KIDS=data.kids;window.TODAY=data.today;const s=document.createElement("script");s.src="app.js";s.onload=addBtn;document.body.appendChild(s)}
function addBtn(){const b=document.createElement("button");b.id="rf";b.textContent="🔄 تحديث";b.onclick=async()=>{b.textContent="⏳";try{const e=await fetchEnc();const k=await storedKey();await dec(k,e);ls.setItem("famCache",JSON.stringify(e));location.reload()}catch(x){b.textContent="⚠️ offline";setTimeout(()=>b.textContent="🔄 تحديث",2000)}};document.body.appendChild(b)}
(async()=>{let e=null,cached=ls.getItem("famCache");try{e=await fetchEnc()}catch(x){}
if(!e&&cached)e=JSON.parse(cached);
if(!e){const d=document.createElement("div");d.id="lk";d.innerHTML=`<div class="bx"><div style="font-size:2.4em">📡</div><h2>نحتاج إنترنت أول مرة</h2><p>Connect to the internet once, then reopen.</p><button onclick="location.reload()">🔄</button></div>`;document.body.appendChild(d);return}
let data=null;try{if(ls.getItem("famSalt")==e.salt){const k=await storedKey();if(k)data=await dec(k,e)}}catch(x){}
if(!data)data=await ask(e);
ls.setItem("famCache",JSON.stringify(e));start(data)})();
})();
