let config = null;
let rsvps = [];
const $ = (id) => document.getElementById(id);
const fields = () => Array.from(document.querySelectorAll('[data-field]'));

const transformDefs = [
  { key:'hero', path:'images.hero', label:'Ảnh Hero', previews:['transformPreviewHero'] },
  { key:'envelope1', path:'images.envelope1', label:'Ảnh rút ra 1', previews:['transformPreviewEnvelope1'] },
  { key:'envelope2', path:'images.envelope2', label:'Ảnh rút ra 2', previews:['transformPreviewEnvelope2'] },
  { key:'groom', path:'images.groom', label:'Ảnh chú rể', previews:['transformPreviewGroomRect','transformPreviewGroomCircle'] },
  { key:'bride', path:'images.bride', label:'Ảnh cô dâu', previews:['transformPreviewBrideRect','transformPreviewBrideCircle'] },
  { key:'thankYouBg', path:'images.thankYouBg', label:'Ảnh nền cảm ơn', previews:['transformPreviewThankYouBg'] }
];
function ensureImageTransforms(){
  if(!config.imageTransforms || typeof config.imageTransforms !== 'object') config.imageTransforms = {};
  const defaults = { hero:{x:50,y:50,zoom:1}, envelope1:{x:50,y:50,zoom:1}, envelope2:{x:50,y:50,zoom:1}, groom:{x:50,y:28,zoom:1}, bride:{x:50,y:26,zoom:1}, thankYouBg:{x:50,y:50,zoom:1} };
  Object.keys(defaults).forEach(key=>{ if(!config.imageTransforms[key]) config.imageTransforms[key] = { ...defaults[key] }; else { config.imageTransforms[key].x = Number(config.imageTransforms[key].x ?? defaults[key].x); config.imageTransforms[key].y = Number(config.imageTransforms[key].y ?? defaults[key].y); config.imageTransforms[key].zoom = Number(config.imageTransforms[key].zoom ?? defaults[key].zoom); } });
}
function getTransform(key){ ensureImageTransforms(); return config.imageTransforms[key]; }
function setTransformValue(key, axis, value){ ensureImageTransforms(); config.imageTransforms[key][axis] = axis === 'zoom' ? Number(value) : Number(value); }
function applyTransformToImg(el, key){ if(!el) return; const t = getTransform(key); el.style.objectPosition = `${t.x}% ${t.y}%`; el.style.transform = `scale(${t.zoom})`; el.style.transformOrigin = 'center center'; }
function renderTransformEditor(){
  ensureImageTransforms();
  transformDefs.forEach(def=>{
    const t = getTransform(def.key);
    const cap = def.key.charAt(0).toUpperCase() + def.key.slice(1);
    if($(`transform${cap}X`)) $('transform'+cap+'X').value = t.x;
    if($(`transform${cap}Y`)) $('transform'+cap+'Y').value = t.y;
    if($(`transform${cap}Zoom`)) $('transform'+cap+'Zoom').value = t.zoom;
    if($(`transform${cap}XVal`)) $('transform'+cap+'XVal').textContent = `${Math.round(t.x)}%`;
    if($(`transform${cap}YVal`)) $('transform'+cap+'YVal').textContent = `${Math.round(t.y)}%`;
    if($(`transform${cap}ZoomVal`)) $('transform'+cap+'ZoomVal').textContent = `${Number(t.zoom).toFixed(2)}x`;
    def.previews.forEach(id=>{ const img = $(id); if(!img) return; img.src = WeddingCMS.normalizeImageUrl(getPath(config, def.path) || ''); applyTransformToImg(img, def.key); });
  });
}
function bindTransformEditor(){
  transformDefs.forEach(def=>{
    const cap = def.key.charAt(0).toUpperCase() + def.key.slice(1);
    [['X','x'],['Y','y'],['Zoom','zoom']].forEach(([suffix,axis])=>{
      const el = $('transform'+cap+suffix);
      if(!el) return;
      const handler = ()=>{ setTransformValue(def.key, axis, el.value); renderTransformEditor(); renderImagePreviews(); };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
    def.previews.forEach(id=>{
      const img = $(id);
      if(!img) return;
      const box = img.parentElement;
      let dragging = false;
      const move = (clientX, clientY)=>{
        const rect = box.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
        setTransformValue(def.key, 'x', x);
        setTransformValue(def.key, 'y', y);
        renderTransformEditor();
        renderImagePreviews();
      };
      const onMouseMove = (e)=>{ if(!dragging) return; move(e.clientX, e.clientY); };
      const stop = ()=>{ dragging = false; box.classList.remove('dragging'); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', stop); window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('touchend', stop); };
      const onTouchMove = (e)=>{ if(!dragging || !e.touches[0]) return; move(e.touches[0].clientX, e.touches[0].clientY); };
      const start = (e)=>{ dragging = true; box.classList.add('dragging'); const point = e.touches ? e.touches[0] : e; move(point.clientX, point.clientY); window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', stop); window.addEventListener('touchmove', onTouchMove, {passive:false}); window.addEventListener('touchend', stop); if(e.cancelable) e.preventDefault(); };
      img.addEventListener('mousedown', start);
      img.addEventListener('touchstart', start, {passive:false});
    });
  });
}

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
function setMsg(txt){ if($('saveMsg')) $('saveMsg').textContent = txt || ''; if($('statusLine')) $('statusLine').textContent = txt || 'Sẵn sàng chỉnh sửa'; }
function fileToDataUrl(file){ return WeddingCMS.readFileDataUrl(file); }
function getCloudUrl(){ return WeddingCMS.getScriptUrl(config); }
function isDataUrl(v){ return String(v || '').startsWith('data:'); }
async function uploadImageForPath(path, file){
  const url = getCloudUrl();
  if(url){
    setMsg('Đang upload ảnh lên Google Drive: ' + (file.name || path));
    const result = await WeddingCMS.uploadImage(url, config.adminPassword, file, path);
    setPath(config, path, result.url);
    setMsg('Đã upload ảnh lên cloud. Bấm Lưu để đồng bộ thay đổi cho mọi thiết bị.');
    return result.url;
  }
  const localUrl = await fileToDataUrl(file);
  setPath(config, path, localUrl);
  setMsg('Chưa cấu hình Google Apps Script URL: ảnh chỉ preview/lưu nháp trên thiết bị này, chưa đồng bộ toàn bộ khách.');
  return localUrl;
}
function buildImageFields(){
  $('imageFields').innerHTML = imgDefs.map(([path,label]) => `<div class="image-card"><h3>${label}</h3><img data-preview="${path}" src=""><small>${path}</small><input data-image-url="${path}" placeholder="URL ảnh hoặc data image"><input type="file" accept="image/*" data-image-file="${path}"></div>`).join('');
  document.querySelectorAll('[data-image-url]').forEach(inp=>inp.oninput=()=>{ setPath(config, inp.dataset.imageUrl, inp.value); renderImagePreviews(); });
  document.querySelectorAll('[data-image-file]').forEach(inp=>inp.onchange=async()=>{ const f=inp.files[0]; if(!f) return; try{ await uploadImageForPath(inp.dataset.imageFile, f); }catch(err){ console.error(err); setMsg('Upload cloud không thành công. Vui lòng kiểm tra Google Apps Script URL/quyền Drive rồi thử lại.'); } renderImagePreviews(); });
}
function fillForm(){
  fields().forEach(el=>{ el.value = getPath(config, el.dataset.field) || ''; });
  $('galleryText').value = (config.gallery || []).join('\n');
  $('guestText').value = (config.guests || []).map(g=>`${g.id || ''}, ${g.name || ''}, ${g.side || ''}`).join('\n');
  renderImagePreviews(); renderAlbumPreview(); renderTransformEditor();
}
function readForm(){
  fields().forEach(el=>setPath(config, el.dataset.field, el.value));
  config.gallery = $('galleryText').value.split('\n').map(x=>x.trim()).filter(Boolean);
  config.guests = $('guestText').value.split('\n').map(line=>line.split(',').map(x=>x.trim())).filter(a=>a[0]||a[1]).map(a=>({id:a[0], name:a[1], side:a[2]||''}));
}
function renderImagePreviews(){
  document.querySelectorAll('[data-preview]').forEach(img=>{ img.src = WeddingCMS.normalizeImageUrl(getPath(config, img.dataset.preview) || ''); const p = img.dataset.preview; const map = {'images.hero':'hero','images.envelope1':'envelope1','images.envelope2':'envelope2','images.groom':'groom','images.bride':'bride','images.thankYouBg':'thankYouBg'}; if(map[p]) applyTransformToImg(img, map[p]); });
  document.querySelectorAll('[data-image-url]').forEach(inp=>inp.value = getPath(config, inp.dataset.imageUrl) || '');
  renderTransformEditor();
}
function renderAlbumPreview(){
  const imgs = ($('galleryText').value || '').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,16);
  $('albumPreview').innerHTML = imgs.map(src=>`<img src="${WeddingCMS.normalizeImageUrl(src)}">`).join('');
}
async function addGalleryFiles(){
  const files = Array.from($('galleryFiles').files || []);
  if(!files.length) return;
  const urls = [];
  const cloud = !!getCloudUrl();
  for(let i=0;i<files.length;i++){
    const f = files[i];
    try{
      if(cloud){
        setMsg(`Đang upload ảnh album ${i+1}/${files.length}: ${f.name}`);
        const result = await WeddingCMS.uploadImage(getCloudUrl(), config.adminPassword, f, 'gallery');
        urls.push(result.url);
      }else{
        urls.push(await fileToDataUrl(f));
      }
    }catch(err){
      console.error(err);
      setMsg(`Không upload được ảnh album ${i+1}. Đã dừng để tránh mất dữ liệu.`);
      break;
    }
  }
  const current = $('galleryText').value.split('\n').map(x=>x.trim()).filter(Boolean);
  $('galleryText').value = current.concat(urls).join('\n');
  renderAlbumPreview();
  setMsg(cloud ? 'Đã upload album lên cloud. Bấm Lưu để đồng bộ cho mọi thiết bị.' : 'Album đang là dữ liệu local. Cần cấu hình Google Apps Script để đồng bộ mọi thiết bị.');
}

async function uploadDataUrlForPath(path, dataUrl){
  const url = getCloudUrl();
  if(!url || !isDataUrl(dataUrl)) return dataUrl;
  const mime = (String(dataUrl).match(/^data:([^;]+);base64,/) || [,'image/png'])[1];
  const ext = (mime.split('/')[1] || 'png').replace('jpeg','jpg');
  const fakeFileName = path.replace(/[^a-z0-9_-]+/gi,'-') + '-' + Date.now() + '.' + ext;
  const data = await WeddingCMS.postForm(url, {
    action:'uploadImage',
    uploadId:'auto_' + Date.now() + '_' + Math.random().toString(36).slice(2),
    password:config.adminPassword || '',
    fieldPath:path || '',
    filename:fakeFileName,
    mimeType:mime,
    dataUrl:dataUrl
  });
  if(data && data.url) return WeddingCMS.normalizeImageUrl(data.url);
  throw new Error('Upload ảnh local lên Drive không trả về URL');
}
async function uploadPendingLocalImages(){
  const tasks = [];
  imgDefs.forEach(([path])=>{
    const v = getPath(config, path);
    if(isDataUrl(v)) tasks.push({type:'field', path, value:v});
  });
  (config.gallery || []).forEach((v, i)=>{
    if(isDataUrl(v)) tasks.push({type:'gallery', path:'gallery.'+i, index:i, value:v});
  });
  if(!tasks.length) return 0;
  for(let i=0; i<tasks.length; i++){
    const t = tasks[i];
    setMsg(`Đang chuyển ảnh local lên Google Drive (${i+1}/${tasks.length})...`);
    const url = await uploadDataUrlForPath(t.path, t.value);
    if(t.type === 'gallery') config.gallery[t.index] = url;
    else setPath(config, t.path, url);
  }
  renderImagePreviews();
  renderAlbumPreview();
  return tasks.length;
}
function assertNoDataImages(){
  const found = [];
  imgDefs.forEach(([path])=>{ if(isDataUrl(getPath(config,path))) found.push(path); });
  (config.gallery || []).forEach((v,i)=>{ if(isDataUrl(v)) found.push('gallery['+i+']'); });
  return found;
}

async function load(){
  config = await WeddingCMS.loadConfig({includeDraft:true});
  buildImageFields(); bindTransformEditor(); fillForm(); setMsg('Đã tải cấu hình. Bạn có thể chỉnh nội dung, hình ảnh và lưu.');
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
function saveLocal(){ readForm(); WeddingCMS.saveDraft(config); setMsg('Đã lưu bản nháp. Bản nháp chỉ dùng trong trang admin và không làm thay đổi thiệp đang công khai.'); }
async function saveCloud(){
  readForm();
  const url = getCloudUrl();
  if(!url){
    setMsg('Chưa có Google Apps Script Web App URL nên chưa thể Lưu đồng bộ cho mọi thiết bị. Vào tab Thiết lập để cấu hình trước.');
    showTab('setup', true);
    return;
  }
  config.googleAppsScriptUrl = url;
  setMsg('Đang kiểm tra ảnh local trước khi lưu đồng bộ...');
  try{
    const uploadedCount = await uploadPendingLocalImages();
    const stillLocal = assertNoDataImages();
    if(stillLocal.length){
      setMsg('Chưa thể lưu đồng bộ vì vẫn còn ảnh local chưa upload: ' + stillLocal.join(', ') + '. Hãy thử chọn ảnh nhỏ hơn hoặc dán URL ảnh Drive.');
      return;
    }
    if(uploadedCount) setMsg('Đã chuyển ' + uploadedCount + ' ảnh lên Google Drive. Đang lưu dữ liệu thật lên Google Sheet...');
    else setMsg('Đang lưu dữ liệu thật lên Google Sheet...');
    const result = await WeddingCMS.postForm(url, {
      action:'saveConfig',
      password:config.adminPassword,
      configJson: JSON.stringify(config)
    });
    WeddingCMS.clearDraft();
    WeddingCMS.clearLive();
    await new Promise(r=>setTimeout(r,800));
    const remote = await WeddingCMS.jsonp(url,'getConfig');
    if(remote && remote.ok && remote.config){
      config = remote.config;
      fillForm();
      setMsg('Đã LƯU THẬT lên Google Sheet. Tất cả thiết bị sẽ thấy thay đổi sau khi tải lại trang thiệp.');
    }else{
      setMsg('Đã lưu nhưng chưa đọc lại được dữ liệu. Hãy refresh sau vài giây.');
    }
  }catch(err){
    console.error(err);
    setMsg('Chưa lưu được dữ liệu thật: ' + (err.message || err) + '. Hãy kiểm tra Apps Script đã dán code v1.13, Deploy Web App quyền Anyone, URL /exec đúng và ảnh không vượt dung lượng.');
  }
}
function resetLocal(){ if(confirm('Xóa bản nháp local và quay về dữ liệu đã lưu thật/Google Sheet?')){ WeddingCMS.clearDraft(); location.reload(); } }
function downloadConfig(){ readForm(); const blob=new Blob([JSON.stringify(config,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wedding-config.json'; a.click(); }
function renderLinks(){ readForm(); const base=location.origin + location.pathname.replace(/admin\.html$/,'index.html'); const text=(config.guests||[]).map(g=>`${g.name}: ${base}?id=${encodeURIComponent(g.id)}&name=${encodeURIComponent(g.name)}`).join('\n'); $('guestLinks').textContent=text; navigator.clipboard && navigator.clipboard.writeText(text).catch(()=>{}); }
function getLocalRsvps(){ try{return JSON.parse(localStorage.getItem('wedding_rsvp')||localStorage.getItem('wedding_rsvp_records')||'[]')}catch(e){return[]} }
async function renderRsvp(){
  rsvps = (config && config.googleAppsScriptUrl) ? [] : getLocalRsvps();
  if(config && config.googleAppsScriptUrl){ try{ const remote=await WeddingCMS.jsonp(config.googleAppsScriptUrl,'getRsvps'); if(remote && remote.ok && Array.isArray(remote.rsvps)) rsvps=remote.rsvps; }catch(e){ setMsg('Chưa đọc được RSVP cloud: ' + (e.message || e)); } }
  $('total').textContent=rsvps.length; $('yes').textContent=rsvps.filter(x=>x.attending==='Có tham dự').length; $('no').textContent=rsvps.filter(x=>x.attending==='Rất tiếc không thể tham dự').length; $('bride').textContent=rsvps.filter(x=>x.guestOf==='Cô dâu').length; $('groom').textContent=rsvps.filter(x=>x.guestOf==='Chú rể').length; $('common').textContent=rsvps.filter(x=>x.guestOf==='Khách chung').length;
  $('rsvpRows').innerHTML=rsvps.map(x=>`<tr><td>${x.timestamp||''}</td><td>${x.guestId||''}</td><td>${x.guestName||''}</td><td>${x.attending||''}</td><td>${x.companions||''}</td><td>${x.guestOf||''}</td><td>${x.wish||''}</td></tr>`).join('');
}
function exportCsv(){ const head=['Timestamp','Guest ID','Tên khách','Tham dự','Đi cùng','Khách của','Lời chúc']; const lines=[head,...rsvps.map(x=>[x.timestamp,x.guestId,x.guestName,x.attending,x.companions,x.guestOf,x.wish])].map(r=>r.map(v=>'"'+String(v||'').replaceAll('"','""')+'"').join(',')); const blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='rsvp.csv'; a.click(); }
$('loginBtn').onclick=login; $('password').addEventListener('keydown',e=>{if(e.key==='Enter')login()}); document.querySelector('.tabs').onclick=switchTab; $('saveLocalBtn').onclick=saveLocal; $('saveCloudBtn').onclick=saveCloud; $('downloadConfigBtn').onclick=downloadConfig; $('resetLocalBtn').onclick=resetLocal; $('copyLinksBtn').onclick=renderLinks; $('refreshRsvpBtn').onclick=renderRsvp; $('exportCsvBtn').onclick=exportCsv; $('clearLocalBtn').onclick=()=>{ if(confirm('Xóa RSVP local trên trình duyệt này?')){ localStorage.removeItem('wedding_rsvp'); localStorage.removeItem('wedding_rsvp_records'); renderRsvp(); }};
$('galleryFiles').onchange=addGalleryFiles; $('galleryText').addEventListener('input', renderAlbumPreview); $('clearGalleryBtn').onclick=()=>{ if(confirm('Xóa danh sách ảnh album đang nhập?')){ $('galleryText').value=''; renderAlbumPreview(); }};
window.addEventListener('hashchange', ()=>showTab((location.hash||'#content').replace('#',''), false));
setTimeout(()=>showTab((location.hash||'#content').replace('#',''), false), 0);
