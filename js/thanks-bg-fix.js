(function(){
  function getImageValue(cfg){
    return cfg && cfg.images ? (cfg.images.thankYouBg || cfg.images.hero || '') : '';
  }
  function getTransform(cfg){
    const t = cfg && cfg.imageTransforms && cfg.imageTransforms.thankYouBg ? cfg.imageTransforms.thankYouBg : {};
    return {
      x: Number(t.x ?? 50),
      y: Number(t.y ?? 50),
      zoom: Number(t.zoom ?? 1)
    };
  }
  function applyUrl(el, url, t){
    if(!el || !url) return;
    el.style.setProperty('--thanks-bg', 'url("' + url + '")');
    el.style.setProperty('background-image', 'url("' + url + '")', 'important');
    el.style.setProperty('background-position', t.x + '% ' + t.y + '%', 'important');
    el.style.setProperty('background-size', Math.max(100, t.zoom * 100) + '%', 'important');
    el.style.setProperty('background-repeat', 'no-repeat', 'important');
    el.dataset.bg = url;
  }
  function candidatesFor(value){
    if(!value) return [];
    if(window.WeddingCMS && WeddingCMS.driveImageCandidates) return WeddingCMS.driveImageCandidates(value).filter(Boolean);
    if(window.WeddingCMS && WeddingCMS.normalizeImageUrl) return [WeddingCMS.normalizeImageUrl(value)].filter(Boolean);
    return [value];
  }
  function testAndApply(el, list, t, index){
    if(!el || !list.length || index >= list.length) return;
    const url = list[index];
    applyUrl(el, url, t);
    const img = new Image();
    img.onload = function(){ applyUrl(el, url, t); };
    img.onerror = function(){ testAndApply(el, list, t, index + 1); };
    img.src = url;
  }
  async function refreshThanksBg(){
    const el = document.getElementById('thanks');
    if(!el || !window.WeddingCMS) return;
    try{
      const cfg = await WeddingCMS.loadConfig();
      const raw = getImageValue(cfg);
      const t = getTransform(cfg);
      const list = candidatesFor(raw);
      if(list.length) testAndApply(el, list, t, 0);
    }catch(e){
      console.warn('Thank You background refresh failed', e);
    }
  }
  function restoreMapTarget(){
    const map = document.getElementById('mapBtn');
    if(map){
      map.target = '_blank';
      map.rel = 'noopener';
    }
  }
  function applyCalendarRequestedFix(){
    if(document.getElementById('calendar-requested-fix-v178')) return;
    const style = document.createElement('style');
    style.id = 'calendar-requested-fix-v178';
    style.textContent = `
      .calendar39::before{
        content:none !important;
        display:none !important;
        border:none !important;
        background:none !important;
        opacity:0 !important;
      }
      .calendar39 h2{
        font-family:"Playfair Display", serif !important;
        font-weight:700 !important;
        font-size:clamp(26px, 6vw, 42px) !important;
        line-height:1.12 !important;
        letter-spacing:.04em !important;
        text-transform:none !important;
        color:var(--t39-gold) !important;
        text-align:center !important;
        margin:0 auto 14px !important;
      }
    `;
    document.head.appendChild(style);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ refreshThanksBg(); restoreMapTarget(); applyCalendarRequestedFix(); });
  else { refreshThanksBg(); restoreMapTarget(); applyCalendarRequestedFix(); }
  window.addEventListener('load', function(){ refreshThanksBg(); restoreMapTarget(); applyCalendarRequestedFix(); });
  setTimeout(refreshThanksBg, 1200);
  setTimeout(refreshThanksBg, 3500);
})();
