
(function(G){
const D2R=Math.PI/180,R2D=180/Math.PI,sin=d=>Math.sin(d*D2R),cos=d=>Math.cos(d*D2R),tan=d=>Math.tan(d*D2R),
 asin=x=>R2D*Math.asin(x),acos=x=>R2D*Math.acos(Math.max(-1,Math.min(1,x))),atan2=(y,x)=>R2D*Math.atan2(y,x),acot=x=>R2D*Math.atan(1/x),
 fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};
const CITIES={abudhabi:{ar:"أبوظبي",en:"Abu Dhabi",lat:24.4539,lng:54.3773,tz:4},alain:{ar:"العين",en:"Al Ain",lat:24.2075,lng:55.7447,tz:4}};
const METHOD={fajr:18.2,isha:18.2,asr:1,
 // minute offsets ("ihtiyat") applied after astronomical calc; tuned to UAE published times
 adj:{fajr:0,sunrise:0,dhuhr:3,asr:0,maghrib:3,isha:0}};
function julian(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function sunPos(jd){const D=jd-2451545,g=fix(357.529+.98560028*D,360),q=fix(280.459+.98564736*D,360),L=fix(q+1.915*sin(g)+.020*sin(2*g),360),e=23.439-.00000036*D,
 RA=fix(atan2(cos(e)*sin(L),cos(L))/15,24),decl=asin(sin(e)*sin(L)),eqt=q/15-RA;return{decl,eqt}}
function compute(date,cityKey){const c=CITIES[cityKey]||CITIES.abudhabi,y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate(),
 jd=julian(y,m,d)-c.lng/(15*24);
 const midDay=t=>{const e=sunPos(jd+t).eqt;return fix(12-e,24)},
 angleT=(a,t,ccw)=>{const s=sunPos(jd+t).decl,n=midDay(t),v=acos((-sin(a)-sin(s)*sin(c.lat))/(cos(s)*cos(c.lat)))/15;return n+(ccw?-v:v)},
 asrT=(f,t)=>{const s=sunPos(jd+t).decl,a=-acot(f+tan(Math.abs(c.lat-s)));return angleT(a,t)};
 let T={fajr:5,sunrise:6,dhuhr:12,asr:13,maghrib:18,isha:18};
 for(let i=0;i<2;i++){const p={};for(const k in T)p[k]=T[k]/24;
  T={fajr:angleT(METHOD.fajr,p.fajr,1),sunrise:angleT(.833,p.sunrise,1),dhuhr:midDay(p.dhuhr),asr:asrT(METHOD.asr,p.asr),maghrib:angleT(.833,p.maghrib),isha:angleT(METHOD.isha,p.isha)}}
 const out={};for(const k in T){const h=T[k]+c.tz-c.lng/15,min=Math.round(h*60)+(METHOD.adj[k]||0);out[k]=new Date(y,m-1,d,0,min,0)}return out}
const ORDER=["fajr","sunrise","dhuhr","asr","maghrib","isha"],PRAYERS=["fajr","dhuhr","asr","maghrib","isha"];
const NAMES={ar:{fajr:"الفجر",sunrise:"الشروق",dhuhr:"الظهر",asr:"العصر",maghrib:"المغرب",isha:"العشاء"},en:{fajr:"Fajr",sunrise:"Sunrise",dhuhr:"Dhuhr",asr:"Asr",maghrib:"Maghrib",isha:"Isha"}};
function next(now,city){now=now||new Date();const t=compute(now,city);for(const k of PRAYERS)if(t[k]>now)return{key:k,at:t[k]};
 const tm=new Date(now);tm.setDate(tm.getDate()+1);return{key:"fajr",at:compute(tm,city).fajr}}
// upcoming alarms for N days -> [{at:ms,title,body}]
function schedule(opts){const o=Object.assign({days:30,city:"abudhabi",lang:"ar",pre:false,kids:false},opts),out=[],now=Date.now(),N=NAMES[o.lang];
 for(let i=0;i<o.days;i++){const d=new Date();d.setDate(d.getDate()+i);const t=compute(d,o.city);
  for(const k of PRAYERS){const at=t[k].getTime();
   if(o.pre&&at-6e5>now)out.push({at:at-6e5,title:o.lang=="ar"?`🕌 بعد 10 دقائق: ${N[k]}`:`🕌 ${N[k]} in 10 minutes`,body:o.lang=="ar"?"استعد للصلاة 🤍":"Get ready to pray 🤍"});
   if(at>now)out.push({at,title:o.lang=="ar"?`حان وقت صلاة ${N[k]} 🕌`:`It's time for ${N[k]} prayer 🕌`,body:o.kids?(o.lang=="ar"?"يلا نتوضأ ونصلي 🤍":"Let's make wudu and pray 🤍"):(o.lang=="ar"?"الصلاة خير من كل شي 🤍":"Time to pray 🤍")})}}
 return out}
const notifier={native:()=>!!(G.FamPrayer&&G.FamPrayer.schedule),
 async enable(opts){const list=schedule(opts);
  if(this.native()){G.FamPrayer.schedule(JSON.stringify(list));return "native"}
  if(!("Notification" in G))return "none";if(Notification.permission!="granted"&&(await Notification.requestPermission())!="granted")return "denied";
  (G.__prT||[]).forEach(clearTimeout);G.__prT=list.filter(x=>x.at-Date.now()<864e5).map(x=>setTimeout(()=>new Notification(x.title,{body:x.body}),x.at-Date.now()));return "web"},
 disable(){if(this.native())G.FamPrayer.cancel();(G.__prT||[]).forEach(clearTimeout);G.__prT=[]}};
function hijri(d,lang){try{return new Intl.DateTimeFormat((lang=="ar"?"ar-SA":"en-GB")+"-u-ca-islamic-umalqura"+(lang=="ar"?"-nu-arab":""),{day:"numeric",month:"long",year:"numeric"}).format(d)}catch(e){return""}}
G.PrayerTimes={compute,next,schedule,notifier,hijri,CITIES,NAMES,ORDER,PRAYERS,METHOD};
if(typeof module!="undefined")module.exports=G.PrayerTimes;
})(typeof window!="undefined"?window:globalThis);
