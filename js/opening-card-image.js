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

  function injectEnvelopeTimingStyle(){
    const old = document.getElementById('envelope-sequence-speed-v1');
    if(old) old.remove();
    const style = document.createElement('style');
    style.id = 'envelope-sequence-speed-v2';
    style.textContent = `
      .gif-flap{
        transition:transform .44s cubic-bezier(.22,.85,.23,1), z-index 0s linear .30s !important;
      }
      .gif-card{
        transition:
          opacity .05s linear,
          transform .52s cubic-bezier(.22,1,.22,1),
          box-shadow .36s ease,
          z-index 0s linear 0s !important;
      }
      .gif-shadow{
        transition:transform .48s ease, opacity .48s ease !important;
      }
      .t44-gate.card-front-now .gif-card{
        opacity:1 !important;
        z-index:8 !important;
      }
      .t44-gate.card-pull .gif-card{
        opacity:1 !important;
        transform:translateY(-250px) !important;
        z-index:8 !important;
        box-shadow:0 20px 42px rgba(93,45,22,.14) !important;
      }
      .t44-gate.card-front .gif-card,
      .t44-gate.card-rise .gif-card{
        opacity:1 !important;
        transform:translateY(-150px) !important;
        z-index:8 !important;
        box-shadow:0 24px 50px rgba(93,45,22,.17) !important;
      }
      .t44-gate.card-front .gif-hint,
      .t44-gate.card-rise .gif-hint{
        opacity:1 !important;
        transform:translateX(-50%) translateY(-4px) !important;
      }
      @media(max-width:520px){
        .t44-gate.card-pull .gif-card{
          transform:translateY(-220px) !important;
        }
        .t44-gate.card-front .gif-card,
        .t44-gate.card-rise .gif-card{
          transform:translateY(-128px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function revealSiteBelow(){
    const site = document.getElementById('site');
    const musicToggle = document.getElementById('musicToggle');
    const intro = document.getElementById('intro');
    if(site) site.classList.remove('hidden');
    if(musicToggle) musicToggle.classList.remove('hidden');
    if(intro) intro.classList.add('sequence-done');
    const offset = Math.max(Math.round(window.innerHeight * 0.30), 230);
    window.scrollTo({ top: offset, behavior: 'smooth' });
  }

  function installEnvelopeSequenceOverride(){
    injectEnvelopeTimingStyle();
    const gate = document.getElementById('envelope');
    const openBtn = document.getElementById('openEnvelopeButton');
    if(!gate || !openBtn) return;
    openBtn.dataset.envelopeSequenceOverride = 'v2';
    openBtn.onclick = function(e){
      if(e) e.stopPropagation();
      if(gate.dataset.opened === '1') return;
      gate.dataset.opened = '1';
      if(window.playMusic) window.playMusic();

      gate.classList.add('opened');
      setTimeout(function(){ gate.classList.add('flap-back'); }, 320);
      setTimeout(function(){ gate.classList.add('card-front-now'); }, 330);
      setTimeout(function(){ gate.classList.add('card-pull'); }, 340);
      setTimeout(function(){ gate.classList.add('card-front'); }, 820);
      setTimeout(revealSiteBelow, 1500);
    };
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ refreshOpeningCard(); installEnvelopeSequenceOverride(); });
  else { refreshOpeningCard(); installEnvelopeSequenceOverride(); }
  window.addEventListener('load', function(){ refreshOpeningCard(); installEnvelopeSequenceOverride(); });
  setTimeout(refreshOpeningCard, 1200);
  setTimeout(refreshOpeningCard, 3500);
  setTimeout(installEnvelopeSequenceOverride, 300);
  setTimeout(installEnvelopeSequenceOverride, 900);
  setTimeout(installEnvelopeSequenceOverride, 1600);
})();