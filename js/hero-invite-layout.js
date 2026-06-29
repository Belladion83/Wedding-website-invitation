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

  function resolveGuest(cfg){
    const params = new URLSearchParams(location.search);
    const guestId = params.get('id') || params.get('guest') || '';
    const guestNameParam = params.get('name') || '';
    const found = ((cfg && cfg.guests) || []).find(function(g){
      return String(g.id || '').toLowerCase() === String(guestId || '').toLowerCase();
    });
    return guestNameParam || (found && found.name) || 'Quý khách';
  }

  function injectStyle(){
    const oldIds = ['hero-invite-layout-v195','hero-invite-layout-v196','hero-invite-layout-v197','hero-invite-layout-v198','hero-invite-layout-v199','hero-invite-layout-v200','hero-invite-layout-v201','hero-invite-layout-v202','hero-invite-layout-v203','hero-invite-layout-v204','hero-invite-layout-v205','hero-invite-layout-v206','hero-invite-layout-v207'];
    oldIds.forEach(function(id){ const old = document.getElementById(id); if(old) old.remove(); });
    const style = document.createElement('style');
    style.id = 'hero-invite-layout-v207';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        gap:0 !important;
        font-family:"Great Vibes", "Allura", cursive !important;
        font-size:clamp(48px, 13vw, 72px) !important;
        line-height:.92 !important;
        font-weight:400 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        white-space:normal !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names span{
        font-family:inherit !important;
        font-size:inherit !important;
        line-height:.92 !important;
        font-weight:400 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        color:#9c763a !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
        margin:2px 0 -2px !important;
        transform:none !important;
        font-size:.72em !important;
        color:#a87a36 !important;
        opacity:.95 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #heroGroomName,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #heroBrideName{
        transform:none !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine{
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:center !important;
        gap:6px !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine::before,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine::after{
        content:"" !important;
        display:block !important;
        width:120px !important;
        height:1px !important;
        background:linear-gradient(90deg, transparent, rgba(255,255,255,.92), transparent) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span:first-child{
        font-family:Inter, Arial, sans-serif !important;
        font-size:13px !important;
        line-height:1.1 !important;
        font-weight:600 !important;
        letter-spacing:.34em !important;
        text-transform:uppercase !important;
        color:#a87a36 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span+span{
        font-family:"Cormorant Garamond", "Playfair Display", serif !important;
        font-size:clamp(34px, 8.8vw, 46px) !important;
        line-height:1 !important;
        font-weight:500 !important;
        letter-spacing:.01em !important;
        color:#fffaf2 !important;
        text-transform:none !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .invitee-detail,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #musicStart{
        display:none !important;
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:clamp(43px, 12vw, 58px) !important;
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
    if(names.nextElementSibling !== invite) content.insertBefore(invite, names.nextSibling);

    const detail = content.querySelector('.invitee-detail');
    if(detail) detail.style.display = 'none';

    const guestName = resolveGuest(cfg);
    invite.innerHTML = '<span>Kính mời</span><span>' + escapeHtml(guestName) + '</span>';

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