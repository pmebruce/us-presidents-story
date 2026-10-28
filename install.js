(()=>{
 const button=document.getElementById('install-button'),bar=document.getElementById('install-bar'),dialog=document.getElementById('install-dialog'),instructions=document.getElementById('install-instructions'),urlInput=document.getElementById('install-url'),feedback=document.getElementById('install-feedback');
 let deferredPrompt=null;const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),android=/Android/.test(navigator.userAgent);
 function refresh(){bar.hidden=standalone()}
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredPrompt=event;refresh()});window.addEventListener('appinstalled',()=>{deferredPrompt=null;bar.hidden=true});
 function showHelp(){
  feedback.textContent='';urlInput.value=location.origin+location.pathname;
  if(ios){instructions.innerHTML='<p>在 iPhone／iPad 上，請透過 Safari 的分享選單完成加入。</p><ol><li>用 <strong>Safari</strong> 開啟這個 App。若在 ChatGPT 或 LINE 內，先複製下方網址，貼到 Safari。</li><li>點 Safari 的<strong>分享</strong>按鈕；部分佈局要先打開頁面選單，再選分享。</li><li>向下找<strong>加入主畫面</strong>。若沒有這項，到列表底部的「編輯動作」加入。</li><li>若看到<strong>打開為網頁 App</strong>，請保持開啟，再點<strong>加入</strong>。</li></ol><p class="install-note">完成後，手機主畫面會出現「美國史」圖示。</p><a href="https://support.apple.com/zh-tw/guide/iphone/iphea86e5236/ios" target="_blank" rel="noopener">Apple 的操作說明</a>'}
  else if(android){instructions.innerHTML='<p>用 <strong>Chrome</strong> 開啟這個 App，點右上角選單，選擇<strong>安裝應用程式</strong>或<strong>加入主畫面</strong>，再依畫面完成確認。</p><p>若在其他 App 內開啟，先複製下方網址，貼到 Chrome。</p>'}
  else{instructions.innerHTML='<p>在 Chrome 或 Edge 中，使用網址列的安裝圖示或瀏覽器選單的<strong>安裝應用程式</strong>。</p><p>若要加入 iPhone 主畫面，請在手機 Safari 開啟下方網址，再使用<strong>分享</strong>選單的<strong>加入主畫面</strong>。</p>'}
  dialog.showModal();
 }
 button.onclick=async()=>{setPlaying(false);if(deferredPrompt){const prompt=deferredPrompt;deferredPrompt=null;try{await prompt.prompt();const result=await prompt.userChoice;if(result.outcome==='accepted')bar.hidden=true;return}catch{showHelp()}}else showHelp()};
 document.getElementById('install-close').onclick=()=>dialog.close();
 document.getElementById('copy-install-url').onclick=async()=>{try{await navigator.clipboard.writeText(urlInput.value);feedback.textContent='已複製，請貼到 Safari 或其他瀏覽器開啟。'}catch{urlInput.focus();urlInput.select();feedback.textContent='請長按或選取上方網址，再選「複製」。'}};
 refresh();
})();
