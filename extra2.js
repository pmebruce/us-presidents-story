(function(){
const S=window.US_STATS||[],T=window.US_TERRITORY,g=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PC={none:'#8f99a3',fed:'#6d5a96',dr:'#3f8a68',dem:'#2f5d9e',whig:'#c2964d',rep:'#aa383e',nu:'#8a6d5a'};
const PL={none:'無黨派／建國前',fed:'聯邦黨',dr:'民主共和黨',dem:'民主黨',whig:'輝格黨',rep:'共和黨',nu:'全國聯盟'};
const reduce=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const INSET={HI:[392,474],AK:[160,440]};
/* territory-data uses an equirectangular frame: fitted from Cape Flattery, Cape Hatteras, 49°N border, Florida tip (±3 units) */
const proj=(lon,lat)=>[16.06*lon+2040.5,816.5-16*lat];
const fmtN=n=>n.toLocaleString('en-US');
/* ---------- charts ---------- */
function spark(vals,cur,fmt,label){const W=300,H=46,P=4,max=Math.max(...vals),min=Math.min(...vals);const x=i=>P+i*(W-2*P)/(vals.length-1),y=v=>H-P-(v-min)/(max-min||1)*(H-2*P);
 const d=vals.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(v).toFixed(1)).join('');
 return `<svg class="spark" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(label)}"><path d="${d}" fill="none" stroke="#9aa6b0" stroke-width="2"/><line x1="${x(cur)}" x2="${x(cur)}" y1="2" y2="${H-2}" stroke="#c2964d" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="${x(cur)}" cy="${y(vals[cur])}" r="5" fill="#aa383e" stroke="#fff" stroke-width="2"/></svg>`}
function evSvg(el,party){const segs=[{n:el.winner.name,v:el.winner.ev,c:PC[party]||'#555'}].concat(el.opp.filter(o=>o.ev>0).map((o,k)=>({n:o.name,v:o.ev,c:['#7d8a96','#a9b3bb','#c9d0d5'][k]})));const rest=el.total-segs.reduce((a,s)=>a+s.v,0);if(rest>0)segs.push({n:'其他',v:rest,c:'#e3e6e8'});
 let x=0;const r=segs.map(s=>{const w=s.v/el.total*300,o=`<rect x="${x.toFixed(2)}" y="3" width="${w.toFixed(2)}" height="14" fill="${s.c}"><title>${e(s.n)} ${s.v}</title></rect>`;x+=w;return o}).join('');
 return `<svg class="evbar" viewBox="0 0 300 20" preserveAspectRatio="none" role="img" aria-label="${el.year}年選舉人票：${e(el.winner.name)} ${el.winner.ev}／${el.total}">${r}${el.year>=1804?'<line x1="150" x2="150" y1="0" y2="20" stroke="#152b43" stroke-width="1.5" vector-effect="non-scaling-stroke"/>':''}</svg>`}
function renderStats(i){const d=S[i],box=g('stats');if(!d||!box)return;
 const states=S.map(x=>x.statesEnd),pops=S.map(x=>x.pop);let h='';
 if(d.pre){h+=`<p class="st-pre">總統制度尚未開始：本幕無總統選舉、政黨或就任年齡資料。</p>`}
 else{h+=`<div class="st-row"><span class="chip" style="--c:${PC[d.party]}">${e(d.partyName)}</span><span>就任時 <b>${d.age}</b> 歲</span><span class="muted">${d.took.replace(/-/g,'.')} 就任</span></div>`;
  if(d.partyNote)h+=`<p class="st-note">${e(d.partyNote)}</p>`;
  if(d.succession)h+=`<p class="st-succ"><b>${d.elections.length?'先接任、後當選':'未經選舉出任此職'}</b>　${e(d.succession)}</p>`;
  for(const el of d.elections){const opp=el.opp.map(o=>`${e(o.name)} ${o.ev}${o.popp?' · '+e(o.popp):''}`).join('；');
   h+=`<div class="st-el"><div class="st-elh"><b>${el.year} 選舉</b><a href="${e(el.url)}" target="_blank" rel="noopener">UCSB 數據</a></div>${evSvg(el,d.party)}<p class="st-line"><span class="sw" style="background:${PC[d.party]}"></span>${e(el.winner.name)} <b>${el.winner.ev}</b>／${el.total} 選舉人票${el.winner.popp?' · 普選 '+e(el.winner.popp):el.year<1824?' · 尚無全國普選統計':''}</p>${opp?`<p class="st-opp">對手：${opp}</p>`:''}${el.note?`<p class="st-note">${e(el.note)}</p>`:''}</div>`}}
 h+=`<div class="st-spark"><div><span>州數</span><b>${d.statesStart===d.statesEnd?d.statesEnd:d.statesStart+' → '+d.statesEnd}</b></div>${spark(states,i,null,'各任期末州數走勢，目前任期以紅點標示')}</div>`;
 if(d.statesNote)h+=`<p class="st-note">${e(d.statesNote)}</p>`;
 h+=`<div class="st-spark"><div><span>人口（${d.census} 年普查）</span><b>${fmtN(d.pop)}</b></div>${spark(pops,i,null,'各任期最接近的十年普查人口走勢')}</div>`;
 h+=`<p class="st-src">資料：選舉＝<a href="https://www.presidency.ucsb.edu/statistics/elections" target="_blank" rel="noopener">American Presidency Project 選舉統計</a>；人口＝<a href="https://www.census.gov/programs-surveys/decennial-census/decade.${d.census}.html" target="_blank" rel="noopener">美國普查局 ${d.census} 年普查</a>；${d.mc?`生日與就任日＝<a href="${e(d.mc)}" target="_blank" rel="noopener">Miller Center</a>；`:''}州數＝本站疆土圖資料（任初／任末）。</p>`;
 box.innerHTML=h}
/* ---------- party band ---------- */
function band(i){const b=g('party-band');if(!b)return;const sc=window.US_HISTORY;
 if(!b.dataset.built){b.innerHTML=sc.map((s,k)=>{const a=(s.year-1775)/250*100,nx=k<sc.length-1?(sc[k+1].year-1775)/250*100:100,p=S[k].party||'none';return `<i data-k="${k}" title="${e(s.name)}｜${e(PL[p])}" style="left:${a}%;width:${Math.max(nx-a,.4)}%;background:${PC[p]}"></i>`}).join('');b.dataset.built=1;
  g('party-legend').innerHTML=Object.keys(PC).map(k=>`<span><i style="background:${PC[k]}"></i>${PL[k]}</span>`).join('')}
 b.querySelectorAll('i').forEach(x=>x.classList.toggle('current',+x.dataset.k===i))}
/* ---------- map ---------- */
let shownDate=null,animT=null;
function pathsFor(m,keys){return keys.flatMap(k=>m[k]).filter(id=>T.paths[id]&&T.paths[id].length>2)}
function drawGain(fromDate,toDate){const lay=g('gain-layer');lay.innerHTML='';clearTimeout(animT);if(!fromDate||fromDate===toDate)return;
 const a=T.snapshots[fromDate],b=T.snapshots[toDate],ka=['states','territories','disputed'],kb=['states','territories'];
 const ids=pathsFor(b,kb);if(!ids.length)return;
 const oldIds=pathsFor(a,ka);
 if(ids.join()===pathsFor(a,kb).join())return;
 lay.innerHTML=`<mask id="gain-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="570"><rect width="1000" height="570" fill="#fff"/>${oldIds.map(id=>`<path d="${T.paths[id]}" fill="#000" stroke="#000" stroke-width="3" fill-rule="evenodd"/>`).join('')}</mask><g mask="url(#gain-mask)" class="${reduce()?'gain static':'gain'}">${ids.map(id=>`<path d="${T.paths[id]}" fill-rule="evenodd"/>`).join('')}</g>`;
 if(!reduce())animT=setTimeout(()=>{const x=lay.querySelector('.gain');x&&x.classList.add('done')},2600)}
function drawMarkers(i){const L=g('event-layer');L.innerHTML='';const d=S[i];if(!d||!d.markers)return;
 const placed=[];const pts=d.markers.map(m=>m.inset?INSET[m.inset]:proj(m.ll[0],m.ll[1]));
 pts.forEach(([x,y])=>placed.push({x:x-9,y:y-9,w:18,h:18}));
 d.markers.forEach((m,k)=>{const [x,y]=pts[k];const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',matchMedia('(max-width:760px)').matches?10:7);c.setAttribute('class','ev-dot');L.appendChild(c)});
 d.markers.forEach((m,k)=>{const [x,y]=pts[k];const t=document.createElementNS(NS,'text');t.setAttribute('class','ev-label');t.textContent=m.label;L.appendChild(t);
  const cands=[[12,6,'start'],[-12,6,'end'],[0,-14,'middle'],[0,30,'middle'],[12,-12,'start'],[-12,-12,'end'],[12,26,'start'],[-12,26,'end']];let ok=false,bb;
  for(const [dx,dy,an] of cands){t.setAttribute('x',x+dx);t.setAttribute('y',y+dy);t.setAttribute('text-anchor',an);bb=t.getBBox();
   const r={x:bb.x-2,y:bb.y-1,w:bb.width+4,h:bb.height+2};
   if(r.x<2||r.y<2||r.x+r.w>998||r.y+r.h>568)continue;
   if(placed.some(p=>r.x<p.x+p.w&&p.x<r.x+r.w&&r.y<p.y+p.h&&p.y<r.y+r.h))continue;placed.push(r);ok=true;break}
  if(!ok){t.remove();const c=L.querySelectorAll('circle')[k];const tt=document.createElementNS(NS,'title');tt.textContent=m.label;c.appendChild(tt)}
 });
 g('map-events').textContent=d.markers.length?'地圖標記：'+d.markers.map(m=>m.label).join('、')+(d.gain?'。本任新增疆土：'+d.gain:''):''}
const orig=window.renderTerritory;
window.renderTerritory=function(){orig();const phase=g('map-period').value==='start'?0:1,date=T.dates[index][phase];
 drawGain(shownDate,date);shownDate=date;drawMarkers(index)};
window.renderStats=function(i){renderStats(i);band(i)};
document.addEventListener('DOMContentLoaded',()=>{g('map-period').onchange=window.renderTerritory});
g('map-period')&&(g('map-period').onchange=window.renderTerritory);
if(typeof index!=='undefined'){window.renderTerritory();window.renderStats(index)}
})();
