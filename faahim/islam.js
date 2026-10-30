// «ديني – Islam» v1.4 (Hamad's decision): NO own-written Islamic explanations, stories, timelines, glossary, hadith or quiz.
// Only: topic name + verbatim Quran ayah (quran.js, Tanzil quran-simple) with surah:ayah + a button that opens https://qaf.ai/ in the external browser.
// qaf.ai has no documented prefilled-query URL (checked 2026-10-30), so we open the home page and copy the question to the clipboard. No automated queries.
// Never depict the Prophet ﷺ, Sahaba, prophets or angels.
const ISLAM={
tawheed:{icon:'☝️',ayah:'112:1-4',ar:{title:'التوحيد',ask:'ما معنى التوحيد؟ اشرحه لطفل'},en:{title:'Tawheed',ask:'What is Tawheed? Explain it for a child'}},
seerah:{icon:'🕋',ayah:'33:21',ar:{title:'السيرة النبوية',ask:'حدثني عن السيرة النبوية بأسلوب مبسط لطفل'},en:{title:'Seerah',ask:'Tell me about the Seerah of the Prophet ﷺ simply for a child'}},
sahaba:{icon:'🌴',ayah:'9:100',ar:{title:'الصحابة',ask:'من هم الصحابة رضي الله عنهم؟ اشرح لطفل'},en:{title:'The Sahaba',ask:'Who were the Sahaba? Explain for a child'}},
quran:{icon:'📖',ayah:'15:9',ar:{title:'القرآن الكريم',ask:'ما هو القرآن الكريم؟ اشرح لطفل'},en:{title:'The Holy Quran',ask:'What is the Holy Quran? Explain for a child'}},
sunnah:{icon:'🤲',ayah:'4:80',ar:{title:'السنة النبوية',ask:'ما هي السنة النبوية؟ اشرح لطفل'},en:{title:'The Sunnah',ask:'What is the Sunnah? Explain for a child'}}};
function openIslam(k){const I=ISLAM[k],d=I[L],q=QURAN[I.ayah];D=null;$('#tabs').innerHTML='';$('#p2').style.display='none';$('#main').classList.remove('split');
 $('#p1').innerHTML=`<div class="title">${I.icon} ${d.title}</div>
 <div class="ayah" style="flex:1;display:flex;flex-direction:column;justify-content:center"><div dir="rtl" lang="ar" style="font-size:clamp(20px,3.2vh,28px);line-height:2">﴿ ${q.text} ﴾</div><div class="src" style="font-size:14px;font-weight:800">📖 ${q.surah} · ${q.en} · ${I.ayah}</div></div>
 <button class="btn" data-qaf="${k}" style="font-size:clamp(18px,2.6vh,22px);padding:14px;background:linear-gradient(135deg,#0a9a4c,#05502b);border:3px solid #C9962B">اسأل قاف 📖 / Ask Qaf</button>
 <div class="src" id="qafmsg">${L=='ar'?'يفتح موقع قاف في المتصفح، وننسخ سؤالك لتلصقه هناك:':'Opens qaf.ai in your browser; we copy your question so you can paste it there:'} «${d.ask}»</div>
 <div class="src">${L=='ar'?'نص القرآن حرفياً من Tanzil (quran-simple). «فاهم» لا يكتب شروحات دينية.':'Quran text verbatim from Tanzil (quran-simple). Faahim writes no religious explanations of its own.'}</div>`;
 const s=new Set(JSON.parse(localStorage.fhIslOpen||'[]'));s.add(k);localStorage.fhIslOpen=JSON.stringify([...s]);
 if(s.size>=3&&typeof P!='undefined')P.upd(p=>{if(!p.badges.includes('islam'))p.badges.push('islam')});addStar(1)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-isl],[data-qaf]');if(!b)return;e.preventDefault();
 if(b.dataset.isl)return openIslam(b.dataset.isl);
 const t=ISLAM[b.dataset.qaf][L].ask;try{navigator.clipboard&&navigator.clipboard.writeText(t)}catch(_){}
 window.open('https://qaf.ai/','_blank');const m=$('#qafmsg');if(m)m.textContent=(L=='ar'?'✅ تم نسخ السؤال – الصقه في قاف: ':'✅ Question copied – paste it in Qaf: ')+'«'+t+'»'});
