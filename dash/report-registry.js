/* V5 local report registry — display mapping only. Does not mutate enc. */
(function(global){
'use strict';
const REG={version:5,built:'2026-11-06T13:35:00+04:00',entries:[],diagnostics:[],unassigned:[],byProject:{}};
const NAMES={elcapino:'ELCAPINO',agency:'وكالة واتساب AI',fahem:'فاهم',drop:'دروبشيبنج',market:'إشارات السوق',ideas:'أفكار الإمارات',house:'البيت',unassigned:'غير مُسند'};

/* Exact / word-boundary privacy — "case study" must NOT match "study". Fail-closed on child/family. */
function isPrivate(v){
  const s=String(v||'');
  if(/\bkids\b|\bchild(?:ren)?\b|\bschool\b|\bfamily\b|FAMILY_PASSWORD|أطفال|اطفال|دراسة العيال|دراسة الأطفال|دراسة الاطفال|واجبات|مدرسة|المدرسة/i.test(s))return true;
  if(/(^|[^a-z])study([^a-z]|$)/i.test(s) && !/case\s*study/i.test(s))return true;
  return false;
}
function isFamilyDoc(d){return d.p==='house'||/بيت المالك|بناء البيت|وثائق البيت|V1b-final|P05-AUD|p5v[\/ -]|ملف الأبعاد|حزمة الأبعاد|مراجعة هندسية.*البيت/i.test(String(d.t||''));}
function isDiagnosticNoise(d){
  const t=String(d.t||''), f=String(d.f||'');
  if(/^[╔╗╚╝═─\|]+/.test(t.trim())||/╔═+|╗|╚═+|╝/.test(t))return {reason:'ascii-frame',keepArchive:true};
  if(/ANNOTATION\s*:/i.test(t)||/src_status_snap/i.test(t)||/src_status_snap/i.test(f))return {reason:'annotation-metadata',keepArchive:true};
  if(/^[\-=_]{8,}$/.test(t.trim()))return {reason:'separator',keepArchive:true};
  return null;
}

/** Priority: explicit project f/p markers (fahem) BEFORE generic channel words (WhatsApp). No title-only sourceId. */
function classify(d){
  const title=String(d.t||''), f=String(d.f||d.file||''), p=String(d.p||'');
  const src=f||null;
  const base={sourceId:src,sourceRef:src?('feed.docs.f:'+src):null,title,feedP:p,date:d.m||null,verified_claims:[]};
  const blob=title+' '+f;

  if(/ceo_179345(7745|2242)_/.test(f)||(/\b(Inflation|التضخم|Living Standards|المعیشة|Gold Rises|لماذا يرتفع الذهب|أسعار الذهب|صعود أسعار الذهب|Drivers Behind Global and Local Gold)\b/i.test(title)&&/ceo_/i.test(f))){
    return {...base,projectId:'unassigned',project_name:NAMES.unassigned,eventKind:'econ-brief',why:'title+f educational CEO brief; not FAHEM program'};
  }
  if(/gold_v\d|G3 frozen|G2 frozen|PAXGUSDT|paper trading|تداول ورق|gold feasibility/i.test(blob)||p==='trading'){
    return {...base,projectId:'market',project_name:NAMES.market,eventKind:'market-paper',why:'trading/gold_v paper-spec'};
  }
  if(/HMK|hmk-|feeds|command-intake|r5-split|SEND-001|التسليم التشغيلي|hmk-live/i.test(blob)){
    return {...base,projectId:'elcapino',project_name:NAMES.elcapino,eventKind:'ops-report',why:'HMK ops markers'};
  }
  if(/Shopify|دروب|dropship|helium/i.test(blob)||p==='drop'){
    return {...base,projectId:'drop',project_name:NAMES.drop,eventKind:'commerce',why:'drop/shopify markers'};
  }
  /* FAHEM before generic WhatsApp — conflict with channel word leaves unassigned unless f/p explicit */
  if(p==='fahem' || (/فاهم|FAHEM/i.test(title)&&/تسعير|pricing|قناة|تيليجرام|telegram|اشتراك/i.test(title))){
    if(/واتساب|WhatsApp/i.test(title) && p!=='fahem' && !/^fahem[_\/-]/i.test(f)){
      return {...base,projectId:'unassigned',project_name:NAMES.unassigned,eventKind:'conflict-fahem-channel',why:'FAHEM title markers conflict with WhatsApp channel word; no explicit f/p'};
    }
    return {...base,projectId:'fahem',project_name:NAMES.fahem,eventKind:'fahem-program',why:p==='fahem'?'feed p=fahem explicit':'FAHEM program title markers'};
  }
  if(/فرص البحث|R4-revised|Research|أفكار الإمارات|idea/i.test(title)&&!/واتساب|WhatsApp/i.test(title)){
    return {...base,projectId:'ideas',project_name:NAMES.ideas,eventKind:'research',why:'research/ideas markers'};
  }
  if(/واتساب|WhatsApp|BSP|وكالة|agency|مطاعم|UGC script|Week-1|week-1/i.test(title)||(p==='agency'&&/واتساب|WhatsApp|وكالة|agency|BSP|مطاعم|UGC|Week-1|رخصة|BSP/i.test(title))){
    return {...base,projectId:'agency',project_name:NAMES.agency,eventKind:'agency-work',why:'WhatsApp/agency program markers'};
  }
  if(p==='ideas')return {...base,projectId:'ideas',project_name:NAMES.ideas,eventKind:'research',why:'feed p=ideas'};
  if(p==='drop')return {...base,projectId:'drop',project_name:NAMES.drop,eventKind:'commerce',why:'feed p=drop'};
  if(p==='market')return {...base,projectId:'market',project_name:NAMES.market,eventKind:'market-paper',why:'feed p=market'};
  if(p==='agency')return {...base,projectId:'agency',project_name:NAMES.agency,eventKind:'agency-work',why:'feed p=agency'};
  return {...base,projectId:'unassigned',project_name:NAMES.unassigned,eventKind:'unclassified',why:'no stable title/f rule; not agency fallback'};
}

function buildRegistry(docs){
  REG.entries=[];REG.diagnostics=[];REG.unassigned=[];REG.byProject={};
  (docs||[]).forEach((d,idx)=>{
    const bare=Object.assign({},d); delete bare.__reg;
    if(isPrivate(JSON.stringify(bare))||isFamilyDoc(bare))return;
    const noise=isDiagnosticNoise(bare);
    const cls=classify(bare);
    const entry={idx,sourceId:cls.sourceId,sourceRef:cls.sourceRef,projectId:cls.projectId,project_name:cls.project_name,eventKind:cls.eventKind,date:cls.date,title:cls.title,feedP:cls.feedP,why:cls.why,verified_claims:[],ownerVisible:!noise,diagnostic:!!noise,diagnosticReason:noise&&noise.reason||null,hasBody:!!(bare.b||bare.body||bare.text),doc:bare};
    if(noise){REG.diagnostics.push(entry);return;}
    REG.entries.push(entry);
    if(entry.projectId==='unassigned')REG.unassigned.push(entry);
    (REG.byProject[entry.projectId]=REG.byProject[entry.projectId]||[]).push(entry);
  });
  return REG;
}
function ownerEntries(projectId){return REG.entries.filter(e=>e.ownerVisible&&(!projectId||e.projectId===projectId));}

/** Strip unverified approval/demo claim phrases from any display string (title/impact/note). */
function safeDisplayText(v){
  const s=String(v==null?'':v);
  if(!s)return '';
  if(/معتمدة|15\/15|عرض تجريبي|اعتماد الأسعار|prices?\s*approved|demo\s*15/i.test(s)){
    return 'سجل محفوظ · لا قياساً حياً';
  }
  return s;
}
function safeProjectNote(p){
  if(!p)return 'سجل محفوظ · لا قياساً حياً';
  const raw=String(p.ar_n||'');
  if(!raw)return 'سجل محفوظ · لا قياساً حياً';
  return safeDisplayText(raw);
}
function safePctLabel(p){
  if(p==null||p.pct==null)return null;
  // Keep archived number with short context — not live progress/accuracy
  return {label:'أرشيف',value:p.pct,caveat:'ليست تقدماً حياً',display:'أرشيف',detail:'قيمة مؤرشفة؛ منهج القياس وتاريخ التحقق غير مثبتين هنا'};
}
function safeImpact(p){
  if(!p)return 'سجل محفوظ · لا قياساً حياً';
  if(typeof p==='string'||typeof p==='number')return safeDisplayText(p);
  const note=safeProjectNote(p);
  const pct=safePctLabel(p);
  if(pct)return note+' · '+pct.label+' '+pct.value+'٪ · '+pct.caveat;
  return note;
}

global.HMKRegistry={REG,NAMES,buildRegistry,ownerEntries,classify,isDiagnosticNoise,safeProjectNote,safePctLabel,safeImpact,safeDisplayText,isPrivate,isFamilyDoc};
})(typeof window!=='undefined'?window:globalThis);
