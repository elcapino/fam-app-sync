// FAHEM static build: read-only data, no server, no keys.
const _J={};const _get=u=>_J[u]||(_J[u]=fetch(u).then(r=>r.json()));
const _idx=()=>_get('data/index.json'),_r=id=>_get('data/r/'+id+'.json');
const _norm=s=>(s||'').replace(/[\u064B-\u0652\u0640]/g,'').replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').toLowerCase().replace(/\s+/g,' ').trim();
async function api(p,o){const u=new URL(p,'http://x/'),q=u.searchParams,s=u.pathname.split('/').filter(Boolean),I=await _idx();
 if(s[0]==='subjects')return I.subjects;
 if(s[0]==='graph')return I.graph;
 if(s[0]==='home')return I.home[q.get('subject')||'']||I.home[''];
 if(s[0]==='search'){const st=_norm(q.get('q')).split(' ').map(w=>w.replace(/^(وال|بال|فال|ال|و)/,'')).filter(w=>w.length>1);
   return {q:q.get('q'),results:st.length?I.resources.filter(r=>{const t=_norm(r.title+' '+r.summary+' '+r.body);return st.every(w=>t.includes(w))}):[]}}
 if(s[0]==='resources'&&!s[1]){const sub=q.get('subject');return I.resources.filter(r=>!sub||r.subject===sub).slice(0,+(q.get('limit')||24))}
 if(s[0]==='resources'){const d=await _r(s[1]);if(!s[2])return d.r;
   if(s[2]==='explain')return d.explain?{...d.explain,citation:{source:d.r.source_name,url:d.r.url,license:d.r.license,license_url:d.r.license_url,retrieved:d.r.retrieved_at}}:{};
   if(s[2]==='quiz')return {assessment_id:null,...(d.quiz||{questions:[]})};
   return d[s[2]]}
 if(s[0]==='progress'){const L=JSON.parse(localStorage.fahemProgress||'[]');
   if(o&&o.method==='POST'){const b=JSON.parse(o.body),r=(await _r(b.resource_id)).r;L.unshift({...b,title:r.title});localStorage.fahemProgress=JSON.stringify(L.slice(0,200));return {id:L.length}}return L}
 if(s[0]==='report')return {ok:true};
 return null}
