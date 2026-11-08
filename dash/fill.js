/* HMK rows "fill the gaps" — staged 2026-11-07. Client-side only: reads the already-decrypted D payload
   and existing registry helpers; adds compact rows on sum/proj. No new data sources, no network, no writes. */
(function(){
 const NA='غير متوفر';
 const esc=s=>(typeof rEsc==='function'?rEsc(s):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
 const priv=s=>typeof rPrivate==='function'&&rPrivate(String(s));
 const when=v=>v?(typeof rTime==='function'?rTime(v):String(v)):NA;
 const docTime=d=>d&&(d.m||d.date||d.sourceTime)||'';
 const byNew=(a,b)=>String(docTime(b)).localeCompare(String(docTime(a)));
 const docs=id=>{try{return (rDocs(id)||[]).filter(d=>!priv(d.t||''))}catch(e){return []}};
 const ACT=new Map();let seq=0;
 const row=(title,meta,date,act)=>{
  const id=act?('f'+(seq++)):'';if(act)ACT.set(id,act);
  const tag=act?'button':'div',attr=act?` type="button" data-fill="${id}"`:'';
  return `<${tag} class="fill-row"${attr}><b dir="auto">${esc(title||NA)}</b><span class="fill-meta">${esc(meta||'')}</span><span class="fill-date">${esc(date)}</span></${tag}>`;
 };
 function bindFill(w){
  w.querySelectorAll('[data-fill]').forEach(el=>el.addEventListener('click',()=>{
   const act=ACT.get(el.dataset.fill);if(!act)return;
   const back=document.body.dataset.page||'sum';
   if(act.kind==='project'&&typeof rOpen==='function'){rOpen('project',act.id);return;}
   if(act.kind==='doc'&&typeof rRead==='function'){let d=null;try{d=docs().find(x=>(act.f&&x.f===act.f)||(act.t&&x.t===act.t));}catch(e){}if(d)rRead(d,back);return;}
   if(act.kind==='read'&&typeof rRead==='function')rRead(act.doc,back);
  }));
 }
 function sec(title,rows){return `<div class="fill-sec"><div class="fill-h">${esc(title)}</div>${rows.join('')||row(NA,'','')}</div>`;}
 function fillProj(pg){
  const out=rProjects().map(p=>{const ds=docs(p.id).sort(byNew),last=ds[0];
   const next=p.next||p.nextStep||p.next_step;
   return row(R_NAMES[p.id]||p.ar||p.id,'آخر تقرير: '+(last?(last.t||NA):NA)+' · الخطوة التالية: '+(next||NA),last?when(docTime(last)):NA,{kind:'project',id:p.id});});
  return sec('آخر تحديث لكل مشروع',out);
 }
 function fillSum(pg){
  const recent=docs().sort(byNew).slice(0,5).map(d=>{let pid='';try{pid=rDocProject(d)}catch(e){}
   return row(d.t,R_NAMES[pid]||'',when(docTime(d)),{kind:'doc',f:d.f||'',t:d.t||''});});
  const wait=(D.waiting||[]).filter(x=>!priv(JSON.stringify(x))).slice(0,5).map(x=>typeof x==='string'?row(x,'',NA,{kind:'read',doc:{t:x,b:x}}):row(x.t||x.title,x.n||'',when(x.m||x.date),{kind:'read',doc:{t:x.t||x.title||NA,b:[x.t||x.title,x.n].filter(Boolean).join('\n\n'),m:x.m||x.date}}));
  const wins=(D.wins||[]).filter(x=>!priv(JSON.stringify(x))).slice().sort(byNew).slice(0,4).map(x=>row(x.t,x.n||'',when(x.m||x.date),{kind:'read',doc:{t:x.t,b:[x.t,x.n].filter(Boolean).join('\n\n'),m:x.m||x.date}}));
  return sec('آخر التقارير المسجّلة',recent)+sec('بانتظار قرارك',wait)+sec('إنجازات مسجّلة',wins);
 }

 const notPriv=x=>!priv(JSON.stringify(x));
 const ts=v=>{try{const d=rNormalizeDate(v);return d?d.getTime():NaN}catch(e){return NaN}};
 function fillDaily(){
  const news=((D.aiUpdates||{}).news||[]).filter(notPriv).slice().sort((a,b)=>String(b.published_at||'').localeCompare(String(a.published_at||''))).slice(0,5)
   .map(x=>row(x.title,x.summary||'',when(x.published_at),{kind:'read',doc:{t:x.title,b:[x.title,x.summary].filter(Boolean).join('\n\n')+'\n\nسجل بحثي محفوظ · لا تطبيق تلقائي.',m:x.published_at}}));
  return news.length?sec('آخر الأخبار المحفوظة',news):'';
 }
 function fillEvents(){
  if(RESTORE.tab==='upcoming')return '';
  const now=Date.now();
  const up=((D.dailyBrief||{}).dates||[]).filter(notPriv).filter(x=>ts(x.date)>now).sort((a,b)=>ts(a.date)-ts(b.date)).slice(0,5)
   .map(x=>row(typeof x==='string'?x:x.title,x.impact||'',when(x.date),{kind:'read',doc:{t:typeof x==='string'?x:x.title,b:[typeof x==='string'?x:x.title,x.impact].filter(Boolean).join('\n\n'),m:x.date}}));
  return up.length?sec('أقرب المواعيد القادمة',up):'';
 }
 function fillEcosystem(){
  const a=(D.apps||[]).filter(notPriv).map(x=>row(x.ar||x.en||NA,'الإصدار: '+(x.ver||NA)+' · HTTP آخر فحص: '+(x.http??NA),when(x.checked_at),{kind:'read',doc:{t:x.ar||x.en||NA,b:'الإصدار: '+(x.ver||NA)+'\nHTTP آخر فحص: '+(x.http??NA)+'\n'+when(x.checked_at)+'\n\nلم يُختبر الاتصال من هذه النسخة.',m:x.checked_at}}));
  return a.length?sec('تفاصيل آخر فحص',a):'';
 }
 function fillExisting(){
  const i=((D.aiUpdates||{}).ideas||[]).filter(notPriv).slice().sort((a,b)=>String(b.generated_at||'').localeCompare(String(a.generated_at||''))).slice(0,5)
   .map(x=>row(x.title,x.summary||'',when(x.generated_at),{kind:'read',doc:{t:x.title,b:[x.title,x.summary].filter(Boolean).join('\n\n')+'\n\nسجل بحثي محفوظ · لا تطبيق تلقائي.',m:x.generated_at}}));
  return i.length?sec('اقتراحات الذكاء المحفوظة',i):'';
 }
 const PAGED={daily:fillDaily,events:fillEvents,ecosystem:fillEcosystem,existing:fillExisting};
 const MAP={proj:fillProj,sum:fillSum};
 function demoLabel(){const pg=document.querySelector('#pages .restore-page');if(!pg||pg.querySelector('.demo-label'))return;
  const l=document.createElement('div');l.className='demo-label';l.textContent='معاينة تجريبية — بيانات غير حقيقية';
  const h=pg.querySelector('.ph,.r-head');h?h.after(l):pg.prepend(l);}
 function apply(){
  if(typeof D==='undefined'||!D)return;if(D.__qaFixture)demoLabel();const r=document.body.dataset.page,fn=MAP[r]||PAGED[r];if(!fn)return;
  const pg=document.querySelector('#pages .restore-page');if(!pg||pg.querySelector('.fill-wrap'))return;
  ACT.clear();seq=0;
  let html='';try{html=fn(pg);}catch(e){return;}if(!html)return;
  if(PAGED[r]){if(pg.querySelector('.pgr'))return;const box=pg.querySelector('.c.fill');if(box)box.style.flex='0 0 auto';}
  const w=document.createElement('div');w.className='fill-wrap';w.dataset.route=r;w.innerHTML=html;bindFill(w);
  const anchor=pg.querySelector('.r-policy,.project-note');anchor?pg.insertBefore(w,anchor):pg.appendChild(w);
 }
 const start=()=>{const host=document.querySelector('#pages');if(!host)return;new MutationObserver(apply).observe(host,{childList:true,subtree:true});apply();};
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
})();
