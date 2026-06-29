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
    document.querySelectorAll('#envelope-sequence-speed-v1,#envelope-sequence-speed-v2,#envelope-sequence-speed-v3,#envelope-sequence-smooth-v3,#envelope-sequence-smooth-v4,#envelope-sequence-smooth-v5,#envelope-sequence-smooth-v6,#envelope-sequence-smooth-v7,#envelope-sequence-smooth-v8,#envelope-sequence-smooth-v9,#envelope-sequence-smooth-v10').forEach(function(old){ old.remove(); });
    const style = document.createElement('style');
    style.id = 'envelope-sequence-smooth-v10';
    style.textContent = `
      .gif-envelope-stage{
        overflow:visible !important;
        clip-path:none !important;
      }
      .gif-envelope{
        --env-bottom:28px;
        --env-height:282px;
        --flap-height:156px;
        --flap-top:calc(100% - var(--env-bottom) - var(--env-height));
        overflow:hidden !important;
        clip-path:none !important;
        transform:translate3d(0,0,0) !important;
        transform-style:preserve-3d !important;
        perspective:1200px !important;
        backface-visibility:hidden !important;
        contain:layout style;
      }
      .t44-gate.card-front-now .gif-envelope,
      .t44-gate.card-pull .gif-envelope,
      .t44-gate.card-front .gif-envelope{
        overflow:visible !important;
      }
      .gif-back,
      .gif-front{
        bottom:var(--env-bottom) !important;
        height:var(--env-height) !important;
        transform:translate3d(0,0,0) !important;
        backface-visibility:hidden !important;
      }
      .gif-back{ z-index:1 !important; }
      .gif-front{ z-index:5 !important; }
      .gif-seal{
        z-index:20 !important;
        opacity:1 !important;
        visibility:visible !important;
        transition:opacity .18s ease, transform .18s ease !important;
      }
      .t44-gate.opened .gif-seal,
      .t44-gate.card-front-now .gif-seal,
      .t44-gate.card-pull .gif-seal,
      .t44-gate.card-front .gif-seal{
        opacity:0 !important;
        visibility:hidden !important;
        pointer-events:none !important;
      }
      .gif-flap{
        top:var(--flap-top) !important;
        height:var(--flap-height) !important;
        transform-origin:50% 0 !important;
        transform:translate3d(0,0,0) rotateX(0deg) !important;
        backface-visibility:visible !important;
        will-change:transform;
        opacity:1 !important;
        visibility:visible !important;
        z-index:4 !important;
        transition:transform .46s cubic-bezier(.22,1,.36,1), z-index 0s linear 0s !important;
      }
      .gif-flap::after{
        content:"" !important;
        position:absolute !important;
        inset:0 !important;
        clip-path:inherit !important;
        background:linear-gradient(180deg,#ead7ad,#f8e9ca) !important;
        transform:rotateX(180deg) !important;
        backface-visibility:hidden !important;
        opacity:.98 !important;
      }
      .gif-card{
        transform:translate3d(0,240px,12px) scale(.985) !important;
        opacity:0 !important;
        visibility:hidden !important;
        will-change:transform;
        backface-visibility:hidden !important;
        transform-style:preserve-3d !important;
        z-index:3 !important;
        transition:
          transform .62s cubic-bezier(.22,1,.36,1),
          box-shadow .48s ease,
          z-index 0s linear 0s !important;
      }
      .intro-image-card,
      .intro-image-frame,
      #introCardPhoto{
        opacity:1 !important;
        overflow:hidden !important;
        backface-visibility:hidden !important;
        transform:translate3d(0,0,0) !important;
        will-change:auto !important;
      }
      .gif-shadow{
        will-change:transform, opacity;
        transition:transform .55s ease, opacity .55s ease !important;
      }
      .t44-gate.opened .gif-flap,
      .t44-gate.flap-back .gif-flap{
        transform:translate3d(0,0,-12px) rotateX(180deg) !important;
        z-index:2 !important;
        opacity:1 !important;
        visibility:visible !important;
        pointer-events:none !important;
      }
      .t44-gate.card-front-now .gif-flap,
      .t44-gate.card-pull .gif-flap,
      .t44-gate.card-front .gif-flap{
        transform:translate3d(0,0,-12px) rotateX(180deg) !important;
        z-index:1 !important;
      }
      .t44-gate.card-front-now .gif-card{
        opacity:1 !important;
        visibility:visible !important;
        z-index:30 !important;
      }
      .t44-gate.card-pull .gif-card{
        opacity:1 !important;
        visibility:visible !important;
        transform:translate3d(0,-230px,24px) scale(1.012) !important;
        z-index:30 !important;
        box-shadow:0 22px 46px rgba(93,45,22,.15) !important;
      }
      .t44-gate.card-front .gif-card,
      .t44-gate.card-rise .gif-card{
        opacity:1 !important;
        visibility:visible !important;
        transform:translate3d(0,-150px,24px) scale(1) !important;
        z-index:30 !important;
        box-shadow:0 24px 50px rgba(93,45,22,.17) !important;
      }
      .t44-gate.card-front .gif-hint,
      .t44-gate.card-rise .gif-hint{
        opacity:1 !important;
        transform:translate3d(-50%,-4px,0) !important;
      }
      .t44-gate.card-front .gif-shadow,
      .t44-gate.card-rise .gif-shadow{
        transform:scale(1.06) translate3d(0,0,0) !important;
        opacity:.86 !important;
      }
      @media(max-width:520px){
        .gif-envelope{
          --env-height:270px;
          --flap-height:150px;
        }
        .gif-card{
          transform:translate3d(0,225px,12px) scale(.985) !important;
        }
        .t44-gate.card-pull .gif-card{
          transform:translate3d(0,-200px,24px) scale(1.012) !important;
        }
        .t44-gate.card-front .gif-card,
        .t44-gate.card-rise .gif-card{
          transform:translate3d(0,-128px,24px) scale(1) !important;
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
    openBtn.dataset.envelopeSequenceOverride = 'v10';
    openBtn.onclick = function(e){
      if(e) e.stopPropagation();
      if(gate.dataset.opened === '1') return;
      gate.dataset.opened = '1';
      if(window.playMusic) window.playMusic();

      gate.classList.add('opened');
      setTimeout(function(){ gate.classList.add('flap-back'); }, 280);
      setTimeout(function(){ gate.classList.add('card-front-now'); }, 300);
      setTimeout(function(){ gate.classList.add('card-pull'); }, 310);
      setTimeout(function(){ gate.classList.add('card-front'); }, 860);
      setTimeout(revealSiteBelow, 1650);
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