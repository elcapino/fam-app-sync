const $=s=>document.querySelector(s), app=$('#app'); let LANG=localStorage.lang||'ar';
const T={ar:{tag:'افهم، تعلّم، واكتشف',hello:'وش تبي تفهم اليوم؟',ph:'اكتب سؤالك… مثل: الصقر، الماء، القمر',share:'شارك',explain:'فهّمني',quiz:'اختبرني',source:'المصدر',license:'الترخيص',simple:'بكلمات بسيطة',fromsrc:'من نص المصدر',results:'نتائج',none:'ما لقيت شي، جرّب كلمة ثانية',score:'نتيجتك',saved:'✓ انحفظ تقدمك',open:'افتح',copy:'نسخ',copied:'✓ تم النسخ',close:'إغلاق',latest:'جديد في فاهم'},
 en:{tag:'Understand, learn, discover',hello:'What do you want to understand today?',ph:'Ask… e.g. falcon, water, moon',share:'Share',explain:'Explain',quiz:'Quiz me',source:'Source',license:'License',simple:'In simple words',fromsrc:'From the source',results:'Results',none:'Nothing found, try another word',score:'Your score',saved:'✓ Progress saved',open:'Open',copy:'Copy',copied:'✓ Copied',close:'Close',latest:'New on Fahem'}};
const t=k=>T[LANG][k];
const SECTIONS=[['📚','يتعلم','Learn','#/s/العلوم'],['💡','يشرح','Explain','#/search/الماء'],['📖','يقرأ','Read','#/s/الطبيعة'],['🚀','يكتشف','Discover','#/s/الفضاء'],['🇦🇪','الإمارات','UAE','#/s/الإمارات'],['✅','يختبر','Quiz','#/search/الصقر'],['🔎','يبحث','Search','#/search/'],['🌱','ينمو','Grow','#/progress'],['👩‍🏫','للمعلم','Teachers','#/soon/teacher'],['👨‍👩‍👧','للأسرة','Family','#/progress']];
 const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function dates(){const d=new Date();$('#date').textContent=d.toLocaleDateString(LANG==='ar'?'ar-AE':'en-GB',{day:'numeric',month:'short',year:'numeric'})+' · '+d.toLocaleDateString((LANG==='ar'?'ar':'en')+'-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'});}
function src(r){return `<div class="src">${t('source')}: <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.source_name)}</a> · ${t('license')}: <a href="${esc(r.license_url||'#')}" target="_blank">${esc(r.license||'—')}</a></div>`}
function cardHTML(r){return `<div class="card">${r.image_url?`<img loading="lazy" src="${esc(r.image_url)}" alt="">${credit(r)}`:`<div class="ph">${r.content_type==='infographic'?(r.title.split(' ')[0]):(r.icon||'📘')}</div>`}
 <div class="in"><h3><a href="#/r/${r.id}">${esc(r.title)}</a></h3><p>${esc(r.summary)}</p>${src(r)}
 <div class="row"><a class="btn" href="#/r/${r.id}">${t('explain')}</a><button class="btn alt" onclick="share(${r.id})">↗ ${t('share')}</button></div></div></div>`}
const credit=r=>r.image_page?`<div class="src credit">📷 ${esc(r.image_author)} · <a href="${esc(r.image_license_url||r.image_page)}" target="_blank">${esc(r.image_license)}</a> · <a href="${esc(r.image_page)}" target="_blank">Wikimedia Commons</a></div>`:'';
const CACHE={};
async function homeOld(){const subs=await api('/subjects'), rs=await api('/resources?limit=9'); rs.forEach(r=>CACHE[r.id]=r);
 app.innerHTML=`<section class="hero"><h1>${t('hello')}</h1><p>${t('tag')}</p><form class="sbar" onsubmit="location.hash='#/search/'+encodeURIComponent(this.q.value);return false"><input name="q" placeholder="${t('ph')}"><button>🔎</button></form></section>
 <div class="tiles">${SECTIONS.map(s=>`<a class="tile" href="${s[3]}"><b>${s[0]}</b>${LANG==='ar'?'فاهم '+s[1]:s[2]}</a>`).join('')}</div>
 <h2>${t('latest')}</h2><div class="cards">${rs.map(cardHTML).join('')}</div>`}
async function list(title,rs){rs.forEach(r=>CACHE[r.id]=r);app.innerHTML=`<h2>${esc(title)}</h2>${rs.length?`<div class="cards">${rs.map(cardHTML).join('')}</div>`:`<div class="box">${t('none')}</div>`}`}
async function search(q){const d=await api('/search?q='+encodeURIComponent(q));list(`🔎 ${t('results')}: ${q}`,d.results);
 app.insertAdjacentHTML('afterbegin',`<form class="sbar" onsubmit="location.hash='#/search/'+encodeURIComponent(this.q.value);return false"><input name="q" value="${esc(q)}" placeholder="${t('ph')}"><button class="btn">🔎</button></form>`)}
async function lesson(id){const r=await api('/resources/'+id);CACHE[id]=r;const [ex,ig,pk]=await Promise.all([api(`/resources/${id}/explain`),api(`/resources/${id}/infographic`),api(`/resources/${id}/understand`)]);r.ex=ex;if(ig&&ig.eli5)r.ex.one_liner=ig.eli5;
 app.innerHTML=`<article class="lesson">${r.image_url?`<img src="${esc(r.image_url)}" alt="">${credit(r)}`:''}<div class="row"><a class="btn alt" href="#/">→ ${LANG==='ar'?'الرئيسية':'Home'}</a></div><h1>${esc(r.title)}</h1>${bigPicture(pk,ig,id)}${packHTML(pk)}${igHTML(ig)}
 ${r.series?`<div class="box"><div class="bar">${(()=>{const m=Math.max(...r.series.map(x=>x[1]));return r.series.map(x=>`<i title="${x[0]}: ${x[1]}" style="height:${Math.max(3,x[1]/m*100)}%"></i>`).join('')})()}</div><div class="row src"><span>${r.series[0][0]}</span><span style="margin-inline-start:auto">${r.series.at(-1)[0]}</span></div></div>`:''}
 <div class="box"><span class="tag">🤖 ${esc(ex.label)}</span><h3>${t('simple')}</h3><ul class="simple">${ex.simple_points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
 <div class="row"><button class="btn alt" onclick="share(${id})">↗ ${t('share')}</button><button class="btn" onclick="quiz(${id})">✅ ${t('quiz')}</button></div></div>
 <div class="box"><span class="tag">📜 ${t('fromsrc')}</span><p class="quote">${esc(ex.source_text)}</p>${src(r)}<div class="src">${LANG==='ar'?'تاريخ الاسترجاع':'Retrieved'}: ${r.retrieved_at}</div></div>
 <div id="quiz"></div></article>`}
async function quiz(id){const d=await api(`/resources/${id}/quiz`,{method:'POST'});let ok=0,done=0;const box=$('#quiz');
 box.innerHTML=`<div class="box"><span class="tag">🤖 ${esc(d.label)}</span>${d.questions.map((q,i)=>`<div class="q" data-i="${i}"><b>${i+1}. ${esc(q.q)}</b>${q.type==='mcq'?q.options.map((o,j)=>`<button class="btn opt" data-j="${j}">${esc(o)}</button>`).join(''):`<div class="row"><button class="btn opt" data-j="1">✔ ${LANG==='ar'?'صح':'True'}</button><button class="btn opt" data-j="0">✘ ${LANG==='ar'?'خطأ':'False'}</button></div>`}</div>`).join('')}<div id="sc"></div></div>`;
 box.querySelectorAll('.q').forEach(qe=>{const q=d.questions[qe.dataset.i];qe.querySelectorAll('.opt').forEach(b=>b.onclick=async()=>{if(qe.dataset.done)return;qe.dataset.done=1;done++;
  const right=q.type==='mcq'?(+b.dataset.j===q.answer):((b.dataset.j==='1')===q.answer);if(right)ok++;b.classList.add(right?'ok':'no');
  if(done===d.questions.length){await api('/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:1,resource_id:id,assessment_id:d.assessment_id,score:ok,total:done})});
   $('#sc').innerHTML=`<h3>${t('score')}: ${ok}/${done} ${ok===done?'🌟':'👍'}</h3><p>${t('saved')}</p>`}})})}
async function progress(){const p=await api('/progress/1');app.innerHTML=`<h2>🌱 ${LANG==='ar'?'تقدّمي':'My progress'}</h2><div class="box">${p.length?p.map(x=>`<div>✅ <a href="#/r/${x.resource_id}">${esc(x.title)}</a> — ${x.score}/${x.total}</div>`).join(''):'—'}</div>`}
function shareText(r){const one=r.ex?r.ex.one_liner:(r.summary||'').split(/[.؟!]/)[0];return `💡 ${r.title}\n${one}.\n📚 ${t('source')}: ${r.source_name} (${r.license})\n${decodeURI(r.url)}\n— ${LANG==='ar'?'عبر فاهم':'via Fahem'}`}
async function share(id){const r=CACHE[id]||await api('/resources/'+id);const text=shareText(r);
 if(navigator.share&&!location.search.includes('noshare')){try{await navigator.share({title:r.title,text,url:r.url});return}catch(e){if(e.name==='AbortError')return}}
 const sb=$('#sharebox');sb.hidden=false;sb.innerHTML=`<b>↗ ${t('share')}</b><div class="preview" id="sharetext">${esc(text)}</div><div class="row">
 <button class="btn" id="cp">📋 ${t('copy')}</button><a class="btn" style="background:#25D366" target="_blank" href="https://wa.me/?text=${encodeURIComponent(text)}">WhatsApp</a>
 <a class="btn" style="background:#000" target="_blank" href="https://x.com/intent/post?text=${encodeURIComponent(text)}">X</a><button class="btn alt" onclick="$('#sharebox').hidden=true">${t('close')}</button></div>`;
 $('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(text)}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove()}$('#cp').textContent=t('copied')}}
async function report(id){const reason=prompt(LANG==='ar'?'وش المشكلة؟':'What is wrong?');if(reason)await api('/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({resource_id:id,reason})})}
async function route(){$('#sharebox').hidden=true;const h=decodeURIComponent(location.hash.slice(1)||'/').split('/');window.scrollTo(0,0);
 if(h[1]==='search')return search(h.slice(2).join('/'));if(h[1]==='r')return h[3]==='b'?zoom(+h[2],+h[4]):lesson(+h[2]);if(h[1]==='s')return list((await api('/subjects')).find(x=>x.name_ar===h[2])?.icon+' '+h[2],await api('/resources?subject='+encodeURIComponent(h[2])));
 if(h[1]==='progress')return progress();if(h[1]==='graph')return graphView();if(h[1]==='soon'){app.innerHTML=`<div class="box">🛠️ ${LANG==='ar'?'قسم المعلم: مخطط — قريباً':'Teacher tools: planned'}</div>`;return}return home()}
$('#lang').onclick=()=>{LANG=LANG==='ar'?'en':'ar';localStorage.lang=LANG;document.documentElement.lang=LANG;document.documentElement.dir=LANG==='ar'?'rtl':'ltr';$('#lang').textContent=LANG==='ar'?'EN':'ع';document.querySelectorAll('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));dates();route()};
if(LANG==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';$('#lang').textContent='ع'}


// ===== v2 kids one-screen home =====
const COLORS=['#00843D','#C8102E','#7B4DFF','#FF8A00','#00A3C4','#E83E8C','#2BB673','#F2B705'];
const CHIPS=[['الكل','All',''],['🇦🇪 الإمارات','🇦🇪 UAE','الإمارات'],['🔬 العلوم','🔬 Science','العلوم'],['🚀 الفضاء','🚀 Space','الفضاء'],['🌴 الطبيعة','🌴 Nature','الطبيعة'],['📊 أرقام','📊 Numbers','أرقام وإحصاءات']];
const pts=()=>+(localStorage.stars||0);
async function home(sub){sub=sub??(localStorage.chip||'');document.body.classList.add('kids');
 const cards=await api('/home'+(sub?'?subject='+encodeURIComponent(sub):''));cards.forEach(c=>CACHE[c.id]=Object.assign(CACHE[c.id]||{},{id:c.id,title:c.title,summary:c.fact,source_name:c.source_name,url:c.url,license:c.license}));
 const d=new Date(),gd=d.toLocaleDateString(LANG==='ar'?'ar-AE':'en-GB',{day:'numeric',month:'short'}),hd=d.toLocaleDateString((LANG==='ar'?'ar':'en')+'-u-ca-islamic-umalqura',{day:'numeric',month:'long'});
 app.innerHTML=`<div class="kh"><div class="mono">🦅</div><div><h1>${LANG==='ar'?'<b>فاهم</b> <i>يفهّمك</i>':'<b>Fahem</b> <i>explains</i>'}</h1><div class="d">${gd} · ${hd}</div></div><span class="sp"></span>
 <span class="hb">⭐ <span id="pts">${pts()}</span></span><a class="hb" href="#/progress">🌱</a><button class="hb" onclick="$('#lang').click()">${LANG==='ar'?'EN':'ع'}</button></div>
 <div class="fl"><i></i><i></i><i></i><i></i></div>
 <form class="ksearch" onsubmit="location.hash='#/search/'+encodeURIComponent(this.q.value);return false"><input name="q" placeholder="${t('ph')}"><button>🔎</button></form>
 <div class="chips">${CHIPS.map(c=>`<button class="chip ${c[2]===sub?'on':''}" data-s="${c[2]}">${LANG==='ar'?c[0]:c[1]}</button>`).join('')}</div>
 <div class="kgrid">${cards.map((c,i)=>`<div class="kc" style="--c:${COLORS[i%8]}" data-id="${c.id}" data-i="${i}">
  ${c.kind==='challenge'?`<span class="tag">${LANG==='ar'?'تحدّي':'Quiz'}</span>`:''}
  <div class="t"><span class="ic">${c.emoji?esc(c.emoji):c.image_url?`<img src="${esc(c.image_url)}" alt="">`:esc(c.icon)}</span><span>${esc(c.title)}</span></div>
  <p class="f">${c.kind==='challenge'?'❓ ':'💡 '}${esc(c.fact)}</p>
  ${c.kind==='challenge'?`<div class="tf"><button data-a="1">✔ ${LANG==='ar'?'صح':'True'}</button><button data-a="0">✘ ${LANG==='ar'?'خطأ':'False'}</button></div>`:''}
  <div class="ft"><span class="stars">${'★'.repeat(+(localStorage['st'+c.id]||0))}${'☆'.repeat(3-(+(localStorage['st'+c.id]||0)))}</span><button class="sh" data-sh="${c.id}">↗ ${t('share')}</button></div></div>`).join('')}</div>
 <div class="kfoot"><span>فاهم</span><span>${LANG==='ar'?'المصادر: ويكيبيديا · البنك الدولي':'Sources: Wikipedia · World Bank'}</span></div>`;
 app.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{localStorage.chip=b.dataset.s;home(b.dataset.s)});
 app.querySelectorAll('.kc').forEach(el=>{const c=cards[el.dataset.i];el.onclick=e=>{
  if(e.target.dataset.sh){e.stopPropagation();return share(+e.target.dataset.sh)}
  if(e.target.dataset.a!==undefined){e.stopPropagation();if(el.dataset.done)return;el.dataset.done=1;const ok=(e.target.dataset.a==='1')===c.answer;
   el.classList.add(ok?'done-ok':'done-no');el.querySelector('.f').textContent=(ok?'🌟 ':'💡 ')+c.explain;
   if(ok){localStorage.stars=pts()+1;localStorage['st'+c.id]=Math.min(3,+(localStorage['st'+c.id]||0)+1);$('#pts').textContent=pts()}return}
  location.hash='#/r/'+c.id}})}
const _route=route;route=async function(){if(!(location.hash||'#/').match(/^#\/?$/))document.body.classList.remove('kids');return _route()};

dates();addEventListener('hashchange',()=>route());route();

function igHTML(d){if(!d)return'';return `<div class="ig ${esc(d.kind)}"><div class="hd"><span class="em">${esc(d.emoji||'💡')}</span><h2>${esc(d.headline)}</h2></div>
 <div class="eli">${esc(d.eli5)}</div><div class="items">${(d.items||[]).map((x,i)=>`<div class="it" data-n="${i+1}" style="--c:${COLORS[i%8]}"><span class="i">${esc(x.icon)}</span><div>${x.value?`<div class="v">${esc(x.value)}</div>`:''}<div class="l">${esc(x.label)}</div></div></div>`).join('')}</div>
 ${d.uae_example?`<div class="uae">🇦🇪 ${esc(d.uae_example)}</div>`:''}<div class="lb">🤖 ${esc(d.label)}</div></div>`}

function mmSVG(m,hl=-1,mini=false,rid=0){const W=380,H=380,cx=190,cy=190,R=112,n=m.branches.length;
 let g=`<svg viewBox="0 0 ${W} ${H}" id="mmsvg">`;
 m.branches.forEach((b,i)=>{const a=-Math.PI/2+i*2*Math.PI/n,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a),c=COLORS[i%8];
  g+=`<path d="M${cx} ${cy} Q ${(cx+x)/2+20*Math.sin(a)} ${(cy+y)/2-20*Math.cos(a)} ${x} ${y}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  (b.children||[]).forEach((ch,j)=>{const k=(b.children.length-1)/2,a2=a+(j-k)*0.42,x2=cx+(R+68)*Math.cos(a2),y2=cy+(R+68)*Math.sin(a2);
   g+=`<g class="kid k${i}" style="display:none"><line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3"/><rect x="${x2-50}" y="${y2-13}" width="100" height="26" rx="13" fill="#FFF8E7" stroke="${c}" stroke-width="2"/><text x="${x2}" y="${y2+5}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#1f1235">${esc(ch).slice(0,18)}</text></g>`});
  const op=hl>=0&&hl!==i?0.25:1;
  g+=`<g class="b" opacity="${op}" onclick="${mini||!rid?`document.querySelectorAll('#mmsvg .k${i}').forEach(e=>e.style.display=e.style.display==='none'?'':'none')`:`location.hash='#/r/${rid}/b/${i}'`}"><circle cx="${x}" cy="${y}" r="${hl===i?40:33}" fill="${c}" ${hl===i?'stroke="#FFD23F" stroke-width="6"':''}/>${hl===i?`<text x="${x}" y="${y-46}" text-anchor="middle" font-size="13" fill="#C8102E">📍 ${LANG==='ar'?'أنت هنا':'You are here'}</text>`:''}<text x="${x}" y="${y-6}" text-anchor="middle" font-size="22">${esc(b.icon)}</text><rect x="${x-48}" y="${y+6}" width="96" height="26" rx="13" fill="#FFF8E7" stroke="${c}" stroke-width="2"/><text x="${x}" y="${y+24}" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1f1235">${esc(b.label).slice(0,13)}</text></g>`});
 g+=`<circle cx="${cx}" cy="${cy}" r="46" fill="#FFD23F" stroke="#fff" stroke-width="5"/><text x="${cx}" y="${cy-6}" text-anchor="middle" font-size="24">${esc(m.icon||'💡')}</text><text x="${cx}" y="${cy+18}" text-anchor="middle" font-size="13" fill="#2a1846">${esc(m.center).slice(0,16)}</text></svg>`;return g}
function bigPicture(p,ig,rid){const ar=LANG==='ar';return `<div class="sec mm big"><span class="tag">🔭 ${ar?'المستوى 0 — الصورة الكاملة':'Level 0 — Big picture'}</span>
 <div class="eli" style="background:#00843D;color:#fff;border-radius:16px;padding:8px 12px;margin:8px 0;font-size:19px;font-weight:800">${esc(ig&&ig.eli5||p.mindmap.center)}</div>
 ${mmSVG(p.mindmap,-1,false,rid)}<p class="src" style="text-align:center">👆 ${ar?`الموضوع يتكوّن من ${p.mindmap.branches.length} أجزاء — اضغط أي جزء لتدخل فيه`:`${p.mindmap.branches.length} parts — tap one to zoom in`}</p></div>`}
function packHTML(p){if(!p)return'';const A=p.aids||{},ar=LANG==='ar';
 return `<div class="sec bd"><h3>🧩 ${ar?'التفكيك: خطوة خطوة':'Breakdown: step by step'}</h3>${p.breakdown.map((x,i)=>`<div class="st ${i===0?'on':''}" style="--c:${COLORS[i%8]}"><span class="n">${i+1}</span><span class="i">${esc(x.icon)}</span><span>${esc(x.step)}</span></div>`).join('')}
 <div class="row"><button class="btn" id="nextst" onclick="nextStep()">${ar?'الخطوة التالية ←':'Next step →'}</button><span class="src" id="stc">1/${p.breakdown.length}</span></div></div>
 
 ${A.analogy?`<div class="sec"><h3>🔑 ${ar?'أدوات الفهم':'Understanding aids'}</h3><div class="aids">
  <div class="aid" style="--c:#00843D"><b>🪞 ${ar?'تشبيه':'Analogy'}</b>${esc(A.analogy)}</div><div class="aid" style="--c:#FF8A00"><b>🎵 ${ar?'احفظها كذا':'Remember it'}</b>${esc(A.mnemonic)}</div>
  <div class="aid" style="--c:#7B4DFF"><b>🔗 ${ar?'اربطها بما تعرف':'Connect it'}</b>${esc(A.connect)}</div>
  <div class="aid" style="--c:#C8102E"><b>📖 ${ar?'قصة قصيرة':'Mini story'}</b>${(A.story||[]).map((x,i)=>`${i+1}. ${esc(x)}`).join('<br>')}</div></div></div>`:''}
 ${p.links&&p.links.length?`<div class="sec rel"><h3>🕸️ ${ar?'مواضيع مرتبطة':'Related topics'}</h3>${p.links.map(l=>`<a href="#/r/${l.id}">${esc(l.title)}</a>`).join('')} <a href="#/graph" style="background:#00843D">${ar?'خريطة المعرفة':'Knowledge map'}</a></div>`:''}
 <div class="lb src">🤖 ${esc(p.label)}</div>`}
function nextStep(){const s=[...document.querySelectorAll('.bd .st')],k=s.findIndex(x=>!x.classList.contains('on'));if(k<0)return;s[k].classList.add('on');$('#stc').textContent=`${k+1}/${s.length}`;if(k===s.length-1)$('#nextst').textContent='🌟 '+(LANG==='ar'?'فهمتها!':'Got it!')}
async function graphView(){const g=await api('/graph'),n=g.nodes.length,W=420,cx=210,cy=210,R=170,pos={};g.nodes.forEach((x,i)=>{const a=i*2*Math.PI/n;pos[x.id]=[cx+R*Math.cos(a),cy+R*Math.sin(a)]});
 app.innerHTML=`<div class="row"><a class="btn alt" href="#/">→ ${LANG==='ar'?'الرئيسية':'Home'}</a></div><div class="sec mm"><h3>🕸️ ${LANG==='ar'?'خريطة المعرفة — كيف ترتبط المواضيع':'Knowledge map'}</h3><svg viewBox="0 0 ${W} ${W}">${g.edges.map(e=>pos[e.a]&&pos[e.b]?`<line x1="${pos[e.a][0]}" y1="${pos[e.a][1]}" x2="${pos[e.b][0]}" y2="${pos[e.b][1]}" stroke="#7B4DFF88" stroke-width="2.5"/>`:'').join('')}
 ${g.nodes.map((x,i)=>`<a href="#/r/${x.id}"><circle cx="${pos[x.id][0]}" cy="${pos[x.id][1]}" r="22" fill="${COLORS[i%8]}"/><text x="${pos[x.id][0]}" y="${pos[x.id][1]+5}" text-anchor="middle" font-size="15">${x.icon||'📘'}</text><text x="${pos[x.id][0]}" y="${pos[x.id][1]+36}" text-anchor="middle" font-size="10" fill="#2a1846">${esc(x.title.replace(/^\S+ /,'')).slice(0,16)}</text></a>`).join('')}</svg></div>`}

async function zoom(id,bi){const [r,pk,ig]=await Promise.all([api('/resources/'+id),api(`/resources/${id}/understand`),api(`/resources/${id}/infographic`)]);CACHE[id]=r;r.ex={one_liner:ig&&ig.eli5};
 const m=pk.mindmap,b=m.branches[bi],ar=LANG==='ar',n=m.branches.length,c=COLORS[bi%8];
 app.innerHTML=`<div class="row"><a class="btn alt" href="#/r/${id}">🔭 ${ar?'الصورة الكاملة':'Big picture'}</a><span class="src">${ar?'المستوى 1':'Level 1'} · ${bi+1}/${n}</span></div>
 <div class="sec mm mini" style="max-width:260px;margin:8px auto">${mmSVG(m,bi,true,id)}</div>
 <div class="sec" style="border-top:6px solid ${c}"><h2 style="margin:0">${esc(b.icon)} ${esc(b.label)}</h2>
 <p class="src">🔗 ${ar?`«${esc(b.label)}» جزء من «${esc(m.center)}»`:`"${esc(b.label)}" is part of "${esc(m.center)}"`}</p>
 <div class="aids">${(b.children||[]).map((ch,j)=>`<div class="aid" style="--c:${COLORS[(bi+j+1)%8]}"><b>${j+1}</b>${esc(ch)}</div>`).join('')}</div>
 <p class="src">${ar?'أجزاء أخرى:':'Other parts:'} ${m.branches.map((x,i)=>i===bi?'':`<a href="#/r/${id}/b/${i}">${esc(x.icon)} ${esc(x.label)}</a>`).filter(Boolean).join(' · ')}</p>
 <div class="row">${bi>0?`<a class="btn alt" href="#/r/${id}/b/${bi-1}">→ ${ar?'السابق':'Prev'}</a>`:''}${bi<n-1?`<a class="btn" href="#/r/${id}/b/${bi+1}">${ar?'الجزء التالي ←':'Next part →'}</a>`:`<a class="btn" href="#/r/${id}">🌟 ${ar?'رجعنا للصورة الكاملة':'Back to big picture'}</a>`}<button class="btn alt" onclick="share(${id})">↗ ${t('share')}</button></div></div>
 ${src(r)}`}
