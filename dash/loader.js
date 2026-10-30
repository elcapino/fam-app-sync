/* Dashboard loader: fetch encrypted data, decrypt locally (WebCrypto), cache for offline. */
(function(){
const URL_="dash.enc.json",ls=localStorage,b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),tob=a=>btoa(String.fromCharCode(...new Uint8Array(a)));
const css=document.createElement("style");css.textContent=`#lk{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;background:#05080b;color:#e8f1f2;font-family:Cairo,sans-serif;direction:rtl}
#lk .bx{width:min(340px,88vw);background:#0b1218;border:1px solid #2ef2c4;border-radius:18px;padding:22px;text-align:center;box-shadow:0 0 30px #2ef2c433}#lk h2{color:#2ef2c4;margin:6px 0}#lk p{color:#7f97a3;font-size:.9em}
#lk input{width:100%;padding:12px;border-radius:12px;border:1px solid #173040;background:#05080b;color:#e8f1f2;font-size:1.05em;text-align:center;direction:ltr;margin:8px 0}#lk button{width:100%;padding:12px;border-radius:12px;border:0;background:#2ef2c4;color:#05080b;font-weight:900}#lk .er{color:#ff5d6c;min-height:1.4em;margin-top:8px;font-size:.85em}
#rf{position:fixed;bottom:8px;inset-inline-end:10px;z-index:50;border:1px solid #2ef2c4;background:#06221ccc;color:#2ef2c4;border-radius:99px;padding:4px 10px;font:700 12px ui-monospace,monospace}`;
document.head.appendChild(css);
async function derive(pw,salt){const m=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:b64(salt),iterations:600000},m,{name:"AES-GCM",length:256},true,["decrypt"])}
async function dec(key,e){const p=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(e.iv)},key,b64(e.ct));return JSON.parse(new TextDecoder().decode(p))}
async function storedKey(){const k=ls.getItem("hdKey");return k?crypto.subtle.importKey("raw",b64(k),"AES-GCM",false,["decrypt"]):null}
async function fetchEnc(){const r=await fetch(URL_+"?t="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;return r.json()}
function ask(e){return new Promise(res=>{const d=document.createElement("div");d.id="lk";d.innerHTML=`<div class="bx"><div style="font:28px ui-monospace,monospace;color:#2ef2c4">&gt;_ 🔐</div><h2>كلمة سر العائلة</h2><p>مرة وحدة بس · Family password (once)</p><input id="pwi" type="password" autocomplete="off"><button id="pwb">دخول</button><div class="er"></div></div>`;document.body.appendChild(d);
const go=async()=>{const pw=document.getElementById("pwi").value.trim().toLowerCase();if(!pw)return;d.querySelector(".er").textContent="⏳ ...";try{const k=await derive(pw,e.salt);const data=await dec(k,e);ls.setItem("hdKey",tob(await crypto.subtle.exportKey("raw",k)));ls.setItem("hdSalt",e.salt);d.remove();res(data)}catch(x){d.querySelector(".er").textContent="كلمة السر غلط · Wrong password"}};
document.getElementById("pwb").onclick=go;document.getElementById("pwi").onkeydown=ev=>{if(ev.key=="Enter")go()}})}
function start(data){window.DASH=data;const s=document.createElement("script");s.src="app.js";s.onload=addBtn;document.body.appendChild(s)}
function addBtn(){const b=document.createElement("button");b.id="rf";b.textContent="⟳ sync";b.onclick=()=>location.reload();document.body.appendChild(b)}
(async()=>{let e=null,cached=ls.getItem("hdCache");try{e=await fetchEnc()}catch(x){}
if(!e&&cached)e=JSON.parse(cached);
if(!e){const d=document.createElement("div");d.id="lk";d.innerHTML=`<div class="bx"><h2>نحتاج إنترنت أول مرة</h2><p>Connect once, then reopen.</p><button onclick="location.reload()">⟳</button></div>`;document.body.appendChild(d);return}
let data=null;try{if(ls.getItem("hdSalt")==e.salt){const k=await storedKey();if(k)data=await dec(k,e)}}catch(x){}
if(!data)data=await ask(e);
ls.setItem("hdCache",JSON.stringify(e));start(data)})();
})();
