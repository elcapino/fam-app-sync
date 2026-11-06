/* V5 public data adapter — loads synthetic fixture only. Never touches enc/secrets. */
(async function(){
  const res=await fetch('fixture.json',{cache:'no-store'});
  if(!res.ok)throw new Error('fixture fetch failed '+res.status);
  const data=await res.json();
  data.__qaFixture=true;
  window.D=data;
  if(typeof HMKRegistry!=='undefined')HMKRegistry.buildRegistry(D.docs||[]);
  if(typeof rDraw==='function')rDraw();
  else if(window.HMKRestoreAPI&&HMKRestoreAPI.rDraw)HMKRestoreAPI.rDraw();
})().catch(err=>{
  const p=document.querySelector('#pages');
  if(p)p.textContent='تعذر تحميل بيانات الاختبار: '+err;
});
