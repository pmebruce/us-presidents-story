(function(){
const X=window.US_EXTRA||[],g=id=>document.getElementById(id);
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>{const [y,m,dd]=d.split('-');return `${y}年${+m}月${+dd}日`};
let cur=[],li=0,lastFocus=null;
window.renderExtra=function(i){
  const x=X[i];if(!x)return;cur=x.images;
  g('gallery').innerHTML=x.images.map((im,k)=>`<figure><button type="button" class="shot" data-k="${k}" aria-label="放大圖片：${e(im.caption)}"><img src="${e(im.src)}" width="${im.w}" height="${im.h}" style="aspect-ratio:${im.w}/${im.h}" loading="lazy" decoding="async" alt="${e(im.caption)}"></button><figcaption>${e(im.caption)}<small>${e(im.credit)} · ${im.license==='Public domain'?'公有領域':e(im.license)} · <a href="${e(im.sourcePage)}" target="_blank" rel="noopener">來源</a></small></figcaption></figure>`).join('');
  g('gallery-wrap').hidden=!x.images.length;
  g('quotes').innerHTML=x.quotes.map(q=>`<blockquote class="quote"><p class="en" lang="en">“${e(q.en)}”</p><p class="zh">「${e(q.zh)}」<span class="tag">本站譯文</span></p>${q.note?`<p class="qnote">${e(q.note)}</p>`:''}<footer>— ${e(q.who)}，${fmt(q.date)} · <a href="${e(q.url)}" target="_blank" rel="noopener">原文</a></footer></blockquote>`).join('');
  g('quote-wrap').hidden=!x.quotes.length;
  g('sources').innerHTML=x.sources.map(u=>`<a href="${e(u.url)}" target="_blank" rel="noopener">${e(u.label)}</a>`).join('');
};
function show(k){li=(k+cur.length)%cur.length;const im=cur[li];const I=g('lb-img');I.src=im.src;I.alt=im.caption;I.width=im.w;I.height=im.h;g('lb-cap').innerHTML=`${e(im.caption)}<small>${e(im.credit)} · ${im.license==='Public domain'?'公有領域':e(im.license)} · <a href="${e(im.sourcePage)}" target="_blank" rel="noopener">Wikimedia Commons 檔案頁</a> · ${li+1}/${cur.length}</small>`;g('lb-prev').hidden=g('lb-next').hidden=cur.length<2}
document.addEventListener('click',ev=>{const b=ev.target.closest('.shot');if(!b)return;lastFocus=b;show(+b.dataset.k);const d=g('lightbox');d.showModal?d.showModal():d.setAttribute('open','')});
document.addEventListener('DOMContentLoaded',()=>{const d=g('lightbox');
  g('lb-close').onclick=()=>d.close();g('lb-prev').onclick=()=>show(li-1);g('lb-next').onclick=()=>show(li+1);
  d.addEventListener('click',ev=>{if(ev.target===d)d.close()});
  d.addEventListener('keydown',ev=>{if(ev.key==='ArrowLeft')show(li-1);if(ev.key==='ArrowRight')show(li+1)});
  d.addEventListener('close',()=>{lastFocus&&lastFocus.focus()});});
})();
