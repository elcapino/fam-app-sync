// فاهم – app shell: header (date, Hijri, prayer times), navigation, About, deep links.
let NAV='home';
const fmt=(d,o)=>new Intl.DateTimeFormat((L=='ar'?'ar-AE':'en-GB')+'-u-nu-latn',{timeZone:'Asia/Dubai',...o}).format(d);
function hdr(){const now=new Date();let hij='';try{hij=new Intl.DateTimeFormat((L=='ar'?'ar-SA':'en-GB')+'-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Dubai'}).format(now)}catch(e){}
 $('#date').innerHTML=`<span>📅 ${fmt(now,{weekday:'long'})}</span><span>·</span><span>${fmt(now,{day:'numeric',month:'long',year:'numeric'})}</span><span>·</span><span>🌙 ${hij}</span>`;
 const p=typeof P!='undefined'&&P.cur;$('#me').textContent=p?p.av:'👤';}
function about(){D=null;$('#tabs').innerHTML='';$('#main').classList.toggle('split',innerWidth>=700);const ar=L=='ar',wide=innerWidth>=700;
 const A=`<div style="text-align:center"><img src="logo.svg" style="width:56px;border-radius:20px;box-shadow:0 6px 16px #0003;animation:float 4s infinite"><div class="title" style="font-size:24px">${ar?'فاهم':'Faahim'} <small style="font-size:12px;color:#8a7a5a">v1.2</small></div>
 <div class="big" style="font-size:15px">${ar?'تعلّم أي موضوع ببساطة: شرح، رسمة، قصة، تاريخ، ومسابقات للعائلة.':'Learn any topic simply: explanation, visual, story, history and family contests.'}</div></div>
 <div style="background:#fff;border-radius:16px;padding:10px;text-align:center;font-weight:800;border:2px solid var(--gold)">© 2026 حمد الكعبي – جميع الحقوق محفوظة<br><span dir="ltr">© 2026 Hamad Al Kaabi – All rights reserved</span></div>
 <div class="src" style="font-size:11px">${ar?'🔒 لا حسابات ولا بيانات شخصية تُرسل. النقاط واللاعبون محفوظة على الجهاز فقط.':'🔒 No accounts, no personal data sent. Players & points stay on this device.'}</div>`;
 const S=`<div class="title" style="font-size:16px">📚 ${ar?'المصادر والتراخيص':'Sources & licences'}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px;font-weight:700;line-height:1.3">${[
 ['📖','Quran text: Tanzil (quran-simple), verbatim'],['🇦🇪','OpenAlex UAE universities · CC0'],['🇦🇪','Bayanat.ae · CC BY 4.0'],['🇦🇪',ar?'روابط فقط: مدرسة، مكتبة محمد بن راشد، UAEU، ZU، مركز أبوظبي للغة العربية، وزارة التربية، متحف المستقبل، u.ae، HBMSU':'Links only: Madrasa, MBRL, UAEU, ZU, ALC, MoE, Museum of the Future, u.ae, HBMSU'],['📖','qaf.ai · link only (Ask Qaf)'],['🌐','Wikipedia / Simple Wikipedia · CC BY-SA 4.0'],['📗','OpenStax · CC BY 4.0 (links)'],['📘','Open Library · CC0'],['📜','Project Gutenberg · public domain'],['🛰️','NASA images · public domain'],['🎓','OpenAlex · CC0'],['🔤','Cairo font · SIL OFL 1.1'],['🎥','Khan Academy / YouTube · links only'],['🕌',ar?'قسم الدين: آيات حرفية فقط + «اسأل قاف»':'Islam: verbatim ayat only + Ask Qaf']].map(([i,s])=>`<div style="background:var(--sand);border-radius:9px;padding:3px 5px">${i} ${s}</div>`).join('')}</div>`;
 if(wide){$('#p1').innerHTML=A;$('#p2').style.display='flex';$('#p2').innerHTML=S}else{$('#p2').style.display='none';$('#p1').innerHTML=A+S}}
function go(n){NAV=n;document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('act',b.dataset.nav==n));$('#sheet').classList.remove('open');
 if(n=='home')home();if(n=='comp')compHome();if(n=='news')news();if(n=='about')about()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.nav)go(b.dataset.nav);
if(b.id=='me')go('comp')});
setInterval(hdr,60000);
// init + deep links for tests: #lang=en&nav=comp&demo=ai&tab=info&q=Volcano&play=daily&seed=1
(()=>{const h=new URLSearchParams(location.hash.slice(1));if(h.get('lang'))L=h.get('lang');
 if(h.get('seed')&&!P.list.length){[['سالم','🦅',420],['مريم','🐎',380],['حمد','🐪',260],['نورة','🦌',150]].forEach(([n,a])=>addPlayer(n,a));const l=P.list;l.forEach((p,i)=>{p.pts=p.xp=[420,380,260,150][i];p.badges=['first','combo','speed','daily3'].slice(0,4-i);p.dstreak=4-i});P.save(l);localStorage.fhCur=l[0].id}
 tr();hdr();go(h.get('nav')||'home');if(h.get('sect'))section(+h.get('sect'));if(h.get('demo')){openDemo(h.get('demo'));if(h.get('tab')){TAB=h.get('tab');render()}}
 if(h.get('q'))search(h.get('q')).then(()=>{if(h.get('tab')){TAB=h.get('tab');render()}});
 if(h.get('play')){startRound(h.get('play'));if(h.get('ansd'))setTimeout(()=>{const q=R.qs[0];answer(q.a,[...document.querySelectorAll('[data-ans]')].find(b=>b.dataset.ans==q.a))},2500)}
 if(h.get('lb'))lbScreen();})();
