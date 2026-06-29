(function(){
  function escapeHtml(v){
    return String(v || '').replace(/[&<>"]/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];
    });
  }

  function toNameCase(value){
    return String(value || '')
      .trim()
      .toLocaleLowerCase('vi-VN')
      .replace(/(^|[\s\-'])\p{L}/gu, function(m){ return m.toLocaleUpperCase('vi-VN'); });
  }

  function injectStyle(){
    const oldIds = ['hero-invite-layout-v195','hero-invite-layout-v196','hero-invite-layout-v197','hero-invite-layout-v198','hero-invite-layout-v199','hero-invite-layout-v200','hero-invite-layout-v201','hero-invite-layout-v202','hero-invite-layout-v203','hero-invite-layout-v204','hero-invite-layout-v205','hero-invite-layout-v206','hero-invite-layout-v207','hero-invite-layout-v208'];
    oldIds.forEach(function(id){ const old = document.getElementById(id); if(old) old.remove(); });
    const style = document.createElement('style');
    style.id = 'hero-invite-layout-v208';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
        display:flex !important;
        flex-direction:row !important;
        align-items:center !important;
        justify-content:center !important;
        gap:6px !important;
        font-family:"Great Vibes", "Allura", cursive !important;
        font-size:clamp(38px, 9vw, 56px) !important;
        line-height:.95 !important;
        font-weight:400 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names span{
        font-family:inherit !important;
        font-size:inherit !important;
        line-height:.95 !important;
        font-weight:400 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        color:#9c763a !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
        margin:0 !important;
        transform:translateY(2px) !important;
        font-size:.72em !important;
        color:#a87a36 !important;
        opacity:.95 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #heroGroomName,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #heroBrideName{
        transform:none !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine{
        display:none !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .invitee-detail,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #musicStart{
        display:none !important;
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:clamp(34px, 8.4vw, 44px) !important;
          gap:4px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function applyHeroInviteLayout(){
    const content = document.querySelector('.hero.cinelove-cover .hero-content');
    const names = document.getElementById('heroNames');
    const groom = document.getElementById('heroGroomName');
    const bride = document.getElementById('heroBrideName');
    const invite = document.getElementById('inviteeLine');
    const heroDate = document.getElementById('heroDate');
    if(!content || !names || !groom || !bride || !invite) return;

    injectStyle();
    content.classList.add('hero-invite-v195');
    names.classList.add('hero-short-names');

    let cfg = null;
    try{
      if(window.WeddingCMS && WeddingCMS.loadConfig) cfg = await WeddingCMS.loadConfig();
    }catch(e){
      console.warn('Hero invite layout config load failed', e);
    }

    const site = (cfg && cfg.site) || {};
    groom.textContent = toNameCase(site.groomShortName || 'Phú Quí');
    bride.textContent = toNameCase(site.brideShortName || 'Ánh Nguyệt');

    const amp = names.querySelector('span:nth-child(2)');
    if(amp){
      amp.textContent = '&';
      amp.classList.add('hero-amp');
    }

    if(content.firstElementChild !== names) content.insertBefore(names, content.firstChild);
    invite.innerHTML = '';
    invite.style.display = 'none';

    const detail = content.querySelector('.invitee-detail');
    if(detail) detail.style.display = 'none';

    if(heroDate){
      const displayDate = String(site.displayDate || '18 . 07 . 2026').replace(/\s*\.\s*/g, ' . ');
      heroDate.innerHTML = '<span>Save Our Date</span><b>' + escapeHtml(displayDate) + '</b>';
    }
  }

  function boot(){
    applyHeroInviteLayout();
    setTimeout(applyHeroInviteLayout, 450);
    setTimeout(applyHeroInviteLayout, 1400);
    setTimeout(applyHeroInviteLayout, 3200);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', applyHeroInviteLayout);
})();