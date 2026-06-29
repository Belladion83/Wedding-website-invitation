(function(){
  function candidates(value){
    if(!value) return [];
    if(window.WeddingCMS && WeddingCMS.driveImageCandidates) return WeddingCMS.driveImageCandidates(value).filter(Boolean);
    if(window.WeddingCMS && WeddingCMS.normalizeImageUrl) return [WeddingCMS.normalizeImageUrl(value)].filter(Boolean);
    return [value];
  }

  function setImageWithFallback(el, value){
    if(!el) return;
    const list = candidates(value);
    if(!list.length){ el.removeAttribute('src'); return; }
    let i = 0;
    const tryNext = function(){
      if(i >= list.length) return;
      el.src = list[i++];
    };
    el.onerror = tryNext;
    tryNext();
  }

  function setBgWithFallback(el, value){
    if(!el) return;
    const list = candidates(value);
    if(!list.length){
      el.style.removeProperty('background-image');
      return;
    }
    let i = 0;
    const tryNext = function(){
      if(i >= list.length) return;
      const url = list[i++];
      el.style.setProperty('background-image', 'url("' + url + '")', 'important');
      el.dataset.bg = url;
      const img = new Image();
      img.onload = function(){
        el.style.setProperty('background-image', 'url("' + url + '")', 'important');
        el.dataset.bg = url;
      };
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  }

  function applyObjectPosition(el, t, fallbackX, fallbackY){
    if(!el) return;
    const x = Number((t && t.x) ?? fallbackX ?? 50);
    const y = Number((t && t.y) ?? fallbackY ?? 50);
    const zoom = Number((t && t.zoom) ?? 1);
    el.style.objectPosition = x + '% ' + y + '%';
    el.style.transform = 'scale(' + zoom + ')';
    el.style.transformOrigin = 'center center';
  }

  function applyBgPosition(el, t, fallbackX, fallbackY){
    if(!el) return;
    const x = Number((t && t.x) ?? fallbackX ?? 50);
    const y = Number((t && t.y) ?? fallbackY ?? 50);
    const zoom = Number((t && t.zoom) ?? 1);
    el.style.setProperty('background-position', x + '% ' + y + '%', 'important');
    el.style.setProperty('background-size', Math.max(100, zoom * 100) + '%', 'important');
    el.style.setProperty('background-repeat', 'no-repeat', 'important');
  }

  async function restoreImages(){
    if(!window.WeddingCMS || !WeddingCMS.loadConfig) return;
    const cfg = await WeddingCMS.loadConfig();
    const images = cfg.images || {};
    const tf = cfg.imageTransforms || {};

    setBgWithFallback(document.getElementById('heroPhoto'), images.hero);
    applyBgPosition(document.getElementById('heroPhoto'), tf.hero, 50, 50);

    setBgWithFallback(document.getElementById('introCardPhoto'), images.openingCardImage || images.envelope2 || images.hero);

    setImageWithFallback(document.getElementById('eventGroomPhoto'), images.groom);
    setImageWithFallback(document.getElementById('eventBridePhoto'), images.bride);
    applyObjectPosition(document.getElementById('eventGroomPhoto'), tf.groom, 50, 28);
    applyObjectPosition(document.getElementById('eventBridePhoto'), tf.bride, 50, 26);

    const thanks = document.getElementById('thanks');
    setBgWithFallback(thanks, images.thankYouBg || images.hero);
    applyBgPosition(thanks, tf.thankYouBg, 50, 50);

    setImageWithFallback(document.getElementById('brideQr'), (cfg.banking && cfg.banking.bride && cfg.banking.bride.qr) || '');
    setImageWithFallback(document.getElementById('groomQr'), (cfg.banking && cfg.banking.groom && cfg.banking.groom.qr) || '');

    const grid = document.getElementById('galleryGrid');
    const gallery = (cfg.gallery || []).filter(Boolean);
    if(grid && gallery.length){
      grid.querySelectorAll('img').forEach(function(img, idx){
        if(gallery[idx]) setImageWithFallback(img, gallery[idx]);
      });
    }
  }

  function boot(){
    restoreImages().catch(function(e){ console.warn('Image restore failed', e); });
    setTimeout(function(){ restoreImages().catch(function(){}); }, 800);
    setTimeout(function(){ restoreImages().catch(function(){}); }, 2200);
    setTimeout(function(){ restoreImages().catch(function(){}); }, 4500);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
})();
