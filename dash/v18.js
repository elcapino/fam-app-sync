/* Native pre-v17 navigation; content stays local. */
Object.assign(T.ar,{org:'الهيكل الأمثل',ecosystem:'خريطة المنظومة',team:'فريق HMK'});
Object.assign(T.en,{org:'Optimal organisation',ecosystem:'HMK ecosystem',team:'HMK team'});
const V18_TEAM=[['grok','Grok CEO','التخطيط والتنظيم فقط','أقل استخدام · موجز قرارات واحد'],['codex','Codex / ChatGPT','الهندسة والتنفيذ','حسب حدود الخطة · تنفيذ واختبار'],['claude','Claude API','التحليل والمراجعة','سقف $20'],['gemini','Gemini API','البحث والمصادر','سقف $75 شهريًا · $15 يوميًا'],['notebook','NotebookLM','مكتبة المصادر','مصادر عامة فقط · عبر المتصفح'],['deepseek','DeepSeek','المسودات الاقتصادية','سقف $5 شهريًا'],['scripts','Scripts + cron','الأتمتة المجانية','فحص وحساب ونسخ احتياطي'],['pc','PC workspace','مساحة العمل المحلية','الخاص والأطفال محليًا فقط']];

Object.assign(NS_LABELS,{cap:['السقف والاستخدام','Cap & allowance'],content:['التفاصيل','Details']});
let V18_STATUS=null;
function v18Text(html){const el=document.createElement('div');el.innerHTML=html;el.querySelectorAll('p,small,span,article,.owner,.ceo,.branch,.integration,b,br').forEach(x=>{x.append(document.createTextNode('\n'))});return el.textContent.replace(/\n{3,}/g,'\n\n').trim()}
function v18Org(section){const el=document.createElement('div');el.innerHTML=section.html;const cards=[...el.querySelectorAll('article,.integration')];if(!cards.length)return v18Text(section.html);const rows=cards.map(x=>({title:x.querySelector('h3,p,b')?.textContent||section.title,value:v18Text(x.outerHTML)}));const extra=el.querySelector('.recommend');if(extra)rows.push({title:L==='ar'?'التوصية':'Recommendation',value:v18Text(extra.outerHTML)});return rows.map(x=>({title:x.title,content:x.value}))}
const v18BaseHome=nsHome;
nsHome=function(p){
 if(p==='sum')return [{title:t('org'),open:'org'},{title:t('ecosystem'),open:'ecosystem'},{title:t('team'),open:'team'}].concat(v18BaseHome(p));
 if(p==='house')return nsData(['house']).concat(nsDocs('house'));
 if(p==='org')return ORG_CONTENT.map(s=>({title:s.title,value:v18Org(s)}));
 if(p==='team')return [{title:'المالك ← المدير ← توزيع ← تنفيذ ← تقرير',value:'لا تُرسل البيانات الشخصية أو بيانات الأطفال إلى أي ذكاء اصطناعي خارجي. الموافقة النهائية لالمالك.'},...V18_TEAM.map(([id,name,role,cap])=>{const x=V18_STATUS?.services?.find(s=>s.id===id);return {title:name+' · '+role,value:{role,cap,usage:x?.used!=null?`${x.used}${x.unit||''}${x.cap!=null?' / '+x.cap:''} · ${x.usage_updated||''}`:'الاستهلاك غير مؤكد'}}})];
 if(p==='ecosystem'){
 if(!V18_STATUS)return [{title:'⚪ الحالة غير مؤكدة',value:'تعذّرت قراءة الحالة المحلية. أعد التحديث.'}];
 const data=V18_STATUS,stamp=Date.parse(data.generated_at),stale=!Number.isFinite(stamp)||Date.now()-stamp>3600000;
 const card=x=>{const state=String(x.status||x.runtime||'unknown').toLowerCase();const label=!stale&&['up','connected','ok','running'].includes(state)?'🟢 متصل':['off','down','disabled','stopped'].includes(state)?'🔴 متوقف':'⚪ غير مؤكد';return {title:label+' · '+(x.name||x.id),evidence:x.evidence||x.role||'لا يوجد فحص اتصال مؤكد',last_seen:x.last_seen||'لا يوجد وقت تحقق'}};
 return [{title:'وقت التحديث · '+data.generated_at,value:stale?'لقطة قديمة؛ الاتصال غير مؤكد':'🟢 متصل · 🔴 متوقف · ⚪ غير مؤكد'},...[[ 'الأجهزة',data.devices],['البرامج',data.programs],['الوكلاء والأدوات',data.services?.filter(x=>x.id!=='pages')],['المواقع',data.services?.filter(x=>x.id==='pages')]].map(([title,rows])=>({title,value:(rows||[]).map(card)})),{title:'مقترحات تحتاج موافقة المالك',value:['تفعيل نبض اتصال محلي للأجهزة','ربط عدادات التكلفة وإيقاف الطلبات عند السقف',...(data.integrations||[])].map(x=>'بانتظار موافقة المالك · '+x)}];
 }
 return v18BaseHome(p);
};
fetch('status.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{V18_STATUS=data;if(['ecosystem','team'].includes(PAGES[CUR])&&!NS_STACK.length){NS_ROWS=nsHome(PAGES[CUR]);nsDraw()}}).catch(()=>{});
