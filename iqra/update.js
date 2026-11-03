/* IQRA 1.8: only accept feeds reviewed for this engine; never merge legacy question banks. © HMK */
window.IQRA_UPDATE_URL='https://elcapino.github.io/fam-app-sync/iqra/update.json';
window.HEYYA_CHECK=async()=>{try{const r=await fetch(window.IQRA_UPDATE_URL+'?v='+Date.now(),{cache:'no-store'});if(!r.ok)return;const d=await r.json();if(d.appVersion!=='1.8'||d.version<=window.HEYYA.version)return;if(!Array.isArray(d.grades)||d.grades.some(g=>g.subjects.some(s=>s.topics.some(t=>t.reviewed!=='1.8'))))return;Object.assign(window.HEYYA,d)}catch{}};
addEventListener('load',()=>setTimeout(window.HEYYA_CHECK,1500));
