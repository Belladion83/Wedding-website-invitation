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
    const oldIds = ['hero-invite-layout-v195','hero-invite-layout-v196','hero-invite-layout-v197','hero-invite-layout-v198','hero-invite-layout-v199','hero-invite-layout-v200','hero-invite-layout-v201','hero-invite-layout-v202','hero-invite-layout-v203','hero-invite-layout-v204'];
    oldIds.forEach(function(id){ const old = document.getElementById(id); if(old) old.remove(); });
    const style = document.createElement('style');
    style.id = 'hero-invite-layout-v204';
    style.textContent = `
      body .page-shell .site .hero.cinelove-cover{
        justify-content:flex-start !important;
        align-items:center !important;
      }
      body .page-shell .site .hero.cinelove-cover::before{
        background:linear-gradient(180deg, rgba(255,248,239,.78) 0%, rgba(255,248,239,.50) 18%, rgba(255,255,255,0) 50%, rgba(255,248,239,.35) 100%) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:flex-start !important;
        gap:0 !important;
        padding-top:26px !important;
        padding-bottom:0 !important;
        margin-top:0 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
        order:1 !important;
        display:flex !important;
        flex-direction:row !important;
        align-items:flex-start !important;
        justify-content:center !important;
        width:100% !important;
        max-width:100% !important;
        margin:0 auto 0 !important;
        padding:0 !important;
        gap:0 !important;
        color:var(--cine-wine) !important;
        font-family:"Great Vibes", cursive !important;
        font-weight:400 !important;
        font-size:clamp(43px, 9.4vw, 58px) !important;
        line-height:.92 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names span{
        font-family:"Great Vibes", cursive !important;
        font-size:inherit !important;
        font-weight:400 !important;
        line-height:.92 !important;
        letter-spacing:0 !important;
        text-transform:none !important;
        white-space:nowrap !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroGroomName{
        position:relative !important;
        z-index:3 !important;
        transform:translateX(8px) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
        position:relative !important;
        z-index:1 !important;
        margin:0 -8px !important;
        transform:translateY(23px) rotate(-8deg) !important;
        color:#f3e5c8 !important;
        font-family:"Great Vibes", "Allura", cursive !important;
        font-size:1.08em !important;
        font-weight:400 !important;
        line-height:.65 !important;
        letter-spacing:0 !important;
        opacity:.95 !important;
        text-shadow:0 2px 10px rgba(86,52,23,.30), 0 1px 2px rgba(255,255,255,.62) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroBrideName{
        position:relative !important;
        z-index:3 !important;
        transform:translate(0, 36px) !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine{
        order:2 !important;
        display:flex !important;
        flex-direction:column !important;
        align-items:center !important;
        justify-content:center !important;
        width:100% !important;
        margin:-8px auto 0 !important;
        gap:6px !important;
        text-align:center !important;
        color:#b98645 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span:first-child{
        font-family:"Playfair Display", Inter, Arial, sans-serif !important;
        font-size:clamp(15px, 3.6vw, 18px) !important;
        line-height:1.1 !important;
        font-weight:700 !important;
        letter-spacing:.22em !important;
        text-transform:uppercase !important;
        color:#b98645 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span+span{
        font-family:Inter, Arial, sans-serif !important;
        font-size:clamp(28px, 7vw, 38px) !important;
        line-height:1.05 !important;
        font-weight:600 !important;
        letter-spacing:.12em !important;
        text-transform:none !important;
        color:#b98645 !important;
        font-variant-numeric:lining-nums tabular-nums !important;
        font-feature-settings:"lnum" 1, "tnum" 1 !important;
      }
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .invitee-detail,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-date,
      body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #musicStart{
        display:none !important;
      }
      @media (max-width:760px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
          padding-top:20px !important;
          padding-bottom:0 !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:clamp(39px, 11vw, 52px) !important;
          margin-bottom:0 !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names .hero-amp{
          margin:0 -7px !important;
          transform:translateY(21px) rotate(-8deg) !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #heroBrideName{
          transform:translate(0, 34px) !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine{
          margin-top:-9px !important;
          gap:5px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 #inviteeLine span+span{
          font-size:clamp(27px, 8vw, 36px) !important;
        }
      }
      @media (max-width:390px){
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195{
          padding-top:16px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names{
          font-size:38px !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroGroomName{
          transform:translateX(6px) !important;
        }
        body .page-shell .site .hero.cinelove-cover .hero-content.hero-invite-v195 .hero-names.hero-short-names #heroBrideName{
          transform:translate(0, 32px) !important;
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

    const displayDate = String(site.displayDate || '18 . 07 . 2026').replace(/\s*\.\s*/g, '.');
    invite.innerHTML = '<span>Save Our Date</span><span>' + escapeHtml(displayDate) + '</span>';
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