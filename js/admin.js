let config = null;
let rsvps = [];
const $ = (id) => document.getElementById(id);
const fields = () => Array.from(document.querySelectorAll('[data-field]'));
const imgDefs = [
  ['images.hero','Ảnh Hero / ảnh lớn đầu thiệp'],
  ['images.envelope1','Ảnh rút ra 1 trên vỏ thiệp'],
  ['images.envelope2','Ảnh rút ra 2 trên vỏ thiệp'],
  ['images.groom','Ảnh chú rể'],
  ['images.bride','Ảnh cô dâu'],
  ['images.thankYouBg','Ảnh nền lời cảm ơn'],
  ['banking.bride.qr','QR cô dâu'],
  ['banking.groom.qr','QR chú rể']
];
function clone(o){ return JSON.parse(JSON.stringify(o || {})); }
function getPath(obj,path){ return path.split('.').reduce((o,k)=>o&&o[k],obj); }
function setPath(obj,path,value){ const keys=path.split('.'); let o=obj; keys.slice(0,-1).forEach(k=>{ if(!o[k]||typeof o[k]!=='object') o[k]={}; o=o[k]; }); o[keys[keys.length-1]]=value; }
function setMsg(txt){ $('saveMsg').textContent = txt || ''; $('statusLine').textContent = txt || 'Sẵn sàng chỉnh sửa'; }
function fileToDataUrl(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); }); }
function buildImageFields(){
  $('imageFields').innerHTML = imgDefs.map(([path,label]) => `<div class="image-card"><h3>${label}</h3><img data-preview="${path}" src=""><small>${path}</small><input data-image-url="${path}" placeholder="URL ảnh hoặc data image"><input type="file" accept="image/*" data-image-file="${path}"></div>`).join('');
  document.querySelectorAll('[data-image-url]').forEach(inp=>inp.oninput=()=>{ setPath(config, inp.dataset.imageUrl, inp.value); renderImagePreviews(); });
  document.querySelectorAll('[data-image-file]').forEach(inp=>inp.onchange=async()=>{ const f=inp.files[0]; if(!f) return; const url=await fileToDataUrl(f); setPath(config, inp.dataset.imageFile, url); renderImagePreviews(); });
}
function fillForm(){
  fields().forEach(el=>{ el.value = getPath(config, el.dataset.field) || ''; });
  $('galleryText').value = (config.gallery || []).join('\n');
  $('guestText').value = (config.guests || []).map(g=>`${g.id || ''}, ${g.name || ''}, ${g.side || ''}`).join('\n');
  renderImagePreviews(); renderAlbumPreview();
}
function readForm(){
  fields().forEach(el=>setPath(config, el.dataset.field, el.value));
  config.gallery = $('galleryText').value.split('\n').map(x=>x.trim()).filter(Boolean);
  config.guests = $('guestText').value.split('\n').map(line=>line.split(',').map(x=>x.trim())).filter(a=>a[0]||a[1]).map(a=>({id:a[0], name:a[1], side:a[2]||''}));
}
function renderImagePreviews(){
  document.querySelectorAll('[data-preview]').forEach(img=>img.src = getPath(config, img.dataset.preview) || '');
  document.querySelectorAll('[data-image-url]').forEach(inp=>inp.value = getPath(config, inp.dataset.imageUrl) || '');
}
function renderAlbumPreview(){
  const imgs = ($('galleryText').value || '').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,16);
  $('albumPreview').innerHTML = imgs.map(src=>`<img src="${src}">`).join('');
}
async function addGalleryFiles(){
  const files = Array.from($('galleryFiles').files || []);
  if(!files.length) return;
  const urls = [];
  for(const f of files) urls.push(await fileToDataUrl(f));
  const current = $('galleryText').value.split('\n').map(x=>x.trim()).filter(Boolean);
  $('galleryText').value = current.concat(urls).join('\n');
  renderAlbumPreview();
}
async function load(){
  config = await WeddingCMS.loadConfig();
  buildImageFields(); fillForm(); setMsg('Đã tải cấu hình. Bạn có thể chỉnh nội dung, hình ảnh và lưu.');
  const initialTab = (location.hash || '#content').replace('#','');
  showTab(initialTab, false);
}
function login(){ const pwd=$('password').value; const expected=(window.DEFAULT_WEDDING_CONFIG && window.DEFAULT_WEDDING_CONFIG.adminPassword) || (config&&config.adminPassword) || '29062026'; if(pwd===expected){$('loginPanel').classList.add('hidden');$('adminApp').classList.remove('hidden');load();}else $('loginMsg').textContent='Sai mật khẩu admin.'; }
const tabNames = {content:'Nội dung', images:'Hình ảnh', gift:'QR & ngân hàng', guests:'Khách mời', rsvp:'RSVP', setup:'Thiết lập'};
function showTab(name, scrollToTabs=false){
  if(!name || !document.getElementById(name)) name='content';
  document.querySelectorAll('.tabs button').forEach(b=>{
    const active = b.dataset.tab===name;
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  // Force hide/show by inline style so the admin works even if an old cached CSS file is still loaded.
  document.querySelectorAll('.tab-panel').forEach(panel=>{
    const active = panel.id===name;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
    panel.style.display = active ? (panel.classList.contains('grid2') ? 'grid' : 'block') : 'none';
    panel.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  if($('tabHelp')) $('tabHelp').textContent = `Bạn đang chỉnh tab ${tabNames[name] || name}. Trang quản trị chỉ hiển thị đúng nhóm chỉnh sửa của tab này.`;
  if(name==='rsvp') renderRsvp();
  if(name==='images') renderImagePreviews(), renderAlbumPreview();
  if(scrollToTabs){
    const tabs = $('adminTabs') || document.querySelector('.tabs');
    tabs && tabs.scrollIntoView({behavior:'smooth', block:'start'});
  }
  if(location.hash !== '#'+name) history.replaceState(null, '', '#'+name);
}
function switchTab(e){ const btn=e.target.closest('[data-tab]'); if(!btn) return; showTab(btn.dataset.tab, true); }
function saveLocal(){ readForm(); WeddingCMS.saveLocal(config); setMsg('Đã lưu bản nháp trên trình duyệt này. Mở thiệp trên cùng trình duyệt để xem thay đổi.'); }
async function saveCloud(){ readForm(); if(!config.googleAppsScriptUrl){ setMsg('Chưa có Google Apps Script URL. Hãy cấu hình ở tab Thiết lập trước.'); return; } await WeddingCMS.postNoCors(config.googleAppsScriptUrl,{action:'saveConfig',password:config.adminPassword,config}); WeddingCMS.saveLocal(config); setMsg('Đã gửi cấu hình lên Google Sheet. Ảnh dạng data lớn có thể làm Google Sheet lưu chậm, nên dùng URL ảnh nếu album quá nhiều.'); }
function resetLocal(){ if(confirm('Xóa bản nháp local và quay về cấu hình mặc định/Google Sheet?')){ WeddingCMS.clearLocal(); location.reload(); } }
function downloadConfig(){ readForm(); const blob=new Blob([JSON.stringify(config,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wedding-config.json'; a.click(); }
function renderLinks(){ readForm(); const base=location.origin + location.pathname.replace(/admin\.html$/,'index.html'); const text=(config.guests||[]).map(g=>`${g.name}: ${base}?id=${encodeURIComponent(g.id)}&name=${encodeURIComponent(g.name)}`).join('\n'); $('guestLinks').textContent=text; navigator.clipboard && navigator.clipboard.writeText(text).catch(()=>{}); }
function getLocalRsvps(){ try{return JSON.parse(localStorage.getItem('wedding_rsvp')||localStorage.getItem('wedding_rsvp_records')||'[]')}catch(e){return[]} }
async function renderRsvp(){
  rsvps = getLocalRsvps();
  if(config && config.googleAppsScriptUrl){ try{ const remote=await WeddingCMS.jsonp(config.googleAppsScriptUrl,'getRsvps'); if(remote && remote.ok && Array.isArray(remote.rsvps)) rsvps=remote.rsvps; }catch(e){} }
  $('total').textContent=rsvps.length; $('yes').textContent=rsvps.filter(x=>x.attending==='Có tham dự').length; $('no').textContent=rsvps.filter(x=>x.attending==='Rất tiếc không thể tham dự').length; $('bride').textContent=rsvps.filter(x=>x.guestOf==='Cô dâu').length; $('groom').textContent=rsvps.filter(x=>x.guestOf==='Chú rể').length; $('common').textContent=rsvps.filter(x=>x.guestOf==='Khách chung').length;
  $('rsvpRows').innerHTML=rsvps.map(x=>`<tr><td>${x.timestamp||''}</td><td>${x.guestId||''}</td><td>${x.guestName||''}</td><td>${x.attending||''}</td><td>${x.companions||''}</td><td>${x.guestOf||''}</td><td>${x.wish||''}</td></tr>`).join('');
}
function exportCsv(){ const head=['Timestamp','Guest ID','Tên khách','Tham dự','Đi cùng','Khách của','Lời chúc']; const lines=[head,...rsvps.map(x=>[x.timestamp,x.guestId,x.guestName,x.attending,x.companions,x.guestOf,x.wish])].map(r=>r.map(v=>'"'+String(v||'').replaceAll('"','""')+'"').join(',')); const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='rsvp.csv'; a.click(); }
$('loginBtn').onclick=login; $('password').addEventListener('keydown',e=>{if(e.key==='Enter')login()}); document.querySelector('.tabs').onclick=switchTab; $('saveLocalBtn').onclick=saveLocal; $('saveCloudBtn').onclick=saveCloud; $('downloadConfigBtn').onclick=downloadConfig; $('resetLocalBtn').onclick=resetLocal; $('copyLinksBtn').onclick=renderLinks; $('refreshRsvpBtn').onclick=renderRsvp; $('exportCsvBtn').onclick=exportCsv; $('clearLocalBtn').onclick=()=>{ if(confirm('Xóa RSVP local trên trình duyệt này?')){ localStorage.removeItem('wedding_rsvp'); localStorage.removeItem('wedding_rsvp_records'); renderRsvp(); }};
$('galleryFiles').onchange=addGalleryFiles; $('galleryText').addEventListener('input', renderAlbumPreview); $('clearGalleryBtn').onclick=()=>{ if(confirm('Xóa danh sách ảnh album đang nhập?')){ $('galleryText').value=''; renderAlbumPreview(); }};
window.addEventListener('hashchange', ()=>showTab((location.hash||'#content').replace('#',''), false));
setTimeout(()=>showTab((location.hash||'#content').replace('#',''), false), 0);
