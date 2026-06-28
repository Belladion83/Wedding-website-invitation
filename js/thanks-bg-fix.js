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
    if(document.getElementById('calendar-requested-fix-v182')) return;
    const style = document.createElement('style');
    style.id = 'calendar-requested-fix-v182';
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
      .cinelove-site > section + section{
        margin-top:12px !important;
      }
      .section-reveal{
        opacity:0 !important;
        transform:translateY(28px) !important;
        transition:opacity .85s ease, transform .85s ease !important;
        will-change:opacity, transform;
      }
      .section-reveal.visible{
        opacity:1 !important;
        transform:translateY(0) !important;
      }
      .intro.section-reveal,
      .site.hidden .section-reveal{
        opacity:1 !important;
        transform:none !important;
      }
      @media (prefers-reduced-motion: reduce){
        .section-reveal{
          opacity:1 !important;
          transform:none !important;
          transition:none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  function initSectionReveal(){
    const sections = Array.from(document.querySelectorAll('.site .section-reveal'));
    if(!sections.length) return;
    if(!('IntersectionObserver' in window)){
      sections.forEach(function(section){ section.classList.add('visible'); });
      return;
    }
    const observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:0.16, rootMargin:'0px 0px -8% 0px' });
    sections.forEach(function(section){
      if(section.getBoundingClientRect().top < window.innerHeight * 0.88) section.classList.add('visible');
      else observer.observe(section);
    });
  }
  function runEnhancements(){
    refreshThanksBg();
    restoreMapTarget();
    applyCalendarRequestedFix();
    initSectionReveal();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runEnhancements);
  else runEnhancements();
  window.addEventListener('load', runEnhancements);
  setTimeout(refreshThanksBg, 1200);
  setTimeout(refreshThanksBg, 3500);
  setTimeout(initSectionReveal, 1200);
})();
