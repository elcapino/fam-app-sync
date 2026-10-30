/* © 2026 حمد الكعبي – جميع الحقوق محفوظة */

const D=window.DASH;let L=localStorage.getItem('lang')||'ar';
const T={ar:{ttl:'لوحة <b>حمد</b>',brief:'الملخص اليومي',house:'بناء البيت',kids:'دراسة العيال',apps:'التطبيقات',spend:'المصاريف والسقوف',wait:'ينتظر قرارك',sugg:'مقترحات لك',dev:'الأجهزة',wins:'إنجازات الأسبوع',due:'واجبات',test:'اختبارات',nw:'جديد',step:'أول خطوة',src:'المصدر',reset:'يتجدد',built:'آخر بناء',done:'تم',wt:'ينتظر',nx:'التالي',td:'لاحقاً',live:'شغّال',down:'متوقف',next:'الدوام الجاي'},
en:{ttl:'Hamad <b>Board</b>',brief:'Daily brief',house:'House build',kids:'Kids study',apps:'Apps',spend:'Spend vs caps',wait:'Waiting on you',sugg:'Suggestions for you',dev:'Devices',wins:'Wins this week',due:'due',test:'tests',nw:'new',step:'First step',src:'source',reset:'resets',built:'built',done:'done',wt:'waiting',nx:'next',td:'later',live:'live',down:'down',next:'Next school day'}};
const t=k=>T[L][k],tx=o=>o&&typeof o=='object'?(o[L]??o.ar):o;
function age(s){if(!s)return 2;const h=(Date.now()-new Date(s.replace(' ','T')))/36e5;return h<12?0:h<48?1:2}
const dot=k=>`<i class="dot f${age(D.fresh[k])}" title="${D.fresh[k]||''}"></i>`;
const card=(a,k,key,body,cls='')=>`<section class="c ${cls}" style="grid-area:${a}"><h2><span class="k">//${key}</span>${t(k)}${dot(key)}</h2>${body}</section>`;
function ring(p){const r=52,c=2*Math.PI*r;return `<svg class="ring" viewBox="0 0 132 132"><circle cx="66" cy="66" r="${r}" stroke="#14303c" stroke-width="10" fill="none"/>
<circle cx="66" cy="66" r="${r}" stroke="url(#gr)" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="${c*p/100} ${c}" transform="rotate(-90 66 66)"/>
<defs><linearGradient id="gr"><stop offset="0" stop-color="#2ef2c4"/><stop offset="1" stop-color="#e2b867"/></linearGradient></defs>
<text x="66" y="72" text-anchor="middle" fill="#e8f1f2" font-size="28" font-weight="700">${p}%</text></svg>`}
function render(){document.documentElement.lang=L;document.documentElement.dir=L=='ar'?'rtl':'ltr';
document.getElementById('ttl').innerHTML=t('ttl');document.getElementById('lang').textContent=L=='ar'?'EN':'ع';
document.getElementById('built').textContent=`> ${t('built')}: ${D.built}`;
const sc={done:['done','ok'],wait:['wt','wt'],next:['nx','gd'],todo:['td','mu']};
let h='';
h+=card('brief','brief','brief',`<div class="brief"><ul>${tx(D.brief).map(x=>`<li>${x}</li>`).join('')}</ul></div>
<div class="mu" style="margin-top:6px">${t('wins')}</div><div class="heat">${D.wins.map(w=>`<i style="height:${6+w.n*3}px;opacity:${.35+w.n/10}" title="${w.d}: ${w.n}"></i>`).join('')}</div>
<div class="mu" style="font-size:11.5px;margin-top:4px;line-height:1.35">${tx(D.wins_list).join(' · ')}</div>`);
h+=card('house','house','house',`<div class="hs">${ring(D.house.pct)}<div class="falaj">${D.house.stages.map(s=>`<div class="st ${s.s}"><span>${tx(s)}</span><span class="pill ${sc[s.s][1]}">${t(sc[s.s][0])}</span></div>`).join('')}
<div class="mu mono" style="font-size:11px;margin-top:4px">agents: ${D.house.agents.design} · ${D.house.agents.eng} — ${tx(D.house.note)}</div></div></div>`);
const K=D.kids;h+=card('kids','kids','kids',K?Object.entries(K.kids).map(([k,v])=>`<div class="kid"><b>${tx((D.kn||{})[k])||k}</b>
<div class="n"><span class="pill wt">${v.due} ${t('due')}</span><span class="pill bd">${v.test} ${t('test')}</span><span class="pill ok">${v.new} ${t('nw')}</span></div>
${v.top.length?v.top.slice(0,2).map(x=>`<div class="it">› ${tx(x)}</div>`).join(''):`<div class="it">${tx(v.msg)||''}</div>`}</div>`).join('')+
`<div class="mu" style="margin-top:4px">${t('next')}: ${tx(K.next.dow)||''} ${K.next.date||''} · ${K.next.lineup||''}</div>`:'<div class="mu">—</div>');
h+=card('apps','apps','apps',D.apps.map(a=>`<div class="row" style="padding:2px 0"><span><b>${tx(a)}</b> <span class="mono mu">v${a.ver}</span></span>
<span class="pill ${a.http==200?'ok':a.http==null?'mu':'bd'}">${a.http==200?t('live'):a.http==null?'—':t('down')+' '+a.http}${a.apk_sha?' · '+a.apk_sha.slice(0,6):''}</span></div>`).join('')+
`<div class="mu" style="margin-top:3px">${t('dev')}</div><div class="dev">${D.devices.map(d=>`<span><span class="${d.on?'ok':'bd'}">●</span>${d.n.replace('LAPTOP-216GHTKJ','LAPTOP').replace('DESKTOP-ALM0UPS','DESKTOP')}</span>`).join('')}</div>`);
h+=card('spend','spend','spend',D.spend.map(s=>{const p=Math.min(100,s.v/s.cap*100);return `<div class="row" style="border:0"><span>${s.k}</span><span class="mono">$${s.v} / $${s.cap}</span></div>
<div class="bar"><i style="width:${p}%;background:${p>80?'var(--red)':p>60?'var(--amb)':'linear-gradient(90deg,var(--neo),var(--cy))'}"></i></div>`}).join('')+`<div class="mu">${t('reset')}: ${D.spend_reset}</div>`);
h+=card('wait','wait','waiting',D.waiting.map((w,i)=>`<div class="row"><span>${tx(w)}</span><span class="pill gd mono">#${i+1}</span></div>`).join(''));
h+=card('sugg','sugg','sugg',`<div class="list">${D.sugg.map(s=>`<div class="sg"><div class="t"><span class="fld">${s.f}</span>${tx(s)}</div><div class="b">${tx(s.b)}</div>
<div class="s">▸ ${t('step')}: ${tx(s.s)}</div><a href="${s.u}" target="_blank">↗ ${t('src')} · ${s.d}</a></div>`).join('')}</div>`,'sugg');
const g=document.getElementById('g');g.innerHTML=h;
const n=g.children.length,nav=document.getElementById('nav');nav.innerHTML=Array.from({length:n},()=>'<i></i>').join('');
g.scrollLeft=0;const upd=()=>{const i=Math.min(n-1,Math.round(Math.abs(g.scrollLeft)/(g.clientWidth+10)));[...nav.children].forEach((e,j)=>e.className=j==i?'on':'')};g.onscroll=upd;upd();clock()}
function clock(){const d=new Date(),lc=L=='ar'?'ar-AE':'en-GB';
document.getElementById('clk').textContent=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
const day=d.toLocaleDateString(lc,{weekday:'long'}),gr=d.toLocaleDateString(lc,{day:'numeric',month:'long',year:'numeric',calendar:'gregory',numberingSystem:'latn'}),
hj=d.toLocaleDateString(lc+'-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric',numberingSystem:'latn'});
document.getElementById('dte').textContent=`${day} · ${gr} · ${hj}`}
document.getElementById('lang').onclick=()=>{L=L=='ar'?'en':'ar';localStorage.setItem('lang',L);render()};
setInterval(clock,30000);setInterval(()=>{const b=document.getElementById('blink');b.style.opacity=b.style.opacity=='0'?'1':'0'},600);
render();
/* neural-net + sadu background */
(function(){const cv=document.getElementById('bg'),x=cv.getContext('2d');let W,H,P;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;P=Array.from({length:Math.round(W*H/26000)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}))}
function sadu(){x.save();x.globalAlpha=.07;x.strokeStyle='#e2b867';for(let i=0;i<W;i+=28){x.beginPath();x.moveTo(i,H-18);x.lineTo(i+14,H-30);x.lineTo(i+28,H-18);x.lineTo(i+14,H-6);x.closePath();x.stroke()}x.restore()}
function f(){x.clearRect(0,0,W,H);sadu();for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){x.strokeStyle=`rgba(46,242,196,${.12*(1-d/120)})`;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
x.fillStyle='rgba(56,189,248,.5)';for(const p of P){x.beginPath();x.arc(p.x,p.y,1.4,0,7);x.fill()}requestAnimationFrame(f)}
addEventListener('resize',rs);rs();f()})();
