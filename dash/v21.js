/* HMK command hub v21.7.1 — encrypted feed + status.json + optional local-data events/projects. تحديث دوري · لا إرسال خارجي. */
const C21={screen:'home',page:0,stack:[],rows:[],title:'',parts:[],draft:'',draftNote:''};
const C21_LOCAL={company:null,ideas:null,compare:null,events:null,projects:null,feedMeta:{etag:null,revision:null,fetchedAt:null,lastSuccessAt:null,intervalMs:60000}};
const c21ReloadLocal=(key,path)=>{fetch(path,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(key);const et=r.headers.get('ETag');if(et)C21_LOCAL.feedMeta.etag=et;return r.json()}).then(d=>{C21_LOCAL[key]=d;if(d&&d.revision!=null)C21_LOCAL.feedMeta.revision=d.revision;C21_LOCAL.feedMeta.lastSuccessAt=new Date().toISOString();C21_LOCAL.feedMeta.fetchedAt=C21_LOCAL.feedMeta.lastSuccessAt;if(PAGES[CUR]==='sum'&&document.body.classList.contains('command21'))c21Draw()}).catch(()=>{});};
fetch('local-data/company.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{C21_LOCAL.company=d;C21_LOCAL.compare=d?.compare||null;C21_LOCAL.feedMeta.lastSuccessAt=new Date().toISOString();if(PAGES[CUR]==='sum'&&document.body.classList.contains('command21'))c21Draw()}).catch(()=>{});
c21ReloadLocal('ideas','local-data/ideas.json');
c21ReloadLocal('compare','local-data/daily-compare.json');
c21ReloadLocal('events','local-data/events.json');
c21ReloadLocal('projects','local-data/projects.json');
setInterval(()=>{c21ReloadLocal('events','local-data/events.json');},60000);

const c21Text=v=>{v=nsLang(v);return v==null?'':typeof v==='object'?String(nsLang(v.title||v.t||v.name||v.ar||'')||''):String(v)};
const c21Stamp=()=>D?.dailyBrief?.generated_at||D?.built||D?.updated||V18_STATUS?.generated_at||'غير مسجل';
const c21LocalLead=id=>(C21_LOCAL.company?.leadership||[]).find(x=>x.id===id)||null;
const c21Ceo=()=>(D?.hq?.agents||[]).find(a=>a.id===(D?.hq?.ceo_id||'ceo'))||(c21LocalLead('ceo')?{id:'ceo',name:c21LocalLead('ceo').name_ar,role:c21LocalLead('ceo').role_ar,status:'unknown'}:null);
const c21Coo=()=>(D?.hq?.agents||[]).find(a=>a.id==='coo'||/عمليات|COO/i.test(String(a.name||'')+String(a.role||'')))||(c21LocalLead('coo')?{id:'coo',name:c21LocalLead('coo').name_ar,role:c21LocalLead('coo').role_ar,status:'unknown'}:null);
const c21Prompt=()=>(D?.hq?.agents||[]).find(a=>a.id==='prompt'||/برومبت|أوامر|prompt/i.test(String(a.name||'')+String(a.role||'')))||(c21LocalLead('prompt')?{id:'prompt',name:c21LocalLead('prompt').name_ar,role:c21LocalLead('prompt').role_ar,status:'unknown'}:null);
const c21State=a=>{
 /* trust note: role/person rows stay «غير مؤكد» unless explicit agent status; never inherit service health as person health */
 if(!a)return 'غير متاح في السجل';
 const st=String(a.status||'').trim();
 if(!st||/^(unknown|n\/?a|unset|null)$/i.test(st))return 'غير مؤكد';
 if(/^(fail|error|down|failed)$/i.test(st))return 'متعطل';
 if(/^(up|ok|working|running)$/i.test(st)&&a.active!==false)return 'يعمل';
 if(/^(idle)$/i.test(st))return 'خامل';
 return 'غير مؤكد';
};
const c21Gap=(ar,en)=>L==='ar'?ar:en;



const c21Priv=s=>/kids|child|study|أطفال|اطفال|دراسة/i.test(String(s||''));
const c21TitleAr=v=>{
 if(v==null)return '';
 if(typeof v==='string')return v;
 if(typeof v==='object')return v.ar||v.AR||v.name_ar||v.title_ar||v.en||'';
 return String(v);
};
const c21ProjAr=pid=>{
 const id=String(pid||'');
 const pickAr=p=>{
  if(!p)return '';
  const t=p.title;
  if(t&&typeof t==='object'&&t.ar)return String(t.ar);
  return c21TitleAr(t)||p.name_ar||p.title_ar||p.nameAr||p.titleAr||'';
 };
 const fromCat=(C21_LOCAL.projects?.projects||[]).find(p=>p.id===id||p.projectId===id);
 if(fromCat){const n=pickAr(fromCat)||fromCat.name; if(n)return n;}
 const fromEv=C21_LOCAL.events?.projects;
 if(fromEv&&!Array.isArray(fromEv)){const n=pickAr(fromEv[id]); if(n)return n;}
 if(Array.isArray(fromEv)){const n=pickAr(fromEv.find(x=>x.id===id)); if(n)return n;}
 const kpi=(D?.kpi?.projects||[]).find(p=>(p.id||p.k)===id);
 if(kpi){const n=pickAr(kpi)||kpi.ar||kpi.name_ar||kpi.name; if(n)return n;}
 const map={elcapino:'ELCAPINO',agency:'وكالة واتساب AI',house:'البيت',market:'إشارات السوق',ideas:'أفكار الإمارات',drop:'دروبشيبنج',fahem:'فاهم',hmk:'HMK',sum:'الملخص',hq:'المقر'};
 return map[id]||id||'عام';
};
const c21ArStatus=raw=>{
 const x=String(raw||'').toLowerCase();
 const map={up:'يعمل',ok:'يعمل',working:'يعمل',running:'يعمل',fail:'متعطل',failed:'متعطل',error:'متعطل',down:'متعطل',idle:'خامل',unknown:'غير مؤكد',pending:'قيد الانتظار',frozen:'مجمّد',blocked:'محظور',current:'جاري',past:'ماضي',upcoming:'قادم',projected:'متوقع',active:'نشط',organization_unverified:'دور مسجل · غير مُختبَر',bridge_liveness:'قراءة مصدر',updated:'محدّث',report:'تقرير',decision:'قرار',calendar:'موعد'};
 return map[x]||'غير مؤكد';
};
const c21PreviewAr=raw=>{
 if(raw==null||raw==='')return '';
 const t=String(raw);
 if(/[\u0600-\u06FF]/.test(t)&&!/mtime\s*observed/i.test(t))return t;
 let out=t;
 out=out.replace(/mtime\s*observed\s*;\s*stale\s*=\s*False/ig,'رُصد وقت تعديل الملف · غير متقادم');
 out=out.replace(/mtime\s*observed\s*;\s*stale\s*=\s*True/ig,'رُصد وقت تعديل الملف · متقادم');
 out=out.replace(/mtime\s*observed/ig,'رُصد وقت تعديل الملف');
 out=out.replace(/\bstale\s*=\s*False\b/ig,'غير متقادم');
 out=out.replace(/\bstale\s*=\s*True\b/ig,'متقادم');
 return out;
};
function c21EventLabel(e){
 if(!e)return 'حدث';
 const proj=c21ProjAr(e.projectId||e.program||e.project);
 const kind=String(e.kind||e.entryType||'');
 const src=e.source||{};
 const srcType=src.type||src.ref||'';
 const when=(e.observedAt||e.startsAt||'').toString().replace('T',' ').slice(0,16);
 if(kind==='bridge_liveness' || /liveness/i.test(kind) || /liveness/i.test(String(srcType))){
  /* mtime/read only — do NOT claim live connectivity */
  const ch=src.ref||src.id||'قناة محلية';
  const prev=c21PreviewAr(e.sourcePreview);
  return `${proj}: مصدر ${ch}${prev?' · '+prev:''} · آخر قراءة ${when||'غير مسجل'} (mtime/قراءة · ليست شهادة اتصال)`;
 }
 const st=c21ArStatus(e.kpi_status||e.status||e.timeline||kind);
 if(kind==='report'||e.entryType==='report') return `${proj}: تقرير · ${st}${when?' · '+when:''}`;
 if(kind==='calendar'||e.timeline==='upcoming') return `${proj}: موعد · ${st}${when?' · '+when:''}`;
 if(kind==='decision') return `${proj}: قرار · ${st}`;
 if(e.gap) return `${proj}: لا سجل بعد · غير مؤكد`;
 return `${proj}: ${st}${when?' · '+when:''}`;
}
function c21EventTranslated(e){
 const ar=e.title_ar||e.titleAr||(e.title&&/[\u0600-\u06FF]/.test(String(e.title))?e.title:null);
 return ar || c21EventLabel(e);
}
function c21UnifiedEvents(){
 let rows=[]; const seen=new Set();
 const push=(e)=>{
  if(!e)return; const id=e.id||e.contentHash||(String(e.title||'')+String(e.observedAt||''));
  if(seen.has(id)||c21Priv(JSON.stringify(e)))return; seen.add(id);
  const titleAr=e.title_ar||e.titleAr||(e.title&&/[\u0600-\u06FF]/.test(String(e.title))?e.title:null);
  /* never default whole event text to raw English title (doc backlinks keep rawTitle separately) */
  const displayTitle=titleAr||c21EventLabel(e);
  const category=e.category||e.timeline||e.temporal||'current';
  rows.push({
   id, timeline:e.timeline||category||'current', category,
   title: titleAr, titleEn:e.title_en||e.title||'',
   displayTitle, projectId:e.projectId||e.project||e.program,
   observedAt:e.observedAt||e.startsAt||e.at||e.m,
   sourcePreview:e.sourcePreview||null,
   sourceRefs:e.sourceRefIds||e.source||e.localRoute||null,
   extra:e.extra||null,
   kpi_status:c21ArStatus(e.kpi_status||e.status||e.kind||e.timeline),
   kind:e.kind||e.entryType||'event',
   gap:!titleAr, rawTitle:e.title||e.title_en||null,
   localRoute:e.localRoute||null, page:e.page||null
  });
 };
 (C21_LOCAL.events?.events||[]).forEach(push);
 (D?.docs||[]).slice().sort((a,b)=>String(b.m).localeCompare(String(a.m))).slice(0,12).forEach(d=>push({id:'doc:'+d.t+d.m,title:d.t,timeline:'past',category:'past',observedAt:d.m,kind:'report',projectId:d.p,source:{type:'docs'}}));
 (D?.dailyBrief?.dates||[]).forEach(x=>push({id:'date:'+(x.date||'')+(typeof x.title==='object'?(x.title.ar||x.title.en):x.title),title:typeof x.title==='object'?(x.title.ar||x.title.en):x.title,timeline:'upcoming',category:'upcoming',observedAt:x.date,kind:'calendar',source:{type:'dailyBrief.dates'}}));
 (D?.waiting||[]).forEach((x,i)=>push({id:'wait:'+i,title:typeof x==='object'?(x.ar||x.t||x.title):x,timeline:'current',category:'current',kind:'decision',source:{type:'waiting'}}));
 if(!(C21_LOCAL.events?.events||[]).length && !(D?.docs||[]).length){
  rows.push({id:'gap-feed',timeline:'current',category:'current',displayTitle:'فجوة: لا أحداث محلية ولا تقارير في الحمولة',title:'فجوة: لا أحداث محلية ولا تقارير في الحمولة',kpi_status:'غير مؤكد',kind:'gap',gap:true,sourceRefs:'none'});
 }
 const lim=(C21_LOCAL.events&&C21_LOCAL.events.generatedAt)||new Date().toISOString();
 rows=rows.filter(e=>!e.observedAt||String(e.observedAt)<=String(lim));
 return rows;
}
function c21LatestByProject(){
 const map=new Map();
 c21UnifiedEvents().forEach(e=>{
  const pid=e.projectId||'general';
  const prev=map.get(pid);
  if(!prev||String(e.observedAt||'')>String(prev.observedAt||''))map.set(pid,e);
 });
 const ids=(C21_LOCAL.projects?.kpiProjectIds)||Object.keys(C21_LOCAL.events?.indexByProject||{})||(D?.kpi?.projects||[]).map(p=>p.id||p.k||p.name)||[];
 (ids||[]).forEach(pid=>{if(!map.has(pid))map.set(pid,{id:'gap:'+pid,projectId:pid,timeline:'current',displayTitle:c21ProjAr(pid)+': لا سجل بعد · غير مؤكد',kpi_status:'غير مؤكد',kind:'gap',gap:true,sourceRefs:'missing'});});
 return [...map.entries()].map(([pid,e])=>({pid,...e}));
}
function c21EventDetails(ev){
 /* isolated event detail sheet — keeps C21 screen; never generic project redirect */
 if(!ev)return;
 const src=ev.sourceRefs||ev.source||{};
 const srcObj=(src&&typeof src==='object'&&!Array.isArray(src))?src:{};
 const kind=String(ev.kind||'');
 const liveish=/liveness/i.test(kind)||/liveness/i.test(String(srcObj.type||''))||/liveness/i.test(String(srcObj.ref||''));
 /* liveness: show actual Arabic preview; do NOT fall back to raw English title as whole text */
 const preview=c21PreviewAr(ev.sourcePreview||srcObj.preview||'') || (liveish?'رصد mtime محلي فقط':'');
 const ref=srcObj.ref||srcObj.id||srcObj.type||'—';
 const when=(ev.observedAt||'').toString().replace('T',' ').slice(0,19);
 const rows={
  'العنوان':ev.displayTitle||c21EventLabel(ev),
  'الحالة':ev.kpi_status||'غير مؤكد',
  'المشروع':c21ProjAr(ev.projectId)+' · '+(ev.projectId||'—'),
  'النوع':kind||ev.category||'—',
  'المقطع الزمني':ev.timeline||ev.category||'—',
  'آخر قراءة / رصد':when||'غير مسجل',
  'مرجع المصدر':ref,
  'معاينة المصدر':preview||'—',
  'ملاحظة اتصال': liveish?'mtime/قراءة ملف فقط · ليست شهادة أن القناة متصلة الآن':'لا ادّعاء اتصال من هذا السجل',
  'مصادر': typeof src==='string'?src:JSON.stringify(srcObj||src||{})
 };
 /* raw English kept only as optional secondary field when present — never as default event text */
 if(ev.rawTitle||ev.titleEn) rows['خام إنجليزي (مرجعي)']=ev.rawTitle||ev.titleEn;
 const lr=ev.localRoute||{};
 const extra=ev.extra||{};
 const kpiIds=(C21_LOCAL.projects?.kpiProjectIds)||['elcapino','agency','house','market','ideas','drop','fahem'];
 const canProj=!!(extra.openProject||extra.open_project||extra.open==='project'||(lr.type==='hmk_project_open'&&kpiIds.includes(lr.projectId||ev.projectId)));
 C21.stack.push({...C21,stack:undefined,eventDetail:C21.eventDetail});
 C21.eventDetail={rows, canProj, projectId:ev.projectId||lr.projectId, ev};
 C21.screen='event-detail';
 C21.title=ev.displayTitle||c21EventLabel(ev);
 C21.page=0;
 c21Draw();
}
function c21OpenEvent(ev, mode){
 /* mode project = KPI catalog (7) → project page; event/liveness → c21EventDetails only */
 if(!ev)return;
 mode=mode||'event';
 const kpiIds=(C21_LOCAL.projects?.kpiProjectIds)||['elcapino','agency','house','market','ideas','drop','fahem'];
 if(mode==='project'){
  const pid=ev.projectId||ev.pid||ev.id;
  if(!pid||!kpiIds.includes(pid)){c21Detail({title:c21ProjAr(pid)||'مشروع',value:{'الحالة':'غير مؤكد','ملاحظة':'ليس ضمن المشاريع السبعة المعتمدة في الكتالوج'}});return;}
  if(typeof PROJECT_ID!=='undefined' && typeof PAGES!=='undefined' && PAGES.includes('project')){
   PROJECT_ID=pid; document.body.classList.remove('command21'); return goPage(PAGES.indexOf('project'));
  }
  if(typeof PAGES!=='undefined' && PAGES.includes('proj')){document.body.classList.remove('command21'); return goPage(PAGES.indexOf('proj'));}
  return;
 }
 return c21EventDetails(ev);
}
function c21LiveInit(root){
 /* attach to existing #timeline only — never append a duplicate empty timeline */
 const host=root||document.querySelector('.cmd-page')||document.querySelector('#pages .pg');
 if(!host)return null;
 const box=host.querySelector('#timeline');
 if(!box)return null;
 const poll=C21_LOCAL.feedMeta||{};
 const unified=typeof c21UnifiedEvents==='function'?c21UnifiedEvents():[];
 const tab=C21.tlTab||'current';
 const tl={past:unified.filter(e=>e.timeline==='past'),current:unified.filter(e=>e.timeline==='current'||!e.timeline),upcoming:unified.filter(e=>e.timeline==='upcoming'||e.timeline==='projected')};
 const byProj=typeof c21LatestByProject==='function'?c21LatestByProject():[];
 const stamp=(poll.lastSuccessAt|| (typeof c21Stamp==='function'?c21Stamp():'') || 'غير مسجل').toString().replace('T',' ').slice(0,19);
 const now=new Date().toISOString().replace('T',' ').slice(0,19);
 return {host,box,unified,tl,tab,byProj,stamp,now,revision:poll.revision??(C21_LOCAL.events?.schemaVersion??'—')};
}

function c21UpdatesRows(){
 const rows=[];
 const apps=D?.apps||[];
 if(apps.length)apps.forEach(a=>rows.push({title:(a.ar||a.en||a.id)+' · v'+(a.ver||'?'),value:{'الحالة HTTP':a.http??'غير مسجل','آخر فحص':a.checked_at||'غير مسجل','الرابط':a.final_url||a.url||'غير مسجل'}}));
 else rows.push({title:c21Gap('تحديثات البرامج','App updates'),value:c21Gap('لا سجلات تطبيقات في الحمولة المحلية.','No app records in the local payload.')});
 const alerts=D?.alertSummary;if(alerts)rows.push({title:c21Gap('ملخص التنبيهات المحلية','Local alert summary'),value:{'آخر تحديث':alerts.updated||'غير مسجل','عدد المدخلات':alerts.entries??'غير مسجل','الأحدث':(alerts.recent||[]).slice(-6)}});
 const ai=D?.aiUpdates;if(ai)rows.push({title:c21Gap('سجل تحديثات الأدوات/الأخبار','Tool & news update log'),value:{'وقت التوليد':ai.generated_at||'غير مسجل','أخبار':(ai.news||[]).length,'أفكار AI':(ai.ideas||[]).length,'أخطاء':(ai.errors||ai.news_errors||[]).length||'لا سجل أخطاء'}});
 const src=D?.localSources||[];if(src.length)rows.push({title:c21Gap('مصادر محلية وطوابع','Local sources & stamps'),children:()=>nsEntries(src)});
 return rows;
}
function c21EventsRows(){
 const rows=[];
 const b=D?.dailyBrief||{};
 (b.dates||[]).forEach(x=>rows.push({title:(x.date||'?')+' · '+c21Text(x.title),value:{'الأثر':c21Text(x.impact),'المصدر':x.url||'غير مسجل','من':c21Gap('موجز اليوم','Daily brief')}}));
 (b.watch||[]).forEach(x=>rows.push({title:c21Gap('للمتابعة · ','Watch · ')+c21Text(x),value:c21Text(x)}));
 (D?.marketReference?.calendar||[]).slice(0,12).forEach(x=>rows.push({title:c21Text(x.title||x.name||x.event||x),value:typeof x==='object'?x:String(x)}));
 if(!rows.length)rows.push({title:c21Gap('الأحداث','Events'),value:c21Gap('لا مواعيد في dailyBrief.dates ولا calendar في marketReference.','No dates in dailyBrief and no calendar in marketReference.')});
 return rows;
}
function c21MarketRows(){
 const rows=[];
 const mr=D?.marketReference||{};
 rows.push({title:c21Gap('مرجع السوق المحلي','Local market reference'),value:{'البناء':mr.built||'غير مسجل','إشارات':(mr.signals||[]).length,'تقويم':(mr.calendar||[]).length,'أخبار':(mr.news||[]).length,'الصحة':mr.health||'غير مسجل','المنهج':c21Text(mr.method)||'غير مسجل'}});
 if(mr.halal)rows.push({title:c21Gap('ضابط الحلال المسجّل','Recorded halal note'),value:c21Text(mr.halal)});
 (mr.signals||[]).slice(0,8).forEach(s=>rows.push({title:c21Text(s.symbol||s.name||s.title||s.id||'signal'),value:s}));
 rows.push({title:c21Gap('TradingView · بدون بث حي','TradingView · no live stream'),value:c21Gap('لا مخطط بث حي من هذه البطاقة. صفحة السوق من الأرشيف المحلي؛ لا ربط API مدفوع.','No live chart from this card. Legacy market page from local archive; no paid API link.'),open:'market'});
 if(!(mr.signals||[]).length)rows.push({title:c21Gap('فجوة الإشارات','Signals gap'),value:c21Gap('marketReference بلا إشارات في هذه النسخة.','marketReference has no signals in this payload.')});
 return rows;
}
function c21ToolsRows(){
 const rows=[];
 (V18_STATUS?.services||[]).forEach(s=>rows.push({title:s.name||s.id,value:{'الحالة':s.status||'unknown','الاستخدام':s.used==null?'غير مقاس':`${s.used} ${s.unit||''} / ${s.cap??'—'}`,'الفترة':s.period||'—','يومي':s.day_used==null?'غير مقاس':`${s.day_used} / ${s.day_cap??'—'}`,'الدور':s.role||'—','دليل':s.evidence||'—','تحديث الاستخدام':s.usage_updated||'غير مسجل'}}));
 (D?.spend||[]).forEach(s=>rows.push({title:c21Gap('إنفاق · ','Spend · ')+(s.k||s.name||'?'),value:{'المسجّل':s.v,'السقف':s.cap,'ملاحظة':'لقطة محلية · ليست فاتورة حية'}}));
 if(D?.usage)rows.push({title:c21Gap('لقطة الاستخدام','Usage snapshot'),value:D.usage});
 rows.push({title:c21Gap('الروتين المسجّل','Recorded routines'),children:()=>nsEntries(V18_STATUS?.routines||[])});
 if(!(V18_STATUS?.services||[]).length&&!(D?.spend||[]).length)rows.push({title:c21Gap('السقوف','Caps'),value:c21Gap('status.json و spend غير متاحين في هذه الجلسة.','status.json and spend unavailable in this session.')});
 return rows;
}
function c21RatingsRows(){
 const rows=[];
 const ac=D?.agentComparison;
 if(ac?.rows?.length){
  rows.push({title:c21Gap('مقارنة الوكلاء · نافذة مسجّلة','Agent comparison · recorded window'),value:{'توليد':ac.generated_at||'غير مسجل','أيام':ac.window_days??'غير مسجل'}});
  ac.rows.forEach(r=>rows.push({title:`${r.tool} · ${r.role}`,value:{'نجاح':`${r.successes}/${r.attempts}`,'جودة متوسط':r.quality_mean??c21Gap('غير مراجعة','unreviewed'),'ملاءمة الدور':r.role_fit||'—','تكلفة معروفة $':r.known_cost_usd,'محاولات تكلفة مجهولة':r.unknown_cost_attempts}}));
 }else rows.push({title:c21Gap('مقارنة الوكلاء','Agent comparison'),value:c21Gap('لا صفوف agentComparison في الحمولة. لا تُخترع درجات.','No agentComparison rows. Ratings are not invented.')});
 (D?.hq?.agents||[]).filter(a=>a.level!=null&&a.kind!=='tool').slice(0,12).forEach(a=>rows.push({title:(a.name||a.id)+' · مستوى '+a.level+'/10',value:{'الحالة':c21State(a),'الدور':a.role||'—','تشغيلات':a.runs??'—','نجاح':a.ok??a.successful_runs??'—','آخر تشغيل':a.last_run||'غير مسجل'}}));
 const q=D?.hq?.quality;if(q?.items?.length){
  rows.push({title:c21Gap('اقتراحات تحسين دائمة (مسجّلة)','Standing improvement tips (recorded)'),value:{'المزوّد':q.provider||'—','توليد':q.generated||'—','عدد':q.items.length}});
  q.items.forEach(it=>rows.push({title:c21Gap('تحسين','Tip'),value:L==='ar'?(it.ar||it.en):(it.en||it.ar)}));
 }
 (V18_STATUS?.uptime?.checks||[]).forEach(c=>rows.push({title:c21Gap('موقع متصل · ','Connected site · ')+c.url,value:{'رمز':c.code,'الحالة':c.status,'فحص':V18_STATUS?.uptime?.checked_at||'غير مسجل'}}));
 (C21_LOCAL.company?.evaluations||[]).forEach(e=>rows.push({title:`${e.name} · ${e.health} · ${e.score_documented}/10`,value:{'الدور':e.role,'الدليل':e.evidence,'الاستخدام':e.used!=null?`${e.used}${e.cap!=null?' / '+e.cap:''} ${e.unit||''}`:'غير مقاس','أساس الدرجة':e.score_basis,'المصدر':'local-data/company.json'}}));
 (C21_LOCAL.company?.proposals||[]).forEach(p=>rows.push({title:c21Gap('اقتراح للمالك · ','Owner proposal · ')+p.target,value:p.reason+' · '+p.action}));
 return rows;
}
function c21IdeasRows(){
 const ir=D?.ideasReference||{};
 let ideas=[...(ir.ideas||[])].slice();
 let meta={criteria_policy:ir.criteria_policy,provider:ir.provider,checked_at:ir.checked_at||ir.generated_at,refresh_state:ir.refresh_state,source:'ideasReference'};
 if(!ideas.length && C21_LOCAL.ideas?.ideas?.length){
  ideas=C21_LOCAL.ideas.ideas.slice();
  meta={criteria_policy:C21_LOCAL.ideas.criteria_policy,provider:C21_LOCAL.ideas.provider,checked_at:C21_LOCAL.ideas.checked_at||C21_LOCAL.ideas.generated_at,refresh_state:C21_LOCAL.ideas.refresh_state,source:'local-data/ideas.json · '+ (C21_LOCAL.ideas.source||'')};
 }
 ideas=ideas.slice().sort((a,b)=>(Number(b.score)||0)-(Number(a.score)||0)||String(a.id||'').localeCompare(String(b.id||'')));
 const rows=[{title:c21Gap('منهج الترتيب','Ranking method'),value:{'السياسة':meta.criteria_policy||c21Gap('غير موثّق في المصدر','Not documented in source'),'المزوّد':meta.provider||'—','فحص':meta.checked_at||'—','حالة التحديث':meta.refresh_state||'—','المصدر':meta.source,'تنبيه':c21Gap('الأعلى جدوى أولاً من السجل المحلي فقط؛ تحديث دوري من السجل المحلي.','Highest feasibility first from local records only; periodic local-record refresh.')}}];
 if(!ideas.length){rows.push({title:c21Gap('فجوة صريحة','Explicit gap'),value:c21Gap('لا أفكار في ideasReference ولا local-data/ideas.json. لم تُرفع أفكار عشوائية.','No ideas in ideasReference or local-data/ideas.json. No random ideas invented.')});return rows;}
 ideas.forEach(x=>{
  const title=c21Text(x.title),has=!!(x.study||x.study_verdict);
  rows.push({title:`${x.score??'—'} · ${title}`,value:{'الحالة':x.status||'—','معايير':x.criteria||c21Gap('غير متوفرة','unavailable'),'دراسة جدوى':has?(x.study||x.study_verdict):c21Gap('غير متوفرة في المصدر','Not present in source'),'محدّث':x.updated_at||x.created_at||'—','event':x.event||null}});
 });
 return rows;
}

function c21DailyCompareRows(){
 const rows=[];
 const b=D?.dailyBrief||{};
 rows.push({title:c21Gap('موجز اليوم الحالي','Current daily brief'),value:{'توليد':b.generated_at||'غير مسجل','مزوّد':b.provider||'—','مصادر':b.source_count??'—','اقتصاد':(b.economy||[]).length,'سياسة':(b.politics||[]).length,'رياضة':(b.sports||[]).length,'مواعيد':(b.dates||[]).length}});
 const loc=C21_LOCAL.compare;
 if(loc?.ideas){
  rows.push({title:c21Gap('أفكار · أمس مقابل اليوم (ملفات محلية)','Ideas · yesterday vs today (local files)'),value:loc.ideas});
  (loc.basis||[]).forEach(x=>rows.push({title:c21Gap('أساس المقارنة','Comparison basis'),value:x}));
  if(loc.status_snapshot)rows.push({title:c21Gap('لقطة الحالة','Status snapshot'),value:loc.status_snapshot});
 }else{
  const docs=(D?.docs||[]).filter(x=>/تقرير اليوم|daily|morning|موجز/i.test(String(x.t||'')+String(x.p||'')));
  const prior=docs.map(x=>({t:x.t,m:x.m})).sort((a,b)=>String(b.m).localeCompare(String(a.m))).slice(0,3);
  if(prior.length>=2){
   rows.push({title:c21Gap('لقطات تقارير متتالية محفوظة','Saved consecutive report stamps'),value:prior});
  }else rows.push({title:c21Gap('مقارنة باليوم السابق','Vs previous day'),value:c21Gap('لا لقطتين متتاليتين كافيتين ولا local-data/daily-compare.json.','Not enough consecutive docs and no local-data/daily-compare.json.')});
 }
 const tips=D?.hq?.quality?.items||[];
 if(tips.length)tips.forEach(it=>rows.push({title:c21Gap('اقتراح تحسين دائم','Standing improvement'),value:L==='ar'?(it.ar||it.en):(it.en||it.ar)}));
 else if(loc?.status_snapshot?.improvement_suggestions)loc.status_snapshot.improvement_suggestions.forEach(x=>rows.push({title:c21Gap('تحسين مقترح','Suggested improvement'),value:x}));
 else rows.push({title:c21Gap('اقتراحات التحسين','Improvement tips'),value:c21Gap('لا بند quality.items في hq.','No hq.quality.items entries.')});
 return rows;
}

function c21ChannelRows(){
 const mon=(D?.hq?.agents||[]).find(a=>a.id==='w_fahem');
 const local=(C21_LOCAL.company?.channels||[]).map(c=>{const mode=c.mode||'';const tag=mode==='local_draft'?'مسودة محلية UI':mode==='project_bot_observed'?'مشروع · متصل موثّق (ليس قناة مالك)':mode==='ui_only'?'UI فقط':c.connected?'موثّق':'يحتاج ربط';return {title:(c.name_ar||c.id)+' · '+tag,value:{'قناة المالك':c.owner_channel,'ملاحظة':c.project_note||'—','دليل':c.evidence||'—','الوضع':mode}};});
 return local.concat([
  {title:'WhatsApp / Telegram · FAHEM',value:{'المراقب المحلي':mon?(mon.name+' · '+c21State(mon)+' · '+(mon.last_run||'غير مسجل')):c21Gap('لا سجل w_fahem','No w_fahem record'),'الإرسال من المعاينة':'موقوف · draft-only','إنشاء قنوات جديدة':'غير مسموح دون اعتماد لاحق','ملاحظة':c21Gap('الواجهة تعرض الحالة المسجّلة فقط؛ لا اتصال outbound.','UI shows recorded status only; no outbound connection.')}},
  {title:c21Gap('متطلبات التفعيل اللاحق','Later activation requirements'),value:c21Gap('اعتماد المالك الصريح + موصل مصرّح + عدم إرسال بيانات أطفال/خاصة خارج Ollama المحلي.','Explicit owner approval + authorized connector + no child/private data outside local Ollama.')}
 ]);
}
function c21CommandRows(){
 return [
  {title:c21Gap('مسودة أمر إلى CEO','Command draft → CEO'),commandDraft:true},
  {title:c21Gap('مسار الاعتماد','Approval path'),value:c21Gap('المالك → CEO (اعتماد) → خبير الأوامر (تدقيق) → COO (برامج/مشاريع) → التنفيذ → تقرير نهائي إلى CEO. مسودة محلية: لا إرسال.','Owner → CEO (approve) → Command expert (review) → COO (programs/projects) → execution → final report to CEO. Local draft: no send.')},
  {title:c21Gap('حالة القنوات','Channel status'),children:()=>c21ChannelRows()},
  {title:c21Gap('صوت / ميكروفون','Voice / microphone'),value:c21Gap('لا ميكروفون مفعّل ولا قناة backend صوتية مصرّح بها في هذه الجلسة المحلية. الزر UI فقط ولا يسجّل ولا يرسل.','No microphone enabled and no authorized voice backend in this local session. Button is UI-only; neither records nor sends.')}
 ];
}
function c21CompanyRows(){
 const ceo=c21Ceo(),coo=c21Coo(),prompt=c21Prompt();
 const agents=(D?.hq?.agents||[]).filter(a=>a.kind!=='tool');
 const up=agents.filter(a=>c21State(a)==='يعمل').length,fail=agents.filter(a=>c21State(a)==='متعطل').length;
 return [
  {title:'CEO · '+(ceo?.name||'غير مسجل'),value:{'الحالة':c21State(ceo),'آخر تشغيل':ceo?.last_run||'غير مسجل','مستوى':ceo?.level!=null?ceo.level+'/10':'غير مسجل','دور':'اعتماد قبل التوزيع'}},
  {title:'COO · '+(coo?.name||'غير مسجل'),value:{'الحالة':c21State(coo),'آخر تشغيل':coo?.last_run||'غير مسجل','مستوى':coo?.level!=null?coo.level+'/10':'غير مسجل','دور':'يشرف على البرامج والمشاريع'}},
  {title:c21Gap('خبير الأوامر','Command expert')+' · '+(prompt?.name||'غير مسجل'),value:{'الحالة':c21State(prompt),'آخر تشغيل':prompt?.last_run||'غير مسجل','دور':'يدقق الأوامر الصادرة'}},
  {title:c21Gap('ملخص الشركة (من hq)','Company summary (from hq)'),value:{'موظفين/عمال في السجل':agents.length,'يعمل':up,'متعطل':fail,'خامل':agents.length-up-fail,'توليد hq':D?.hq?.generated||'غير مسجل'}},
  {title:c21Gap('المشاريع','Projects'),children:()=>nsHome('proj')},
  {title:c21Gap('الموجز اليومي','Daily brief'),children:()=>nsEntries(D?.dailyBrief||{})},
  {title:c21Gap('افتح المقر التفاعلي','Open interactive HQ'),open:'hq'},
  {title:c21Gap('سياسة تلوين الأدوات','Tool color policy'),value:C21_LOCAL.company?.ai_services_policy||c21Gap('غير المؤكد لا يُعرض يعمل','Unknown is not shown as working')},
  {title:c21Gap('أجهزة ListMachines','ListMachines devices'),value:C21_LOCAL.company?.devices_live||c21Gap('لا لقطة','No snapshot')},
  {title:c21Gap('مواقع عامة / API','Public sites / API'),value:C21_LOCAL.company?.public_sites||[]}
 ];
}
function c21Rows(kind){switch(kind){
 case 'decisions':return nsEntries(D.waiting||[]);
 case 'projects':return nsHome('proj');
 case 'personal':return [{title:'المدرسة والدراسة',value:{'المحتوى':'محلي ومشفّر؛ لا يُرسل إلى أدوات خارجية','آخر قراءة موثقة':'5 نوفمبر 2026','التنبيه':'تفاصيل المزامنة اليومية تحتاج تحققاً؛ لا توجد مادة جديدة مؤكدة لليوم'}}].concat(nsData(['house','apps','devices','localSources'])).concat([{title:'الملخص السابق · الأرشيف',legacy:true}]);
 case 'day':return nsEntries(D.dailyBrief||{}).concat([{title:'الدراسات المحفوظة',children:()=>nsEntries(D.researchItems||[])},{title:'التقارير المعتمدة محلياً',children:()=>nsDocs()},{title:c21Gap('مقارنة يومية','Daily comparison'),children:()=>c21DailyCompareRows()}]);
 case 'tools':return c21ToolsRows();
 case 'sources':return nsEntries(D.localSources||[]);
 case 'updates':return c21UpdatesRows();
 case 'events':return c21EventsRows();
 case 'market':return c21MarketRows();
 case 'ratings':return c21RatingsRows();
 case 'ideas':return c21IdeasRows();
 case 'command':return c21CommandRows();
 case 'company':return c21CompanyRows();
 case 'compare':return c21DailyCompareRows();
 case 'timeline':return c21UnifiedEvents().map(e=>({title:(e.displayTitle||('فجوة · '+(e.projectId||e.id))),value:e}));
 default:return []}}

function c21Home(){CUR=0;C21.screen='home';C21.stack=[];C21.page=0;C21.homePack=0;c21Draw()}
const c21Route=goPage;goPage=function(i){if(PAGES[i]!=='sum'){document.body.classList.remove('command21');return c21Route(i)}c21Home()};
function c21Open(kind,title,rows){C21.stack.push({...C21,stack:undefined});C21.screen=kind;C21.title=title;C21.rows=rows||c21Rows(kind);C21.page=0;c21Draw()}
function c21Back(){const s=C21.stack.pop();if(s)Object.assign(C21,{...s,stack:C21.stack});else C21.screen='home';c21Draw()}
function c21Detail(row){
 if(row.legacy){document.body.classList.remove('command21');return c21Route(0)}
 if(row.commandDraft){c21Open('draft',row.title,[]);return}
 if(row.open){
  if(row.open==='status'){location.href='status.html';return}
  if(row.open==='hq'){return c21Route(PAGES.indexOf('hq'))}
  if(row.open==='market'){document.body.classList.remove('command21');return c21Route(PAGES.indexOf('market'))}
  if(PAGES.includes(row.open))goPage(PAGES.indexOf(row.open));
  else{PROJECT_ID=row.open;goPage(PAGES.indexOf('project'))}
  return
 }
 if(row.children){c21Open('list',row.title,row.children());return}
 const v=nsLang(row.value);if(v&&typeof v==='object'){c21Open('list',row.title,nsEntries(v));return}
 c21Open('text',row.title,[]);C21.text=String(v??'غير متاح');c21Draw()
}
function c21Button(label,preview,kind,title,cls=''){return `<button class="cmd-card ${cls}" data-command="${kind}" data-title="${esc(title||label)}"><span class="cmd-label">${label}<b>‹</b></span><span class="cmd-preview">${esc(preview)}</span></button>`}

function c21Draw(){
 if(!D)return;
 document.body.classList.add('command21');document.body.dataset.page='sum';
 $('#back').hidden=C21.screen==='home';$('#back').onclick=c21Back;
 $('#nav').querySelectorAll('button').forEach(b=>{const on=b.dataset.p==='sum';b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
 $('#pages').innerHTML='<section class="pg cmd-page"></section>';
 const pg=$('#pages .pg'),stamp=c21Stamp(),ceo=c21Ceo(),coo=c21Coo();

 if(C21.screen==='home'){
  const w=D.waiting||[],projects=D.kpi?.projects||[],brief=D.dailyBrief||{},docs=D.docs||[];
  const orderedDocs=docs.slice().sort((a,b)=>String(b.m).localeCompare(String(a.m)));
  const latest=orderedDocs.find(x=>/^تقرير اليوم الكامل/m.test(String(x.b||''))&&/daily|يومي|الصباح|التقرير اليوم|morning/i.test(x.t||''));
  const reportSections=latest?String(latest.b||'').split('\n').filter(x=>/^#{1,4}\s/.test(x)).map(x=>x.replace(/^#+\s*/,'' )).filter(x=>x.length<70).slice(0,3):[];
  const services=V18_STATUS?.services||[];
  const capped=services.filter(s=>s.cap!=null).slice(0,2).map(s=>`${s.name||s.id} ${s.used??'؟'}/${s.cap}`).join(' · ')||c21Gap('لا سقوف مقاسة','No measured caps');
  const sigN=(D.marketReference?.signals||[]).length,dateN=(brief.dates||[]).length+(D.marketReference?.calendar||[]).length,ideaN=(D.ideasReference?.ideas||[]).length||(C21_LOCAL.ideas?.ideas||[]).length,rateN=(D.agentComparison?.rows||[]).length||(C21_LOCAL.company?.evaluations||[]).length;
  pg.innerHTML=`<div class="cmd-heading"><div><small>المالك · لوحة القيادة الشخصية</small><h2>مركز الأوامر</h2></div><span class="cmd-seal">العين<br>HMK</span></div><div class="cmd-clock"></div>
  <div class="cmd-statusline"><span>CEO · ${esc(c21State(ceo))}</span><span>COO · ${esc(c21State(coo))}</span><span>${esc((projects.length||0)+' مشاريع')}</span><span>${esc((w.length||0)+' قرار')}</span></div>
  <div class="cmd-shortcuts">${[['company','الشركة'],['command','أمر'],['decisions','قراراتي'],['day','يومي']].map(([k,t])=>`<button data-command="${k}" data-title="${t}">${t}</button>`).join('')}</div>`;
  
  const unified=c21UnifiedEvents();
  const byProj=c21LatestByProject();
  const tab=C21.tlTab||'current';
  const tl={past:unified.filter(e=>e.timeline==='past'),current:unified.filter(e=>e.timeline==='current'||!e.timeline),upcoming:unified.filter(e=>e.timeline==='upcoming'||e.timeline==='projected')};
  const poll=C21_LOCAL.feedMeta||{};
  pg.innerHTML+=`<div class="cmd-poll">تحديث دوري · السجل: ${esc(String(c21Stamp()))} · آخر نجاح: ${esc((poll.lastSuccessAt||'غير مسجل').toString().replace('T',' ').slice(0,19))} · فحص الآن: ${esc(new Date().toISOString().replace('T',' ').slice(0,19))} UAE · rev ${esc(poll.revision??(C21_LOCAL.events?.schemaVersion??'—'))} · بلا تكرار</div>`;
  const kpiIds=(C21_LOCAL.projects?.kpiProjectIds)||['elcapino','agency','house','market','ideas','drop','fahem'];
  const seven=kpiIds.map(pid=>{const e=byProj.find(x=>(x.pid||x.projectId)===pid)||{pid,projectId:pid,displayTitle:c21ProjAr(pid)+': لا سجل بعد · غير مؤكد',kpi_status:'غير مؤكد',gap:true};return e;});
  pg.innerHTML+=`<div class="cmd-latest"><div class="cmd-section-title">المشاريع السبعة <small>${seven.length}</small></div><div class="cmd-latest-grid">${seven.map(e=>{const label=e.displayTitle||c21EventLabel(e);return `<button data-proj="${esc(e.pid||e.projectId)}"><b>${esc(c21ProjAr(e.pid||e.projectId))}</b><span>${esc(label)}</span><i>${esc(e.kpi_status||'غير مؤكد')}</i></button>`;}).join('')}</div></div>`;
  const tlAll=tl[tab]||[];const tlPer=4;const tlPages=Math.max(1,Math.ceil(tlAll.length/tlPer));C21.tlPage=Math.max(0,Math.min(C21.tlPage||0,tlPages-1));const tlSlice=tlAll.slice(C21.tlPage*tlPer,C21.tlPage*tlPer+tlPer);
  pg.innerHTML+=`<div class="cmd-tl" id="timeline"><div class="cmd-tl-tabs">${[['past','ماضي'],['current','جاري'],['upcoming','قادم']].map(([k,l])=>`<button data-tl="${k}" class="${tab===k?'on':''}">${l} · ${tl[k].length}</button>`).join('')}</div><div class="cmd-tl-list">${tlSlice.map(e=>`<button class="cmd-tl-row" data-event="${esc(e.id)}"><small>${esc(e.kpi_status)}</small><strong>${esc(e.displayTitle||c21EventLabel(e))}</strong><span>${esc((e.observedAt||'').toString().slice(0,16))}</span></button>`).join('')||'<div class="cmd-preview">لا بنود في هذا المقطع · فجوة موثّقة</div>'}</div>${tlPages>1?`<div class="cmd-pager"><button type="button" data-tl-nav="-1" ${C21.tlPage===0?'disabled':''}>السابق</button><span>${C21.tlPage+1} / ${tlPages}</span><button type="button" data-tl-nav="1" ${C21.tlPage>=tlPages-1?'disabled':''}>التالي</button></div>`:''}</div>`;

  pg.innerHTML+=c21Button('قراراتك أولاً · '+w.length,w.length?c21Text(w[0]):'لا توجد قرارات مسجلة','decisions','قراراتي','cmd-priority');
  pg.innerHTML+=`<div class="cmd-pair">${c21Button('الشركة والموظفون',`CEO ${c21State(ceo)} · COO يشرف البرامج/المشاريع`,'company','الشركة')}${c21Button('أمر إلى CEO','مسودة مكتوبة · صوت UI فقط · بلا إرسال','command','أمر')}</div>`;
  pg.innerHTML+=`<div class="cmd-hub">${[
   ['updates','تحديثات',(D.apps||[]).length?((D.apps||[]).length+' تطبيق'):'لا سجل'],
   ['events','أحداث',dateN+' موعد/تقويم'],
   ['market','سوق/TV',sigN+' إشارة · بلا حي'],
   ['tools','سقوف',capped],
   ['ratings','تقييمات',rateN? (rateN+' تقييم/مقارنة'):'لا صفوف'],
   ['ideas','أفكار الإمارات',ideaN? (ideaN+' · بالجدوى'):'لا سجل محلي']
  ].map(([k,l,p])=>`<button data-command="${k}" data-title="${l}"><b>${l}</b><span>${esc(p)}</span></button>`).join('')}</div>`;
  const sections=['economy','politics','sports','dates','watch'].filter(k=>Array.isArray(brief[k])&&brief[k].length);
  pg.innerHTML+=`<div class="cmd-brief"><div class="cmd-section-title">موجز المصدر <small>${esc(String(stamp).slice(0,16))}</small></div><div class="cmd-news">${sections.map(k=>`<button data-brief="${k}"><b>${esc(nsLabel(k))}</b><span>${esc(c21Text(brief[k][0])+' ←')}</span><i>‹</i></button>`).join('')||'<div class="cmd-preview">لا أقسام موجز في السجل</div>'}</div></div>`;
  if(latest)pg.innerHTML+=`<button class="cmd-report"><small>آخر تقرير محفوظ · ${esc(latest.m||'')}</small><strong>${esc(latest.t)}</strong><span>${reportSections.length?reportSections.map(x=>esc(x)).join(' · '):'الأقسام والملخص'} ‹</span></button>`;
  pg.innerHTML+=`<div class="cmd-truth">ملف محلي يُحدَّث دورياً (الطوابع أعلاه) · لا إرسال واتساب/تيليجرام · الصوت UI فقط · المقر عبر شعار HMK<br>يُعرض المسجّل فقط · غير الموثّق = غير مؤكد · المقارنة تظهر فجوة إن لم توجد لقطات</div>`;
  pg.querySelector('.cmd-report')?.addEventListener('click',()=>c21Detail({title:latest.t,value:{'ملخص التقرير':v19Brief(latest.b),'النص الكامل':latest.b,'وقت المصدر':latest.m,'القسم':latest.p}}));
  pg.querySelectorAll('[data-brief]').forEach(b=>b.onclick=()=>c21Open('list',nsLabel(b.dataset.brief),nsEntries(brief[b.dataset.brief])));
  pg.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{C21.tlTab=b.dataset.tl;C21.tlPage=0;c21Draw()});
  pg.querySelectorAll('[data-tl-nav]').forEach(b=>b.onclick=()=>{if(b.disabled)return;C21.tlPage=(C21.tlPage||0)+Number(b.dataset.tlNav);c21Draw()});
  c21Pack(pg);
  pg.querySelectorAll('[data-proj]').forEach(b=>b.onclick=()=>c21OpenEvent({projectId:b.dataset.proj,pid:b.dataset.proj},'project'));
  pg.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>{const ev=c21UnifiedEvents().find(x=>x.id===b.dataset.event);c21OpenEvent(ev,'event');});
 }else if(C21.screen==='draft'){
  pg.innerHTML=`<div class="cmd-heading"><div><small>HMK · مسودة فقط</small><h2>${esc(C21.title)}</h2></div><button class="cmd-home">الرئيسية</button></div>
  <div class="cmd-source">المسار: المالك → CEO → خبير الأوامر → COO · لا إرسال في المعاينة · ${esc(String(stamp).replace('T',' · ').slice(0,21))}</div>
  <div class="cmd-draft"><label for="cmdDraftText">نص الأمر</label>
  <textarea id="cmdDraftText" maxlength="1200" placeholder="اكتب الأمر هنا… يُحفظ كمسودة محلية في هذه الجلسة فقط">${esc(C21.draft||'')}</textarea>
  <div class="cmd-draft-actions"><button type="button" id="cmdSaveDraft">حفظ المسودة محلياً</button><button type="button" id="cmdCeoReview">مراجعة CEO (محلي)</button><button type="button" id="cmdVoice" class="cmd-voice">🎤 صوت (غير مفعّل)</button></div>
  <p class="cmd-draft-note" id="cmdDraftNote">${esc(C21.draftNote||'المسودة لا تغادر الجهاز في هذه الجلسة المحلية. لا قناة backend صوتية مصرّح بها.')}</p></div>`;
  pg.querySelector('.cmd-home').onclick=c21Home;
  const ta=pg.querySelector('#cmdDraftText');
  pg.querySelector('#cmdSaveDraft').onclick=()=>{C21.draft=ta.value.trim();try{localStorage.setItem('hmk_ceo_cmd_draft',C21.draft)}catch(e){}C21.draftNote=C21.draft?`مسودة محلية · ${C21.draft.length} حرف · لم تُرسل.`:'المسودة فارغة.';pg.querySelector('#cmdDraftNote').textContent=C21.draftNote};
  pg.querySelector('#cmdVoice').onclick=()=>{C21.draftNote='الصوت غير متصل: لا إذن ميكروفون ولا backend مصرّح. استخدم النص.';pg.querySelector('#cmdDraftNote').textContent=C21.draftNote};
  pg.querySelector('#cmdCeoReview').onclick=()=>{C21.draft=ta.value.trim();if(!C21.draft){C21.draftNote='لا نص لمراجعته.';pg.querySelector('#cmdDraftNote').textContent=C21.draftNote;return;}const env={command_id:'local-'+Date.now(),status:'draft',dispatch_status:'not_sent',external_actions_allowed:false,cost_authorized:false,owner_routed_to:'CEO',qa_status:'pending',impact_class:'draft_local',source_summary:C21.draft.slice(0,240)};try{localStorage.setItem('hmk_ceo_cmd_envelope',JSON.stringify(env));localStorage.setItem('hmk_ceo_cmd_draft',C21.draft)}catch(e){}C21.draftNote='أُنشئ غلاف مسودة محلي لمراجعة CEO · dispatch_status=not_sent · لا تنفيذ ولا قناة خارجية. qa_status=pending.';pg.querySelector('#cmdDraftNote').textContent=C21.draftNote};
 }else if(C21.screen==='event-detail'){
  const ed=C21.eventDetail||{rows:{}};
  pg.innerHTML=`<div class="cmd-heading"><div><small>HMK · تفاصيل حدث</small><h2>${esc(C21.title)}</h2></div><button class="cmd-home">الرئيسية</button></div>
  <div class="cmd-source">تفاصيل محلية · بلا تحويل لمشروع عام · ${esc(String(stamp).replace('T',' · ').slice(0,21))}</div>
  <div class="cmd-body"></div>
  <div class="cmd-cmdactions">${ed.canProj?`<button type="button" id="evtOpenProj">فتح مشروع ${esc(c21ProjAr(ed.projectId))}</button>`:''}<button type="button" id="evtBack">رجوع</button></div>`;
  pg.querySelector('.cmd-home').onclick=c21Home;
  const body=pg.querySelector('.cmd-body');
  Object.entries(ed.rows||{}).forEach(([k,v])=>{const a=document.createElement('article');a.className='cmd-copy';a.style.flex='none';a.innerHTML=`<b>${esc(k)}</b><div>${esc(v)}</div>`;body.append(a);});
  c21PageArticles(body,pg);
  pg.querySelector('#evtBack').onclick=c21Back;
  if(pg.querySelector('#evtOpenProj'))pg.querySelector('#evtOpenProj').onclick=()=>c21OpenEvent({projectId:ed.projectId},'project');

 }else{
  pg.innerHTML=`<div class="cmd-heading"><div><small>HMK · سجل محلي</small><h2>${esc(C21.title)}</h2></div><button class="cmd-home">الرئيسية</button></div><div class="cmd-source">المصدر: ${esc(String(stamp).replace('T',' · ').slice(0,21))}${String(stamp).includes('+')?' UAE':''} · مقروء محلياً</div><div class="cmd-body"></div><div class="cmd-pager"></div>`;
  pg.querySelector('.cmd-home').onclick=c21Home;
  const body=pg.querySelector('.cmd-body'),pager=pg.querySelector('.cmd-pager');let count;
  if(C21.screen==='text'){
   const chars=Array.from(C21.text||'غير متاح');const probe=document.createElement('article');probe.className='cmd-copy';body.append(probe);const parts=[];let pos=0;
   while(pos<chars.length){let lo=1,hi=chars.length-pos,fit=1;while(lo<=hi){const mid=(lo+hi)>>1;probe.textContent=chars.slice(pos,pos+mid).join('');if(probe.scrollHeight<=body.clientHeight-4){fit=mid;lo=mid+1}else hi=mid-1}parts.push(chars.slice(pos,pos+fit).join(''));pos+=fit}
   C21.parts=parts;count=parts.length;C21.page=Math.max(0,Math.min(C21.page,count-1));probe.textContent=parts[C21.page];
  }else{
   const per=Math.max(1,Math.floor(body.clientHeight/78));count=Math.max(1,Math.ceil(C21.rows.length/per));C21.page=Math.max(0,Math.min(C21.page,count-1));
   C21.rows.slice(C21.page*per,(C21.page+1)*per).forEach((r,i)=>{const b=document.createElement('button');b.className='cmd-row';b.innerHTML=`<small>${C21.page*per+i+1}</small><strong>${esc(r.title)}</strong><span>‹</span>`;b.onclick=()=>c21Detail(r);body.append(b)});
   if(!C21.rows.length)body.textContent='لا توجد بيانات مسجلة لهذا القسم';
  }
  pager.innerHTML=`<button ${C21.page===0?'disabled':''}>السابق</button><span>${C21.page+1} / ${count}</span><button ${C21.page>=count-1?'disabled':''}>التالي</button>`;
  pager.firstChild.onclick=()=>{C21.page--;c21Draw()};pager.lastChild.onclick=()=>{C21.page++;c21Draw()};
 }
 pg.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>c21Open(b.dataset.command,b.dataset.title));
 c21Clock();
}
function c21Pack(pg){const blocks=[...pg.children].filter(el=>el.classList&&!el.classList.contains('cmd-pager'));if(blocks.length<2)return;const saved=blocks.map(el=>({flex:el.style.flex,minHeight:el.style.minHeight}));blocks.forEach(el=>{el.style.flex='none';el.style.minHeight='0'});const limit=Math.max(160,pg.clientHeight-44);const pages=[];let bucket=[];let used=0;for(const el of blocks){const h=el.offsetHeight||40;if(bucket.length&&used+8+h>limit){pages.push(bucket);bucket=[];used=0}bucket.push(el);used+=h+8}if(bucket.length)pages.push(bucket);blocks.forEach((el,i)=>{el.style.flex=saved[i].flex;el.style.minHeight=saved[i].minHeight});if(pages.length<2)return;const page=Math.max(0,Math.min(C21.homePack||0,pages.length-1));C21.homePack=page;blocks.forEach(el=>{el.hidden=true});pages[page].forEach(el=>{el.hidden=false});const nav=document.createElement('div');nav.className='cmd-pager';nav.innerHTML=`<button type="button" ${page===0?'disabled':''}>السابق</button><span>${page+1} / ${pages.length}</span><button type="button" ${page>=pages.length-1?'disabled':''}>التالي</button>`;pg.append(nav);nav.firstChild.onclick=()=>{C21.homePack=Math.max(0,page-1);c21Draw()};nav.lastChild.onclick=()=>{C21.homePack=page+1;c21Draw()}}
function c21PageArticles(body,pg){const limit=Math.max(48,body.clientHeight||120);let guard=0;while(guard++<40){const tall=[...body.children].find(el=>el.offsetHeight>limit+2);if(!tall)break;const text=tall.innerText||'';const chars=Array.from(text);if(chars.length<2)break;let lo=1,hi=chars.length-1,fit=1;const probe=tall.cloneNode(false);probe.className='cmd-copy';probe.style.flex='none';probe.style.visibility='hidden';probe.style.position='absolute';body.append(probe);while(lo<=hi){const mid=(lo+hi)>>1;probe.textContent=chars.slice(0,mid).join('');if(probe.offsetHeight<=limit){fit=mid;lo=mid+1}else hi=mid-1}probe.remove();fit=Math.max(1,Math.min(fit,chars.length-1));const cut=Math.max(chars.slice(0,fit).join('').lastIndexOf('\n'),chars.slice(0,fit).join('').lastIndexOf(' '));if(cut>fit*.6)fit=cut+1;const a=document.createElement('article');a.className='cmd-copy';a.style.flex='none';a.textContent=chars.slice(0,fit).join('');const b=document.createElement('article');b.className='cmd-copy';b.style.flex='none';b.textContent=chars.slice(fit).join('');tall.replaceWith(a,b)}const items=[...body.children];if(items.length<2)return;const pages=[];let bucket=[];let used=0;for(const el of items){const h=el.offsetHeight||40;if(bucket.length&&used+h>limit){pages.push(bucket);bucket=[];used=0}bucket.push(el);used+=h+7}if(bucket.length)pages.push(bucket);if(pages.length<2)return;const page=Math.max(0,Math.min(C21.page||0,pages.length-1));C21.page=page;items.forEach(el=>{el.hidden=!pages[page].includes(el)});const nav=document.createElement('div');nav.className='cmd-pager';nav.innerHTML=`<button type="button" ${page===0?'disabled':''}>السابق</button><span>${page+1} / ${pages.length}</span><button type="button" ${page>=pages.length-1?'disabled':''}>التالي</button>`;pg.append(nav);nav.firstChild.onclick=()=>{C21.page=Math.max(0,page-1);c21Draw()};nav.lastChild.onclick=()=>{C21.page=page+1;c21Draw()}}
function c21Clock(){const el=document.querySelector('.cmd-clock');if(el)el.textContent=new Intl.DateTimeFormat('ar-AE',{timeZone:'Asia/Dubai',weekday:'short',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date())+' · الإمارات'}
setInterval(c21Clock,30000);
addEventListener('resize',()=>{if(PAGES[CUR]==='sum'&&document.body.classList.contains('command21'))c21Draw()});
const c21Render=render;render=function(){c21Render();const projectTab=$('#nav button[data-p="proj"]');if(projectTab){projectTab.dataset.p='daily';projectTab.querySelector('span').textContent='يومي';projectTab.querySelector('path').setAttribute('d',I.daily||I.ideas);projectTab.onclick=()=>{c21Home();c21Open('day','يومي')}}if(PAGES[CUR]==='sum')c21Draw()};
const c21NsDraw=nsDraw;nsDraw=function(){if(PAGES[CUR]==='sum'&&document.body.classList.contains('command21'))return c21Draw();return c21NsDraw()};
document.querySelector('header .logo').style.cursor='pointer';document.querySelector('header .logo').setAttribute('role','button');document.querySelector('header .logo').tabIndex=0;document.querySelector('header .logo').onclick=()=>goPage(PAGES.indexOf('hq'));document.querySelector('header .logo').onkeydown=e=>{if(e.key==='Enter')goPage(PAGES.indexOf('hq'))};
const c21HqSend=hqSend;hqSend=function(){c21HqSend();const f=$('#hqf');if(f&&f.contentWindow&&D&&D.hq){try{f.contentWindow.postMessage({hq:{...D.hq,agentComparison:D.agentComparison},lang:L,compare:{prev_date:null,summary:null,note:'لا لقطة يوم سابق متتالية موثّقة في هذه الحمولة'}},location.origin)}catch(e){}}};
window.hmkLoadFeed=window.hmkPreviewFeed=(d,status)=>{if(d)D=d;if(status!==undefined)V18_STATUS=status;const lk=document.getElementById('lk');if(lk)lk.style.display='none';if(typeof render==='function')render();};

window.c21LiveInit=c21LiveInit;window.c21EventLabel=c21EventLabel;window.c21OpenEvent=c21OpenEvent;window.c21EventDetails=c21EventDetails;window.c21ProjAr=c21ProjAr;window.c21PreviewAr=c21PreviewAr;
