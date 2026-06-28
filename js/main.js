let C = null;
let galleryIndex = 0;
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const guestId = params.get('id') || params.get('guest') || '';
const guestNameParam = params.get('name') || '';
function setText(id, value){ const el=$(id); if(el) el.textContent = value || ''; }
function imgUrl(value){ return WeddingCMS && WeddingCMS.normalizeImageUrl ? WeddingCMS.normalizeImageUrl(value) : (value || ''); }
function setSrc(id, value){ const el=$(id); if(el) el.src = imgUrl(value); }
function setBg(id, value){ const el=$(id); const v = imgUrl(value); if(el) el.style.backgroundImage = v ? `url("${v}")` : ''; }

const DEFAULT_IMAGE_TRANSFORMS = {
  hero: { x: 50, y: 50, zoom: 1 },
  envelope1: { x: 50, y: 50, zoom: 1 },
  envelope2: { x: 50, y: 50, zoom: 1 },
  groom: { x: 50, y: 28, zoom: 1 },
  bride: { x: 50, y: 26, zoom: 1 },
  thankYouBg: { x: 50, y: 50, zoom: 1 }
};
function getTransform(kind){
  const fallback = DEFAULT_IMAGE_TRANSFORMS[kind] || { x: 50, y: 50, zoom: 1 };
  const base = (C && C.imageTransforms && C.imageTransforms[kind]) || {};
  return {
    x: Number(base.x ?? fallback.x),
    y: Number(base.y ?? fallback.y),
    zoom: Number(base.zoom ?? fallback.zoom)
  };
}
function applyImgTransform(el, kind){
  if(!el) return;
  const t = getTransform(kind);
  el.style.objectPosition = `${t.x}% ${t.y}%`;
  el.style.transform = `scale(${t.zoom})`;
  el.style.transformOrigin = 'center center';
}
function applyBgTransform(el, kind){
  if(!el) return;
  const t = getTransform(kind);
  el.style.backgroundPosition = `${t.x}% ${t.y}%`;
  el.style.backgroundSize = `${Math.max(100, t.zoom * 100)}%`;
  el.style.backgroundRepeat = 'no-repeat';
}
function stripPrefix(s){ return String(s || '').replace(/^Ông:\s*/i,'').replace(/^Bà:\s*/i,'').replace(/^Địa chỉ:\s*/i,''); }
function toNameCase(s){
  return String(s || '')
    .trim()
    .toLocaleLowerCase('vi-VN')
    .replace(/(^|[\s\-'])\p{L}/gu, m => m.toLocaleUpperCase('vi-VN'));
}
function resolveGuest(){
  const found = (C.guests || []).find(g => String(g.id || '').toLowerCase() === String(guestId || '').toLowerCase());
  return { id: guestId, name: guestNameParam || (found && found.name) || '', side: (found && found.side) || '' };
}

function prefillRsvpForm(){
  const form = $('rsvpForm');
  if(!form) return;
  const guest = resolveGuest();
  const nameInput = form.elements['guestName'];
  if(nameInput && guest.name) nameInput.value = guest.name;
  const guestOf = form.elements['guestOf'];
  if(guestOf && guest.side && [...guestOf.options].some(o => o.value === guest.side)) guestOf.value = guest.side;
}
function initContent(){
  document.documentElement.style.setProperty('--gold', C.site.colorPrimary || '#b98645');
  document.documentElement.style.setProperty('--gold2', C.site.colorPrimary || '#d7b77f');
  $('bgMusic').src = C.site.musicUrl || '';
  setText('introGroom', toNameCase(C.site.groomShortName)); setText('introBride', toNameCase(C.site.brideShortName)); setText('introDate', C.site.displayDate); setText('introType', C.site.eventType);
  document.querySelectorAll('[data-bind="site.saveText"]').forEach(el => el.textContent = C.site.saveText || 'SAVE OUR DATE');
  setSrc('envPhoto1', C.images.envelope1); setSrc('envPhoto2', C.images.envelope2); setText('envDate1', C.site.displayDate); setText('envDate2', C.site.displayDate);
  applyImgTransform($('envPhoto1'), 'envelope1'); applyImgTransform($('envPhoto2'), 'envelope2');
  setBg('heroPhoto', C.images.hero); setBg('thanks', C.images.thankYouBg || C.images.hero);
  applyBgTransform($('heroPhoto'), 'hero'); applyBgTransform($('thanks'), 'thankYouBg');
  setText('heroGroomName', toNameCase(C.site.groomFullName));
  setText('heroBrideName', toNameCase(C.site.brideFullName));
  setText('heroDate', C.site.displayDate);
  const guest = resolveGuest();
  if (guest.name) $('inviteeLine').innerHTML = `<span>Kính mời</span><span>${escapeHtml(guest.name)}</span>`;
  setSrc('groomPhoto', C.images.groom); setSrc('bridePhoto', C.images.bride); setSrc('eventGroomPhoto', C.images.groom); setSrc('eventBridePhoto', C.images.bride);
  applyImgTransform($('groomPhoto'), 'groom'); applyImgTransform($('eventGroomPhoto'), 'groom'); applyImgTransform($('bridePhoto'), 'bride'); applyImgTransform($('eventBridePhoto'), 'bride');
  setText('groomName', toNameCase(C.couple.groom.name)); setText('groomBirthday', C.couple.groom.birthday); setText('groomSubtitle', C.couple.groom.subtitle); setText('groomAddress', C.couple.groom.address);
  setText('brideName', toNameCase(C.couple.bride.name)); setText('brideBirthday', C.couple.bride.birthday); setText('brideSubtitle', C.couple.bride.subtitle); setText('brideAddress', C.couple.bride.address);
  setText('storyTitle', C.story.title || 'OUR STORY'); setText('storyText', C.story.text);
  setText('eventGroomRole', C.site.groomRole || 'Trưởng Nam'); setText('eventBrideRole', C.site.brideRole || 'Trưởng Nữ'); setText('eventGroomShort', toNameCase(C.site.groomShortName)); setText('eventBrideShort', toNameCase(C.site.brideShortName));
  setText('groomFather', stripPrefix(C.families.groomSide.father)); setText('groomMother', stripPrefix(C.families.groomSide.mother)); setText('groomFamAddress', stripPrefix(C.families.groomSide.address));
  setText('brideFather', stripPrefix(C.families.brideSide.father)); setText('brideMother', stripPrefix(C.families.brideSide.mother)); setText('brideFamAddress', stripPrefix(C.families.brideSide.address));
  setText('formalGroomName', toNameCase(C.site.groomFullName)); setText('formalGroomRole', String(C.site.groomRole || 'Trưởng Nam').toUpperCase()); setText('formalBrideName', toNameCase(C.site.brideFullName)); setText('formalBrideRole', String(C.site.brideRole || 'Trưởng Nữ').toUpperCase());
  setText('ceremonyTitle', C.event.ceremonyTitle || 'TIỆC BÁO HỶ ĐƯỢC TỔ CHỨC TẠI'); renderVenueBlock(C.event.venue); setText('venueAddress', C.event.address); setText('eventTime', C.event.timeLabel); setText('eventDay', C.event.dayLabel); setText('eventDateDay', C.event.dateDay); setText('eventMonth', C.event.monthLabel); setText('eventYear', C.event.year); setText('eventLunar', C.event.lunarDate);
  const D = C.dresscode || {};
  setText('dresscodeKicker', D.kicker || 'Dresscode');
  setText('dresscodeTitle', D.title || 'TRANG PHỤC GỢI Ý');
  setText('dresscodeNote', D.note || 'Quý khách vui lòng ưu tiên các gam màu: trắng, kem, nâu, hồng phấn, đen.');
  const map = $('mapBtn'); if(map) map.href = C.site.googleMapsUrl || '#';
  setText('thanksNames', `${toNameCase(C.site.groomShortName)} & ${toNameCase(C.site.brideShortName)}`); setText('thanksDate', C.site.displayDate);
  prefillRsvpForm();
  fillGift('', C.banking.bride, C.banking.groom);
  buildGallery();
  renderCalendar39();
  renderTimeline39();
  bindWish39();
}
function escapeHtml(v){return String(v||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function titleCaseWords(str){
  return String(str || "")
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w === "&" ? "&" : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .replace(/\s*&\s*/g, " & ")
    .trim();
}
function renderVenueBlock(value){
  const el = $('venue');
  if(!el) return;
  const raw = String(value || '').trim();
  let line1 = raw, line2 = '', line3 = '';
  if(raw.includes('\n')){
    const parts = raw.split(/\n+/).map(s=>s.trim()).filter(Boolean);
    line1 = parts[0] || '';
    line2 = parts[1] || '';
    line3 = parts[2] || '';
  }else if(/JOLIE WEDDING & EVENT/i.test(raw)) {
    line1 = raw.replace(/\s*JOLIE WEDDING & EVENT\s*/i,'').trim();
    line2 = 'Jolie Wedding & Event';
  }
  if(line2){
    const normalized = line2.toLowerCase().replace(/\s+/g,' ').trim();
    if(normalized === 'jolie wedding & event') line2 = 'Jolie Wedding & Event';
    else line2 = titleCaseWords(line2);
  }
  el.innerHTML = `<span class="venue-main">${escapeHtml(line1)}</span>${line2 ? `<span class="venue-brand">${escapeHtml(line2)}</span>` : ''}${line3 ? `<span class="venue-hall">${escapeHtml(line3)}</span>` : ''}`;
}
function fillGift(suffix, bride, groom){
  setText('brideGiftTitle'+suffix, bride.title); setSrc('brideQr'+suffix, bride.qr); setText('brideBank'+suffix, bride.bank); setText('brideAcc'+suffix, bride.accountNo); setText('brideNameBank'+suffix, bride.accountName); setText('brideMemo'+suffix, bride.memo);
  setText('groomGiftTitle'+suffix, groom.title); setSrc('groomQr'+suffix, groom.qr); setText('groomBank'+suffix, groom.bank); setText('groomAcc'+suffix, groom.accountNo); setText('groomNameBank'+suffix, groom.accountName); setText('groomMemo'+suffix, groom.memo);
}
function buildGallery(){
  const grid = $('galleryGrid'); if(!grid) return;
  const imgs = (C.gallery || []).filter(Boolean);
  const shown = imgs.slice(0,16);
  grid.innerHTML = shown.map((src,i)=>`<div class="thumb" data-i="${i}"><img src="${imgUrl(src)}" alt="Ảnh cưới ${i+1}">${i===15 && imgs.length>16 ? `<div class="more">+${imgs.length-15}<br>Ảnh khác</div>` : ''}</div>`).join('');
  grid.querySelectorAll('.thumb').forEach(el=>el.onclick=()=>openLightbox(Number(el.dataset.i)));
}
function openLightbox(i){ galleryIndex=i; const imgs=C.gallery||[]; if(!imgs.length) return; $('lightboxImg').src=imgUrl(imgs[galleryIndex%imgs.length]); $('lightbox').classList.add('open'); }
function navLightbox(step){ const imgs=C.gallery||[]; if(!imgs.length) return; galleryIndex=(galleryIndex+step+imgs.length)%imgs.length; $('lightboxImg').src=imgUrl(imgs[galleryIndex]); }
function startCountdown(){
  const boxes = document.querySelectorAll('#countdown strong');
  const target = new Date(C.site.weddingDate || '2026-06-29T18:00:00+07:00');
  function tick(){
    const diff = Math.max(0, target - new Date());
    const vals = [Math.floor(diff/864e5), Math.floor(diff/36e5)%24, Math.floor(diff/6e4)%60, Math.floor(diff/1e3)%60];
    vals.forEach((v,i)=>{ if(boxes[i]) boxes[i].textContent=String(v).padStart(2,'0'); });
  }
  tick(); setInterval(tick,1000);
}
function initEvents(){
  const gate = $('envelope');
  const openBtn = $('openEnvelopeButton');
  let introOpened = false;

  const revealSiteBelow = () => {
    $('site').classList.remove('hidden');
    $('musicToggle').classList.remove('hidden');
    $('intro').classList.add('sequence-done');
    const offset = Math.max(Math.round(window.innerHeight * 0.30), 230);
    window.scrollTo({ top: offset, behavior: 'smooth' });
  };

  const openInvitation = (e) => {
    if(e) e.stopPropagation();
    if(introOpened) return;
    introOpened = true;
    playMusic();

    if(gate) gate.classList.add('opened');
    setTimeout(()=>{ if(gate) gate.classList.add('flap-back'); }, 760);
    setTimeout(()=>{ if(gate) gate.classList.add('card-pull'); }, 840);
    setTimeout(()=>{ if(gate) gate.classList.add('card-front'); }, 1520);
    setTimeout(revealSiteBelow, 2700);
  };

  if(openBtn) openBtn.onclick = openInvitation;

  $('giftBtn').onclick = ()=> $('giftOverlay').classList.add('show');
  $('giftBack').onclick = ()=> $('giftOverlay').classList.remove('show');
  $('lightbox').onclick = (e)=> { if(e.target.id==='lightbox') $('lightbox').classList.remove('show'); };
  $('closeLightbox').onclick=()=> $('lightbox').classList.remove('show'); $('prevImg').onclick=()=>navLightbox(-1); $('nextImg').onclick=()=>navLightbox(1);
  $('rsvpForm').onsubmit = submitRsvp;
  const obs = new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting && x.target.classList.add('visible')), {threshold:.14});
  document.querySelectorAll('.section-reveal').forEach(el=>obs.observe(el));
}
async function playMusic(){ const a=$('bgMusic'); if(!a || !a.src) return; try{ await a.play(); $('musicToggle').textContent='Tắt nhạc'; }catch(e){ console.warn(e); } }
function toggleMusic(){ const a=$('bgMusic'); if(!a) return; if(a.paused) playMusic(); else { a.pause(); $('musicToggle').textContent='Nhạc'; } }
async function submitRsvp(e){
  e.preventDefault();
  const guest = resolveGuest();
  const data = Object.fromEntries(new FormData(e.target));
  const payload = { action:'rsvp', timestamp:new Date().toISOString(), guestId: guest.id || '', guestLinkName: guest.name || '', ...data };
  try{
    if(C.googleAppsScriptUrl){
      await WeddingCMS.postForm(C.googleAppsScriptUrl, { action:'rsvp', payloadJson: JSON.stringify(payload) });
    }else{
      const arr = JSON.parse(localStorage.getItem('wedding_rsvp_records') || '[]');
      arr.push(payload);
      localStorage.setItem('wedding_rsvp_records', JSON.stringify(arr));
      localStorage.setItem('wedding_rsvp', JSON.stringify(arr));
    }
    setText('formStatus','Cảm ơn Quý khách. Lời chúc và xác nhận đã được ghi nhận.'); e.target.reset(); prefillRsvpForm();
  }catch(err){
    console.error(err);
    setText('formStatus','Chưa gửi được xác nhận. Vui lòng thử lại sau.');
  }
}
(async function init(){ C = await WeddingCMS.loadConfig(); initContent(); startCountdown(); initEvents(); })();



function getTimelineIconSvg(it, idx){
  const raw = `${it?.title || ''} ${it?.description || ''}`.toLowerCase();
  const kind = /báo hỷ|bao hy|nghi lễ|nghi le|nhẫn|nhan|ceremony/.test(raw)
    ? 'rings'
    : (/khai tiệc|khai tiec|tiệc|tiec|dinner|banquet/.test(raw) ? 'dining' : 'welcome');

  if(kind === 'rings') return `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M32 10.5c1.3-2 3.2-3 5.5-3 3.8 0 6.5 2.8 6.5 6.4 0 1.9-.7 3.5-2.3 5.3L32 29.6 22.3 19.2c-1.6-1.8-2.3-3.4-2.3-5.3 0-3.6 2.7-6.4 6.5-6.4 2.3 0 4.2 1 5.5 3Z"></path>
      <circle cx="24" cy="41" r="12.2"></circle>
      <circle cx="40" cy="41" r="12.2"></circle>
    </svg>`;

  if(kind === 'dining') return `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="34" r="14.8"></circle>
      <circle cx="32" cy="34" r="8.5"></circle>
      <path d="M15 16v32"></path>
      <path d="M11.8 16v10"></path>
      <path d="M15 16v10"></path>
      <path d="M18.2 16v10"></path>
      <path d="M49 16v32"></path>
      <path d="M45.8 16c0 3.8 1.2 6.8 3.2 9.2"></path>
      <path d="M49 16c0 3.8 0 32 0 32"></path>
      <path d="M52.2 16c0 3.8-1.2 6.8-3.2 9.2"></path>
    </svg>`;

  return `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="14" y="16" width="36" height="33" rx="1.5"></rect>
      <path d="M14 49h36"></path>
      <path d="M20 22v17"></path>
      <path d="M44 22v17"></path>
      <path d="M14 16h36"></path>
      <path d="M18 16c6 9 22 9 28 0"></path>
      <path d="M22 16c4 6 16 6 20 0"></path>
      <path d="M26 16c2 3 8 3 12 0"></path>
      <path d="M20 39c2.6-1.2 4.1-2.3 4.1-3.4V22"></path>
      <path d="M44 39c-2.6-1.2-4.1-2.3-4.1-3.4V22"></path>
      <path d="M17 53h30"></path>
    </svg>`;
}
function renderCalendar39(){
  const grid = $('calendarGrid');
  if(!grid || !C || !C.site) return;
  const date = new Date(C.site.weddingDate || '2026-07-18T18:00:00+07:00');
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const cells = [];
  for(let i=0;i<startOffset;i++) cells.push('<span class="muted"></span>');
  for(let day=1; day<=last.getDate(); day++){
    const cls = day === d ? 'active' : '';
    cells.push(`<span class="${cls}">${day}${day === d ? '<b>♥</b>' : ''}</span>`);
  }
  grid.innerHTML = cells.join('');
}

function renderTimeline39(){
  const wrap = $('timelineList');
  if(!wrap) return;
  const items = (C.timeline && C.timeline.length ? C.timeline : [
    {time:'17:30', title:'Đón Khách', description:''},
    {time:'18:30', title:'Tiệc Báo Hỷ', description:''},
    {time:'19:00', title:'Khai Tiệc', description:''}
  ]);
  wrap.innerHTML = items.map((it,idx)=>`
    <article class="timeline-item timeline-card">
      <div class="timeline-icon" aria-hidden="true">${getTimelineIconSvg(it, idx)}</div>
      <div class="time-dot timeline-time"><span class="timeline-time-text">${escapeHtml(it.time || '')}</span></div>
      <h3>${escapeHtml(it.title || '')}</h3>
    </article>
  `).join('');
}

function bindWish39(){
  const btn = $('floatingWishBtn');
  const txt = $('floatingWish');
  const stage = $('heartStage');
  if(!btn || !txt || !stage) return;
  btn.onclick = ()=>{
    const value = (txt.value || '').trim();
    if(value){
      const current = $('wish') || null;
      if(current && !current.value) current.value = value;
    }
    for(let i=0;i<18;i++){
      const h = document.createElement('span');
      h.className = 'fly-heart';
      h.textContent = ['♥','♡','❤'][i % 3];
      h.style.left = (45 + Math.random()*12) + '%';
      h.style.animationDelay = (Math.random()*0.25) + 's';
      h.style.setProperty('--x', (Math.random()*160 - 80) + 'px');
      h.style.setProperty('--y', (-80 - Math.random()*180) + 'px');
      stage.appendChild(h);
      setTimeout(()=>h.remove(), 1700);
    }
    txt.value = '';
  };
}
