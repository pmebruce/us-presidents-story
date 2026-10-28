(function(){
const D=window.US_THEMES,g=id=>document.getElementById(id),sc=window.US_HISTORY;
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TC={reg:'#6b7a2a',land:'#b07a2a',war:'#8c2f34',rights:'#2f6e5a',native:'#7a4f8a',econ:'#4a6b8c',const:'#5c5c5c',diplo:'#2a7a8c'};
let cur=null;try{cur=localStorage.getItem('us-theme')||null}catch(_){}
const members=t=>sc.map((s,i)=>i).filter(i=>(D.tags[i]||[]).some(x=>x[0]===t));
const label=t=>D.themes.find(x=>x.id===t).label;
function go(i){const sel=g('people');sel.value=String(i);sel.dispatchEvent(new Event('change'))}
function chips(){g('theme-chips').innerHTML=`<button type="button" data-t="" aria-pressed="${!cur}">全部</button>`+D.themes.map(t=>`<button type="button" data-t="${t.id}" aria-pressed="${cur===t.id}" style="--c:${TC[t.id]}"><i></i>${e(t.label)}<span>${members(t.id).length}</span></button>`).join('')}
function render(i){
 const tags=D.tags[i]||[];
 g('entry-themes').innerHTML=tags.length?tags.map(([t,w])=>`<button type="button" class="etag" data-t="${t}" style="--c:${TC[t]}" title="${e(w)}">${e(label(t))}</button>`).join(''):'<span class="etag none">未歸入以上主題</span>';
 const box=g('theme-thread');
 if(!cur){box.innerHTML=`<p class="th-hint">選一個主題，即可沿著它跨越不同總統閱讀。標籤依本站各幕既有內容判定，每條都附上判定依據。</p>`;g('theme-nav').hidden=true}
 else{const m=members(cur),t=D.themes.find(x=>x.id===cur),pos=m.indexOf(i);
  box.innerHTML=`<p class="th-desc"><b style="color:${TC[cur]}">${e(t.label)}</b>：${e(t.desc)}共 ${m.length} 幕${pos<0?'；目前這一幕不在此主題':''}。</p><ol class="th-list">${m.map(k=>{const w=(D.tags[k].find(x=>x[0]===cur)||[])[1];const s=sc[k];return `<li${k===i?' class="current" aria-current="true"':''}><button type="button" data-go="${k}"><span class="th-term">${e(s.term)}</span><span class="th-name">${e(s.name)}</span><span class="th-why">${e(w)}</span></button></li>`}).join('')}</ol>`;
  const prev=[...m].reverse().find(k=>k<i),next=m.find(k=>k>i);g('theme-nav').hidden=false;
  g('th-prev').disabled=prev==null;g('th-next').disabled=next==null;g('th-prev').dataset.go=prev??'';g('th-next').dataset.go=next??'';
  g('th-prev').textContent='‹ 同主題上一幕';g('th-next').textContent='同主題下一幕 ›';
  const cl=box.querySelector('li.current');if(cl&&box.scrollHeight>box.clientHeight){box.scrollTop=cl.offsetTop-box.offsetTop-40}}
 document.querySelectorAll('#ruler i').forEach((x,k)=>{x.classList.toggle('in-theme',!!cur&&members(cur).includes(k))});
 g('ruler').classList.toggle('themed',!!cur);g('ruler').style.setProperty('--tc',cur?TC[cur]:'');
}
function setTheme(t){cur=t||null;try{t?localStorage.setItem('us-theme',t):localStorage.removeItem('us-theme')}catch(_){}chips();render(index)}
document.addEventListener('click',ev=>{const c=ev.target.closest('#theme-chips button,.etag[data-t]');if(c){setTheme(c.dataset.t);if(c.classList.contains('etag'))g('theme-card').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return}
 const b=ev.target.closest('[data-go]');if(b&&b.dataset.go!==''){go(+b.dataset.go)}});
window.renderThemes=render;chips();
if(typeof index!=='undefined')render(index);
})();
