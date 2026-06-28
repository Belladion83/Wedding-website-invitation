(function(){
  let revealObserver = null;
  let siteObserverStarted = false;

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
  function applyVisualRefinements(){
    if(document.getElementById('calendar-requested-fix-v184')) return;
    const style = document.createElement('style');
    style.id = 'calendar-requested-fix-v184';
    style.textContent = `
      .calendar39::before{
        content:none !important;
        display:none !important;
        border:none !important;
        background:none !important;
        opacity:0 !important;
      }
      .calendar39 h2,
      #storyTitle,
      .timeline39 h2,
      .cinelove-gallery h2,
      .cinelove-rsvp h2{
        font-family:"Times New Roman", Times, serif !important;
        font-weight:600 !important;
        font-size:clamp(20px, 4.56vw, 32px) !important;
        line-height:1.14 !important;
        letter-spacing:.045em !important;
        text-transform:uppercase !important;
        color:var(--t39-gold) !important;
        text-align:center !important;
        margin-left:auto !important;
        margin-right:auto !important;
        font-variant-numeric:normal !important;
        font-feature-settings:normal !important;
      }
      .calendar39 h2{
        margin-top:0 !important;
        margin-bottom:14px !important;
      }

      /* Uniform separation for every direct website section */
      .cinelove-site{
        background:#f1e8dc !important;
      }
      .cinelove-site > section{
        position:relative !important;
        margin-top:0 !important;
        margin-bottom:0 !important;
        box-shadow:0 -7px 16px rgba(112,76,43,.08), 0 12px 28px rgba(112,76,43,.14) !important;
      }
      .cinelove-site > section:not(:first-child){
        border-top:14px solid #f1e8dc !important;
      }
      .cinelove-site > section:first-child{
        box-shadow:0 12px 28px rgba(112,76,43,.12) !important;
      }

      /* Fade in + slight upward slide when sections enter viewport */
      .site:not(.hidden) .section-reveal{
        opacity:0 !important;
        transform:translate3d(0,38px,0) !important;
        transition:opacity 1.05s ease, transform 1.05s ease !important;
        will-change:opacity, transform;
      }
      .site:not(.hidden) .section-reveal.visible{
        opacity:1 !important;
        transform:translate3d(0,0,0) !important;
      }
      .site.hidden .section-reveal{
        opacity:0 !important;
        transform:translate3d(0,38px,0) !important;
      }

      .formal-intro{
        margin:8px 0 18px !important;
        text-align:center !important;
        font:500 24px/1.4 "Cormorant Garamond", serif !important;
        letter-spacing:.02em !important;
        color:var(--t39-muted) !important;
      }
      @media (max-width:520px){
        .cinelove-site > section:not(:first-child){
          border-top-width:12px !important;
        }
        .formal-intro{
          font-size:21px !important;
          margin:6px 0 16px !important;
        }
      }
      @media (prefers-reduced-motion: reduce){
        .site:not(.hidden) .section-reveal,
        .site.hidden .section-reveal{
          opacity:1 !important;
          transform:none !important;
          transition:none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  function initSectionReveal(){
    const site = document.getElementById('site');
    if(!site || site.classList.contains('hidden')) return;
    const sections = Array.from(site.querySelectorAll(':scope > .section-reveal'));
    if(!sections.length) return;

    if(revealObserver) revealObserver.disconnect();
    sections.forEach(function(section){
      if(section.dataset.revealShown !== '1') section.classList.remove('visible');
    });

    if(!('IntersectionObserver' in window)){
      sections.forEach(function(section){ section.classList.add('visible'); section.dataset.revealShown = '1'; });
      return;
    }

    revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          window.setTimeout(function(){
            entry.target.classList.add('visible');
            entry.target.dataset.revealShown = '1';
          }, 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:0.18, rootMargin:'0px 0px -12% 0px' });

    window.setTimeout(function(){
      sections.forEach(function(section){
        if(section.dataset.revealShown === '1') section.classList.add('visible');
        else revealObserver.observe(section);
      });
    }, 80);
  }
  function watchSiteReveal(){
    const site = document.getElementById('site');
    if(!site || siteObserverStarted) return;
    siteObserverStarted = true;
    if(!site.classList.contains('hidden')) initSectionReveal();
    const observer = new MutationObserver(function(){
      if(!site.classList.contains('hidden')) window.setTimeout(initSectionReveal, 120);
    });
    observer.observe(site, { attributes:true, attributeFilter:['class'] });
  }
  function runEnhancements(){
    refreshThanksBg();
    restoreMapTarget();
    applyVisualRefinements();
    watchSiteReveal();
    initSectionReveal();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runEnhancements);
  else runEnhancements();
  window.addEventListener('load', runEnhancements);
  setTimeout(refreshThanksBg, 1200);
  setTimeout(refreshThanksBg, 3500);
  setTimeout(initSectionReveal, 3200);
})();
