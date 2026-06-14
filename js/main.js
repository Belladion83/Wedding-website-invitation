let C = null;
let galleryIndex = 0;
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const guestId = params.get('id') || params.get('guest') || '';
const guestNameParam = params.get('name') || '';
function setText(id, value){ const el=$(id); if(el) el.textContent = value || ''; }
function setSrc(id, value){ const el=$(id); if(el) el.src = value || ''; }
function setBg(id, value){ const el=$(id); if(el) el.style.backgroundImage = value ? `url("${value}")` : ''; }
function stripPrefix(s){ return String(s || '').replace(/^Ông:\s*/i,'').replace(/^Bà:\s*/i,'').replace(/^Địa chỉ:\s*/i,''); }
function resolveGuest(){
  const found = (C.guests || []).find(g => String(g.id || '').toLowerCase() === String(guestId || '').toLowerCase());
  return { id: guestId, name: guestNameParam || (found && found.name) || '', side: (found && found.side) || '' };
}
function initContent(){
  document.documentElement.style.setProperty('--gold', C.site.colorPrimary || '#b98645');
  document.documentElement.style.setProperty('--gold2', C.site.colorPrimary || '#d7b77f');
  $('bgMusic').src = C.site.musicUrl || '';
  setText('introGroom', C.site.groomShortName); setText('introBride', C.site.brideShortName); setText('introDate', C.site.displayDate); setText('introType', C.site.eventType);
  document.querySelectorAll('[data-bind="site.saveText"]').forEach(el => el.textContent = C.site.saveText || 'SAVE OUR DATE');
  setSrc('envPhoto1', C.images.envelope1); setSrc('envPhoto2', C.images.envelope2); setText('envDate1', C.site.displayDate); setText('envDate2', C.site.displayDate);
  setBg('heroPhoto', C.images.hero); setBg('thanks', C.images.thankYouBg || C.images.hero);
  setText('heroGroomName', (C.site.groomFullName || '').toUpperCase());
  setText('heroBrideName', (C.site.brideFullName || '').toUpperCase());
  setText('heroDate', C.site.displayDate);
  const guest = resolveGuest();
  if (guest.name) $('inviteeLine').innerHTML = `<span>Kính mời</span><span>${escapeHtml(guest.name)}</span>`;
  setSrc('groomPhoto', C.images.groom); setSrc('bridePhoto', C.images.bride); setSrc('eventGroomPhoto', C.images.groom); setSrc('eventBridePhoto', C.images.bride);
  setText('groomName', C.couple.groom.name); setText('groomBirthday', C.couple.groom.birthday); setText('groomSubtitle', C.couple.groom.subtitle); setText('groomAddress', C.couple.groom.address);
  setText('brideName', C.couple.bride.name); setText('brideBirthday', C.couple.bride.birthday); setText('brideSubtitle', C.couple.bride.subtitle); setText('brideAddress', C.couple.bride.address);
  setText('storyTitle', C.story.title || 'OUR STORY'); setText('storyText', C.story.text);
  setText('eventGroomRole', C.site.groomRole || 'Trưởng Nam'); setText('eventBrideRole', C.site.brideRole || 'Trưởng Nữ'); setText('eventGroomShort', C.site.groomShortName); setText('eventBrideShort', C.site.brideShortName);
  setText('groomFather', stripPrefix(C.families.groomSide.father)); setText('groomMother', stripPrefix(C.families.groomSide.mother)); setText('groomFamAddress', stripPrefix(C.families.groomSide.address));
  setText('brideFather', stripPrefix(C.families.brideSide.father)); setText('brideMother', stripPrefix(C.families.brideSide.mother)); setText('brideFamAddress', stripPrefix(C.families.brideSide.address));
  setText('formalGroomName', C.site.groomFullName); setText('formalGroomRole', String(C.site.groomRole || 'Trưởng Nam').toUpperCase()); setText('formalBrideName', C.site.brideFullName); setText('formalBrideRole', String(C.site.brideRole || 'Trưởng Nữ').toUpperCase());
  setText('ceremonyTitle', C.event.ceremonyTitle || 'TIỆC BÁO HỶ ĐƯỢC TỔ CHỨC TẠI'); setText('venue', C.event.venue); setText('venueAddress', C.event.address); setText('eventTime', C.event.timeLabel); setText('eventDay', C.event.dayLabel); setText('eventDateDay', C.event.dateDay); setText('eventMonth', C.event.monthLabel); setText('eventYear', C.event.year); setText('eventLunar', C.event.lunarDate);
  const map = $('mapBtn'); if(map) map.href = C.site.googleMapsUrl || '#';
  setText('thanksNames', `${C.site.groomShortName} & ${C.site.brideShortName}`.toUpperCase()); setText('thanksDate', C.site.displayDate);
  fillGift('', C.banking.bride, C.banking.groom);
  buildGallery();
}
function escapeHtml(v){return String(v||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function fillGift(suffix, bride, groom){
  setText('brideGiftTitle'+suffix, bride.title); setSrc('brideQr'+suffix, bride.qr); setText('brideBank'+suffix, bride.bank); setText('brideAcc'+suffix, bride.accountNo); setText('brideNameBank'+suffix, bride.accountName); setText('brideMemo'+suffix, bride.memo);
  setText('groomGiftTitle'+suffix, groom.title); setSrc('groomQr'+suffix, groom.qr); setText('groomBank'+suffix, groom.bank); setText('groomAcc'+suffix, groom.accountNo); setText('groomNameBank'+suffix, groom.accountName); setText('groomMemo'+suffix, groom.memo);
}
function buildGallery(){
  const grid = $('galleryGrid'); if(!grid) return;
  const imgs = (C.gallery || []).filter(Boolean);
  const shown = imgs.slice(0,16);
  grid.innerHTML = shown.map((src,i)=>`<div class="thumb" data-i="${i}"><img src="${src}" alt="Ảnh cưới ${i+1}">${i===15 && imgs.length>16 ? `<div class="more">+${imgs.length-15}<br>Ảnh khác</div>` : ''}</div>`).join('');
  grid.querySelectorAll('.thumb').forEach(el=>el.onclick=()=>openLightbox(Number(el.dataset.i)));
}
function openLightbox(i){ galleryIndex=i; const imgs=C.gallery||[]; if(!imgs.length) return; $('lightboxImg').src=imgs[galleryIndex%imgs.length]; $('lightbox').classList.add('open'); }
function navLightbox(step){ const imgs=C.gallery||[]; if(!imgs.length) return; galleryIndex=(galleryIndex+step+imgs.length)%imgs.length; $('lightboxImg').src=imgs[galleryIndex]; }
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
  $('openEnvelope').onclick = () => $('envelope').classList.add('opened');
  $('enterSite').onclick = () => { $('intro').classList.add('hidden'); $('site').classList.remove('hidden'); $('musicToggle').classList.remove('hidden'); playMusic(); window.scrollTo({top:0, behavior:'smooth'}); };
  $('musicStart').onclick = playMusic; $('musicToggle').onclick = toggleMusic;
  $('giftBtn').onclick = () => $('giftSheet').classList.add('open'); $('closeGift').onclick = () => $('giftSheet').classList.remove('open'); $('backInvite').onclick = () => $('giftSheet').classList.remove('open');
  $('closeLightbox').onclick=()=> $('lightbox').classList.remove('open'); $('prevImg').onclick=()=>navLightbox(-1); $('nextImg').onclick=()=>navLightbox(1);
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
    const arr = JSON.parse(localStorage.getItem('wedding_rsvp_records') || '[]'); arr.push(payload); localStorage.setItem('wedding_rsvp_records', JSON.stringify(arr));
    localStorage.setItem('wedding_rsvp', JSON.stringify(arr));
    if(C.googleAppsScriptUrl) await WeddingCMS.postNoCors(C.googleAppsScriptUrl, payload);
    setText('formStatus','Cảm ơn Quý khách. Lời chúc và xác nhận đã được ghi nhận.'); e.target.reset();
  }catch(err){ console.error(err); setText('formStatus','Chưa gửi được xác nhận. Vui lòng thử lại sau.'); }
}
(async function init(){ C = await WeddingCMS.loadConfig(); initContent(); startCountdown(); initEvents(); })();
