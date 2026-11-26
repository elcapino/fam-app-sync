/* V5 public data adapter — synthetic fixture only. Never touches enc/secrets.
   http(s) reads fixture.json. A file:// opening uses fixture.js so the offline
   package does not depend on fetch. */
(async function(){
  async function load(){
    if(location.protocol==='file:'){
      await new Promise((resolve,reject)=>{
        const s=document.createElement('script');
        s.src='fixture.js';
        s.onload=()=>resolve();
        s.onerror=()=>reject(new Error('fixture.js missing'));
        document.head.appendChild(s);
      });
      if(!window.HMK_FIXTURE||typeof window.HMK_FIXTURE!=='object')throw new Error('fixture.js did not provide data');
      return window.HMK_FIXTURE;
    }
    const res=await fetch('fixture.json',{cache:'no-store'});
    if(!res.ok)throw new Error('fixture fetch failed '+res.status);
    return await res.json();
  }
  const data=await load();
  data.__qaFixture=true;
  window.D=data;
  if(typeof HMKRegistry!=='undefined')HMKRegistry.buildRegistry(D.docs||[]);
  if(typeof rDraw==='function')rDraw();
  else if(window.HMKRestoreAPI&&HMKRestoreAPI.rDraw)HMKRestoreAPI.rDraw();
})().catch(err=>{
  const p=document.querySelector('#pages');
  if(p)p.textContent='تعذر تحميل بيانات الاختبار: '+err;
});
