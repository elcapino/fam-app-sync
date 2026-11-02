const D=window.HEYYA,$=s=>document.querySelector(s),A=$('#app'),H=$('#top'),N=$('#nav');
let P=JSON.parse(localStorage.getItem('heyya')||'{}');P.stars??=0;P.done??={};P.av??='⚡';P.days??=[];P.lang??='ar';
const today=new Date().toISOString().slice(0,10);if(!P.days.includes(today))P.days.push(today);
const save=()=>localStorage.setItem('heyya',JSON.stringify(P));save();
const tr=o=>trx(o);
const U={home:['الرئيسية','Home'],card:['بطاقتي','My Card'],notes:['ملاحظات','Notes'],share:['شارك','Share'],
 app:['اقرأ','IQRA'],under:['الفهم أهم من الحفظ 💡 اختر صفّك وابدأ!','Understanding beats memorising 💡 Pick your Year!'],
 stars:['نجمة','stars'],days:['يوم','days'],lvl:['مستوى','Level'],pick:['اختار مادة 👇','Pick a subject 👇'],challenge:['🎮 تحدّي الصف (5 أسئلة)','🎮 Year challenge (5 questions)'],
 exams:['📝 الاختبارات','📝 Exams'],past:['الماضي','Past'],now:['الحاضر','Now'],future:['المستقبل','Future'],
 pastd:['اللي خلصناه، راجعه','What we covered, review it'],nowd:['نتعلمه الحين','Learning this week'],futured:['اللي جاي، استعد!','Coming next, get ready!'],
 soon:['🌟 قريباً دروس هنا. استمر!','🌟 Lessons coming soon. Keep going!'],
 explain:['اشرح','Explain'],keys:['النقاط','Key points'],und:['افهمها','Understand'],game:['العب','Play'],rev:['راجع','Revise'],
 undq:['🤔 ليش يصير هذا؟ جرّب تشرحها لصديقك بكلماتك وبمثال من حياتك. إذا قدرت تشرحها، يعني فهمتها!','🤔 Why does this happen? Try explaining it to a friend in your own words with an example from your life. If you can explain it, you understand it!'],
 undk:['🎈 قول لماما أو بابا: شو تعلمت اليوم؟','🎈 Tell Mum or Dad: what did you learn today?'],
 play:['🎮 العب الكويز واجمع النجوم','🎮 Play the quiz & win stars'],tbc:['يتأكد من المدرسة','To be confirmed'],
 q:['سؤال','Question'],of:['من','of'],right:['صح! ⭐ +1','Correct! ⭐ +1'],close:['قريب! شوف الجواب الصح 👀','Close! See the right answer 👀'],
 w1:['ممتاز يا بطل! 🏆','Amazing, champion! 🏆'],w2:['شغل حلو! 🌟','Great work! 🌟'],w3:['ولا يهمك، المرة الجاية أحسن 💪','No worries, next time will be better 💪'],
 won:['ربحت','You won'],back:['↩️ رجوع','↩️ Back'],again:['🔁 مرة ثانية','🔁 Play again'],
 avatar:['اختار شخصيتك','Choose your avatar'],badges:['🏅 الأوسمة','🏅 Badges'],lessons:['درس','lessons'],
 fbh:['💡 رأيك يهمنا! اكتب ملاحظة أو فكرة. لا تكتب اسمك أو أي معلومات شخصية.','💡 Your opinion matters! Write a note or idea. Please don\'t write your name or personal info.'],
 yr:['الصف','Year'],type:['النوع','Type'],sug:['💡 اقتراح','💡 Suggestion'],bug:['⚠️ مشكلة','⚠️ Problem'],love:['❤️ شي حبيته','❤️ Something I loved'],par:['ولي أمر / معلم','Parent / Teacher'],
 ph:['اكتب هنا...','Write here...'],send:['📨 أرسل','📨 Send'],thx:['شكراً! وصلت ملاحظتك ⭐ +1','Thanks! Note received ⭐ +1'],empty:['اكتب ملاحظتك أول ✍️','Write your note first ✍️'],saved:['ملاحظات محفوظة','notes saved'],
 shp:['حبيت التطبيق؟ شاركه مع صديقك عشان تتعلمون وتلعبون مع بعض!','Love the app? Share it with a friend so you can learn and play together!'],
 shb:['💌 شارك صديقك','💌 Share with a friend'],
 copied:['انسخ ورسلها لصديقك 💌','Copied! Send it to a friend 💌'],soon2:['قريباً: كل صفوف المدرسة 🏫','Coming soon: every Year in the school 🏫'],
 tone_y8:['شرح واضح بالخطوات 🧠','Clear step-by-step 🧠'],tone_y6:['شرح بسيط بأمثلة من حياتك 🌈','Simple, with everyday examples 🌈'],tone_y1:['نلعب ونتعلم 🎈','Play and learn 🎈']};
const t=k=>U[k]?U[k][P.lang=='en'?1:0]:k;
const EX={y8:['اختبارات الفصل الأول (Years 7-10)، الجدول نزل 30 أكتوبر. Cambridge Checkpoint في نهاية Year 8.','Term 1 exams (Years 7-10), timetable published 30 Oct. Cambridge Checkpoint at the end of Year 8.'],
 y6:['اختبارات الفصل الأول (الموعد يتأكد). Cambridge Checkpoint في نهاية Year 6.','Term 1 exams (dates TBC). Cambridge Checkpoint at the end of Year 6.'],
 y1:['ما في اختبارات رسمية، تقييم مستمر باللعب.','No formal exams, ongoing assessment through play.']};
const HOB={y8:{bio:['🎮 مثل Minecraft: كل بلوك خلية، وتبني منها عالم كامل!','🎮 Like Minecraft: every block is a cell, and together they build a world!'],phy:['⚽ ركلة الكرة = طاقة حركة. كل ما ركلت أسرع زادت الطاقة أضعاف!','⚽ Kicking a ball = kinetic energy. Kick twice as fast, get four times the energy!'],chem:['🧪 الجدول الدوري مثل بطاقات اللاعبين: كل عنصر له قوى خاصة.','🧪 The periodic table is like player cards: every element has special powers.'],math:['🎯 في الألعاب: 1,248 نقطة ≈ 1.2K، هذا تقريب!','🎯 In games, 1,248 points ≈ 1.2K. That\'s rounding!'],eng:['🎧 اختار أغنيتك المفضلة ودوّر فيها على 3 أفعال مع حروف جر.','🎧 Pick a favourite song and find 3 prepositional verbs in it.'],ara:['🎬 سوّ فيديو قصير بالعربي عن هوايتك مثل اليوتيوبر.','🎬 Make a short Arabic video about your hobby, YouTuber-style.'],isl:['🤝 تحدّي الأسبوع: 3 أعمال طيبة.','🤝 Weekly challenge: 3 good deeds.'],ss:['🎨 صمّم علم الإمارات بأسلوبك أو في Minecraft!','🎨 Design the UAE flag your way, or in Minecraft!'],cs:['👾 الألعاب كلها 0 و1! اكتب عمرك بالثنائي.','👾 Every game is 0s and 1s! Write your age in binary.']},
 y6:{eng:['🎤 غنّ القصيدة على لحن تحبه، تنحفظ أسرع!','🎤 Sing the poem to a tune you like. It sticks faster!'],math:['🏀 دوّر على المثلثات في ملعب كرة السلة!','🏀 Find the triangles on a basketball court!'],phy:['🏎️ سباق السيارات: قوة المحرك ضد الاحتكاك ومقاومة الهواء.','🏎️ Car racing: engine force vs friction and air resistance.'],chem:['♻️ تحدّي: اجمع 10 قناني للتدوير هالأسبوع.','♻️ Challenge: collect 10 bottles to recycle this week.'],bio:['🌻 ازرع بذرة وصوّرها كل يوم مثل فيديو تايم لابس!','🌻 Plant a seed and photograph it daily like a time-lapse!'],cs:['💻 Scratch: إذا لمس القط الجدار يرجع، هذا اختيار!','💻 Scratch: if the cat touches the wall, it bounces. That\'s selection!'],ara:['🗣️ العب «مين أنا؟» بالعربي مع أهلك.','🗣️ Play "Who am I?" in Arabic with your family.'],isl:['❤️ اكتب رسالة شكر لأحد في البيت.','❤️ Write a thank-you note to someone at home.'],ss:['🇦🇪 لوّن العلم وعلّقه على باب غرفتك.','🇦🇪 Colour the flag and hang it on your door.']},
 y1:{eng:['🎵 غنّ أغنية الحروف وارقص!','🎵 Sing the alphabet song and dance!'],math:['✏️ عدّ ألعابك وحطها في صف!','✏️ Count your toys and line them up!'],art:['🖍️ ارسم ولوّن، كل رسمة = نجمة!','🖍️ Draw and colour: every drawing = a star!'],ara:['🎶 نشيد الحروف أ ب ت','🎶 The أ ب ت song']}};
Object.assign(HOB.y1,{eng:['🎵 ردّد الأصوات بإيقاع ثابت، الإيقاع يثبّت الذاكرة.','🎵 Repeat the sounds to a steady beat. Rhythm locks in memory.'],math:['🔢 عُدّ أي مجموعة حولك ورتّبها في صف.','🔢 Count any set of objects around you and line them up.'],art:['🎨 صمّم لوحة ألوان خاصة فيك واشرح اختيارك.','🎨 Design your own colour palette and explain your choice.'],ara:['🎶 ردّد الحروف بإيقاع وتحدَّ نفسك بالسرعة.','🎶 Recite the letters to a beat and push your speed.']});
Object.assign(HOB.y6,{eng:['🎤 حوّل القصيدة إلى إيقاع، الحفظ يصير أسرع بمرتين.','🎤 Turn the poem into a beat. It sticks twice as fast.'],cs:['💻 Scratch: إذا لمس الكائن الحافة يرجع. هذا هو الاختيار (if).','💻 Scratch: if the sprite hits the edge, it bounces. That is selection (if).'],ara:['🗣️ تحدّي «من أنا؟» بالعربي: 5 أسئلة وتعرف الجواب.','🗣️ "Who am I?" in Arabic: guess it in 5 questions.'],isl:['❤️ اكتب رسالة شكر حقيقية لشخص يستاهلها.','❤️ Write a genuine thank-you note to someone who earned it.'],ss:['🇦🇪 صمّم ملصق يوم العلم بأسلوبك الخاص.','🇦🇪 Design your own Flag Day poster.']});
const hob=(g,s)=>HOB[g]?.[s]?HOB[g][s][P.lang=='en'?1:0]:'';
Object.assign(U,{contests:['المسابقات','Contests'],dark:['الوضع الليلي','Dark mode'],
 m_explain:['اشرح','Explain'],m_ig:['إنفوجرافيك','Infographic'],m_simp:['بسّطها','Simplify'],m_det:['تفاصيل','Details'],m_hob:['هوايتي','Hobby'],m_prac:['تدرّب','Practice'],
 why:['🔍 ليش وكيف؟','🔍 Why & how?'],mist:['⚠️ خطأ شائع','⚠️ Common mistake'],xtip:['🎯 نصيحة للاختبار','🎯 Exam tip'],simph:['🌅 بكل بساطة','🌅 Simply put'],
 igsteps:['خطوة بخطوة','Step by step'],igcmp:['قارن','Compare'],igkey:['الفكرة الكبيرة','Big idea'],
 flip:['🃏 اقلب البطاقة','🃏 Flip cards'],match:['🔗 طابق','🔗 Match'],order:['🔢 رتّب','🔢 Order'],tfq:['⚡ صح/خطأ','⚡ True/False'],fill:['✍️ أكمل','✍️ Fill in'],
 tapflip:['اضغط البطاقة عشان تقلبها 👆','Tap a card to flip it 👆'],tapmatch:['اختر من اليسار ثم طابقه 👆','Pick one, then its match 👆'],taporder:['اضغط الخطوات بالترتيب الصحيح','Tap the steps in the right order'],
 nice:['رائع! ⭐ +1','Brilliant! ⭐ +1'],quizall:['🎮 كويز الدرس','🎮 Lesson quiz'],qs:['سؤال','Qs'],reveal:['👀 اكشف الجواب','👀 Reveal answer'],
 daily:['🎯 تحدّي اليوم','🎯 Daily challenge'],dailyd:['3 أسئلة · نجمة إضافية','3 questions · bonus star'],dailydone:['✅ خلّصت تحدّي اليوم! تعال بكرة','✅ Done today! Come back tomorrow'],
 flag:['يوم العلم 🇦🇪','Flag Day 🇦🇪'],nextc:['المسابقة الأسبوعية الجاية','Next weekly contest'],exam:['الاختبارات','Exams'],tbcx:['الموعد يتأكد من المدرسة','Date TBC by school'],
 c_week:['المسابقة الأسبوعية','Weekly contest'],c_weekd:['10 أسئلة من صفك','10 questions from your Year'],c_bat:['معركة المواد','Subject battle'],c_batd:['اختر مادة وتحدّاها','Pick a subject & battle it'],
 c_speed:['جولة السرعة','Speed round'],c_speedd:['60 ثانية! جاوب أكثر','60 seconds! Answer most'],c_str:['سلسلة الصح','Streak run'],c_strd:['استمر لين تغلط','Keep going till a miss'],
 c_cup:['كأس الصف','Year cup'],c_cupd:['مجموع نقاطك لكل صف','Your points per Year'],c_arena:['ساحة التدريب','Practice arena'],c_arenad:['طابق ورتّب واقلب','Match, order & flip'],
 best:['أفضل نتيجة','Best'],bests:['🏅 أفضل نتائجك (على هذا الجهاز)','🏅 Your personal bests (this device)'],trophies:['🏆 الكؤوس','🏆 Trophies'],
 nick:['لقبك (بدون اسم حقيقي)','Nickname (not your real name)'],pickyr:['اختر الصف','Pick a Year'],timeup:['⏰ خلص الوقت!','⏰ Time\'s up!'],streakend:['انتهت السلسلة!','Streak over!'],newbest:['🎉 رقم قياسي جديد!','🎉 New personal best!'],
 pts:['نقطة','pts'],d:['ي','d'],h:['س','h'],m:['د','m'],arenapick:['اختر درس للتدريب','Pick a lesson to practise']});
Object.assign(U,{school:['Merryland International School','Merryland International School'],under:['عقلك، وقتك، قرارك. افهم بعمق وتحدَّ نفسك.','Your mind. Your pace. Your call. Understand deeply, then compete.'],
 undq:['🧠 اختبر نفسك: اشرحها بجملتين بدون ما تبص. إذا قدرت، صارت لك.','🧠 Test yourself: explain it in two sentences without looking. If you can, you own it.'],
 undk:['🎯 قولها بصوتك لأهلك في دقيقة.','🎯 Say it out loud to your family in one minute.'],
 w1:['أداء احترافي. القمة لك 🏆','Elite performance. The top is yours 🏆'],w2:['قوي. خطوة أقرب للقمة ⚡','Strong. One step closer to the top ⚡'],w3:['كل محترف بدأ هنا. جولة ثانية؟ 🔥','Every pro started here. Another round? 🔥'],
 right:['إصابة ⚡ +1','Nailed it ⚡ +1'],close:['قريبة. شوف الجواب واضرب أقوى','Close. Check it and hit harder'],
 shh:['⚡ تحدَّ صديقك','⚡ Challenge a friend'],shp:['التعلم أقوى مع منافس. ارسل التطبيق لصديقك وشوف مين يوصل القمة أول.','Learning hits harder with a rival. Send it to a friend and see who reaches the top first.'],
 shb:['⚡ أرسل التحدي','⚡ Send the challenge'],sht:['اقرأ · Merryland International School ⚡ افهم دروسك بعمق، نافس، واجمع النقاط. تقدر تغلبني؟','IQRA · Merryland International School ⚡ Master your lessons, compete, rack up points. Think you can beat me?'],
 tone_y8:['مستوى متقدّم: منطق، تحليل، تحدّي','Advanced: logic, analysis, challenge'],tone_y6:['افهم الفكرة واربطها بالواقع','Get the idea, link it to real life'],tone_y1:['تعلّم سريع وممتع','Quick, fun learning'],
 simph:['الخلاصة في سطر','The one-line takeaway'],nice:['ممتاز ⚡ +1','Sharp ⚡ +1'],avatar:['رمزك','Your emblem'],
 daily:['🎯 مهمة اليوم','🎯 Today\'s mission'],dailyd:['3 أسئلة · نقطة إضافية · دقيقتين','3 questions · bonus point · 2 minutes'],
 pick:['اختر ميدانك 👇','Choose your arena 👇'],m_hob:['عالمك','Your world'],m_simp:['الخلاصة','Takeaway']});
P.best??={};P.cup??={};P.nick??='';P.dark??=0;P.daily??='';P.tro??={};
const AV0=0;const AV=['⚡','🎯','🧠','🚀','🏆','💎','🔥','🛡️','⚔️','🌌','🏎️','🎧','🧬','♟️','🛰️'];
if(!AV.includes(P.av))P.av='⚡';
function streak(){let n=0,d=new Date();while(P.days.includes(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
const level=()=>1+Math.floor(P.stars/10),lvlPct=()=>(P.stars%10)*10;
const BADGES=[['🌱',['أول نجمة','First star'],()=>P.stars>=1],['🔥',['3 أيام متتالية','3-day streak'],()=>streak()>=3],['🏅',['10 نجوم','10 stars'],()=>P.stars>=10],['🧠',['5 دروس','5 lessons'],()=>Object.keys(P.done).length>=5],['👑',['50 نجمة','50 stars'],()=>P.stars>=50],['💌',['ملاحظة مفيدة','Helpful note'],()=>P.fb>0]];
const G=id=>D.grades.find(g=>g.id==id),Sb=(g,id)=>g.subjects.find(s=>s.id==id);
const sname=s=>P.lang=='en'?s.en:s.ar;
function toast(x){const e=$('#toast');e.textContent=x;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1500)}
function confetti(){for(let i=0;i<22;i++){const c=document.createElement('div');c.className='conf';c.textContent=['⭐','🎉','✨','🏆'][i%4];c.style.left=Math.random()*100+'vw';c.style.animationDelay=Math.random()*.4+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),2200)}}
function lang(){P.lang=P.lang=='ar'?'en':'ar';save();route()}
const L1=()=>P.lang=='en'?1:0;
function head(title,back){document.documentElement.lang=P.lang;document.documentElement.dir=P.lang=='ar'?'rtl':'ltr';document.body.classList.toggle('dark',!!P.dark);
 H.innerHTML=(back?`<button class="ib" onclick="history.back()">${P.lang=='ar'?'→':'←'}</button>`:`<span style="font-size:26px">${P.av}</span>`)+`<div class="t">${title}</div>${localStorage.getItem('heyya_updated')?'<span title="updated" style="font-size:13px">🔄</span>':''}<span class="pill">⭐ ${P.stars} · Lv ${level()}</span><button class="ib" onclick="P.dark=P.dark?0:1;save();route()" aria-label="dark">${P.dark?'☀️':'🌙'}</button><button class="ib" onclick="lang()">${P.lang=='ar'?'EN':'ع'}</button>`}
function nav(on){N.innerHTML=[['home','🏠','#/'],['contests','🏆','#/c'],['card','◆','#/me'],['notes','📝','#/fb'],['share','💌','#/share']].map(([k,i,h])=>`<button class="${k==on?'on':''}" onclick="go('${h}')"><i>${k=='card'?P.av:i}</i>${t(k)}</button>`).join('')}
const crest=`<svg class="crest" viewBox="0 0 64 64"><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#e0a400"/></linearGradient></defs><path d="M32 3 58 12v18c0 16-11 26-26 31C17 56 6 46 6 30V12z" fill="url(#gg)"/><path d="M32 9 52 16v14c0 12-8 20-20 24-12-4-20-12-20-24V16z" fill="#14275e"/><path d="M32 17l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1L32 35.6l-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.2z" fill="#ffd76a"/><path d="M22 46h20" stroke="#ffd76a" stroke-width="3" stroke-linecap="round"/></svg>`;
/* time */
const FLAG=new Date('2026-11-03T11:00:00+04:00');
function nextSun(){const n=new Date(),d=new Date(n);d.setHours(20,0,0,0);d.setDate(d.getDate()+((7-d.getDay())%7));if(d<=n)d.setDate(d.getDate()+7);return d}
function cd(to){let s=Math.max(0,(to-new Date())/1e3|0);const d=s/86400|0,h=s%86400/3600|0,m=s%3600/60|0;return `<span class="cd"><span>${d}${t('d')}</span><span>${h}${t('h')}</span><span>${m}${t('m')}</span></span>`}
let TICK;function tick(f){clearInterval(TICK);TICK=setInterval(()=>{if(!document.querySelector('.cd'))return clearInterval(TICK);f()},30000)}
/* question pools */
const allQ=g=>g.subjects.flatMap(s=>s.topics.flatMap(x=>x.quiz.concat(x.xq).map(q=>({...q,s:s.id}))));
const tq=x=>x.quiz.concat(x.xq);
function seeded(arr,seed){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))|0;const a=arr.slice();for(let i=a.length-1;i>0;i--){h=(h*1103515245+12345)|0;const j=Math.abs(h)%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const shuf=a=>a.slice().sort(()=>Math.random()-.5);
function lastG(){return P.lastG||'y8'}
function home(){head(t('app'));nav('home');document.body.classList.remove('kg');const dd=P.daily==today;
 A.innerHTML=`<div class="hero">${crest}<div><h1>${t('school')}</h1><p>${t('under')}</p></div></div>
 <div class="stats"><span class="glass">⭐ ${P.stars} ${t('stars')}</span><span class="glass">🔥 ${streak()} ${t('days')}</span><span class="glass">🏆 ${t('lvl')} ${level()}</span></div>
 <button class="daily" onclick="${dd?`toast(t('dailydone'))`:`go('#/daily')`}"><i>${dd?'✅':'🎯'}</i><span>${t('daily')}<small>${dd?t('dailydone'):t('dailyd')}</small></span></button>
 <div class="strip glass">${t('flag')} ${cd(FLAG)}</div>
 <div class="grades fill">${D.grades.map(g=>{const n=g.subjects.flatMap(s=>s.topics).length,dn=g.subjects.flatMap(s=>s.topics).filter(x=>P.done[g.id+x.id]).length;return `<button class="grade" style="background:linear-gradient(135deg,${g.color},${g.color}bb)" onclick="go('#/g/${g.id}')"><span class="em">${g.id=='y1'?'✏️':g.id=='y6'?'🚀':'🔬'}</span><span><b>${g.label}</b>${g.alt} · ${P.lang=='en'?g.stage:g.stage_ar} · ${dn}/${n}</span><i class="pr" style="width:${dn/n*100}%"></i></button>`}).join('')}</div>`;
 tick(home)}
function grade(id){const g=G(id);P.lastG=id;save();head(g.label+' · '+g.alt,1);nav('home');document.body.classList.toggle('kg',id=='y1');
 A.innerHTML=`<div class="msg" style="flex:none">${t('tone_'+id)} · ${t('pick')}</div>
 <div class="grid fill" style="grid-template-columns:repeat(${g.subjects.length>4?3:2},1fr)">${g.subjects.map(s=>`<button class="sub" onclick="go('#/g/${id}/s/${s.id}')"><span class="i">${s.icon}</span>${sname(s)}${P.lang=='ar'?`<small>${s.en}</small>`:''}</button>`).join('')}</div>
 <div class="row" style="flex:none"><button class="big" onclick="go('#/x/${id}')">${t('challenge')}</button><button class="big n" style="flex:.6" onclick="go('#/c')">🏆 ${t('contests')}</button></div>
 <div class="strip glass" style="font-weight:600">${t('exams')}: ${EX[id][L1()]}</div>`}
const PH={past:'⏪',now:'⭐',future:'🚀'};
function subject(id,sid,ph,pg){const g=G(id),s=Sb(g,sid);ph=ph||'now';pg=+pg||0;head(s.icon+' '+sname(s)+' · '+g.label,1);nav('home');
 const ts=s.topics.filter(x=>x.phase==ph),per=4,np=Math.ceil(ts.length/per)||1,sl=ts.slice(pg*per,pg*per+per),h=hob(id,sid);
 A.innerHTML=`<div class="tabs glass">${Object.keys(PH).map(k=>`<button class="${k==ph?'on':''}" onclick="go('#/g/${id}/s/${sid}/${k}',1)">${PH[k]} ${t(k)}</button>`).join('')}</div>
 <div style="color:var(--mu);font-size:13px;flex:none;padding:0 4px">${t(ph+'d')}</div>
 <div class="list fill">${sl.map(x=>`<button class="topic" onclick="go('#/g/${id}/s/${sid}/t/${x.id}')"><span style="font-size:24px">${PH[ph]}</span><span>${P.lang=='en'?x.en:x.ar}<br><span class="tag due">${tq(x).length} ${t('qs')}</span>${tr(x.due)?` <span class="tag due">${tr(x.due)}</span>`:''}</span><span class="s">${P.done[id+x.id]?'✅':'▶️'}</span>${sl.length<4?`<span class="sm">⚡ ${tr(x.simp)}</span>`:''}${sl.length<=2?`<span class="pts">${x.points.slice(0,sl.length==1?4:2).map(q=>`<span>✔ ${tr(q)}</span>`).join('')}<span>⚠️ ${tr(x.mist)}</span><span>🎯 ${tr(x.examtip)}</span></span>`:''}</button>`).join('')||`<div class="panel center fill">${t('soon')}</div>`}</div>
 ${np>1?`<div class="pager"><button onclick="go('#/g/${id}/s/${sid}/${ph}/${Math.max(0,pg-1)}',1)">‹</button>${pg+1}/${np}<button onclick="go('#/g/${id}/s/${sid}/${ph}/${Math.min(np-1,pg+1)}',1)">›</button></div>`:''}
 ${h?`<div class="hob">${h}</div>`:''}`}
/* infographic */
const IGC=['#2a4aa8','#12a77a','#e0752d','#8e44ad','#d6336c','#0b7285'];
function infographic(x,s){const ig=x.ig,it=ig.items;
 const hd=`<div class="ig-h"><span class="e">${s.icon}</span><span><small style="opacity:.8;font-size:11px;display:block">${t('igkey')} · ${t(ig.kind=='steps'?'igsteps':'igcmp')}</small>${P.lang=='en'?x.en:x.ar}</span></div>`;
 const body=ig.kind=='steps'?it.map((v,k)=>`${k?`<div class="ig-ar">${P.lang=='ar'?'▼':'▼'}</div>`:''}<div class="ig-step"><span class="n" style="background:${IGC[k%6]}">${v.i}</span><span class="c"><span class="k">${k+1}</span>${tr(v)}</span></div>`).join('')
  :`<div class="ig-cmp">${it.map((v,k)=>`<div style="background:linear-gradient(160deg,${IGC[k%6]},${IGC[k%6]}cc)"><i>${v.i}</i>${tr(v)}</div>`).join('')}</div>`;
 return `<div class="ig">${hd}<div class="igb grow">${body}</div><div class="ig-f">💡 ${tr(x.simp)}</div><div class="two"><div class="kc"><b>⚠️</b>${tr(x.mist)}</div><div class="kc"><b>🎯</b>${tr(x.examtip)}</div></div></div>`}
/* lesson */
let SEC='explain',PR='flip';
const MODES=[['explain','⚡'],['ig','📊'],['simp','🎯'],['det','🔍'],['hob','🕹️'],['prac','🧩']];
function topic(id,sid,tid){const g=G(id),s=Sb(g,sid),x=s.topics.find(y=>y.id==tid);head(s.icon+' '+sname(s),1);nav('home');document.body.classList.toggle('kg',id=='y1');
 const title=P.lang=='en'?x.en:x.ar;let body;
 if(SEC=='explain')body=`<div class="blk hi">${tr(x.exp)}</div><div class="cards grow">${(x.points.length?x.points:[x.simp]).slice(0,4).map((p,k)=>`<div class="kc"><b>0${k+1}</b>${tr(p)}</div>`).join('')}</div>${tr(x.msg)?`<div class="msg">⚡ ${tr(x.msg)}</div>`:''}`;
 if(SEC=='ig')body=infographic(x,s);
 if(SEC=='simp')body=`<div class="blk hero2 grow"><small>${t('simph')}</small><h2>${tr(x.simp)}</h2></div><div class="two"><div class="kc"><b>🔍</b>${tr(x.why)}</div><div class="kc"><b>🎯</b>${tr(x.examtip)}</div></div><div class="msg">${t(id=='y1'?'undk':'undq')}</div>`;
 if(SEC=='det')body=`<div class="blk grow"><b>${t('why')}</b><p>${tr(x.why)}</p></div><div class="warn grow"><b>${t('mist')}</b><p>${tr(x.mist)}</p></div><div class="msg grow"><b>${t('xtip')}</b><p>${tr(x.examtip)}</p></div>`;
 if(SEC=='hob')body=`<div class="blk hero2 grow"><small>${t('m_hob')}</small><h2>${hob(id,sid)||tr(x.msg)}</h2></div><div class="two"><div class="kc"><b>📌</b>${tr(x.tip)||tr(x.simp)}</div><div class="kc"><b>⚠️</b>${tr(x.mist)}</div></div>`;
 if(SEC=='prac')body=practice(x);
 A.innerHTML=`<div class="panel" style="flex:none;padding:8px 13px;gap:2px"><h2>${title}</h2><div style="font-size:12px;color:var(--mu)">${P.lang=='ar'?x.en:''} ${x.tbc?`<span class="tag tbc">${t('tbc')}</span>`:''} ${tr(x.due)?`<span class="tag due">${tr(x.due)}</span>`:''}</div></div>
 <div class="tabs sm glass">${MODES.map(([k,i])=>`<button class="${k==SEC?'on':''}" onclick="go(tb()+'/${k}',1)"><i>${i}</i>${t('m_'+k)}</button>`).join('')}</div>
 <div class="panel fill" id="pb">${body}</div>
 <button class="big" onclick="go('#/q/${id}/${sid}/${tid}')">${t('quizall')} · ${tq(x).length} ${t('qs')}</button>`;
 if(SEC=='prac')wirePrac(x)}
/* practice games */
function practice(x){const ks=[['flip'],['match'],...(x.steps.length?[['order']]:[]),['tfq'],['fill']];if(!ks.some(k=>k[0]==PR))PR='flip';
 const sub=`<div class="tabs" style="padding:0">${ks.map(([k])=>`<button class="${k==PR?'on':''}" style="font-size:11.5px" onclick="go(tb()+'/prac/${k}',1)">${t(k)}</button>`).join('')}</div>`;
 let b='';
 if(PR=='flip')b=`<div style="font-size:12.5px;color:var(--mu);flex:none">${t('tapflip')}</div><div class="flips fill">${x.pairs.map(p=>`<button class="flip"><div class="in"><div class="f">${tr(p.a)}</div><div class="b">${tr(p.b)}</div></div></button>`).join('')}<button class="flip"><div class="in"><div class="f">💡 ${t('simph')}</div><div class="b">${tr(x.simp)}</div></div></button><button class="flip"><div class="in"><div class="f">⚠️ ${t('mist')}</div><div class="b">${tr(x.mist)}</div></div></button><button class="flip"><div class="in"><div class="f">🎯 ${t('xtip')}</div><div class="b">${tr(x.examtip)}</div></div></button></div>`;
 if(PR=='match'){const L=x.pairs.map((p,i)=>({i,v:tr(p.a)})),R=seeded(x.pairs.map((p,i)=>({i,v:tr(p.b)})),x.id);
  b=`<div style="font-size:12.5px;color:var(--mu);flex:none">${t('tapmatch')}</div><div class="mt fill" style="align-content:center">${L.map((l,k)=>`<button data-s="L" data-i="${l.i}">${l.v}</button><button data-s="R" data-i="${R[k].i}">${R[k].v}</button>`).join('')}</div>`}
 if(PR=='order'){const S=seeded(x.steps.map((v,i)=>({i,v:tr(v)})),x.id+'o');b=`<div style="font-size:12.5px;color:var(--mu);flex:none">${t('taporder')}</div><div class="ord fill">${S.map(v=>`<button data-i="${v.i}"><b>?</b>${v.v}</button>`).join('')}</div>`}
 if(PR=='tfq'){const q=x.xq.filter(q=>q.k=='tf');b=`<div class="ord fill" id="tfl">${q.map((q,k)=>`<div class="glass" style="padding:8px 10px;margin-bottom:6px;font-size:14px;line-height:1.5" data-a="${q.a}">${tr(q.q).replace(/^[^:]+:\s*/,'')}<div class="opts two" style="margin-top:5px"><button class="opt" style="padding:4px" data-v="0">✅</button><button class="opt" style="padding:4px" data-v="1">❌</button></div></div>`).join('')}</div>`}
 if(PR=='fill'){const src=x.points.length?x.points:[x.simp];const p=tr(src[0]),w=p.split(/\s+/).filter(z=>z.replace(/[^\p{L}\p{N}]/gu,'').length>3);const hide=w.length?w.reduce((a,b)=>b.length>a.length?b:a):'';
  b=`<div class="center fill"><div style="font-size:44px">✍️</div><h2 style="font-size:18px;line-height:1.7">${p.replace(hide,'<span id="blank" style="border-bottom:3px dashed var(--gold);padding:0 22px"> </span>')}</h2><button class="big w" style="width:auto;padding:8px 18px" onclick="$('#blank').textContent='${hide.replace(/'/g,"\\'")}';$('#blank').style.color='var(--ok)'">${t('reveal')}</button></div><div class="cards">${src.slice(1,3).map(q=>`<div class="kc"><b>✔</b>${tr(q)}</div>`).join('')||`<div class="kc"><b>🔍</b>${tr(x.why)}</div>`}</div>`}
 return sub+b}
function star1(){P.stars++;save();toast(t('nice'));head(document.querySelector('header .t').textContent,1)}
function wirePrac(x){
 A.querySelectorAll('.flip').forEach(f=>f.onclick=()=>f.classList.toggle('on'));
 let sel=null,left=x.pairs.length;A.querySelectorAll('.mt button').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;
  if(!sel||sel.dataset.s==b.dataset.s){A.querySelectorAll('.mt .sel').forEach(z=>z.classList.remove('sel'));sel=b;b.classList.add('sel');return}
  if(sel.dataset.i==b.dataset.i){sel.classList.replace('sel','done');b.classList.add('done');sel=null;if(!--left){confetti();star1()}}
  else{b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400)}});
 let nx=0;A.querySelectorAll('.ord>button').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;
  if(+b.dataset.i==nx){b.classList.add('done');b.querySelector('b').textContent=++nx;if(nx==x.steps.length){confetti();star1()}}else{b.style.animation='shake .3s';setTimeout(()=>b.style.animation='',350)}});
 let ok=0,n=0;A.querySelectorAll('#tfl>div').forEach(c=>c.querySelectorAll('.opt').forEach(o=>o.onclick=()=>{c.querySelectorAll('.opt').forEach(z=>z.disabled=1);n++;
  if(o.dataset.v==c.dataset.a){o.classList.add('ok');ok++}else{o.classList.add('no')}if(n==3&&ok==3){confetti();star1()}}))}
/* quiz engine: opts {timer:sec, streak:bool, key, best:'id', bonus} */
function quiz(list,title,o={}){let i=0,score=0,T0=Date.now(),tm;
 const fin=why=>{clearInterval(tm);P.stars+=score+(o.bonus&&score?1:0);if(o.key&&score>=Math.ceil(list.length/2))P.done[o.key]=1;if(o.daily)P.daily=today;
  let nb=false;if(o.best){if(score>(P.best[o.best]||0)){P.best[o.best]=score;nb=score>0}}if(o.g){P.cup[o.g]=(P.cup[o.g]||0)+score}save();head(title,1);if(score)confetti();
  const tot=o.timer||o.streak?score:score+'/'+list.length;
  A.innerHTML=`<div class="panel center fill"><div style="font-size:80px">${!o.timer&&!o.streak&&score==list.length?'🏆':score?'🌟':'💪'}</div>${why?`<h3>${t(why)}</h3>`:''}<h2>${nb?t('newbest'):t(score==list.length?'w1':score?'w2':'w3')}</h2><p style="font-size:20px">${t('won')} ⭐ ${tot}</p>${o.best?`<div class="msg">🏅 ${t('best')}: ${P.best[o.best]||0}</div>`:''}</div>
  <div class="row" style="flex:none"><button class="big" onclick="history.back()">${t('back')}</button><button class="big w" onclick="route()">${t('again')}</button></div>`};
 if(o.timer)tm=setInterval(()=>{const left=o.timer-(Date.now()-T0)/1e3;const b=$('#tb');if(b)b.style.width=Math.max(0,left/o.timer*100)+'%';if(left<=0)fin('timeup')},250);
 const draw=()=>{head(title,1);nav('contests');if(i>=list.length)return fin();
  const q=list[i];A.innerHTML=`${o.timer?`<div class="bar t"><i id="tb" style="width:${Math.max(0,100-(Date.now()-T0)/10/o.timer)}%"></i></div>`:`<div class="bar"><i style="width:${i/list.length*100}%"></i></div>`}<div style="color:var(--mu);font-size:13px;flex:none">${o.timer||o.streak?'':`${t('q')} ${i+1} ${t('of')} ${list.length} · `}⭐ ${score}${o.streak?' 🔥':''}</div>
  <div class="panel center fill"><div style="font-size:50px">${["🤔","🧠","🎯","🚀","⭐"][i%5]}</div><h2 style="font-size:20px">${tr(q.q)}</h2></div><div class="opts ${q.o.length==2&&q.k=='tf'?'two':''}">${q.o.map((x,k)=>`<button class="opt" data-k="${k}">${tr(x)}</button>`).join('')}</div>`;
  A.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const k=+b.dataset.k,os=A.querySelectorAll('.opt');os.forEach(y=>y.disabled=1);
   if(k==q.a){b.classList.add('ok');score++;if(!o.timer)toast(t('right'))}else{b.classList.add('no');os[q.a].classList.add('ok');if(!o.timer)toast(t('close'));if(o.streak)return setTimeout(()=>fin('streakend'),900)}
   setTimeout(()=>{i++;draw()},o.timer?450:1000)})};draw()}
/* contests */
function contests(gid){gid=gid||lastG();const g=G(gid);head('🏆 '+t('contests'),0);nav('contests');document.body.classList.remove('kg');const b=k=>P.best[k+gid]||0;
 const C=[['week','🗓️','#7b2ff7,#f107a3'],['bat','⚔️','#e0752d,#d6336c'],['speed','⏱️','#0b7285,#2a4aa8'],['str','🔥','#e5484d,#f2b705'],['cup','🏆','#b8860b,#f2b705'],['arena','🧩','#12a77a,#0b7285']];
 A.innerHTML=`<div class="tabs glass">${D.grades.map(x=>`<button class="${x.id==gid?'on':''}" onclick="P.lastG='${x.id}';save();go('#/c/${x.id}',1)">${x.label}</button>`).join('')}</div>
 <div class="glass" style="flex:none;padding:6px 10px;display:flex;flex-direction:column;gap:3px;font-size:12.5px;font-weight:700">
 <div style="display:flex;align-items:center;gap:6px">🗓️ ${t('nextc')}<span style="margin-inline-start:auto">${cd(nextSun())}</span></div>
 <div style="display:flex;align-items:center;gap:6px">${t('flag')}<span style="margin-inline-start:auto">${cd(FLAG)}</span></div>
 <div style="display:flex;align-items:center;gap:6px">📝 ${t('exam')} · ${g.label}<span class="tag tbc" style="margin-inline-start:auto">${gid=='y1'?(L1()?'No formal exams':'لا اختبارات رسمية'):t('tbcx')}</span></div></div>
 <div class="ct fill">${C.map(([k,i,c])=>`<button class="ctc" style="background:linear-gradient(135deg,${c})" onclick="go('#/c/${gid}/${k}')"><i>${i}</i>${['week','speed','str'].includes(k)?`<span class="pb">🏅 ${b(k)}</span>`:k=='cup'?`<span class="pb">${P.cup[gid]||0} ${t('pts')}</span>`:''}<span><b>${t('c_'+k)}</b><br><small>${t('c_'+k+'d')}</small></span></button>`).join('')}</div>`;
 tick(()=>contests(gid))}
function cup(gid){head('🏆 '+t('c_cup'),1);nav('contests');const tro=[['🥉',10],['🥈',30],['🥇',60],['💎',100],['👑',200]];
 A.innerHTML=`<div class="panel" style="flex:none"><b>${t('c_cup')}</b><div class="lb">${D.grades.map(g=>`<div><span style="font-size:20px">${P.av}</span>${g.label} · ${g.alt}<b>${P.cup[g.id]||0} ${t('pts')}</b></div>`).join('')}</div></div>
 <div class="panel" style="flex:none"><b>${t('bests')}</b><div class="lb">${['week','speed','str'].map(k=>`<div>${{week:'🗓️',speed:'⏱️',str:'🔥'}[k]} ${t('c_'+k)}<b>${P.best[k+gid]||0}</b></div>`).join('')}</div>
 <label>${t('nick')}</label><input id="nk" maxlength="14" value="${(P.nick||'').replace(/"/g,'')}" onchange="P.nick=this.value.replace(/[<>]/g,'');save()" placeholder="⭐ Star"></div>
 <div class="panel fill"><b>${t('trophies')}</b><div class="badges" style="grid-template-columns:repeat(5,1fr);text-align:center">${tro.map(([e,n])=>{const tot=Object.values(P.cup).reduce((a,b)=>a+b,0);return `<span class="${tot>=n?'':'off'}" style="font-size:24px">${e}<br><small style="font-size:11px">${n}</small></span>`}).join('')}</div></div>`}
function battle(gid){const g=G(gid);head('⚔️ '+t('c_bat')+' · '+g.label,1);nav('contests');
 A.innerHTML=`<div class="grid fill" style="grid-template-columns:repeat(${g.subjects.length>4?3:2},1fr)">${g.subjects.map(s=>`<button class="sub" onclick="go('#/c/${gid}/bat/${s.id}')"><span class="i">${s.icon}</span>${sname(s)}<small>${s.topics.reduce((a,x)=>a+tq(x).length,0)} ${t('qs')}</small></button>`).join('')}</div>`}
function arena(gid,pg){const g=G(gid),ts=g.subjects.flatMap(s=>s.topics.map(x=>({s,x}))),per=5;pg=+pg||0;const np=Math.ceil(ts.length/per);head('🧩 '+t('c_arena')+' · '+g.label,1);nav('contests');
 A.innerHTML=`<div style="color:var(--mu);font-size:13px;flex:none">${t('arenapick')}</div><div class="list fill">${ts.slice(pg*per,pg*per+per).map(({s,x})=>`<button class="topic" onclick="SEC='prac';PR='match';LASTT='${x.id}';go('#/g/${gid}/s/${s.id}/t/${x.id}')"><span style="font-size:22px">${s.icon}</span><span>${P.lang=='en'?x.en:x.ar}</span><span class="s">🧩</span></button>`).join('')}</div>
 <div class="pager"><button onclick="go('#/c/${gid}/arena/${Math.max(0,pg-1)}',1)">‹</button>${pg+1}/${np}<button onclick="go('#/c/${gid}/arena/${Math.min(np-1,pg+1)}',1)">›</button></div>`}
function me(){head(t('card'));nav('card');
 A.innerHTML=`<div class="panel center" style="flex:none"><div style="font-size:60px;line-height:1">${P.av}</div><h2>${t('lvl')} ${level()}</h2><div class="bar" style="width:100%"><i style="width:${lvlPct()}%"></i></div>
 <div>⭐ ${P.stars} · 🔥 ${streak()} ${t('days')} · 📚 ${Object.keys(P.done).length} ${t('lessons')}</div></div>
 <div class="panel" style="flex:none"><b>${t('avatar')}</b><div class="av">${AV.map(a=>`<button class="${a==P.av?'on':''}" onclick="P.av='${a}';save();me()">${a}</button>`).join('')}</div></div>
 <div class="panel fill"><b>${t('badges')}</b><div class="badges">${BADGES.map(b=>`<span class="${b[2]()?'':'off'}">${b[0]} ${b[1][P.lang=='en'?1:0]}</span>`).join('')}</div></div>`}
function fb(){head(t('notes'));nav('notes');const L=JSON.parse(localStorage.getItem('heyya_fb')||'[]');
 A.innerHTML=`<div class="msg" style="flex:none;font-size:14px">${t('fbh')}</div>
 <div class="panel fill"><div class="row"><div><label>${t('yr')}</label><select id="fg">${D.grades.map(g=>`<option>${g.label}</option>`).join('')}<option>${t('par')}</option></select></div>
 <div><label>${t('type')}</label><select id="ft"><option>${t('sug')}</option><option>${t('bug')}</option><option>${t('love')}</option></select></div></div>
 <textarea id="fx" maxlength="1000" placeholder="${t('ph')}"></textarea><div style="font-size:12px;color:#667">📥 ${L.length} ${t('saved')}</div></div>
 <button class="big" onclick="sendFb()">${t('send')}</button>`}
function sendFb(){const x=$('#fx').value.trim();if(!x)return toast(t('empty'));
 const L=JSON.parse(localStorage.getItem('heyya_fb')||'[]');const f={at:new Date().toISOString(),lang:P.lang,grade:$('#fg').value,type:$('#ft').value,text:x};L.push(f);localStorage.setItem('heyya_fb',JSON.stringify(L));
 P.stars++;P.fb=(P.fb||0)+1;save();if(window.HEYYA_FB_URL)fetch(window.HEYYA_FB_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)}).catch(()=>{});fb();toast(t('thx'))}
function sharePg(){head(t('share'));nav('share');
 A.innerHTML=`<div class="panel center fill"><div style="font-size:90px;line-height:1">⚔️</div><h2>${t('shh')}</h2><p>${t('shp')}</p><div class="msg" style="font-size:14px">${t('sht')}</div></div>
 <button class="big" onclick="share()">${t('shb')}</button>`}
function share(){const d={title:t('app'),text:t('sht')};navigator.share?navigator.share(d).catch(()=>{}):(navigator.clipboard?.writeText(d.text),toast(t('copied')))}
/* ===== v1.4 overrides ===== */
Object.assign(U,{rk:['الرتبة','Rank'],dyk:['💡 هل تعرف؟','💡 Did you know?'],cont:['▶ كمّل من حيث وقفت','▶ Continue where you left off'],
 combo:['كومبو','Combo'],lvup:['🚀 مستوى جديد!','🚀 Level up!'],weekly_at:['كل أحد 20:00','Every Sunday 20:00'],
 fact:['حقيقة سريعة','Quick fact'],next:['التالي ⟵','Next ⟶'],tapnext:['اضغط للحقيقة التالية','Tap for the next fact'],
 hot:['🔥 الأكثر تحدياً','🔥 Hottest challenge'],xp:['XP','XP'],toNext:['للمستوى التالي','to next level'],
 bdg_combo:['كومبو ×5','Combo ×5'],bdg_all:['مادة كاملة','Full subject'],noexam:['لا اختبارات رسمية','No formal exams']});
const RANKS=[['مبتدئ','Rookie'],['مستكشف','Explorer'],['محترف','Pro'],['خبير','Expert'],['نخبة','Elite'],['أسطورة','Legend']];
const rank=()=>RANKS[Math.min(RANKS.length-1,Math.floor((level()-1)/2))][L1()];
let CURG='';
/* fix: Arabic text with Latin units -> isolate LTR runs */
const iso=s=>P.lang=='ar'&&typeof s=='string'?s.replace(/([0-9][0-9.,]*\s?(?:[A-Za-zµΩ°%²³\/]+(?:\s?[A-Za-z²³\/]+)?)?(?:\s?[=×+\-–÷]\s?[0-9A-Za-z.,²³\/]+)*)/g,'\u2066$1\u2069'):s;
function trx(o){return iso(o==null?'':typeof o=='string'?o:(o[P.lang]||o.ar||''))}
const tb=()=>location.hash.split('/').slice(0,7).join('/');
function setLang(){P.lang=P.lang=='ar'?'en':'ar';save();route()}
function setDark(){P.dark=P.dark?0:1;save();route()}
function head(title,back){document.documentElement.lang=P.lang;document.documentElement.dir=P.lang=='ar'?'rtl':'ltr';const b=document.body;b.classList.toggle('dark',!!P.dark);
 b.classList.remove('th-y8','th-y6','th-y1');if(CURG)b.classList.add('th-'+CURG);
 H.innerHTML=(back?`<button class="ib" id="bk" onclick="history.back()">${P.lang=='ar'?'→':'←'}</button>`:`<span class="logo">${P.av}</span>`)+`<div class="t">${title}</div>${localStorage.getItem('heyya_updated')?'<span style="font-size:13px">🔄</span>':''}<span class="pill">⭐ ${P.stars} · Lv ${level()}</span><button class="ib" id="dk" onclick="setDark()">${P.dark?'☀️':'🌙'}</button><button class="ib" id="lg" onclick="setLang()">${P.lang=='ar'?'EN':'ع'}</button>`}
function nav(on){N.innerHTML=[['home','🏠','#/'],['contests','🏆','#/c'],['card','⚡','#/me']].map(([k,i,h])=>`<button class="${k==on?'on':''}" onclick="go('${h}')"><i>${k=='card'?P.av:i}</i>${t(k)}</button>`).join('')}
function facts(g){return g.subjects.flatMap(s=>s.topics.map(x=>({s,x})))}
let FI=0;
function home(){CURG='';head(t('app'));nav('home');document.body.classList.remove('kg');const dd=P.daily==today;
 const allT=D.grades.flatMap(g=>facts(g).map(o=>({...o,g}))),f=allT[(FI+new Date().getDate())%allT.length];
 const last=P.lastT&&allT.find(o=>o.g.id+o.x.id==P.lastT);
 A.innerHTML=`<div class="hero">${crest}<div><h1>Merryland International School</h1></div><div class="hx"><b>${rank()}</b><small>Lv ${level()}</small></div></div>
 <div class="stats"><span class="glass">⭐ ${P.stars} ${t('stars')}</span><span class="glass">🔥 ${streak()} ${t('days')}</span><span class="glass">🎯 ${Object.keys(P.done).length} ${t('lessons')}</span></div>
 <div class="row" style="flex:none"><button class="daily" onclick="${dd?`toast(t('dailydone'))`:`go('#/daily')`}"><i>${dd?'✅':'🎯'}</i><span>${t('daily')}<small>${dd?t('dailydone'):t('dailyd')}</small></span></button></div>
 <button class="factc" onclick="FI++;home()"><span class="fl">${t('dyk')} · ${f.g.label} ${f.s.icon}</span><span class="ft">${trx(f.x.simp)}</span><small>${t('tapnext')} ↻</small></button>
 ${last?`<button class="topic" style="flex:none" onclick="go('#/g/${last.g.id}/s/${last.s.id}/t/${last.x.id}')"><span style="font-size:22px">${last.s.icon}</span><span>${t('cont')}<br><small style="color:var(--mu)">${P.lang=='en'?last.x.en:last.x.ar}</small></span><span class="s">▶️</span></button>`:''}
 ${newsCard()}<div class="grades fill">${D.grades.map(g=>{const ts=facts(g),dn=ts.filter(o=>P.done[g.id+o.x.id]).length;return `<button class="grade gy-${g.id}" onclick="go('#/g/${g.id}')"><span class="em">${g.id=='y1'?'✏️':g.id=='y6'?'🚀':'🔬'}</span><span><b>${g.label}</b>${g.alt} · ${P.lang=='en'?g.stage:g.stage_ar} · ${dn}/${ts.length}</span><i class="pr" style="width:${dn/ts.length*100}%"></i></button>`}).join('')}</div>`+hmk()}
const BADGES2=[['🌱',['أول نجمة','First star'],()=>P.stars>=1],['🔥',['3 أيام متتالية','3-day streak'],()=>streak()>=3],['🏅',['10 نجوم','10 stars'],()=>P.stars>=10],['🧠',['5 دروس','5 lessons'],()=>Object.keys(P.done).length>=5],['💥',['كومبو ×5','Combo ×5'],()=>(P.maxCombo||0)>=5],['👑',['50 نجمة','50 stars'],()=>P.stars>=50]];
function me(){CURG='';head(t('card'));nav('card');
 A.innerHTML=`<div class="panel center" style="flex:none"><div style="font-size:54px;line-height:1">${P.av}</div><h2>${rank()} · ${t('lvl')} ${level()}</h2><div class="bar" style="width:100%"><i style="width:${lvlPct()}%"></i></div>
 <div style="font-size:13px">${10-P.stars%10} ⭐ ${t('toNext')} · 🔥 ${streak()} ${t('days')} · 💥 ${P.maxCombo||0}</div></div>
 <div class="panel" style="flex:none"><b>${t('avatar')}</b><div class="av">${AV.map(a=>`<button class="${a==P.av?'on':''}" onclick="P.av='${a}';save();me()">${a}</button>`).join('')}</div></div>
 <div class="panel fill"><b>${t('badges')}</b><div class="badges grow" style="grid-auto-rows:1fr">${BADGES2.map(b=>`<span class="${b[2]()?'':'off'}">${b[0]} ${b[1][L1()]}</span>`).join('')}</div>
 <div class="lb">${D.grades.map(g=>`<div>${g.label}<b>${P.cup[g.id]||0} ${t('pts')}</b></div>`).join('')}</div></div>`+`<button class="topic" style="flex:none" onclick="go('#/about')"><span style="font-size:20px">ℹ️</span><span>${t('about')}<br><small style="color:var(--mu)">IQRA · اقرأ · © HMK</small></span><span class="s">›</span></button>`}
function burst(el,ch){const r=el.getBoundingClientRect();for(let i=0;i<8;i++){const c=document.createElement('div');c.className='spark';c.textContent=ch;c.style.left=r.left+r.width/2+'px';c.style.top=r.top+r.height/2+'px';c.style.setProperty('--dx',(Math.random()*160-80)+'px');c.style.setProperty('--dy',(Math.random()*-120-20)+'px');document.body.appendChild(c);setTimeout(()=>c.remove(),800)}}
function quiz(list,title,o={}){let i=0,score=0,combo=0,T0=Date.now(),tm;const lv0=level();
 const fin=why=>{clearInterval(tm);P.stars+=score+(o.bonus&&score?1:0);if(o.key&&score>=Math.ceil(list.length/2))P.done[o.key]=1;if(o.daily)P.daily=today;
  let nb=false;if(o.best&&score>(P.best[o.best]||0)){P.best[o.best]=score;nb=score>0}if(o.g)P.cup[o.g]=(P.cup[o.g]||0)+score;save();head(title,1);if(score)confetti();
  const up=level()>lv0,pct=list.length?score/list.length:0,tot=o.timer||o.streak?score:score+'/'+list.length;
  A.innerHTML=`<div class="panel center fill res"><div class="medal">${o.timer||o.streak?'⚡':pct==1?'🏆':pct>=.7?'🥇':pct>=.4?'🥈':'🔥'}</div>${why?`<h3>${t(why)}</h3>`:''}${up?`<div class="lvup">${t('lvup')} Lv ${level()}</div>`:''}<h2>${nb?t('newbest'):t(pct==1?'w1':score?'w2':'w3')}</h2>
  <div class="rs"><span><b>${tot}</b>${t('won')} ⭐</span><span><b>${P.maxCombo||0}</b>${t('combo')} 💥</span>${o.best?`<span><b>${P.best[o.best]||0}</b>${t('best')} 🏅</span>`:`<span><b>${rank()}</b>${t('rk')}</span>`}</div></div>
  <div class="row" style="flex:none"><button class="big" onclick="history.back()">${t('back')}</button><button class="big w" onclick="route()">${t('again')}</button></div>`};
 if(o.timer)tm=setInterval(()=>{const left=o.timer-(Date.now()-T0)/1e3;const b=$('#tb');if(b)b.style.width=Math.max(0,left/o.timer*100)+'%';const n=$('#tl');if(n)n.textContent=Math.ceil(Math.max(0,left))+'s';if(left<=0)fin('timeup')},250);
 const draw=()=>{head(title,1);nav('contests');if(i>=list.length)return fin();
  const q=list[i];A.innerHTML=`${o.timer?`<div class="bar t"><i id="tb" style="width:${Math.max(0,100-(Date.now()-T0)/10/o.timer)}%"></i></div>`:`<div class="bar"><i style="width:${i/list.length*100}%"></i></div>`}
  <div class="qmeta"><span>${o.timer?`⏱ <b id="tl">${Math.ceil(o.timer-(Date.now()-T0)/1e3)}s</b>`:o.streak?'🔥':`${t('q')} ${i+1}/${list.length}`}</span><span>⭐ ${score}</span><span class="cb ${combo>=2?'on':''}">💥 ×${combo}</span></div>
  <div class="panel center fill qc"><div class="qe">${["🧠","🎯","⚡","🚀","💎"][i%5]}</div><h2 style="font-size:20px">${trx(q.q)}</h2></div><div class="opts ${q.o.length==2&&q.k=='tf'?'two':''}">${q.o.map((x,k)=>`<button class="opt" data-k="${k}"><span class="ol">${'ABCD'[k]}</span>${trx(x)}</button>`).join('')}</div>`;
  A.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const k=+b.dataset.k,os=A.querySelectorAll('.opt');os.forEach(y=>y.disabled=1);
   if(k==q.a){b.classList.add('ok');score++;combo++;P.maxCombo=Math.max(P.maxCombo||0,combo);burst(b,combo>=3?'💥':'⭐');navigator.vibrate?.(30);if(!o.timer)toast(combo>=3?`💥 ${t('combo')} ×${combo}!`:t('right'))}
   else{combo=0;b.classList.add('no');os[q.a].classList.add('ok');navigator.vibrate?.([60,40,60]);if(!o.timer)toast(t('close'));if(o.streak)return setTimeout(()=>fin('streakend'),900)}
   setTimeout(()=>{i++;draw()},o.timer?450:1000)})};draw()}
function contests(gid){gid=gid||lastG();CURG=gid;const g=G(gid);head('🏆 '+t('contests'),0);nav('contests');document.body.classList.remove('kg');const b=k=>P.best[k+gid]||0;
 const C=[['week','🗓️'],['bat','⚔️'],['speed','⏱️'],['str','🔥'],['cup','🏆'],['arena','🧩']];
 A.innerHTML=`<div class="tabs glass">${D.grades.map(x=>`<button class="${x.id==gid?'on':''}" onclick="P.lastG='${x.id}';save();go('#/c/${x.id}',1)">${x.label}</button>`).join('')}</div>
 <div class="glass" style="flex:none;padding:7px 11px;display:flex;gap:8px;font-size:12.5px;font-weight:700;align-items:center">🗓️ ${t('c_week')}: ${t('weekly_at')}<span class="tag tbc" style="margin-inline-start:auto">📝 ${gid=='y1'?t('noexam'):t('tbcx')}</span></div>
 <div class="ct fill">${C.map(([k,i],n)=>`<button class="ctc c${n}" onclick="go('#/c/${gid}/${k}')"><i>${i}</i>${['week','speed','str'].includes(k)?`<span class="pb">🏅 ${b(k)}</span>`:k=='cup'?`<span class="pb">${P.cup[gid]||0} ${t('pts')}</span>`:''}<span><b>${t('c_'+k)}</b><br><small>${t('c_'+k+'d')}</small></span></button>`).join('')}</div>`}
function cup(gid){CURG=gid;head('🏆 '+t('c_cup'),1);nav('contests');const tro=[['🥉',10],['🥈',30],['🥇',60],['💎',100],['👑',200]],tot=Object.values(P.cup).reduce((a,b)=>a+b,0);
 A.innerHTML=`<div class="panel" style="flex:none"><b>${t('c_cup')}</b><div class="lb">${D.grades.map(g=>`<div><span>${P.av}</span>${g.label} · ${g.alt}<b>${P.cup[g.id]||0} ${t('pts')}</b></div>`).join('')}</div></div>
 <div class="panel" style="flex:none"><b>${t('bests')}</b><div class="lb">${['week','speed','str'].map(k=>`<div>${{week:'🗓️',speed:'⏱️',str:'🔥'}[k]} ${t('c_'+k)}<b>${P.best[k+gid]||0}</b></div>`).join('')}</div>
 <label>${t('nick')}</label><input id="nk" maxlength="14" value="${(P.nick||'').replace(/"/g,'')}" onchange="P.nick=this.value.replace(/[<>]/g,'');save()" placeholder="⭐"></div>
 <div class="panel fill" style="gap:4px"><b>${t('trophies')}</b><div class="badges grow" style="grid-template-columns:repeat(5,1fr);text-align:center;grid-auto-rows:1fr">${tro.map(([e,n])=>`<span class="${tot>=n?'':'off'}" style="font-size:22px;display:flex;flex-direction:column;justify-content:center;padding:2px">${e}<small style="font-size:11px">${n}</small></span>`).join('')}</div></div>`}
function go(h,rep){rep?location.replace(h):location.hash=h}
let LASTT='';
function route(){clearInterval(TICK);{const q=location.hash.slice(2).split('/');CURG=['g','q','x','c'].includes(q[0])&&G(q[1])?q[1]:q[0]=='daily'?lastG():''}document.querySelectorAll('.conf').forEach(c=>c.remove());const p=location.hash.slice(2).split('/');
 if(p[0]=='g'&&p[4]=='t'){P.lastT=p[1]+p[5];save();if(LASTT!=p[5]){SEC='explain';PR='flip';LASTT=p[5]}SEC=p[6]||SEC;if(p[7])PR=p[7];return topic(p[1],p[3],p[5])}
 if(p[0]=='g'&&p[2]=='s')return subject(p[1],p[3],p[4],p[5]);if(p[0]=='g')return grade(p[1]);
 if(p[0]=='me')return me();if(p[0]=='about')return about();if(p[0]=='news')return news(p[1]);
 if(p[0]=='q'){const g=G(p[1]),x=Sb(g,p[2]).topics.find(y=>y.id==p[3]);return quiz(shuf(tq(x)),'🎮 '+(P.lang=='en'?x.en:x.ar),{key:p[1]+x.id,g:p[1]})}
 if(p[0]=='x'){const g=G(p[1]);return quiz(shuf(allQ(g)).slice(0,5),'🎮 '+g.label,{g:p[1]})}
 if(p[0]=='daily'){const g=G(lastG());return quiz(seeded(allQ(g),today).slice(0,3),t('daily')+' · '+g.label,{daily:1,bonus:1,g:g.id})}
 if(p[0]=='c'){const gid=p[1]||lastG(),g=G(gid),k=p[2];
  if(k=='week'){const wk=nextSun().toISOString().slice(0,10);return quiz(seeded(allQ(g),wk+gid).slice(0,10),'🗓️ '+t('c_week'),{best:'week'+gid,g:gid})}
  if(k=='speed')return quiz(shuf(allQ(g)),'⏱️ '+t('c_speed'),{timer:60,best:'speed'+gid,g:gid});
  if(k=='str')return quiz(shuf(allQ(g)),'🔥 '+t('c_str'),{streak:1,best:'str'+gid,g:gid});
  if(k=='cup')return cup(gid);if(k=='arena')return arena(gid,p[3]);
  if(k=='bat'&&p[3]){const s=Sb(g,p[3]);return quiz(shuf(s.topics.flatMap(tq)).slice(0,8),'⚔️ '+sname(s),{best:'bat'+gid+s.id,g:gid})}
  if(k=='bat')return battle(gid);return contests(gid)}
 home()}


/* v1.5 IQRA · © HMK */
Object.assign(U,{about:['عن اقرأ','About IQRA'],news:['من الصف اليوم','From class today'],newsd:['تحديثات دروس صفك من المدرسة','Your class lesson updates from school'],
 nonews:['لا تحديثات جديدة لهذا الصف اليوم — راجع درساً أو خض تحدياً ⚡','No new updates for this class today — revise a lesson or take a challenge ⚡'],
 go_s:['افتح المادة','Open subject'],synced:['آخر مزامنة','Last sync'],
 ab1:['اقرأ — منصة مذاكرة ذكية لطلاب Merryland International School: دروس الماضي والآن والقادم، شرح بأكثر من طريقة، تحديات ومسابقات.','IQRA — a smart study space for Merryland International School students: past, current and upcoming lessons, several ways to explain each idea, challenges and contests.'],
 ab2:['تتحدّث تلقائياً كل يوم مع دروس الصفوف. لا حسابات، لا كلمة مرور، ولا تُجمع أي بيانات شخصية — تقدّمك محفوظ على جهازك فقط.','Updates itself daily with class lessons. No accounts, no password, and no personal data collected — your progress stays on your device only.'],
 ab3:['جميع الحقوق محفوظة','All rights reserved'],
 k_tip:{'🎯':['ركّز: هذا ما سيأتي في الامتحان','Focus: this is what the exam covers'],'🏆':['جهّز نفسك وشارك بثقة','Get ready and take part with confidence'],'🗓️':['اطّلع على خطة أسبوعك','Check your week plan'],'🏠':['أنجزه اليوم قبل أن يتراكم','Finish it today before it piles up'],'🔤':['احفظ 5 كلمات الآن','Learn 5 words now'],'📝':['حلّها ثم قارن بمفتاح الإجابة','Solve it, then check the answer key'],'📊':['راجع الشرح ثم اختبر نفسك','Review the notes, then test yourself'],'📌':['اطّلع عليه','Take a look']}});
function hmk(){return `<button class="hmk" dir="ltr" onclick="go('#/about')"><bdi>IQRA</bdi> · <bdi>اقرأ</bdi> · <bdi>© ${new Date().getFullYear()} HMK</bdi></button>`}
function newsAll(){const n=D.news||{};return D.grades.flatMap(g=>(n[g.id]||[]).map(x=>({...x,G:g})))}
function newsCard(){const a=newsAll();if(!a.length)return '';const x=a[0],s=Sb(x.G,x.sid);
 return `<button class="topic news" style="flex:none" onclick="go('#/news/${x.g}')"><span style="font-size:22px">📌</span><span>${t('news')} · ${a.length}<br><small style="color:var(--mu)">${x.G.label} ${s?s.icon:''} ${trx(x.t)}</small></span><span class="s">›</span></button>`}
function news(gid){const n=D.news||{};gid=G(gid)?gid:(D.grades.find(g=>(n[g.id]||[]).length)||D.grades[0]).id;CURG=gid;head(t('news'),1);nav('home');const g=G(gid),L=(n[gid]||[]).slice(0,6);
 A.innerHTML=`<div class="tabs" style="flex:none">${D.grades.map(x=>`<button class="${x.id==gid?'on':''}" onclick="go('#/news/${x.id}',1)">${x.label} · ${(n[x.id]||[]).length}</button>`).join('')}</div>
 <div class="panel fill"><b>${t('newsd')}</b><div class="cards grow" style="grid-auto-rows:1fr">${L.length?L.map(x=>{const s=Sb(g,x.sid);const tip=U.k_tip[x.k]||U.k_tip['📌'];return `<button class="nw" onclick="go('#/g/${gid}/s/${x.sid}')"><b>${x.k} ${s?s.icon+' '+sname(s):''} · ${P.lang=='en'?x.ken:x.kar} · ${x.d.slice(5)}</b><span>${trx(x.t)}</span><small style="color:var(--mu)">${tip[L1()]} ›</small></button>`}).join(''):`<div class="kc">${t('nonews')}</div>`}</div>
 <small style="color:var(--mu)">${t('synced')}: <span dir="ltr">${(D.news_synced||'').replace('T',' ')} · © HMK</span></small></div>`}
function about(){CURG='';head(t('about'),1);nav('card');
 A.innerHTML=`<div class="panel center fill"><div style="font-size:46px;line-height:1;font-weight:800;letter-spacing:2px">IQRA</div><h2 style="margin:0">اقرأ</h2>
 <p>${t('ab1')}</p><p>${t('ab2')}</p><div class="lb"><div>Version<b>1.5</b></div><div>${t('synced')}<b>${(D.news_synced||'—').slice(0,10)}</b></div></div>
 <h3 dir="ltr" style="margin:6px 0 0">© ${new Date().getFullYear()} HMK</h3><small>${t('ab3')} · IQRA™ / اقرأ</small></div>`}

addEventListener('hashchange',route);route();
