let C = null;
let galleryIndex = 0;
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const guestId = params.get('id') || params.get('guest') || '';
const guestNameParam = params.get('name') || '';
function getPath(obj, path){ return path.split('.').reduce((o,k)=>o && o[k], obj); }
function setText(id, value){ const el=$(id); if(el) el.textContent = value || ''; }
function setSrc(id, value){ const el=$(id); if(el) el.src = value || ''; }
function setBg(id, value){ const el=$(id); if(el) el.style.backgroundImage = `url('${value}')`; }
function resolveGuest(){
  const list = C.guests || [];
  const found = list.find(g => String(g.id || '').toLowerCase() === String(guestId || '').toLowerCase());
  return { id: guestId, name: guestNameParam || (found && found.name) || '', side: (found && found.side) || '' };
}
function initContent(){
  document.documentElement.style.setProperty('--gold', C.site.colorPrimary || '#b98645');
  document.documentElement.style.setProperty('--gold2', C.site.colorPrimary || '#d7b77f');
  setText('introGroom', C.site.groomShortName); setText('introBride', C.site.brideShortName); setText('introDate', C.site.displayDate); setText('introType', C.site.eventType);
  document.querySelectorAll('[data-bind="site.saveText"]').forEach(el=>el.textContent=C.site.saveText || 'SAVE OUR DATE');
  setSrc('envPhoto1', C.images.envelope1); setSrc('envPhoto2', C.images.envelope2); setText('envDate1', C.site.displayDate); setText('envDate2', C.site.displayDate);
  setBg('heroBg', C.images.hero); setBg('thanks', C.images.thankYouBg || C.images.hero);
  setText('heroNames', `${C.site.groomFullName} & ${C.site.brideFullName}`); setText('heroDate', C.site.displayDate);
  const guest = resolveGuest();
  if(guest.name) setText('inviteeLine', `Kính mời ${guest.name}`);
  setSrc('groomPhoto', C.images.groom); setSrc('bridePhoto', C.images.bride);
  setText('groomName', C.couple.groom.name); setText('groomBirthday', `☷ ${C.couple.groom.birthday}`); setText('groomSubtitle', `✧ ${C.couple.groom.subtitle}`); setText('groomAddress', `⌖ ${C.couple.groom.address}`);
  setText('brideName', C.couple.bride.name); setText('brideBirthday', `☷ ${C.couple.bride.birthday}`); setText('brideSubtitle', `✧ ${C.couple.bride.subtitle}`); setText('brideAddress', `⌖ ${C.couple.bride.address}`);
  setText('storyTitle', C.story.title); setText('storyText', C.story.text);
  setText('groomSideTitle', C.families.groomSide.title); setText('groomFather', C.families.groomSide.father); setText('groomMother', C.families.groomSide.mother); setText('groomFamAddress', C.families.groomSide.address);
  setText('brideSideTitle', C.families.brideSide.title); setText('brideFather', C.families.brideSide.father); setText('brideMother', C.families.brideSide.mother); setText('brideFamAddress', C.families.brideSide.address);
  setText('eventIntro', C.event.intro); setText('eventDesc', C.event.description); setText('venue', C.event.venue); setText('venueAddress', C.event.address); setText('eventDay', C.event.dayLabel); setText('eventDate', C.site.displayDate); setText('eventTime', C.event.timeLabel); $('mapBtn').href = C.site.googleMapsUrl || '#';
  setText('thanksNames', `${C.site.groomShortName} & ${C.site.brideShortName}`); setText('thanksDate', `${C.site.displayDate} ♥`);
  setText('brideGiftTitle', C.banking.bride.title); setSrc('brideQr', C.banking.bride.qr); setText('brideBank', `Ngân hàng: ${C.banking.bride.bank}`); setText('brideAcc', `STK: ${C.banking.bride.accountNo}`); setText('brideNameBank', `Tên TK: ${C.banking.bride.accountName}`); setText('brideMemo', `Nội dung CK: ${C.banking.bride.memo}`);
  setText('groomGiftTitle', C.banking.groom.title); setSrc('groomQr', C.banking.groom.qr); setText('groomBank', `Ngân hàng: ${C.banking.groom.bank}`); setText('groomAcc', `STK: ${C.banking.groom.accountNo}`); setText('groomNameBank', `Tên TK: ${C.banking.groom.accountName}`); setText('groomMemo', `Nội dung CK: ${C.banking.groom.memo}`);
  $('bgMusic').src = C.site.musicUrl || '';
  const nameInput = document.querySelector('[name="guestName"]');
  const sideSelect = document.querySelector('[name="guestOf"]');
  if(guest.name){ nameInput.value = guest.name; nameInput.readOnly = true; }
  if(guest.side) sideSelect.value = guest.side;
  renderGallery();
}
function renderGallery(){
  const grid = $('galleryGrid'); grid.innerHTML=''; const imgs=C.gallery || []; const shown=imgs.slice(0,16);
  shown.forEach((src,i)=>{ const d=document.createElement('div'); d.className='thumb'; d.innerHTML=`<img src="${src}" alt="Ảnh cưới ${i+1}">`; if(i===15 && imgs.length>16){ const m=document.createElement('div'); m.className='more'; m.textContent=`+${imgs.length-15}`; d.appendChild(m); } d.onclick=()=>openLightbox(i); grid.appendChild(d); });
}
function openLightbox(i){ galleryIndex=i; $('lightbox').classList.add('open'); $('lightboxImg').src=C.gallery[galleryIndex]; }
function moveGallery(step){ galleryIndex=(galleryIndex+step+C.gallery.length)%C.gallery.length; $('lightboxImg').src=C.gallery[galleryIndex]; }
function startMusic(){ const a=$('bgMusic'); if(!a.src) return; a.play().catch(()=>{}); $('musicToggle').classList.remove('hidden'); }
function countdown(){ const target=new Date(C.site.weddingDate).getTime(); const now=Date.now(); let diff=Math.max(0,target-now); const d=Math.floor(diff/86400000); diff-=d*86400000; const h=Math.floor(diff/3600000); diff-=h*3600000; const m=Math.floor(diff/60000); diff-=m*60000; const s=Math.floor(diff/1000); const vals=[d,h,m,s]; document.querySelectorAll('#countdown strong').forEach((el,i)=>el.textContent=String(vals[i]).padStart(2,'0')); }
function localSave(payload){ const arr=JSON.parse(localStorage.getItem('wedding_rsvp')||'[]'); arr.push(payload); localStorage.setItem('wedding_rsvp',JSON.stringify(arr)); }
async function submitRsvp(e){
  e.preventDefault(); const fd=new FormData(e.target); const guest=resolveGuest();
  const payload={ action:'rsvp', timestamp:new Date().toISOString(), guestId: guest.id || '', guestName:fd.get('guestName'), wish:fd.get('wish'), attending:fd.get('attending'), companions:fd.get('companions'), guestOf:fd.get('guestOf')};
  $('formStatus').textContent='Đang gửi xác nhận...';
  try{ if(C.googleAppsScriptUrl){ await WeddingCMS.postNoCors(C.googleAppsScriptUrl, payload); } localSave(payload); $('formStatus').textContent='Cảm ơn Quý khách! Cô dâu và chú rể đã nhận được xác nhận.'; e.target.reset(); if(guest.name){ const nameInput=document.querySelector('[name="guestName"]'); nameInput.value=guest.name; nameInput.readOnly=true;} if(guest.side) document.querySelector('[name="guestOf"]').value=guest.side; }
  catch(err){ localSave(payload); $('formStatus').textContent='Đã lưu xác nhận trên thiết bị. Vui lòng gửi lại nếu cần.'; }
}
function initEvents(){ $('openEnvelope').onclick=()=> $('envelope').classList.add('opened'); $('enterSite').onclick=()=>{ $('intro').classList.add('hidden'); $('site').classList.remove('hidden'); startMusic(); setTimeout(()=>window.scrollTo(0,0),0);}; $('musicStart').onclick=startMusic; $('musicToggle').onclick=()=>{ const a=$('bgMusic'); if(a.paused){a.play(); $('musicToggle').textContent='♪'} else {a.pause(); $('musicToggle').textContent='♫'} }; $('rsvpForm').onsubmit=submitRsvp; $('giftBtn').onclick=()=> $('giftSheet').classList.add('open'); $('closeGift').onclick=$('backInvite').onclick=()=> $('giftSheet').classList.remove('open'); $('closeLightbox').onclick=()=> $('lightbox').classList.remove('open'); $('prevImg').onclick=()=>moveGallery(-1); $('nextImg').onclick=()=>moveGallery(1); }
function revealOnScroll(){ const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12}); document.querySelectorAll('.section-reveal').forEach(el=>io.observe(el)); }
(async function(){ C = await WeddingCMS.loadConfig(); initContent(); initEvents(); revealOnScroll(); countdown(); setInterval(countdown,1000); })();
