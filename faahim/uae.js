// UAE sources = PRIMARY backbone (v1.4). Every licence below was checked on the source's own terms page on 2026-10-30 (see SOURCES.md).
// use: 'api' = open data/API we may reuse (with attribution) · 'link' = deep link only (we never copy their content) .
const UAE=[
 {i:'🎓',n:'OpenAlex – UAE universities',lic:'CC0',use:'api',u:q=>`https://openalex.org/works?filter=institutions.country_code:ae&search=${q}`},
 {i:'📊',n:'Bayanat.ae (UAE open data)',lic:'CC BY 4.0',use:'api',u:q=>`https://bayanat.ae/en/Datasets?search=${q}`},
 {i:'🏛️',n:'UAEU Scholarworks',lic:'link only',use:'link',u:q=>`https://scholarworks.uaeu.ac.ae/do/search/?q=${q}`},
 {i:'📘',n:'ZU Scholars – Zayed University',lic:'link only',use:'link',u:q=>`https://zuscholars.zu.ac.ae/do/search/?q=${q}`},
 {i:'🎬',n:'Madrasa – مدرسة (MBRGI)',lic:'link only',use:'link',u:()=>'https://madrasa.org/'},
 {i:'📚',n:'Mohammed Bin Rashid Library',lic:'link only',use:'link',u:()=>'https://www.mbrl.ae/'},
 {i:'🔤',n:'Abu Dhabi Arabic Language Centre',lic:'link only (non-commercial)',use:'link',u:()=>'https://alc.ae/'},
 {i:'🏫',n:'Ministry of Education',lic:'link only',use:'link',u:()=>'https://www.moe.gov.ae/'},
 {i:'🔮',n:'Museum of the Future',lic:'link only',use:'link',u:()=>'https://museumofthefuture.ae/en'},
 {i:'🇦🇪',n:'u.ae – UAE Government portal',lic:'link only',use:'link',u:()=>'https://u.ae/en/about-the-uae'},
 {i:'💡',n:'HBMSU',lic:'link only',use:'link',u:()=>'https://www.hbmsu.ac.ae/'}];
// Section -> which UAE links rank first in that section's Sources tab
const UAE_SEC={Science:[0,2,3,4],Mathematics:[4,0,2],History:[5,0,9,2],Technology:[0,8,2,10],'Outer space':[0,8,2],'Human body':[0,2,4],Language:[6,5,4],Art:[5,0,3],Geography:[1,9,0,2],Economy:[1,0,3],Islam:[]};
function uaeLinks(q,sec){const e=encodeURIComponent(q||'');const ord=UAE_SEC[sec]||[0,1,2,3];const ids=[...ord,...UAE.map((_,i)=>i).filter(i=>!ord.includes(i))].slice(0,5);
 return ids.map(i=>({t:UAE[i].i+' 🇦🇪 '+UAE[i].n,s:UAE[i].lic,u:UAE[i].u(e),uae:1}))}
// Live UAE university papers (OpenAlex, CC0): only titles + links, no full text copied
const uaePapers=(q,n=3)=>J(`https://api.openalex.org/works?filter=institutions.country_code:ae,is_oa:true${q?'':',from_publication_date:'+(new Date().getFullYear())+'-01-01'}${q?'&search='+encodeURIComponent(q):''}&sort=${q?'relevance_score':'publication_date'}:desc&per_page=${n}&select=title,publication_year,doi,id,authorships`).then(r=>(r?.results||[]).filter(w=>w.title).map(w=>{const inst=(w.authorships||[]).flatMap(a=>a.institutions||[]).find(i=>i.country_code=='AE');return {t:'🎓🇦🇪 '+w.title+' ('+w.publication_year+')',s:'OpenAlex · CC0'+(inst?' · '+inst.display_name:''),u:w.doi||w.id,uni:inst?.display_name}}));
