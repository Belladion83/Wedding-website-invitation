(function(){
  function getOpeningImage(cfg){
    if(!cfg || !cfg.images) return '';
    return String(cfg.images.openingCardImage || cfg.images.envelope2 || cfg.images.hero || '').trim();
  }

  function candidatesFor(value){
    if(!value) return [];
    if(window.WeddingCMS && WeddingCMS.driveImageCandidates) return WeddingCMS.driveImageCandidates(value).filter(Boolean);
    if(window.WeddingCMS && WeddingCMS.normalizeImageUrl) return [WeddingCMS.normalizeImageUrl(value)].filter(Boolean);
    return [value];
  }

  function applyImage(el, url){
    if(!el || !url) return;
    el.style.setProperty('background-image', 'url("' + url + '")', 'important');
    el.classList.remove('is-empty');
    el.dataset.bg = url;
  }

  function tryImage(el, list, index){
    if(!el) return;
    if(!list.length || index >= list.length){
      el.classList.add('is-empty');
      el.style.removeProperty('background-image');
      return;
    }
    const url = list[index];
    applyImage(el, url);
    const img = new Image();
    img.onload = function(){ applyImage(el, url); };
    img.onerror = function(){ tryImage(el, list, index + 1); };
    img.src = url;
  }

  async function refreshOpeningCard(){
    const el = document.getElementById('introCardPhoto');
    if(!el || !window.WeddingCMS) return;
    try{
      const cfg = await WeddingCMS.loadConfig();
      const raw = getOpeningImage(cfg);
      tryImage(el, candidatesFor(raw), 0);
    }catch(e){
      console.warn('Opening card image refresh failed', e);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshOpeningCard);
  else refreshOpeningCard();
  window.addEventListener('load', refreshOpeningCard);
  setTimeout(refreshOpeningCard, 1200);
  setTimeout(refreshOpeningCard, 3500);
})();
