/* HMK restored-compact-v5: unified owner+QA renderer (same r* functions).
   Encrypted loader untouched for owner path. No publish/PC/APK. */
TH='alain';if(typeof theme==='function')theme();const _tc=document.querySelector('meta[name=theme-color]');if(_tc)_tc.content='#5b2d91';
const RESTORE={route:'hq',project:null,page:0,tab:'current',doc:null,offsets:[0],text:'',returnTo:null,returnState:null,draft:'',note:'',scrollTop:0,filters:{},hqTab:'brief',newsIdx:0,entrySource:'nav',hqQuery:'',hqFilter:'all',hqPanelScroll:0,hqReady:false,pendingHqRestore:null,iframeGen:0};
const R_IDS=['elcapino','agency','fahem','drop','market','ideas','house'];
const R_NAMES={elcapino:'ELCAPINO',agency:'وكالة واتساب AI',fahem:'فاهم',drop:'دروبشيبنج',market:'إشارات السوق',ideas:'أفكار الإمارات',house:'البيت'};
const R_NAV=[['sum','الملخص','◈'],['hq','المقر','⌂'],['proj','المشاريع','▦'],['ai','التطورات','✦'],['spend','الإنفاق','▤']];
const ROOM_PROJECT={agency:'agency',fahem:'fahem',drop:'drop',market:'market',ideas:'ideas',house:'house',elcapino:'elcapino',ops:'elcapino',dev:'elcapino',trading:'market',research:'ideas',shopify:'drop'};
const rPrivate=v=>HMKRegistry.isPrivate(v);
const rEsc=v=>esc(String(v??''));
function rText(v){if(v==null)return '';if(typeof v==='string'||typeof v==='number')return String(v);if(Array.isArray(v))return v.map(rText).filter(Boolean).join('\n');return rText(v.ar||v.title_ar||v.name_ar||v.title||v.name||v.text||v.summary||v.t||v.description||v.impact||v.note_ar||v.ar_n||v.b||'');}

/** Normalize seconds/millis/ISO → Asia/Dubai display. Invalid ≠ 1970. */
function rNormalizeDate(v){
  if(v==null||v==='')return null;
  if(typeof v==='number'||(/^\d+(\.\d+)?$/.test(String(v).trim()))){
    let n=Number(v);
    if(!Number.isFinite(n))return null;
    if(n>0 && n<1e11)n=n*1000; // seconds → ms
    if(n<1e11)return null; // still too small / bogus
    const d=new Date(n);return isNaN(d.getTime())?null:d;
  }
  const s=String(v).trim();
  const d=new Date(s);
  if(isNaN(d.getTime()))return null;
  // reject epoch-ish accidental parses from bad units
  if(d.getUTCFullYear()===1970 && !/1970/.test(s) && !/^\d+$/.test(s))return null;
  return d;
}
function rTime(v){
  if(!v)return 'غير مسجّل';
  const d=rNormalizeDate(v);
  if(!d){const s=String(v);return (s.length>16?s.slice(0,16):s)+' · ساعة المصدر غير موثّقة';}
  try{return new Intl.DateTimeFormat('ar-AE',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d)+' · الإمارات';}
  catch(e){return 'غير مسجّل';}
}
function rProjectSourceTime(d){return rTime(d&& (d.m||d.date||d.sourceTime));}
const rStamp=()=>D?.built||D?.updated||'';
function rProjects(){return R_IDS.map(id=>(D?.kpi?.projects||[]).find(p=>p.id===id)||{id,ar:R_NAMES[id],s:'wait'});}
function rRunning(p){return p.s==='go'||p.s==='watch';}
function rChip(p){return `<span class="chip ${rRunning(p)?'go':'wait'}">${rRunning(p)?'شغال':'ينتظر أوامرك'}</span>`;}
function rFamilyDoc(d){return HMKRegistry.isFamilyDoc(d);}
function rDocProject(d){const e=(HMKRegistry.REG.entries.concat(HMKRegistry.REG.diagnostics)).find(x=>x.doc===d)||HMKRegistry.classify(d);return e.projectId||'unassigned';}
function rDocs(id){
 if(id==='house')return [];
 if(!HMKRegistry.REG.entries.length&&D)HMKRegistry.buildRegistry(D.docs||[]);
 return HMKRegistry.ownerEntries(id||null).map(e=>Object.assign({},e.doc,{__reg:e}));
}
function rNote(p){return HMKRegistry.safeProjectNote(p);}
function rPolicy(id){if(id==='market')return 'لا تداول حقيقي من هذه الشاشة.';if(id==='house')return 'المستندات العائلية غير متاحة هنا.';return 'سجل محفوظ · بلا إرسال خارجي.';}
function rCaptureView(){
 const pg=document.querySelector('#pages');
 const ds=document.querySelector('#project-reports')||document.querySelector('.docs-scroll');
 return {route:RESTORE.route,project:RESTORE.project,page:RESTORE.page,tab:RESTORE.tab,scrollTop:pg?pg.scrollTop:0,docsScrollTop:ds?ds.scrollTop:0,filters:Object.assign({},RESTORE.filters),hqTab:RESTORE.hqTab,newsIdx:RESTORE.newsIdx,entrySource:RESTORE.entrySource,hqQuery:RESTORE.hqQuery,hqFilter:RESTORE.hqFilter,hqPanelScroll:RESTORE.hqPanelScroll||0};
}
function rRestoreView(saved){
 if(!saved)return;
 RESTORE.route=saved.route;RESTORE.project=saved.project||null;RESTORE.page=saved.page||0;RESTORE.tab=saved.tab||'current';RESTORE.filters=saved.filters||{};
 RESTORE.hqTab=saved.hqTab||'brief';RESTORE.newsIdx=typeof saved.newsIdx==='number'?saved.newsIdx:0;RESTORE.entrySource=saved.entrySource||'nav';
 RESTORE.hqQuery=saved.hqQuery||'';RESTORE.hqFilter=saved.hqFilter||'all';RESTORE.hqPanelScroll=typeof saved.hqPanelScroll==='number'?saved.hqPanelScroll:0;
 RESTORE.doc=null;RESTORE.offsets=[0];RESTORE.text='';
 if(saved.route==='hq'){
   RESTORE.hqPanelScroll=typeof saved.hqPanelScroll==='number'?saved.hqPanelScroll:RESTORE.hqPanelScroll;
   RESTORE.pendingHqRestore={tab:RESTORE.hqTab,newsIdx:RESTORE.newsIdx,query:RESTORE.hqQuery,filter:RESTORE.hqFilter,scrollTop:saved.scrollTop||0,panelScroll:RESTORE.hqPanelScroll||0};
 }
 rDraw();
 const y=saved.scrollTop||0, yd=saved.docsScrollTop||0;
 if(saved.route!=='hq'){
  const apply=()=>{
    const pg=document.querySelector('#pages'); if(pg&&y) pg.scrollTop=y;
    const ds=document.querySelector('#project-reports')||document.querySelector('.docs-scroll'); if(ds&&yd) ds.scrollTop=yd;
  };
  apply(); requestAnimationFrame(()=>{apply(); setTimeout(apply,40);});
 }
}
function rBack(){
 if(RESTORE.route==='text'){const saved=RESTORE.returnState||{route:RESTORE.returnTo||'reports',project:RESTORE.project,page:0};rRestoreView(saved);return;}
 if(RESTORE.route==='reports'&&RESTORE.project){rOpen('project',RESTORE.project);return;}
 if(RESTORE.route==='project'){rOpen('proj');return;}
 if(['team','ecosystem','existing','daily','events','command','reports','admin'].includes(RESTORE.route)){rOpen(RESTORE.route==='admin'?'sum':'admin');return;}
 rOpen('hq');
}
function rOpen(route,project){RESTORE.route=route;RESTORE.project=project||null;RESTORE.page=0;RESTORE.doc=null;RESTORE.offsets=[0];RESTORE.text='';RESTORE.entrySource='nav';if(route==='hq')RESTORE.pendingHqRestore=null;rDraw();}
function rHeader(title,sub=''){return `<div class="ph"><h2>${rEsc(title)}</h2>${sub?`<span class="mu">${rEsc(sub)}</span>`:''}</div>`;}

function rNewsFeed(){
 const S=HMKRegistry.safeDisplayText||(v=>String(v||''));
 const items=[];
 (D.waiting||[]).filter(x=>!rPrivate(JSON.stringify(x))).slice(0,6).forEach(x=>{
  items.push({kind:'بانتظارك',title:S(rText(x)),date:rStamp(),project:'',projectName:'قرار معلّق',impact:S('يحتاج اعتماداً صريحاً'),action:'waiting',payload:x});
 });
 (D.wins||[]).filter(x=>!rPrivate(JSON.stringify(x))).slice(0,4).forEach(x=>{
  items.push({kind:'إنجاز مسجّل',title:S(rText(x.t||x.title||x)),date:x.m||x.date||rStamp(),project:'',projectName:'سجل الإنجازات',impact:S(rText(x.n||x.note||'من السجل المحفوظ')),action:'wins'});
 });
 HMKRegistry.ownerEntries().slice(0,12).forEach(e=>{const d=e.doc;items.push({kind:'تقرير محفوظ',title:S(d.t||'تقرير'),date:d.m,project:e.projectId,projectName:e.project_name,impact:S((e.sourceRef||'مصدر داخلي')+' · سجل محفوظ'),action:'doc',doc:d,sourceRef:e.sourceRef,sourceId:e.sourceId});});
 (D.kpi?.projects||[]).filter(p=>!rPrivate(JSON.stringify(p))).forEach(p=>{
  if(!p.ar_n&&p.pct==null)return;
  items.push({kind:'تطور مشروع',title:S(R_NAMES[p.id]||p.ar||p.id),date:rStamp(),project:p.id,projectName:R_NAMES[p.id]||p.id,impact:HMKRegistry.safeImpact(p),action:'project',projectId:p.id});
 });
 return items.filter(x=>x.title&&!rPrivate(x.title+x.impact)).slice(0,18);
}

function rHqPayload(){
 const hq=JSON.parse(JSON.stringify(D.hq||{}));
 hq.agents=(hq.agents||[]).filter(a=>!rPrivate([a.id,a.name,a.role].join(' ')));
 hq.rooms=hq.rooms||[];
 const waiting=(D.waiting||[]).filter(x=>!rPrivate(JSON.stringify(x))).map(rText).filter(Boolean).slice(0,8);
 const wins=(D.wins||[]).filter(x=>!rPrivate(JSON.stringify(x))).map(x=>rText(x.t||x.title||x)).filter(Boolean).slice(0,6);
 const brief=hq.brief||{date:'',your_part:[],needs_you:[]};
 brief.date=brief.date||(D.dailyBrief?.generated_at||rStamp()||'').toString().slice(0,10);
 brief.your_part=(brief.your_part&&brief.your_part.length?brief.your_part:waiting.slice(0,5)).filter(x=>!rPrivate(x));
 brief.needs_you=(brief.needs_you&&brief.needs_you.length?brief.needs_you:waiting.slice(5,10)).filter(x=>!rPrivate(x));
 if(!brief.your_part.length)brief.your_part=['راجع آخر تقارير المشاريع من شريط التحديثات أعلاه'];
 hq.brief=brief;
 const meeting=hq.meeting||{week:'',broke:[],wins:[]};
 if(!(meeting.wins||[]).length)meeting.wins=wins.slice(0,5);
 hq.meeting=meeting;
 hq.agents=hq.agents.map(a=>({...a,active:false,status:a.status&&a.status!=='ok'?a.status:'idle'}));
 return hq;
}

function rNavId(){
  if(['sum','hq','proj','ai','spend'].includes(RESTORE.route))return RESTORE.route;
  if(RESTORE.route==='project'||RESTORE.route==='reports')return 'proj';
  if(RESTORE.route==='text'){
    const es=RESTORE.entrySource||(RESTORE.returnState&&RESTORE.returnState.entrySource)||'nav';
    if(es==='hq-news'||(RESTORE.returnState&&RESTORE.returnState.route==='hq'))return 'hq';
    if(RESTORE.returnState&&RESTORE.returnState.route==='project')return 'proj';
    if(RESTORE.returnState&&['ai','spend','sum'].includes(RESTORE.returnState.route))return RESTORE.returnState.route;
    return 'proj';
  }
  return 'sum';
}

function rDraw(){if(!D)return;HMKRegistry.buildRegistry(D.docs||[]);document.body.className='restore';document.body.dataset.page=RESTORE.route;document.documentElement.dir='rtl';if(typeof L!=='undefined')L='ar';
 const upd=$('#upd');if(upd)upd.textContent=D.__qaFixture?'بيانات تجريبية · العين':'العين · الإمارات · سجل محفوظ';
 const back=$('#back');if(back){back.hidden=['hq','sum'].includes(RESTORE.route);back.onclick=rBack;}
 const mainOn=rNavId();
 const nav=$('#nav');
 nav.innerHTML=R_NAV.map(([id,t,icon])=>`<button data-r-nav="${id}" class="${mainOn===id?'on':''}"><em>${icon}</em><span>${t}</span></button>`).join('');
 nav.querySelectorAll('button').forEach(b=>b.onclick=()=>rOpen(b.dataset.rNav));
 $('#pages').innerHTML='<section class="restore-page"></section>';const pg=$('#pages .restore-page');
 if(RESTORE.route==='hq')rHq(pg);
 else if(RESTORE.route==='sum')rSum(pg);
 else if(RESTORE.route==='proj')rPortfolio(pg);
 else if(RESTORE.route==='project')rProject(pg);
 else if(RESTORE.route==='ai')rAI(pg);
 else if(RESTORE.route==='spend')rSpend(pg);
 else if(RESTORE.route==='reports')rReportList(pg);
 else if(RESTORE.route==='text')rTextPage(pg);
 else if(RESTORE.route==='daily')rDaily(pg);
 else if(RESTORE.route==='events')rEvents(pg);
 else if(RESTORE.route==='command')rCommand(pg);
 else if(['admin','team','ecosystem','existing'].includes(RESTORE.route))rAdmin(pg);
 else rOpen('hq');
}

function rHq(pg){
 RESTORE.iframeGen=(RESTORE.iframeGen||0)+1;const gen=RESTORE.iframeGen;RESTORE.hqReady=false;
 const hqSrc=(document.body.dataset.hqSrc)||(location.pathname.includes('/review/')?'../www/hq.html':'hq.html');
 pg.innerHTML=`<div class="r-head"><h2>مقر الشركة الذكي</h2><small>العين · الإمارات</small></div><iframe class="r-hq" id="hqf" title="المقر المتحرك" src="${hqSrc}?v=${gen}"></iframe>`;
 /* do not postMessage before hqReady */
}

function rHqSend(extra){
 const f=$('#hqf');if(!f||!D?.hq||!RESTORE.hqReady)return;
 try{
  const msg={hq:rHqPayload(),news:rNewsFeed()};
  f.contentWindow.postMessage(msg,location.origin);
  const rest=extra||RESTORE.pendingHqRestore;
  if(rest){
   f.contentWindow.postMessage({hqRestore:{tab:rest.tab||RESTORE.hqTab||'brief',newsIdx:typeof rest.newsIdx==='number'?rest.newsIdx:RESTORE.newsIdx,query:rest.query||RESTORE.hqQuery||'',filter:rest.filter||RESTORE.hqFilter||'all',scrollTop:rest.scrollTop||0,panelScroll:typeof rest.panelScroll==='number'?rest.panelScroll:(RESTORE.hqPanelScroll||0)}},location.origin);
   RESTORE.pendingHqRestore=null;
  }
 }catch(e){}
}

function rSum(pg){
 const pr=rProjects(),active=pr.filter(rRunning).length,wait=(D.waiting||[]).filter(x=>!rPrivate(JSON.stringify(x))).length;
 const sp=D.spend||[],tv=sp.reduce((a,s)=>a+Number(s.v||0),0),tc=sp.reduce((a,s)=>a+Number(s.cap||0),0)||1;
 const nDocs=rDocs().length;
 pg.innerHTML=rHeader('الملخص التنفيذي',rTime(rStamp()))+`<div class="g4">
 <button class="c kpi" data-go="proj"><div class="v">${active}</div><div class="l">مشاريع بحالة نشطة في السجل</div></button>
 <button class="c kpi" data-go="admin"><div class="v" style="color:var(--gold2)">${wait}</div><div class="l">بانتظار قرارك</div></button>
 <button class="c kpi" data-go="spend"><div class="v">${Math.round(100*tv/tc)}٪</div><div class="l">من سقوف الإنفاق المسجّلة</div></button>
 <button class="c kpi" data-go="reports"><div class="v">${nDocs}</div><div class="l">تقارير ظاهرة في السجل</div></button></div>
 <div class="menu-list">
  <button class="c" data-go="daily"><b>موجز اليوم</b><small>لقطة محفوظة</small></button>
  <button class="c" data-go="reports"><b>التقارير</b><small>${nDocs} سجل</small></button>
  <button class="c" data-go="events"><b>سجل الأحداث</b><small>مواعيد وتقارير</small></button>
  <button class="c" data-go="command"><b>مسودة أوامر CEO</b><small>محلية · بلا إرسال</small></button>
  <button class="c" data-go="ai"><b>تطورات الذكاء</b><small>أخبار واقتراحات محفوظة</small></button>
  <button class="c" data-go="hq"><b>المقر المتحرك</b><small>تحديثات وغرف</small></button>
 </div>
 <div class="r-policy">النسب والحالات من اللقطة المحفوظة وليست قياساً حياً. الملخص يعكس السجل لا تقدماً حياً.</div>`;
 pg.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>rOpen(b.dataset.go));
}

function rPortfolio(pg){
 const projects=rProjects();
 const row=p=>{const n=rDocs(p.id).length;const pct=HMKRegistry.safePctLabel(p);const snap=pct?`<span class="mu num" title="${rEsc(pct.caveat)}">${rEsc(pct.value)}٪ أرشيف</span>`:`<span class="mu">بلا نسبة مؤرشفة</span>`;
  return `<button class="project-line row" data-project="${p.id}"><span class="project-icon">◇</span><b style="flex:1;text-align:start">${rEsc(R_NAMES[p.id])}</b>${rChip(p)}${snap}<span class="mu num">${n?n+' تقرير':'—'}</span></button>`;};
 pg.innerHTML=rHeader('محفظة المشاريع',projects.length+' في السجل')+`<div class="c fill"><div class="docs-scroll portfolio-lines">${projects.map(row).join('')}</div></div>
 <div class="project-actions"><button class="c" data-go="existing">الاقتراحات الحالية</button><button class="c" data-go="ai">التطورات</button></div>
 <div class="mu project-note">صفوف مضغوطة من السجل · النسبة أرشيف محفوظ وليست تقدماً حياً · افتح السطر للتفاصيل</div>`;
 pg.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>rOpen('project',b.dataset.project));
 pg.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>rOpen(b.dataset.go));
}

function rProject(pg){
 const p=rProjects().find(x=>x.id===RESTORE.project);if(!p){rOpen('proj');return;}
 if(p.id==='house'){pg.innerHTML=rHeader(R_NAMES.house)+`<div class="c"><p>${rEsc(rNote(p))}</p></div><div class="r-policy">${rEsc(rPolicy('house'))}</div>`;return;}
 const ds=rDocs(p.id),per=7,np=Math.max(1,Math.ceil(ds.length/per));RESTORE.page=Math.min(RESTORE.page,np-1);
 const slice=ds.slice(RESTORE.page*per,RESTORE.page*per+per);
 const pct=HMKRegistry.safePctLabel(p);
 const emptyMsg=p.id==='fahem'?'لا توجد تقارير برنامج مصنفة في هذا النطاق':'لا تقرير نصي مرتبط بهذا المشروع في المصدر الحالي.';
 const note=rEsc(rNote(p));
 pg.innerHTML=`<div class="ph"><h2>${rEsc(R_NAMES[p.id])}</h2>${rChip(p)}</div>
 <div class="c"><p>${note}</p>${pct?`<div class="mu">${rEsc(pct.label)} <bdi class="num">${rEsc(pct.value)}٪</bdi> · ${rEsc(pct.caveat)}</div><details class="r-tech"><summary>تفاصيل</summary><div class="mu">${rEsc(pct.detail||'')}</div></details>`:''}</div>
 <div class="c fill"><div class="r-meta"><h3 style="margin:0;color:var(--gold2);font:600 12px Plex">التقارير</h3><button class="r-action" id="all-project-reports" ${ds.length?'':'hidden'}>جميع التقارير</button></div>
 <div class="docs-scroll" id="project-reports">${slice.map((d,i)=>{return `<button class="project-doc row" data-report="${RESTORE.page*per+i}"><span style="flex:1;text-align:start">${rEsc(d.t||'تقرير')}</span><span class="mu num">${rEsc(rProjectSourceTime(d))}</span></button>`;}).join('')||`<p class="mu">${emptyMsg}</p>`}</div></div>
 <div class="pgr"><button data-step="-1" ${RESTORE.page===0?'disabled':''}>‹</button><span class="mu num">${RESTORE.page+1} / ${np}</span><button data-step="1" ${RESTORE.page>=np-1?'disabled':''}>›</button></div>
 <div class="r-policy">${rEsc(rPolicy(p.id))}</div>`;
 pg.querySelectorAll('[data-report]').forEach(b=>b.onclick=()=>{RESTORE.entrySource='project';rRead(ds[Number(b.dataset.report)],'project');});
 const all=$('#all-project-reports');if(all)all.onclick=()=>rOpen('reports',p.id);
 pg.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{RESTORE.page+=Number(b.dataset.step);rDraw();});
}

function rAI(pg){
 const news=(D.aiUpdates?.news||[]).filter(x=>!rPrivate(JSON.stringify(x)));
 const ideas=(D.aiUpdates?.ideas||[]).filter(x=>!rPrivate(JSON.stringify(x)));
 const rows=[...news,...ideas];
 const per=4,np=Math.max(1,Math.ceil(rows.length/per));RESTORE.page=Math.min(RESTORE.page,np-1);
 const slice=rows.slice(RESTORE.page*per,RESTORE.page*per+per);
 pg.innerHTML=rHeader('تطورات الذكاء الاصطناعي',rows.length+' سجل')+`<div class="c fill"><div class="docs-scroll">${slice.map((x,i)=>`<button class="project-doc row" data-i="${RESTORE.page*per+i}"><b>${rEsc(rText(x.title||x.t||x))}</b></button>`).join('')||`<p class="mu">لا نتائج محفوظة.</p>`}</div></div>
 <div class="pgr"><button data-step="-1" ${RESTORE.page===0?'disabled':''}>‹</button><span class="mu num">${RESTORE.page+1} / ${np}</span><button data-step="1" ${RESTORE.page>=np-1?'disabled':''}>›</button></div>
 <div class="r-policy">سجل بحثي محفوظ · لا تطبيق تلقائي أو اشتراك جديد.</div>`;
 pg.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const x=rows[Number(b.dataset.i)];rRead({t:rText(x.title||x.t||x),b:[rText(x.title||x),rText(x.summary||x.what||x.description||x.impact||x.body||x.b),rText(x.benefit||x.opportunity),rText(x.action||x.usage_impact)].filter(Boolean).join('\n\n')+'\n\nسجل بحثي محفوظ · لا تطبيق تلقائي.',m:x.published_at||x.generated_at||rStamp()},'ai');});
 pg.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{RESTORE.page+=Number(b.dataset.step);rDraw();});
}

function rSpend(pg){
 const sp=(D.spend||[]).filter(x=>!rPrivate(JSON.stringify(x)));
 const tv=sp.reduce((a,s)=>a+Number(s.v||0),0),tc=sp.reduce((a,s)=>a+Number(s.cap||0),0)||1;
 pg.innerHTML=rHeader('الإنفاق والسقوف',rTime(D.usage?.updated||rStamp()))+`<div class="c"><div class="v" style="font:700 24px Plex">$${tv.toFixed(1)} <span class="mu">/ $${tc}</span></div><div class="bar"><i style="width:${Math.round(100*tv/tc)}%"></i></div><div class="mu">لقطة إنفاق محفوظة · لا تعديل للسقوف من هنا</div></div>
 <div class="c fill"><div class="docs-scroll">${sp.map(x=>`<div class="row"><b style="flex:1">${rEsc(x.k)}</b><span class="num">${rEsc(x.v)} / ${rEsc(x.cap)}</span></div>`).join('')||`<p class="mu">لا سقوف مسجّلة.</p>`}</div></div>
 <div class="r-policy">وحدة القيمة كما وردت بالمصدر؛ ليست فاتورة حية.</div>`;
}

function rPaginated(pg,items,renderItem,onClick,empty){
 const list=pg.querySelector('.r-list')||pg.querySelector('.docs-scroll');
 const per=Math.max(3,Math.min(8,Math.floor(((list&&list.clientHeight)||280)/48)));
 const count=Math.max(1,Math.ceil(items.length/per));RESTORE.page=Math.min(Math.max(0,RESTORE.page),count-1);
 list.innerHTML=items.slice(RESTORE.page*per,(RESTORE.page+1)*per).map((x,i)=>renderItem(x,RESTORE.page*per+i)).join('')||`<div class="r-empty">${rEsc(empty||'لا سجل متاح.')}</div>`;
 list.querySelectorAll('[data-r-item]').forEach(b=>b.onclick=()=>onClick(items[Number(b.dataset.rItem)]));
 if(count>1){let pager=pg.querySelector('.pgr');if(!pager){pager=document.createElement('div');pager.className='pgr';pg.append(pager);}pager.innerHTML=`<button ${RESTORE.page===0?'disabled':''}>‹</button><span class="mu num">${RESTORE.page+1} / ${count}</span><button ${RESTORE.page===count-1?'disabled':''}>›</button>`;pager.children[0].onclick=()=>{RESTORE.page--;rDraw()};pager.children[2].onclick=()=>{RESTORE.page++;rDraw()};}
}

function rReportList(pg){
 const ds=rDocs(RESTORE.project);
 pg.innerHTML=rHeader(RESTORE.project?'تقارير '+R_NAMES[RESTORE.project]:'التقارير',ds.length+' · الأحدث أولاً')+`<div class="c fill"><div class="docs-scroll r-list"></div></div>`;
 rPaginated(pg,ds,(d,i)=>`<button class="project-doc row" data-r-item="${i}"><span class="chip wait" style="font-size:9px;flex:0 0 auto">${rEsc(R_NAMES[rDocProject(d)]||'تقرير')}</span><span style="flex:1;text-align:start">${rEsc(d.t||'تقرير')}</span><span class="mu num">${rEsc(rTime(d.m||''))}</span></button>`,d=>{RESTORE.entrySource='reports';rRead(d,'reports');});
}
function rRead(d,back){
 const snap=rCaptureView();
 if(back==='hq'||RESTORE.entrySource==='hq-news'){snap.route='hq';snap.project=null;snap.entrySource='hq-news';}
 else{snap.route=back||RESTORE.route;snap.entrySource=RESTORE.entrySource||back||'nav';}
 RESTORE.returnState=snap;RESTORE.doc=d;
 const reg=d.__reg;const meta=reg?('\n\n—\nمصدر السجل: '+(reg.sourceRef||reg.sourceId||'غير مذكور')+' · تصنيف العرض: '+(reg.project_name||'')+' · '+ (reg.eventKind||'')+' · '+(reg.why||'')):'';
 RESTORE.text=String(d.b||d.body||d.text||'المصدر يسجل عنوان التقرير فقط؛ لا نص تفصيلي متاح.')+meta;RESTORE.route='text';RESTORE.page=0;RESTORE.offsets=[0];RESTORE.returnTo=back;rDraw();
}
function rTextPage(pg){
 const d=RESTORE.doc||{};pg.innerHTML=rHeader(d.t||'تفاصيل السجل',rTime(d.m||''))+`<div class="r-meta"><span></span><button class="r-action" id="text-back">رجوع</button></div><div class="r-body"><article class="r-copy"></article></div><div class="pgr"></div>`;
 $('#text-back').onclick=rBack;const body=pg.querySelector('.r-body'),article=pg.querySelector('.r-copy'),tokens=RESTORE.text.split(/(\s+)/),offset=RESTORE.offsets[RESTORE.page]||0;
 let lo=1,hi=Math.min(3000,tokens.length-offset),fit=0;while(lo<=hi){let mid=(lo+hi)>>1;article.textContent=tokens.slice(offset,offset+mid).join('');if(body.scrollHeight<=body.clientHeight+1&&body.scrollWidth<=body.clientWidth+1){fit=mid;lo=mid+1}else hi=mid-1;}
 fit=Math.max(1,fit);article.textContent=tokens.slice(offset,offset+fit).join('');const end=offset+fit,more=end<tokens.length;RESTORE.offsets[RESTORE.page+1]=end;
 const pager=pg.querySelector('.pgr');if(more||RESTORE.page){pager.innerHTML=`<button ${RESTORE.page===0?'disabled':''}>‹</button><span class="mu">النص · جزء ${RESTORE.page+1}</span><button ${!more?'disabled':''}>›</button>`;pager.children[0].onclick=()=>{RESTORE.page--;rDraw()};pager.children[2].onclick=()=>{RESTORE.page++;rDraw()};}else pager.remove();
}
function rDaily(pg){
 const brief=D.dailyBrief||{};const names={economy:'الاقتصاد',politics:'السياسة',sports:'الرياضة',dates:'المواعيد',watch:'للمتابعة',world_updates:'تحديثات العالم'};
 const items=Object.entries(names).flatMap(([k,label])=>(Array.isArray(brief[k])?brief[k]:[]).filter(v=>!rPrivate(JSON.stringify(v))).map(v=>({label,title:rText(v.title||v),text:[rText(v.title||v),rText(v.impact),rText(v.summary),rText(v.background)].filter(Boolean).join('\n\n'),date:v.date||brief.generated_at})));
 pg.innerHTML=rHeader('الموجز اليومي',rTime(brief.generated_at))+`<div class="c fill"><div class="docs-scroll r-list"></div></div>`;
 rPaginated(pg,items,(x,i)=>`<button class="project-doc row" data-r-item="${i}"><small class="chip watch">${rEsc(x.label)}</small><span style="flex:1;text-align:start">${rEsc(x.title||'موجز')}</span></button>`,x=>rRead({t:x.title,b:x.text,m:x.date},'daily'));
}
function rEvents(pg){
 const dates=(D.dailyBrief?.dates||[]).filter(x=>!rPrivate(JSON.stringify(x))).map(x=>({title:rText(x.title||x),text:[rText(x.title),rText(x.impact)].join('\n\n'),date:x.date||'',kind:'موعد'}));
 const reports=rDocs().map(d=>({title:d.t,text:d.b,date:d.m,kind:'تقرير'}));
 const all=[...dates,...reports].sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 const now=Date.now();
 const items=all.filter(x=>{const stamp=(rNormalizeDate(x.date)||{getTime:()=>NaN}).getTime();if(!Number.isFinite(stamp))return RESTORE.tab==='current';if(RESTORE.tab==='upcoming')return stamp>now;if(RESTORE.tab==='past')return stamp<now-86400000;return stamp<=now&&stamp>=now-86400000;});
 pg.innerHTML=rHeader('سجل الأحداث')+`<div class="r-tabs">${[['past','الماضي'],['current','الحالي'],['upcoming','القادم']].map(([k,t])=>`<button data-event-tab="${k}" class="${RESTORE.tab===k?'on':''}">${t}</button>`).join('')}</div><div class="c fill"><div class="docs-scroll r-list"></div></div>`;
 pg.querySelectorAll('[data-event-tab]').forEach(b=>b.onclick=()=>{RESTORE.tab=b.dataset.eventTab;RESTORE.page=0;rDraw()});
 rPaginated(pg,items,(x,i)=>`<button class="project-doc row" data-r-item="${i}"><small>${x.kind}</small><span style="flex:1;text-align:start">${rEsc(x.title)}</span><span class="mu num">${rEsc(rTime(x.date))}</span></button>`,x=>rRead({t:x.title,b:x.text,m:x.date},'events'),'لا أحداث موثقة في هذه الفترة.');
}
function rCommand(pg){
 pg.innerHTML=rHeader('مكتب أوامر CEO','مسودة محلية · بلا إرسال')+`<div class="r-summary"><strong>المسار</strong><br>المالك → CEO → خبير الأوامر → COO → الأقسام</div>
 <div class="r-form"><label for="r-draft">نص الأمر</label><textarea id="r-draft" maxlength="1200" placeholder="اكتب طلبك لمراجعته لاحقاً…"></textarea>
 <div class="r-actions"><button class="r-action" id="r-save">حفظ مسودة محلية</button><button class="r-action" id="r-review">تهيئة للمراجعة</button></div>
 <div class="r-draft-status" id="r-status"></div><div class="r-policy">الصوت وواتساب وتيليجرام غير مفعّلة. لا تنفيذ ولا نشر.</div></div>`;
 $('#r-draft').value=RESTORE.draft;$('#r-status').textContent=RESTORE.note||'لم تُرسل أي أوامر.';
 const save=review=>{RESTORE.draft=$('#r-draft').value.trim();if(!RESTORE.draft){$('#r-status').textContent='اكتب نص الأمر أولاً.';return;}
  sessionStorage.setItem('hmk_restore_draft',JSON.stringify({status:'draft',dispatch_status:'not_sent',owner_routed_to:'CEO',prompt_expert_review:'pending',ceo_review:'pending',external_actions_allowed:false,cost_authorized:false,text:RESTORE.draft}));
  RESTORE.note=review?'المسودة مهيأة محلياً فقط؛ لم تُرسل ولم تُنفّذ.':'حُفظت المسودة في هذه الجلسة فقط؛ لم تُرسل.';$('#r-status').textContent=RESTORE.note;};
 $('#r-save').onclick=()=>save(false);$('#r-review').onclick=()=>save(true);
}
function rAdmin(pg){
 const route=RESTORE.route,defs=[['team','الموظفون والأدوات','أدوار مسجّلة'],['ecosystem','البرامج والاتصالات','آخر فحص فقط'],['existing','المقترحات الحالية','بانتظار CEO'],['daily','موجز اليوم','لقطة محفوظة'],['reports','التقارير','أرشيف'],['events','الأحداث','ترتيب زمني'],['command','الأوامر','مسودة محلية']];
 if(route==='admin'){pg.innerHTML=rHeader('القائمة','عبر الملخص / المقر')+`<div class="menu-list">${defs.map(([id,t,n])=>`<button class="c" data-extra="${id}"><b>${t}</b><small>${n}</small></button>`).join('')}</div>`;pg.querySelectorAll('[data-extra]').forEach(b=>b.onclick=()=>rOpen(b.dataset.extra));return;}
 if(['daily','reports','events','command'].includes(route)){rOpen(route);return;}
 const title=defs.find(x=>x[0]===route)?.[1]||'الإدارة';let items=[];
 if(route==='team')items=(D.hq?.agents||[]).filter(a=>!rPrivate([a.id,a.name,a.role].join(' '))).map(a=>({title:a.name,text:'الدور: '+(a.role||'غير مسجل')+'\n\nحالة التشغيل الحالية: غير مؤكدة.\nالحركة في المقر زخرفية.'}));
 if(route==='ecosystem')items=(D.apps||[]).filter(x=>!rPrivate(JSON.stringify(x))).map(a=>({title:a.ar||a.en||'برنامج',text:'الإصدار: '+(a.ver||'غير مسجل')+'\nHTTP آخر فحص: '+(a.http??'غير مسجّل')+'\n'+rTime(a.checked_at)+'\n\nلم يُختبر الاتصال من هذه النسخة.'}));
 if(route==='existing')items=(D.sugg||[]).filter(x=>!rPrivate(JSON.stringify(x))).map(x=>({title:rText(x),text:rText(x)+'\n\nمقترح محفوظ يحتاج مراجعة CEO.'}));
 pg.innerHTML=rHeader(title,items.length+' سجل')+`<div class="c fill"><div class="docs-scroll r-list"></div></div>`;
 rPaginated(pg,items,(x,i)=>`<button class="project-doc row" data-r-item="${i}">${rEsc(x.title||'سجل')}</button>`,x=>rRead({t:x.title,b:x.text},route));
}

if(typeof render==='undefined'||typeof render==='function'){try{render=function(){rDraw()};}catch(e){}}
try{goPage=function(i){const p=PAGES[i];rOpen(p==='sum'?'sum':p==='org'?'admin':p==='project'?'project':R_IDS.includes(p)?'project':p,p==='project'?PROJECT_ID:R_IDS.includes(p)?p:null)};}catch(e){}
try{nsDraw=function(){rDraw()};nsOpen=function(title,value){rRead({t:title,b:rText(value)},'reports')};hqSend=rHqSend;}catch(e){}

window.addEventListener('message',e=>{
 if(e.origin!==location.origin)return;
 const f=$('#hqf');if(!f||e.source!==f.contentWindow)return;
 if(e.data?.hqReady){RESTORE.hqReady=true;rHqSend(RESTORE.pendingHqRestore);return;}
 if(e.data?.hqState){
  const s=e.data.hqState;
  if(typeof s.tab==='string')RESTORE.hqTab=s.tab;
  if(typeof s.newsIdx==='number')RESTORE.newsIdx=s.newsIdx;
  if(typeof s.query==='string')RESTORE.hqQuery=s.query;
  if(typeof s.filter==='string')RESTORE.hqFilter=s.filter;
  if(typeof s.panelScroll==='number')RESTORE.hqPanelScroll=s.panelScroll;
  return;
 }
 if(e.data?.hqOpen){
  const n=e.data.hqOpen;
  RESTORE.entrySource='hq-news';
  /* state already mirrored via hqState messages — never read closure via window.* */
  if(n.action==='doc'&&n.doc){rRead(n.doc,'hq');return;}
  if(n.doc){rRead(n.doc,'hq');return;}
  if(n.action==='project'&&n.projectId){rOpen('project',n.projectId);return;}
  if(n.action==='waiting'){rOpen('sum');return;}
  if(n.project){rOpen('project',n.project);return;}
 }
 if(e.data?.hqRoom){const pid=ROOM_PROJECT[e.data.hqRoom];if(pid&&R_IDS.includes(pid))rOpen('project',pid);}
});

const lockBtn=$('#lock');
if(lockBtn)lockBtn.onclick=()=>{D=null;if(typeof ls!=='undefined'){ls.removeItem('elKey');ls.removeItem('elSalt');}sessionStorage.removeItem('hmk_restore_draft');Object.assign(RESTORE,{route:'hq',project:null,page:0,tab:'current',doc:null,offsets:[0],text:'',returnTo:null,returnState:null,draft:'',note:'',hqReady:false,pendingHqRestore:null});const pw=$('#pw');if(pw)pw.value='';const er=$('#er');if(er)er.textContent='';$('#pages').replaceChildren();$('#nav').replaceChildren();const lk=$('#lk');if(lk)lk.style.display='flex';if(typeof load==='function')load();};
const logo=document.querySelector('header .logo');if(logo)logo.onclick=()=>rOpen('hq');
window.addEventListener('resize',()=>{if(D)rDraw()});

/* Expose for QA parity hashing — same function objects in public+owner */
window.HMKRestoreAPI={rPortfolio,rProject,rReport:rReportList,rSummary:rSum,rNewsFeed,rDraw,rTime,rNormalizeDate,rCaptureView,rRestoreView,RESTORE};
