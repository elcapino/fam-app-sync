/* Local workspace. Browser storage only. Starts empty. No network, no fixture data. */
(function(){
'use strict';
const KEY='hmk_workspace_v1';
const DRAFT_KEY='hmk_idea_draft_v1';
const PSTAT={wait:'ينتظر',go:'جارٍ',hold:'متوقف',done:'تم'};
const TSTAT={open:'مفتوحة',doing:'قيد العمل',done:'تمت'};
const MAX_P=50,MAX_T=100,MAX_NAME=120,MAX_NEXT=400,MAX_FILE=200000;
const empty=()=>({version:1,projects:[]});
let pending=null, notice='', storageError='', locked=false;

function clean(s,max){
  const t=String(s==null?'':s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim();
  return t.length>max?t.slice(0,max):t;
}
function uid(prefix){
  let id='',i=0;
  do{id=prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,8);i++;}
  while(i<5&&!new RegExp('^'+prefix+'[a-z0-9]{4,24}$').test(id));
  return id;
}
function validate(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {ok:false,error:'الملف ليس كائناً صالحاً.'};
  if(raw.version!==1)return {ok:false,error:'إصدار الملف غير مدعوم. لم يُستبدل شيء.'};
  if(!Array.isArray(raw.projects))return {ok:false,error:'قائمة المشاريع مفقودة. لم يُستبدل شيء.'};
  if(raw.projects.length>MAX_P)return {ok:false,error:'عدد المشاريع أكبر من الحد. لم يُستبدل شيء.'};
  const projects=[],seen=new Set();
  for(const p of raw.projects){
    if(!p||typeof p!=='object'||Array.isArray(p))return {ok:false,error:'مشروع غير صالح. لم يُستبدل شيء.'};
    const id=String(p.id||'');
    if(!/^p_[a-z0-9]{4,24}$/.test(id)||seen.has(id))return {ok:false,error:'معرّف مشروع غير صالح. لم يُستبدل شيء.'};
    seen.add(id);
    const name=clean(p.name,MAX_NAME);
    if(!name)return {ok:false,error:'اسم مشروع فارغ. لم يُستبدل شيء.'};
    if(!Object.prototype.hasOwnProperty.call(PSTAT,p.status))return {ok:false,error:'حالة مشروع غير معروفة. لم يُستبدل شيء.'};
    const next=clean(p.next||'',MAX_NEXT);
    if(!Array.isArray(p.tasks)||p.tasks.length>MAX_T)return {ok:false,error:'مهام المشروع غير صالحة. لم يُستبدل شيء.'};
    const tasks=[],ts=new Set();
    for(const t of p.tasks){
      if(!t||typeof t!=='object'||Array.isArray(t))return {ok:false,error:'مهمة غير صالحة. لم يُستبدل شيء.'};
      const tid=String(t.id||'');
      if(!/^t_[a-z0-9]{4,24}$/.test(tid)||ts.has(tid))return {ok:false,error:'معرّف مهمة غير صالح. لم يُستبدل شيء.'};
      ts.add(tid);
      const title=clean(t.title,MAX_NAME);
      if(!title)return {ok:false,error:'عنوان مهمة فارغ. لم يُستبدل شيء.'};
      if(!Object.prototype.hasOwnProperty.call(TSTAT,t.status))return {ok:false,error:'حالة مهمة غير معروفة. لم يُستبدل شيء.'};
      tasks.push({id:tid,title:title,status:t.status,next:clean(t.next||'',MAX_NEXT)});
    }
    projects.push({id:id,name:name,status:p.status,next:next,tasks:tasks});
  }
  return {ok:true,data:{version:1,projects:projects}};
}
function read(){
  storageError=''; locked=false;
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return empty();
    const parsed=JSON.parse(raw);
    const v=validate(parsed);
    if(!v.ok){locked=true;storageError='الحفظ المحلي غير صالح ولم يُستبدل. امسحه بعد التأكيد إن أردت البدء من جديد.';return empty();}
    return v.data;
  }catch(e){
    locked=true;
    storageError='تعذر قراءة الحفظ المحلي. لم يُستبدل ما هو مخزّن.';
    return empty();
  }
}
function write(data){
  if(locked){storageError='الحفظ موقوف حتى تأكيد المسح، حتى لا يُستبدل الحفظ غير الصالح.';return false;}
  storageError='';
  try{localStorage.setItem(KEY,JSON.stringify(data));return true;}
  catch(e){storageError='تعذر الحفظ في هذا المتصفح. المساحة تبقى على هذا الجهاز فقط، فصدّر ملف JSON الآن إن أمكن.';return false;}
}
function el(tag,cls,text){
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!=null)n.textContent=text;
  return n;
}
function field(label,value,oninput,multiline,max){
  const lab=el('label','ws-label',label);
  const input=document.createElement(multiline?'textarea':'input');
  input.className='ws-field';
  input.dir='auto';
  input.maxLength=max||(multiline?MAX_NEXT:MAX_NAME);
  input.value=value||'';
  input.autocomplete='off';
  if(multiline)input.rows=2;
  lab.append(input);
  input.addEventListener('input',()=>oninput(input.value));
  return lab;
}
function blankDraft(){return {version:1,idea:'',goal:'',steps:['','',''],task:'',ready:false};}
function templateFrom(idea){
  const text=clean(idea,MAX_NAME);
  return {version:1,idea:text,ready:true,
    goal:clean('هدف مقترح: إنجاز «'+text+'» محلياً بعد مراجعتك.',MAX_NEXT),
    steps:[
      clean('حدّد متى تُعد «'+text+'» منتهية.',200),
      clean('اكتب أول عمل يمكنك فعله بنفسك دون إرسال أو دفع.',200),
      clean('راجع هذا القالب وعدّله قبل الاعتماد.',200)
    ],
    task:clean('أول مهمة: تحديد نتيجة «'+text+'»',MAX_NAME)};
}
function loadDraft(){
  try{
    const raw=localStorage.getItem(DRAFT_KEY);
    if(!raw)return blankDraft();
    const o=JSON.parse(raw);
    if(!o||o.version!==1||typeof o!=='object')return blankDraft();
    return {version:1,idea:clean(o.idea||'',MAX_NAME),goal:clean(o.goal||'',MAX_NEXT),
      steps:[0,1,2].map(i=>clean((o.steps||[])[i]||'',200)),task:clean(o.task||'',MAX_NAME),ready:o.ready===true};
  }catch(e){return blankDraft();}
}
function saveDraft(d){
  try{localStorage.setItem(DRAFT_KEY,JSON.stringify({version:1,idea:clean(d.idea,MAX_NAME),goal:clean(d.goal,MAX_NEXT),steps:(d.steps||['','','']).slice(0,3).map(s=>clean(s,200)),task:clean(d.task,MAX_NAME),ready:d.ready===true}));}
  catch(e){storageError='تعذر حفظ المسودة على هذا الجهاز.';}
}
function showIdea(pg,data){
  const draft=loadDraft();
  pg.append(el('div','ws-label','من فكرة إلى مسودة'));
  pg.append(el('div','ws-limit','قالب أولي قابل للتعديل. يُركَّب بقواعد ثابتة داخل الصفحة، وليس تحليلاً ذكياً ولا اتصالاً. لا مشروع ولا مهمة قبل تأكيدك، ولا تنفيذ أو إرسال.'));
  pg.append(field('الفكرة',draft.idea,v=>{draft.idea=v;saveDraft(draft);},true,MAX_NAME));
  pg.append(actions([['إعداد قالب أولي',()=>{
    const idea=clean(draft.idea,MAX_NAME);
    if(!idea){notice='اكتب الفكرة أولاً.';redraw();return;}
    saveDraft(templateFrom(idea));
    pending=null; notice='أُعدّ قالب أولي. لم يُنشأ مشروع.'; redraw();
  },'ws-draft']]));
  if(!draft.ready)return;
  if(pending&&pending.type==='adopt'){
    pg.append(el('div','ws-note','اعتماد هذا القالب ينشئ مشروعاً ومهمة في مساحتك بعد تعديلك. لن يُرسل شيء ولن يُنفَّذ أمر.'));
    pg.append(actions([['تأكيد الإنشاء',()=>{
      const d=loadDraft();
      const name=clean(d.idea,MAX_NAME), goal=clean(d.goal,MAX_NEXT), task=clean(d.task,MAX_NAME);
      if(!name||!goal||!task){pending=null;notice='أكمل الفكرة والهدف والمهمة قبل التأكيد. لم يُنشأ شيء.';redraw();return;}
      if(data.projects.length>=MAX_P){pending=null;notice='بلغت حد المشاريع. لم يُنشأ شيء.';redraw();return;}
      const step=clean((d.steps||[]).filter(Boolean).join(' · '),MAX_NEXT);
      data.projects.push({id:uid('p_'),name:name,status:'wait',next:goal,tasks:[{id:uid('t_'),title:task,status:'open',next:step}]});
      pending=null;
      notice=write(data)?'أُنشئ المشروع بعد تأكيدك. المسودة تبقى على هذا الجهاز. لا تنفيذ تلقائي.':'';
      redraw();
    },'ws-adopt-yes'],['إلغاء',()=>{pending=null;notice='أُلغي الاعتماد. المشاريع كما هي، والمسودة ما زالت محفوظة هنا.';redraw();},'ws-adopt-no']]));
    return;
  }
  pg.append(field('الهدف المقترح',draft.goal,v=>{draft.goal=v;draft.ready=true;saveDraft(draft);},true));
  draft.steps.forEach((s,i)=>pg.append(field('خطوة '+(i+1),s,v=>{draft.steps[i]=v;draft.ready=true;saveDraft(draft);},false,200)));
  pg.append(field('أول مهمة',draft.task,v=>{draft.task=v;draft.ready=true;saveDraft(draft);}));
  pg.append(actions([['اعتماد القالب كمشروع',()=>{
    const d=loadDraft();
    if(!clean(d.idea,MAX_NAME)||!clean(d.goal,MAX_NEXT)||!clean(d.task,MAX_NAME)){notice='أكمل القالب قبل الاعتماد. لم يُنشأ شيء.';redraw();return;}
    pending={type:'adopt'}; notice=''; redraw();
  },'ws-adopt']]));
}
function statusRow(map,current,onset){
  const row=el('div','r-tabs');
  row.setAttribute('role','group');
  Object.keys(map).forEach(k=>{
    const b=el('button',k===current?'on':'',map[k]);
    b.type='button';
    b.addEventListener('click',()=>onset(k));
    row.append(b);
  });
  return row;
}
function actions(pairs){
  const row=el('div','ws-actions');
  pairs.forEach(([label,fn,id])=>{
    const b=el('button','r-action',label);
    b.type='button';
    if(id)b.id=id;
    b.addEventListener('click',fn);
    row.append(b);
  });
  return row;
}
function redraw(){if(typeof rDraw==='function')rDraw();}
function showList(pg,data){
  pg.append(el('div','ph')); const h=pg.querySelector('.ph'); h.append(el('h2','','مساحتي'));
  pg.append(el('div','ws-limit','حفظ محلي في هذا المتصفح فقط · بلا مزامنة. صدّر ملف JSON قبل مسح بيانات المتصفح. هذه ليست المعاينة التجريبية.'));
  if(storageError)pg.append(el('div','ws-note ws-error',storageError));
  if(notice)pg.append(el('div','ws-note',notice));
  if(pending&&pending.type==='clear'){
    pg.append(el('div','ws-note','مسح كل المشاريع والمهام من هذا المتصفح؟ ملف التصدير على جهازك لا يُمسح.'));
    pg.append(actions([['تأكيد المسح',()=>{locked=false;pending=null;notice='مُسحت المساحة المحلية.';write(empty());redraw();}],['إلغاء',()=>{pending=null;redraw();}]]));
    return;
  }
  if(pending&&pending.type==='import'){
    pg.append(el('div','ws-note','استبدال المساحة المحفوظة بهذا الملف؟ المشاريع الحالية في هذا المتصفح ستُستبدل.'));
    pg.append(actions([['استبدال',()=>{const next=pending.data;pending=null;if(write(next))notice='استُبدلت المساحة بالملف.';redraw();}],['إلغاء',()=>{pending=null;notice='أُلغي الاستبدال. البيانات المحفوظة كما هي.';redraw();}]]));
    return;
  }
  showIdea(pg,data);
  if(pending&&pending.type==='adopt')return;
  if(!data.projects.length)pg.append(el('div','ws-note','المساحة فارغة. أضف مشروعاً عندما تريد. لا توجد مشاريع جاهزة هنا.'));
  if(pending&&pending.type==='add'){
    const draft=pending.draft;
    pg.append(field('اسم المشروع',draft.name,v=>{draft.name=v;}));
    pg.append(el('div','ws-label','الحالة'));
    pg.append(statusRow(PSTAT,draft.status,k=>{draft.status=k;redraw();}));
    pg.append(field('الخطوة التالية',draft.next,v=>{draft.next=v;},true));
    pg.append(actions([['حفظ المشروع',()=>{
      const name=clean(draft.name,MAX_NAME);
      if(!name){notice='اكتب اسم المشروع.';redraw();return;}
      data.projects.push({id:uid('p_'),name:name,status:draft.status,next:clean(draft.next,MAX_NEXT),tasks:[]});
      pending=null;notice=write(data)?'حُفظ المشروع على هذا الجهاز.':'';
      redraw();
    }],['إلغاء',()=>{pending=null;redraw();}]]));
  }else pg.append(actions([['إضافة مشروع',()=>{pending={type:'add',draft:{name:'',status:'wait',next:''}};notice='';redraw();}]]));
  data.projects.forEach(p=>{
    const b=el('button','project-line row');
    b.type='button';
    const name=el('b','',p.name); name.dir='auto'; name.style.flex='1';
    const chip=el('span','chip '+(p.status==='go'?'go':p.status==='hold'?'hold':p.status==='done'?'watch':'wait'),PSTAT[p.status]);
    const nxt=el('span','mu',p.next||'بلا خطوة تالية'); nxt.dir='auto';
    b.append(el('span','project-icon','◇'),name,chip,nxt);
    b.addEventListener('click',()=>{pending=null;notice='';if(typeof rOpen==='function')rOpen('wsProject',p.id);});
    pg.append(b);
  });
  const file=document.createElement('input');
  file.type='file'; file.accept='application/json,.json'; file.hidden=true; file.id='ws-file';
  file.addEventListener('change',()=>{
    const f=file.files&&file.files[0]; file.value='';
    if(!f)return;
    const reader=new FileReader();
    reader.onload=()=>{
      const text=String(reader.result||'');
      if(text.length>MAX_FILE){notice='الملف أكبر من الحد. لم يُستبدل شيء.';pending=null;redraw();return;}
      let parsed; try{parsed=JSON.parse(text);}catch(e){notice='الملف ليس JSON صالحاً. لم يُستبدل شيء.';pending=null;redraw();return;}
      const v=validate(parsed);
      if(!v.ok){notice=v.error;pending=null;redraw();return;}
      pending={type:'import',data:v.data}; notice=''; redraw();
    };
    reader.readAsText(f);
  });
  pg.append(file);
  pg.append(actions([
    ['تصدير JSON',exportFile,'ws-export'],
    ['استيراد JSON',()=>file.click(),'ws-import'],
    ['مسح المساحة',()=>{pending={type:'clear'};notice='';redraw();},'ws-clear']
  ]));
}
function showProject(pg,data){
  const p=data.projects.find(x=>x.id===RESTORE.project);
  if(!p){if(typeof rOpen==='function')rOpen('ws');return;}
  const head=el('div','ph'); head.append(el('h2','',p.name)); pg.append(head);
  pg.append(el('div','ws-limit','تعديلك يُحفظ في هذا المتصفح فقط. صدّر JSON إذا أردت نسخة خارج المتصفح. ليست معاينة تجريبية.'));
  if(storageError)pg.append(el('div','ws-note ws-error',storageError));
  if(notice)pg.append(el('div','ws-note',notice));
  if(pending&&pending.type==='delete'&&pending.id===p.id){
    pg.append(el('div','ws-note','حذف هذا المشروع ومهامه من هذا المتصفح؟'));
    pg.append(actions([['تأكيد الحذف',()=>{data.projects=data.projects.filter(x=>x.id!==p.id);pending=null;write(data);if(typeof rOpen==='function')rOpen('ws');}],['إلغاء',()=>{pending=null;redraw();}]]));
    return;
  }
  pg.append(field('اسم المشروع',p.name,v=>{p.name=v;}));
  pg.append(el('div','ws-label','حالة المشروع'));
  pg.append(statusRow(PSTAT,p.status,k=>{p.status=k;write(data);redraw();}));
  pg.append(field('الخطوة التالية',p.next,v=>{p.next=v;},true));
  pg.append(actions([['حفظ المشروع',()=>{
    p.name=clean(p.name,MAX_NAME); p.next=clean(p.next,MAX_NEXT);
    if(!p.name){notice='اكتب اسم المشروع.';redraw();return;}
    notice=write(data)?'حُفظ المشروع على هذا الجهاز.':'';
    redraw();
  }]]));
  pg.append(el('div','ws-label','المهام'));
  if(pending&&pending.type==='deleteTask'){
    pg.append(el('div','ws-note','حذف هذه المهمة من هذا المتصفح؟'));
    pg.append(actions([['تأكيد حذف المهمة',()=>{p.tasks=p.tasks.filter(x=>x.id!==pending.id);pending=null;write(data);notice='حُذفت المهمة.';redraw();}],['إلغاء',()=>{pending=null;redraw();}]]));
    return;
  }
  if(!p.tasks.length)pg.append(el('div','ws-note','لا مهام بعد.'));
  p.tasks.forEach(t=>{
    const row=el('div','project-line row');
    const title=el('b','',t.title); title.dir='auto'; title.style.flex='1';
    const chip=el('span','chip '+(t.status==='doing'?'go':t.status==='done'?'watch':'wait'),TSTAT[t.status]);
    const nxt=el('span','mu',t.next||'بلا خطوة'); nxt.dir='auto';
    row.append(title,chip,nxt);
    pg.append(row);
    pg.append(statusRow(TSTAT,t.status,k=>{t.status=k;write(data);notice='تحدّثت حالة المهمة.';redraw();}));
    pg.append(field('عنوان المهمة',t.title,v=>{t.title=v;}));
    pg.append(field('خطوة المهمة',t.next,v=>{t.next=v;}));
    pg.append(actions([['حفظ المهمة',()=>{
      t.title=clean(t.title,MAX_NAME); t.next=clean(t.next,MAX_NEXT);
      if(!t.title){notice='اكتب عنوان المهمة.';redraw();return;}
      notice=write(data)?'حُفظت المهمة على هذا الجهاز.':'';
      redraw();
    }],['حذف المهمة',()=>{pending={type:'deleteTask',id:t.id};notice='';redraw();}]]));
  });
  if(pending&&pending.type==='addTask'){
    const d=pending.draft;
    pg.append(field('عنوان المهمة الجديدة',d.title,v=>{d.title=v;}));
    pg.append(statusRow(TSTAT,d.status,k=>{d.status=k;redraw();}));
    pg.append(field('خطوة المهمة',d.next,v=>{d.next=v;}));
    pg.append(actions([['حفظ المهمة',()=>{
      const title=clean(d.title,MAX_NAME);
      if(!title){notice='اكتب عنوان المهمة.';redraw();return;}
      if(p.tasks.length>=MAX_T){notice='بلغت حد المهام.';redraw();return;}
      p.tasks.push({id:uid('t_'),title:title,status:d.status,next:clean(d.next,MAX_NEXT)});
      pending=null; notice=write(data)?'حُفظت المهمة على هذا الجهاز.':''; redraw();
    }],['إلغاء',()=>{pending=null;redraw();}]]));
  }else pg.append(actions([['إضافة مهمة',()=>{pending={type:'addTask',draft:{title:'',status:'open',next:''}};notice='';redraw();}]]));
  pg.append(actions([['حذف المشروع',()=>{pending={type:'delete',id:p.id};notice='';redraw();}]]));
}
function exportFile(){
  if(locked){notice='الحفظ المحلي غير صالح. لن أصدّر ملفاً فارغاً مكانه.';redraw();return;}
  const data=read();
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='hmk-workspace.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  notice='بدأ تنزيل hmk-workspace.json على هذا الجهاز. لا يُرسل الملف إلى أي خدمة.';
  redraw();
}
function hmkWsDraw(pg){
  pg.replaceChildren();
  const data=read();
  if(RESTORE.route==='wsProject')showProject(pg,data);
  else showList(pg,data);
}
function hmkWsChrome(){
  const mine=RESTORE.route==='ws'||RESTORE.route==='wsProject';
  document.querySelectorAll('#mode button').forEach(b=>b.classList.toggle('on',(b.dataset.mode==='mine')===mine));
  const banner=document.getElementById('qa-banner');
  if(banner)banner.textContent=mine
    ?'مساحة محلية على هذا الجهاز · بلا مزامنة · ليست المعاينة التجريبية · Local only — not the synthetic demo'
    :'بيانات تجريبية · Synthetic demo — not live business data';
}
document.getElementById('mode').addEventListener('click',e=>{
  const b=e.target.closest('[data-mode]'); if(!b||typeof rOpen!=='function')return;
  pending=null; notice='';
  rOpen(b.dataset.mode==='mine'?'ws':'hq');
});
window.hmkWsDraw=hmkWsDraw;
window.hmkWsChrome=hmkWsChrome;
})();
