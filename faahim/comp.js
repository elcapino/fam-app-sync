// فاهم – Competitions. Questions are ONLY from: (a) the curated FACTS bank below, (b) reviewed DEMOS/ISLAM content (timeline, key points, glossary).
// v1.4: NO Islam questions. 'Ayah reader' badge = opened 3+ Islam topics (islam.js). Everything is stored locally (localStorage); no accounts.
const FACTS=[
['Science',['أي جامعة إماراتية لها أكبر عدد من الأبحاث في OpenAlex؟',['جامعة الإمارات العربية المتحدة','جامعة زايد','جامعة عجمان','جامعة أبوظبي']],['Which UAE university has the most research papers in OpenAlex?',['United Arab Emirates University','Zayed University','Ajman University','Abu Dhabi University']],'🇦🇪 OpenAlex · CC0 (2026-10-30)'],
['Science',['أي جامعة تأتي ثانية في عدد الأبحاث بالإمارات (OpenAlex)؟',['جامعة الشارقة','جامعة زايد','جامعة عجمان','جامعة العين']],['Which UAE university is 2nd by number of research papers (OpenAlex)?',['University of Sharjah','Zayed University','Ajman University','Al Ain University']],'🇦🇪 OpenAlex · CC0 (2026-10-30)'],
['Technology',['أي جامعة إماراتية متخصصة في الذكاء الاصطناعي؟',['جامعة محمد بن زايد للذكاء الاصطناعي','جامعة زايد','الجامعة الأمريكية في الشارقة','جامعة عجمان']],['Which UAE university specialises in Artificial Intelligence?',['Mohamed bin Zayed University of Artificial Intelligence','Zayed University','American University of Sharjah','Ajman University']],'🇦🇪 OpenAlex · CC0'],
['Science',['في أي إمارة تقع جامعة خليفة للعلوم والتكنولوجيا؟',['أبوظبي','دبي','الشارقة','عجمان']],['In which emirate is Khalifa University of Science and Technology?',['Abu Dhabi','Dubai','Sharjah','Ajman']],'🇦🇪 OpenAlex · CC0'],
['Economy',['بوابة البيانات المفتوحة الاتحادية في الإمارات اسمها؟',['بيانات (bayanat.ae)','ويكيبيديا','ناسا','أوبن ستاكس']],['The UAE federal open-data portal is called?',['Bayanat (bayanat.ae)','Wikipedia','NASA','OpenStax']],'🇦🇪 Bayanat.ae · CC BY 4.0'],
['Science',['تغلي المياه عند مستوى سطح البحر عند كم درجة مئوية؟',['100','50','150','80']],['At sea level, water boils at how many °C?',['100','50','150','80']]],
['Science',['كيف تصنع النباتات غذاءها؟',['البناء الضوئي','الهضم','التبخر','التنفس فقط']],['How do plants make their food?',['Photosynthesis','Digestion','Evaporation','Breathing only']]],
['Science',['ما هو H₂O؟',['الماء','الملح','الأكسجين','السكر']],['What is H₂O?',['Water','Salt','Oxygen','Sugar']]],
['Mathematics',['مجموع زوايا المثلث يساوي؟',['180°','90°','360°','270°']],['The angles of a triangle add up to?',['180°','90°','360°','270°']]],
['Mathematics',['كم يساوي 7 × 8؟',['56','54','48','64']],['What is 7 × 8?',['56','54','48','64']]],
['Mathematics',['قيمة π تقريباً؟',['3.14','2.71','1.41','4.13']],['π is approximately?',['3.14','2.71','1.41','4.13']]],
['Outer space',['ما أكبر كوكب في المجموعة الشمسية؟',['المشتري','الأرض','المريخ','زحل']],['What is the largest planet in the Solar System?',['Jupiter','Earth','Mars','Saturn']]],
['Outer space',['كم عدد كواكب المجموعة الشمسية؟',['8','9','7','10']],['How many planets are in the Solar System?',['8','9','7','10']]],
['Outer space',['ما اسم مسبار الإمارات إلى المريخ؟',['الأمل','الفجر','النور','الصقر']],['What is the name of the UAE\'s Mars probe?',['Hope (Al Amal)','Dawn','Noor','Falcon']]],
['Geography',['ما عاصمة دولة الإمارات؟',['أبوظبي','دبي','العين','الشارقة']],['What is the capital of the UAE?',['Abu Dhabi','Dubai','Al Ain','Sharjah']]],
['Geography',['كم عدد إمارات الدولة؟',['7','5','6','9']],['How many emirates are in the UAE?',['7','5','6','9']]],
['Geography',['ما أكبر محيط في العالم؟',['الهادئ','الأطلسي','الهندي','المتجمد الشمالي']],['What is the largest ocean?',['Pacific','Atlantic','Indian','Arctic']]],
['Geography',['ما أعلى قمة في الإمارات؟',['جبل جيس','جبل حفيت','جبل يبر','جبل الرحمة']],['What is the highest peak in the UAE?',['Jebel Jais','Jebel Hafeet','Jebel Yibir','Jebel al-Rahma']]],
['Human body',['كم حجرة في قلب الإنسان؟',['4','2','3','6']],['How many chambers does the human heart have?',['4','2','3','6']]],
['Human body',['كم عدد أسنان الإنسان البالغ عادة؟',['32','20','28','36']],['How many teeth does an adult usually have?',['32','20','28','36']]],
['Human body',['ماذا تنقل كريات الدم الحمراء؟',['الأكسجين','الطعام فقط','الأصوات','الضوء']],['What do red blood cells carry?',['Oxygen','Only food','Sound','Light']]],
['Technology',['أي جزء يُسمّى «عقل» الكمبيوتر؟',['المعالج','الشاشة','الفأرة','السماعة']],['Which part is called the computer\'s "brain"?',['Processor (CPU)','Screen','Mouse','Speaker']]],
['Technology',['من اخترع الشبكة العنكبوتية العالمية (الويب)؟',['تيم بيرنرز لي','توماس إديسون','نيوتن','غراهام بيل']],['Who invented the World Wide Web?',['Tim Berners-Lee','Thomas Edison','Isaac Newton','Graham Bell']]],
['History',['متى تأسس اتحاد دولة الإمارات؟',['1971','1968','1981','1975']],['When was the UAE founded?',['1971','1968','1981','1975']]],
['History',['ابن الهيثم مشهور بعلم…',['البصريات','الطب فقط','الفلك فقط','الشعر']],['Ibn al-Haytham is famous for…',['Optics','Only medicine','Only astronomy','Poetry']]],
['History',['في أي دولة تقع أهرامات الجيزة؟',['مصر','العراق','المغرب','الأردن']],['Where are the Pyramids of Giza?',['Egypt','Iraq','Morocco','Jordan']]],
['Language',['كم عدد حروف الهجاء العربية؟',['28','26','30','24']],['How many letters are in the Arabic alphabet?',['28','26','30','24']]],
['Language',['كم عدد حروف الإنجليزية؟',['26','28','24','30']],['How many letters are in the English alphabet?',['26','28','24','30']]],
['Art',['الألوان الأساسية في الرسم هي الأحمر والأصفر و…',['الأزرق','الأخضر','الأسود','البرتقالي']],['The primary paint colours are red, yellow and…',['Blue','Green','Black','Orange']]],
['Art',['أين يقع برج خليفة؟',['دبي','أبوظبي','الدوحة','الرياض']],['Where is Burj Khalifa?',['Dubai','Abu Dhabi','Doha','Riyadh']]],
['Economy',['ما عملة دولة الإمارات؟',['الدرهم','الدينار','الريال','الجنيه']],['What is the UAE currency?',['Dirham','Dinar','Riyal','Pound']]],
['Economy',['«التضخم» يعني غالباً إن الأسعار…',['ترتفع','تنخفض','تختفي','تبقى نفسها دائماً']],['"Inflation" usually means prices…',['Go up','Go down','Disappear','Never change']]]];
const DSEC={quantum:'Science',ai:'Technology',dna:'Human body',tawheed:'Islam',seerah:'Islam',sahaba:'Islam',quran:'Islam',sunnah:'Islam'};
const shuf=(a,r=Math.random)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function bank(){const out=[];
 FACTS.forEach(([s,ar,en,src])=>{const q=L=='ar'?ar:en;out.push({s,q:q[0],a:q[1][0],o:q[1],src})});
 const keys=Object.keys(DEMOS);
 keys.forEach(k=>{const d=DEMOS[k][L],s=DSEC[k],isl=s=='Islam';
  const yrs=d.time.map(t=>t[0]);d.time.forEach(([y,,e])=>{const w=shuf([...new Set(yrs.filter(x=>x!=y))]).slice(0,3);if(w.length==3)out.push({s,q:(L=='ar'?'في أي سنة: ':'In which year: ')+e+'؟'.replace('؟',L=='ar'?'؟':'?'),a:String(y),o:[String(y),...w.map(String)]})});
  const others=keys.filter(x=>isl?!ISLAM[x]:(x!=k&&!ISLAM[x])).flatMap(x=>DEMOS[x][L].points.map(p=>p[1]));
  d.points.forEach(([,p])=>out.push({s,q:(L=='ar'?'أي جملة صحيحة عن «':'Which is true about "')+d.title+(L=='ar'?'»؟':'"?'),a:p,o:[p,...shuf(others).slice(0,3)]}));
  (d.gloss||[]).forEach(g=>{const m=GLOSS[L][g];if(!m)return;const w=shuf(Object.keys(GLOSS[L]).filter(x=>x!=g)).slice(0,3).map(x=>GLOSS[L][x][0]);out.push({s,q:(L=='ar'?'شو معنى «':'What does "')+g+(L=='ar'?'»؟':'" mean?'),a:m[0],o:[m[0],...w]})});
  if(DEMOS[k].ayah){const [su]=DEMOS[k].ayah.split(':');const q=QURAN[DEMOS[k].ayah];out.push({s,q:(L=='ar'?`ما رقم ${q.surah}؟`:`What is the number of Surah ${q.en}?`),a:su,o:[su,...shuf(['112','33','9','15','4','96','1','2','36','67'].filter(x=>x!=su)).slice(0,3)]})}});
 return out}
// ---------- players (local only) ----------
const AV=['🦅','🐪','🐎','🦌','🐢','🐬','🦁','🦉'];
const P={get list(){return JSON.parse(localStorage.fhPlayers||'[]')},save(l){localStorage.fhPlayers=JSON.stringify(l)},get cur(){return this.list.find(p=>p.id==localStorage.fhCur)||this.list[0]},
 upd(fn){const l=this.list,p=l.find(x=>x.id==(this.cur||{}).id);if(p){fn(p);this.save(l)}}};
function addPlayer(name,av){const l=P.list,id=Date.now().toString(36);l.push({id,name:name.slice(0,14),av,pts:0,xp:0,best:0,games:0,day:'',dstreak:0,badges:[]});P.save(l);localStorage.fhCur=id}
const lvl=xp=>Math.floor(Math.sqrt(xp/50))+1,lvlPct=xp=>{const l=lvl(xp),a=50*(l-1)**2,b=50*l**2;return 100*(xp-a)/(b-a)};
const BADGES={first:['🎉','أول جولة','First round'],perfect:['💯','علامة كاملة','Perfect score'],speed:['⚡','البرق','Lightning'],combo:['🔥','سلسلة 5','5 in a row'],daily3:['📅','3 أيام متتالية','3-day streak'],islam:['🕌','قارئ الآيات','Ayah reader'],lvl5:['👑','المستوى 5','Level 5']};
const TT={ar:{comp:'المسابقات',daily:'تحدّي اليوم',mixed:'جولة منوّعة',lb:'لوحة الأبطال',add:'لاعب جديد',name:'اسم اللاعب',save:'حفظ',lv:'المستوى',done:'انتهت الجولة!',again:'جولة ثانية',back:'رجوع',q:'سؤال',pts:'نقطة',streak:'سلسلة',dd:'يوم متتالي',sec:'تحدّي الأقسام',taken:'خلصت تحدّي اليوم ✅ ارجع بكرة',choose:'اختر لاعب'},
 en:{comp:'Contests',daily:'Daily challenge',mixed:'Mixed round',lb:'Leaderboard',add:'New player',name:'Player name',save:'Save',lv:'Level',done:'Round over!',again:'Play again',back:'Back',q:'Question',pts:'pts',streak:'streak',dd:'day streak',sec:'Section challenges',taken:'Daily challenge done ✅ come back tomorrow',choose:'Choose player'}};
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Dubai'});
function seeded(s){let h=0;for(const c of s)h=Math.imul(31,h)+c.charCodeAt(0)|0;return()=>{h=Math.imul(h^h>>>15,2246822507)^Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
function lbHTML(n){const me=(P.cur||{}).id;return P.list.sort((a,b)=>b.pts-a.pts).slice(0,n).map((p,i)=>`<div class="lb ${p.id==me?'me':''}"><span>${['🥇','🥈','🥉'][i]||i+1}</span><span class="av">${p.av}</span><span class="n">${esc(p.name)}<br><small style="font-weight:600;opacity:.7">${TT[L].lv} ${lvl(p.xp)} · ${p.badges.map(b=>BADGES[b][0]).join('')}</small></span><b>${p.pts}</b></div>`).join('')}
function compHome(){D=null;const t=TT[L],p=P.cur;$('#tabs').innerHTML='';$('#main').classList.toggle('split',innerWidth>=700);const wide=innerWidth>=700;
 if(!p)return playerSheet();const doneToday=p.day==today();
 const secs=SECT.filter(s=>s[3]!='__news'&&bank().some(q=>q.s==s[3]));
 $('#p1').innerHTML=`<div class="title">🏆 ${t.comp}</div>
 <div class="lb me" style="background:#fff"><span class="av" style="font-size:36px">${p.av}</span><span class="n">${esc(p.name)}<div class="bar" style="margin-top:4px"><div style="width:${lvlPct(p.xp)}%"></div></div><small>${t.lv} ${lvl(p.xp)} · 🔥 ${p.dstreak} ${t.dd}</small></span><button class="pill" data-swap="1" style="background:var(--sand);color:var(--gd)">🔄</button></div>
 <div class="bdg">${p.badges.map(b=>`<span class="badge">${BADGES[b][0]} ${BADGES[b][L=='ar'?1:2]}</span>`).join('')||''}</div>
 <div style="display:flex;gap:6px"><button class="btn" data-play="daily" style="flex:1.2;font-size:15px;padding:10px 4px;background:linear-gradient(135deg,#d9a032,#9c6d12);text-shadow:0 1px 2px #0008" ${doneToday?'disabled':''}>📅 ${doneToday?t.taken:t.daily}</button>
 <button class="btn" data-play="mixed" style="flex:1;font-size:15px;background:var(--r)">🎲 ${t.mixed}</button></div>
 <div class="title" style="font-size:15px">🎯 ${t.sec}</div><div class="grid cg" style="grid-template-columns:repeat(${wide?4:2},1fr)">${secs.map((s,i)=>`<button class="tile" data-play="${s[3]}" style="background:${['#00843D','#C8102E','#a8442a','#161616','#1d3f8a','#d6336c','#6b4bb8','#9c6d12','#0b6e4f','#7a5a2e','#05502b'][i%11]}"><i>${s[0]}</i><span>${L=='ar'?s[1]:s[2]}</span></button>`).join('')}</div>
 ${wide?'':`<button class="btn" data-lb="1" style="background:var(--sand);color:var(--gd)">🏅 ${t.lb} ›</button>`}`;
 if(wide){$('#p2').style.display='flex';$('#p2').innerHTML=`<div class="title">🏅 ${t.lb}</div>${lbHTML(7)}`}else $('#p2').style.display='none'}
function lbScreen(){const t=TT[L];$('#main').classList.remove('split');$('#p2').style.display='none';$('#p1').innerHTML=`<div class="title">🏅 ${t.lb}</div><div style="flex:1;display:flex;flex-direction:column;gap:6px">${lbHTML(8)}</div><button class="btn" data-play="mixed" style="background:var(--r)">🎲 ${t.mixed}</button><button class="btn" data-nav="comp" style="background:var(--sand);color:var(--gd)">‹ ${t.back}</button>`}
function playerSheet(){const t=TT[L],S=$('#sheet');S.innerHTML=`<div class="title">👤 ${P.list.length?t.choose:t.add}</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">${P.list.map(p=>`<button class="btn" data-pick="${p.id}" style="background:var(--sand);color:var(--k)">${p.av} ${esc(p.name)}</button>`).join('')}</div>
 <input id="pn" placeholder="${t.name}" maxlength="14" style="width:100%;font:700 16px Cairo;padding:8px;border-radius:12px;border:2px solid var(--sand)"><div class="tiles" style="margin:8px 0">${AV.map((a,i)=>`<button class="btn" data-av="${a}" style="background:${i?'var(--sand)':'var(--gl)'}">${a}</button>`).join('')}</div><button class="btn opt" id="padd" style="text-align:center;background:var(--g);color:#fff">➕ ${t.save}</button>
 <div class="src">${L=='ar'?'🔒 البيانات محفوظة على هذا الجهاز فقط':'🔒 Saved on this device only'}</div>`;S.dataset.av=AV[0];S.classList.add('open')}
// ---------- round ----------
let R=null;
function startRound(kind){const p=P.cur;if(!p)return playerSheet();let b=bank(),n=10,rng=Math.random;
 if(kind=='daily'){rng=seeded(today()+L);n=7}else if(kind!='mixed')b=b.filter(q=>q.s==kind);
 const qs=shuf(b,rng).slice(0,n).map(q=>({...q,o:shuf(q.o,rng)}));R={kind,qs,i:0,score:0,combo:0,best:0,right:0,fast:0};$('#main').classList.remove('split');$('#p2').style.display='none';$('#tabs').innerHTML='';ask()}
function ask(){const t=TT[L],q=R.qs[R.i];R.left=15;R.lock=false;
 $('#p1').innerHTML=`<div style="display:flex;justify-content:space-between;font-weight:900"><span>${t.q} ${R.i+1}/${R.qs.length}</span><span>🔥 ${R.combo}</span><span style="color:var(--r)">⭐ ${R.score}</span></div>
 <div class="bar"><div id="tm" style="width:100%"></div></div><div style="text-align:center;font-size:42px;margin:6px 0" id="tn">⏱️ 15</div>
 <div class="big" style="text-align:center;font-weight:800;font-size:19px;background:#fff;border-radius:16px;padding:12px;box-shadow:0 3px 0 var(--sand)">${esc(q.q)}</div>
 <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">${q.o.map((o,i)=>`<button class="btn" data-ans="${esc(o)}" style="background:${['#00843D','#C8102E','#1d3f8a','#C9962B'][i]};font-size:15px">${esc(o)}</button>`).join('')}</div>
 <div class="src">${q.src?'📚 '+q.src:''}</div>`;
 clearInterval(R.tid);R.tid=setInterval(()=>{R.left--;const tm=$('#tm'),tn=$('#tn');if(tm)tm.style.width=(R.left/15*100)+'%';if(tn)tn.textContent='⏱️ '+Math.max(0,R.left);if(R.left<=0)answer(null)},1000)}
function answer(o,btn){if(!R||R.lock)return;R.lock=true;clearInterval(R.tid);const q=R.qs[R.i],ok=o==q.a;
 document.querySelectorAll('[data-ans]').forEach(b=>{if(b.dataset.ans==q.a)b.classList.add('ok');else if(b==btn)b.classList.add('no');b.style.opacity=b.dataset.ans==q.a||b==btn?1:.45});
 if(ok){R.combo++;R.best=Math.max(R.best,R.combo);R.right++;if(R.left>=10)R.fast++;R.score+=Math.round((10+R.left)*(1+.1*(R.combo-1)))}else R.combo=0;
 setTimeout(()=>{R.i++;R.i<R.qs.length?ask():finish()},ok?700:1300)}
function finish(){const t=TT[L],r=R,newB=[];
 P.upd(p=>{p.pts+=r.score;p.xp+=r.score;p.games++;p.best=Math.max(p.best,r.score);const add=b=>{if(!p.badges.includes(b)){p.badges.push(b);newB.push(b)}};
  add('first');if(r.right==r.qs.length)add('perfect');if(r.fast>=5)add('speed');if(r.best>=5)add('combo');
  if(r.kind=='daily'){const y=new Date(Date.now()-864e5).toLocaleDateString('en-CA',{timeZone:'Asia/Dubai'});p.dstreak=p.day==y?p.dstreak+1:1;p.day=today();if(p.dstreak>=3)add('daily3')}
  if(lvl(p.xp)>=5)add('lvl5')});
 addStar(r.right);const p=P.cur;
 $('#p1').innerHTML=`<div style="text-align:center;margin:auto"><div style="font-size:64px;animation:pop .6s">${r.right>=r.qs.length*.8?'🏆':r.right>=r.qs.length/2?'🎉':'💪'}</div><div class="title">${t.done}</div>
 <div class="big" style="font-size:22px">⭐ ${r.score} ${t.pts} · ✅ ${r.right}/${r.qs.length} · 🔥 ${r.best}</div><div style="margin:6px 0">${newB.map(b=>`<span class="badge" style="animation:pop .5s">${BADGES[b][0]} ${BADGES[b][L=='ar'?1:2]}</span>`).join('')}</div>
 <div class="bar" style="margin:8px 20px"><div style="width:${lvlPct(p.xp)}%"></div></div><small>${t.lv} ${lvl(p.xp)}</small></div>
 <button class="btn" data-play="${r.kind=='daily'?'mixed':r.kind}" style="background:var(--r);font-size:16px">🔁 ${t.again}</button><button class="btn" data-lb="1" style="background:var(--sand);color:var(--gd)">🏅 ${t.lb}</button>`;R=null}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const S=$('#sheet');
 if(b.dataset.play)startRound(b.dataset.play);if(b.dataset.ans!==undefined)answer(b.dataset.ans,b);if(b.dataset.lb)lbScreen();if(b.dataset.swap)playerSheet();
 if(b.dataset.av){S.dataset.av=b.dataset.av;S.querySelectorAll('[data-av]').forEach(x=>x.style.background=x==b?'var(--gl)':'var(--sand)')}
 if(b.dataset.pick){localStorage.fhCur=b.dataset.pick;S.classList.remove('open');hdr();compHome()}
 if(b.id=='padd'){const n=$('#pn').value.trim();if(!n)return;addPlayer(n,S.dataset.av);S.classList.remove('open');hdr();compHome()}});
