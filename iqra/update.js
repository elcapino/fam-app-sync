/* Auto content update. Feed = JSON {"version":"YYYY-MM-DD.n","grades":[...],"events":[...]} (same shape as grades.json).
   Feed URL: window.IQRA_UPDATE_URL (fallback HEYYA_UPDATE_URL), default = public IQRA feed on elcapino.github.io/fam-app-sync/iqra/update.json; bundled update.json if offline. © HMK */
window.IQRA_UPDATE_URL=window.IQRA_UPDATE_URL||window.HEYYA_UPDATE_URL||'https://elcapino.github.io/fam-app-sync/iqra/update.json';window.HEYYA_UPDATE_URL=window.IQRA_UPDATE_URL;
(function(){const K='heyya_upd',base=window.HEYYA;base.version=base.version||'2026-11-02.0';
 try{const c=JSON.parse(localStorage.getItem(K)||'null');if(c&&c.version>base.version&&Array.isArray(c.grades))Object.assign(base,c)}catch(e){}
 const url=()=>window.HEYYA_UPDATE_URL||'update.json';
 async function check(){try{const r=await fetch(url()+(url().includes('?')?'&':'?')+'t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const f=await r.json();
   if(!f||!f.version||!(f.version>window.HEYYA.version)||!Array.isArray(f.grades))return;
   localStorage.setItem(K,JSON.stringify(f));Object.assign(window.HEYYA,f);localStorage.setItem('heyya_updated',f.version);
   if(window.route)route();const e=document.getElementById('toast');if(e){e.textContent='🔄 '+(document.documentElement.lang=='en'?'Updated':'تم التحديث');e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1800)}
 }catch(e){}}
 window.HEYYA_CHECK=check;addEventListener('load',()=>setTimeout(check,1500));setInterval(check,6*3600e3);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()})})();
