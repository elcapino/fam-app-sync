/* Complete, read-only details. Every source URL is retained on one measured page. */
let HMK_DETAIL_VALUE=null;
const hmkTextValue=v=>v==null?'':String(v);
function hmkDetailFull(v){
 if(v==null)return'';
 if(typeof v!=='object')return hmkTextValue(v);
 const text=[];function q(x){x=nsLang(x);if(x==null)return;if(typeof x!=='object'){text.push(hmkTextValue(x));return}Object.values(x).forEach(q)}q(v);return text.join('\n').replace(/^\s{0,3}#{1,6}\s+/gm,'');
}
function hmkDetailValues(v){const urls=[];function q(x){x=nsLang(x);if(x==null)return;if(typeof x!=='object'){(String(x).match(/https?:\/\/[^\s<>"'`“”\[\]’،؛]+(?<![،؛:,.])/g)||[]).forEach(s=>{s=s.replace(/[.,;:]+$/,'');try{new URL(s);urls.push(s)}catch{}});return}Object.values(x).forEach(q)}q(v);return urls}
const hmkOriginalBrief=v19Brief;v19Brief=v=>hmkDetailFull(v);
const hmkOpen=nsOpen;nsOpen=function(title,value){HMK_DETAIL_VALUE=value;hmkOpen(title,value)};
const hmkDetailEsc=s=>esc(String(s??''));
function hmkDetailTokens(value){
 const urls=hmkDetailValues(value);if(value==null)return ['لا يوجد نص تفصيلي موثق.'];
 const parts=[];function q(x){
  x=nsLang(x);if(x==null)return;
  if(typeof x==='object'){if(parts.length&&(parts.at(-1).text||'').trim()&&!parts.at(-1).text?.endsWith('\n'))parts.push({text:'\n'});Object.values(x).forEach(q);return}
  let end=0;const s=hmkTextValue(x);const re=/https?:\/\/[^\s<>"'`“”\[\]’،؛]+(?<![،؛:,.])/g;let m;
  while((m=re.exec(s))!==null){
   const raw=m[0],clean=raw.replace(/[.,;:]+$/,'');if(!urls.includes(clean))continue;
   if(m.index>end)parts.push({text:s.slice(end,m.index)});parts.push({url:clean,text:clean});end=m.index+clean.length;
  }
  if(end<s.length)parts.push({text:s.slice(end)});
 }
 q(value);
 return parts.flatMap(part=>part.url?[part]:String(part.text).split(/(\s+)/).filter(Boolean).map(text=>({text})));
}
function hmkDetailHTML(items){
 return items.map(x=>x.url?`<a class="ns-detail-url" href="${hmkDetailEsc(x.url)}" target="_blank" rel="noopener noreferrer">${hmkDetailEsc(x.url)}</a>`:hmkDetailEsc(x.text)).join('');
}
function hmkDetailPages(items,body){
 const art=document.createElement('article');art.className=body.classList.contains('cmd-body')?'cmd-copy':'ns-copy ns-detail-copy';
 Object.assign(art.style,{position:'absolute',inset:'0 auto auto 0',width:body.clientWidth+'px',height:'auto',maxHeight:'none',visibility:'hidden',pointerEvents:'none'});
 body.append(art);
 const pages=[];let start=0;
 while(start<items.length){
  let lo=1,hi=mathMax(items.length-start,1),fit=0;
  while(lo<=hi){const mid=Math.floor((lo+hi)/2);art.innerHTML=hmkDetailHTML(items.slice(start,start+mid));const ok=art.scrollHeight<=body.clientHeight+1&&art.getBoundingClientRect().bottom<=body.getBoundingClientRect().bottom+1;if(ok){fit=mid;lo=mid+1}else hi=mid-1}
  if(!fit){pages.push(items.slice(start,start+1));start++}else{pages.push(items.slice(start,start+fit));start+=fit}
 }
 art.remove();return pages;
}
function mathMax(a,b){return Math.max(a,b)}
nsDraw=function(){const pg=$('#pages .pg');if(!pg)return;$('#back').hidden=!NS_STACK.length&&PAGES[CUR]==='sum';$('#back').onclick=nsBack;pg.innerHTML=`<div class="ns-heading"><span>HMK / ${esc(t(PAGES[CUR]))}</span><h2>${esc(NS_TITLE)}</h2><small>${esc(PAGES[CUR]==='team'||PAGES[CUR]==='ecosystem'?V18_STATUS?.generated_at||'الحالة غير متاحة':v19Stamp())}</small></div><div class="ns-body"></div><div class="ns-pager"></div>`;const body=pg.querySelector('.ns-body'),pager=pg.querySelector('.ns-pager');let count=1;
 if(NS_TEXT!==null){const items=hmkDetailTokens(HMK_DETAIL_VALUE);const pages=hmkDetailPages(items,body);count=pages.length;NS_PAGE=Math.max(0,Math.min(NS_PAGE,count-1));const article=document.createElement('article');article.className='ns-copy ns-detail-copy';article.innerHTML=hmkDetailHTML(pages[NS_PAGE]);body.append(article);
 }else{const per=5;count=Math.max(1,Math.ceil(NS_ROWS.length/per));NS_PAGE=Math.max(0,Math.min(NS_PAGE,count-1));for(const [i,r] of NS_ROWS.slice(NS_PAGE*per,(NS_PAGE+1)*per).entries()){const b=document.createElement('button');b.className='ns-topic';const preview=r.value==null?'':v19Flat(r.value).join(' · ').slice(0,160);b.innerHTML=`<span class="ns-num">${NS_PAGE*per+i+1}</span><span><strong>${esc(r.title)}</strong><small>${esc(preview)}</small></span><b>‹</b>`;b.onclick=()=>{if(r.open){if(r.open==='status'){location.href='status.html';return}if(PAGES.includes(r.open))goPage(PAGES.indexOf(r.open),true);else{PROJECT_ID=r.open;goPage(PAGES.indexOf('project'),true)}}else nsOpen(r.title,r.value)};body.append(b)}if(NS_ROWS.length<3){body.insertAdjacentHTML('beforeend',v19Context());v19Fit(body)}}
 pager.innerHTML=`<button ${NS_PAGE===0?'disabled':''} aria-label="Previous">‹</button><span>${NS_PAGE+1} / ${count}</span><button ${NS_PAGE===count-1?'disabled':''} aria-label="Next">›</button>`;pager.firstChild.onclick=()=>{NS_PAGE--;nsDraw()};pager.lastChild.onclick=()=>{NS_PAGE++;nsDraw()};
 if(NS_TEXT===null)v19Fit(body)};
